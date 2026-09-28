// Ritaglia IMG_0152 sul tavolo con le medicine, sotto la scritta sulla maglietta
import sharp from 'sharp';
const [src, out, ratioArg] = process.argv.slice(2);
const ratio = ratioArg ? Number(ratioArg) : 0.64;
const img = sharp(src).rotate(); // applica l'orientamento EXIF
const { width, height } = await img.metadata().then((m) => (m.orientation >= 5 ? { width: m.height, height: m.width } : m));
const top = Math.round(height * ratio);
await img.extract({ left: 0, top, width, height: height - top }).resize({ width: 2000 }).jpeg({ quality: 82 }).toFile(out);
console.log('ritaglio', width, 'x', height - top, '→', out, 'ratio', ratio);
