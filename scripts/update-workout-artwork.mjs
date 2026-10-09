import fs from 'node:fs';

const ids = fs
  .readdirSync('public/workouts')
  .filter((file) => file.endsWith('.svg'))
  .map((file) => file.slice(0, -4))
  .sort();
fs.writeFileSync('src/features/workout-book/artwork.json', `${JSON.stringify(ids, null, 2)}\n`);
console.log(`${ids.length} workout drawings available`);
