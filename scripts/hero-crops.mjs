// ========================================================================
// Hero portrait crops — art direction for phones and portrait tablets
// ========================================================================
// The home hero is full-screen. On a portrait screen a landscape photo
// can only show a narrow vertical slice of itself, and `object-fit: cover`
// takes that slice from the dead centre — which cuts people and peaks in
// half. This script cuts a 2:3 portrait version of each hero photo,
// centred on the photo's subject instead.
//
// focusX: where the subject sits, as a fraction of the photo's width.
// Change a number, re-run, and commit the regenerated *-portrait.jpg:
//   node scripts/hero-crops.mjs
// ========================================================================

import sharp from 'sharp';

const DIR = 'src/assets/hero';
const RATIO = 2 / 3; // width / height of the portrait crop

const heroes = {
  hero1: 0.46, // Khangchendzonga massif
  hero2: 0.64, // Rabdentse ruins + cypress
  hero3: 0.56, // comb frame in hand, raw comb on the log
  hero4: 0.76, // Teesta river bend
  hero5: 0.4,  // the two at the stall — too wide for phones; index.astro skips it below aspect 0.55
};

for (const [name, focusX] of Object.entries(heroes)) {
  const src = `${DIR}/${name}.jpg`;
  const { width, height } = await sharp(src).metadata();
  const cropW = Math.round(height * RATIO);
  const left = Math.min(Math.max(Math.round(focusX * width - cropW / 2), 0), width - cropW);
  await sharp(src)
    .extract({ left, top: 0, width: cropW, height })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(`${DIR}/${name}-portrait.jpg`);
  console.log(`${name}-portrait.jpg  ${cropW}x${height}  from x=${left}`);
}
