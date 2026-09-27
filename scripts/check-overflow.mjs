// Nessuna pagina deve essere più larga del viewport a 375 px
import { chromium } from 'playwright';
const base = process.argv[2] ?? 'http://localhost:4321';
const paths = ['/', '/dona/', '/cuba/', '/trasparenza/', '/grazie/', '/es/', '/es/dona/', '/es/cuba/', '/es/transparencia/', '/es/gracias/', '/en/', '/en/donate/', '/en/cuba/', '/en/transparency/', '/en/thank-you/'];
const browser = await chromium.launch();
const pageObj = await browser.newPage({ viewport: { width: 375, height: 812 } });
let bad = 0;
for (const p of paths) {
  await pageObj.goto(base + p);
  const w = await pageObj.evaluate(() => document.documentElement.scrollWidth);
  console.log(w > 375 ? 'KO' : 'OK', p, w);
  if (w > 375) bad++;
}
await browser.close();
process.exit(bad ? 1 : 0);
