// Nessuna pagina deve essere più larga del viewport e nessun titolo deve
// spezzare una parola a metà o uscire dal bordo (320, 375, 768, 1440 px)
import { chromium } from 'playwright';
const base = process.argv[2] ?? 'http://localhost:4321';
const paths = ['/', '/dona/', '/cuba/', '/trasparenza/', '/grazie/', '/es/', '/es/dona/', '/es/cuba/', '/es/transparencia/', '/es/gracias/', '/en/', '/en/donate/', '/en/cuba/', '/en/transparency/', '/en/thank-you/'];
const widths = [320, 375, 768, 1440];
const browser = await chromium.launch();
let bad = 0;
for (const width of widths) {
  const pageObj = await browser.newPage({ viewport: { width, height: 900 } });
  for (const p of paths) {
    await pageObj.goto(base + p);
    const problems = await pageObj.evaluate(() => {
      const out = [];
      const vw = document.documentElement.clientWidth;
      if (document.documentElement.scrollWidth > vw) out.push(`scroll orizzontale ${document.documentElement.scrollWidth}px`);
      for (const el of document.querySelectorAll('h1, h2, h3, .display, .stat-value, .impact-value, .copy-value, .btn, summary')) {
        const r = el.getBoundingClientRect();
        if (r.width && (r.right > vw + 1 || r.left < -1)) out.push(`fuori bordo: ${el.textContent.trim().slice(0, 40)}`);
        // Una parola i cui rettangoli stanno su righe diverse è stata spezzata
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          for (const m of n.data.matchAll(/\S+/g)) {
            const range = document.createRange();
            range.setStart(n, m.index);
            range.setEnd(n, m.index + m[0].length);
            const rows = new Set([...range.getClientRects()].map((x) => Math.round(x.top)));
            if (rows.size > 1) out.push(`parola spezzata: "${m[0]}"`);
          }
        }
      }
      return [...new Set(out)];
    });
    console.log(problems.length ? 'KO' : 'OK', width, p, problems.join(' | '));
    bad += problems.length;
  }
  await pageObj.close();
}
await browser.close();
process.exit(bad ? 1 : 0);
