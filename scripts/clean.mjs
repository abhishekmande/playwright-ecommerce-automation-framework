import fs from 'node:fs';

for (const directory of ['playwright-report', 'test-results', 'docs']) {
  fs.rmSync(directory, { recursive: true, force: true });
}

console.log('Removed generated reports and dashboard files.');
