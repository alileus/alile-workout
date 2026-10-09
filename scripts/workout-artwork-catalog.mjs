import fs from 'node:fs';
import path from 'node:path';

// Shared IDs mean one drawing is reused across all muscle guides and locales.
const catalog = new Map();
for (const filename of fs.readdirSync('content/book/en')) {
  const group = JSON.parse(fs.readFileSync(path.join('content/book/en', filename), 'utf8'));
  for (const section of group.sections)
    for (const region of section.regions)
      for (const exercise of region.exercises) {
        const entry = catalog.get(exercise.id) ?? {
          id: exercise.id,
          name: exercise.name,
          instructions: exercise.instructions,
          cue: exercise.cue,
          guides: [],
          image: `/workouts/${exercise.id}.svg`,
        };
        entry.guides.push(region.id);
        catalog.set(exercise.id, entry);
      }
}
const entries = [...catalog.values()].sort((a, b) => a.id.localeCompare(b.id));
if (process.argv[2]) {
  fs.writeFileSync(process.argv[2], `${JSON.stringify(entries, null, 2)}\n`);
  console.log(`${entries.length} unique workouts exported to ${process.argv[2]}`);
} else {
  console.log(JSON.stringify(entries, null, 2));
}
