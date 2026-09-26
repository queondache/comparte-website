// Local validation only; this script is never loaded by the website.
import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
const binary = process.env.CHROMIUM_BINARY;
if (!binary) throw new Error('Set CHROMIUM_BINARY to an installed headless Chromium executable');
const browser = spawn(binary, ['--headless', '--disable-gpu', '--no-sandbox', '--remote-debugging-address=127.0.0.1', '--remote-debugging-port=0', 'about:blank']);
let socket;
try {
  const endpoint = await new Promise((resolve, reject) => {
    let log = '';
    const timer = setTimeout(() => reject(new Error('DevTools startup timeout')), 10000);
    browser.once('error', reject);
    browser.stderr.on('data', chunk => {
      log += chunk;
      const match = log.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) { clearTimeout(timer); resolve(match[1]); }
    });
  });
  socket = new WebSocket(endpoint);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let nextId = 0;
  const pending = new Map();
  socket.onmessage = ({ data }) => {
    const response = JSON.parse(data);
    if (pending.has(response.id)) {
      const { resolve, reject, timer } = pending.get(response.id);
      clearTimeout(timer); pending.delete(response.id);
      response.error ? reject(new Error(JSON.stringify(response.error))) : resolve(response.result);
    }
  };
  const call = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const id = ++nextId;
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(method + ' timeout')); }, 15000);
    pending.set(id, { resolve, reject, timer });
    socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
  for (const [lang, home, privacy] of [
    ['it', '/#newsletter', '/trasparenza/#privacy'],
    ['es', '/es/#boletin', '/es/transparencia/#privacidad'],
    ['en', '/en/#newsletter', '/en/transparency/#privacy'],
  ]) {
    for (const [name, route] of [['newsletter', home], ['privacy', privacy]]) {
      const { targetId } = await call('Target.createTarget', { url: 'about:blank' });
      const { sessionId } = await call('Target.attachToTarget', { targetId, flatten: true });
      await call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true }, sessionId);
      await call('Page.enable', {}, sessionId);
      await call('Page.navigate', { url: 'http://127.0.0.1:8765' + route.split('#')[0] }, sessionId);
      for (let attempt = 0; attempt < 30; attempt++) {
        const state = await call('Runtime.evaluate', { expression: 'document.readyState', returnByValue: true }, sessionId);
        if (state.result.value === 'complete') break;
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      const id = route.split('#')[1];
      const result = await call('Runtime.evaluate', { expression: `(() => { const el = document.getElementById(${JSON.stringify(id)}); if (!el) throw new Error('Missing section'); el.scrollIntoView({behavior:'instant', block:'start'}); return {title:document.title, section:el.innerText, width:innerWidth, scrollWidth:document.documentElement.scrollWidth}; })()`, returnByValue: true }, sessionId);
      if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
      await new Promise(resolve => setTimeout(resolve, 500));
      const { data } = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false }, sessionId);
      const output = `docs/codex/evidence/mailchimp/${lang}-${name}.png`;
      await writeFile(output, Buffer.from(data, 'base64'));
      console.log(JSON.stringify({ route, output, ...result.result.value }));
      await call('Target.closeTarget', { targetId });
    }
  }
} finally {
  socket?.close();
  browser.kill();
}
