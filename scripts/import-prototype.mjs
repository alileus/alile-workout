// One-time migration. Run with the path to the original prototype's dist folder.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const source = process.argv[2];
if (!source)
  throw new Error('Provide the prototype dist path. Normal development does not need this script.');
const read = (name) => fs.readFileSync(path.join(source, name), 'utf8');
const app = read('app.js');
const code =
  ['regions.js', 'training.js', 'coverage.js'].map(read).join('\n') +
  '\n' +
  app.slice(0, app.indexOf('function renderMap()')) +
  '\nJSON.stringify({data,regionGeometry,trainingMap,atlasComponents,componentPaths,componentGroup,silhouette,additionalExercises})';
const raw = JSON.parse(vm.runInNewContext(code, { addEventListener() {} }));
const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
fs.mkdirSync('content/book/en', { recursive: true });
fs.mkdirSync('src/features/anatomy/data', { recursive: true });
const regions = {};
for (const [id, group] of Object.entries(raw.data)) {
  const entry = {
    id,
    name: group.name,
    view: group.view,
    sections: group.sections.map((section) => ({
      name: section.name,
      regions: group.regions
        .slice(section.start, section.start + section.count)
        .map(([name, description], offset) => {
          const index = section.start + offset,
            geometry = raw.regionGeometry[id][index],
            guide = raw.trainingMap[id][index];
          const regionId = geometry.component + '-' + slug(name);
          regions[regionId] = { ...geometry, group: id };
          return {
            id: regionId,
            name,
            description,
            note: guide.note || '',
            references: [
              guide.source ||
                'https://openstax.org/books/anatomy-and-physiology-2e/pages/11-introduction',
            ],
            reviewStatus: 'draft',
            exercises: guide.items.map(([key, i]) => {
              const exercise =
                key === 'extra'
                  ? raw.additionalExercises[i]
                  : raw.atlasComponents[key].exercises[i];
              if (!exercise) throw new Error('Missing exercise ' + regionId);
              const [name, equipment, , instructions, cue] = exercise;
              return { id: slug(name), name, equipment, instructions, cue };
            }),
          };
        }),
    })),
  };
  fs.writeFileSync('content/book/en/' + id + '.json', JSON.stringify(entry, null, 2) + '\n');
}
fs.writeFileSync(
  'src/features/anatomy/data/geometry.json',
  JSON.stringify(
    {
      silhouette: raw.silhouette,
      paths: raw.componentPaths,
      componentGroup: raw.componentGroup,
      regions,
    },
    null,
    2,
  ) + '\n',
);
console.log(
  'Imported',
  Object.keys(regions).length,
  'regions in',
  Object.keys(raw.data).length,
  'groups',
);
