import fs from 'node:fs';
import path from 'node:path';

const input = path.resolve('test-results/results.json');
const outputDir = path.resolve('docs');
const output = path.join(outputDir, 'index.html');

if (!fs.existsSync(input)) {
  console.error('No JSON test results found. Run "npm test" before "npm run dashboard".');
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(input, 'utf8'));
const cases = [];

function walkSuite(suite, parents = []) {
  const scope = [...parents, suite.title].filter(Boolean);

  for (const spec of suite.specs || []) {
    for (const test of spec.tests || []) {
      const latest = (test.results || []).at(-1) || {};
      cases.push({
        title: [...scope, spec.title].filter(Boolean).join(' › '),
        project: test.projectName || 'unknown',
        status: latest.status || test.expectedStatus || 'unknown',
        duration: latest.duration || 0,
        error: latest.error?.message || '',
      });
    }
  }

  for (const child of suite.suites || []) {
    walkSuite(child, scope);
  }
}

for (const suite of report.suites || []) walkSuite(suite);

const total = cases.length;
const passed = cases.filter(t => t.status === 'passed').length;
const skipped = cases.filter(t => t.status === 'skipped').length;
const failed = cases.filter(t => !['passed', 'skipped'].includes(t.status)).length;
const passRate = total ? ((passed / Math.max(total - skipped, 1)) * 100).toFixed(1) : '0.0';
const durationMs = cases.reduce((sum, t) => sum + t.duration, 0);
const byBrowser = Object.entries(cases.reduce((acc, t) => {
  acc[t.project] ??= { total: 0, passed: 0, failed: 0, skipped: 0, duration: 0 };
  acc[t.project].total += 1;
  acc[t.project].duration += t.duration;
  if (t.status === 'passed') acc[t.project].passed += 1;
  else if (t.status === 'skipped') acc[t.project].skipped += 1;
  else acc[t.project].failed += 1;
  return acc;
}, {}));

const esc = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const rows = cases.map(t => `
  <tr>
    <td>${esc(t.title)}</td>
    <td>${esc(t.project)}</td>
    <td><span class="status ${esc(t.status)}">${esc(t.status)}</span></td>
    <td>${(t.duration / 1000).toFixed(2)}s</td>
    <td class="error">${esc(t.error).slice(0, 240)}</td>
  </tr>`).join('');

const browserCards = byBrowser.map(([browser, data]) => `
  <section class="card browser-card">
    <h3>${esc(browser)}</h3>
    <p>${data.passed} passed · ${data.failed} failed · ${data.skipped} skipped</p>
    <strong>${(data.duration / 1000).toFixed(1)}s</strong>
  </section>`).join('');

const generatedAt = new Date().toISOString();
const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Playwright Automation Dashboard</title>
  <style>
    :root { font-family: Inter, ui-sans-serif, system-ui, sans-serif; color: #172033; background: #f5f7fb; }
    body { margin: 0; }
    header { background: #101827; color: white; padding: 36px max(24px, 6vw); }
    header h1 { margin: 0 0 8px; font-size: clamp(28px, 4vw, 44px); }
    header p { margin: 0; color: #cbd5e1; }
    main { padding: 28px max(24px, 6vw) 60px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 22px; }
    .card { background: white; border-radius: 14px; padding: 20px; box-shadow: 0 8px 26px rgba(15, 23, 42, .07); }
    .metric { font-size: 34px; font-weight: 750; margin-top: 6px; }
    .label { color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: .08em; }
    .browser-card h3 { margin: 0 0 8px; text-transform: capitalize; }
    .browser-card p { margin: 0 0 14px; color: #64748b; }
    .table-wrap { overflow-x: auto; background: white; border-radius: 14px; box-shadow: 0 8px 26px rgba(15, 23, 42, .07); }
    table { width: 100%; border-collapse: collapse; min-width: 860px; }
    th, td { padding: 13px 16px; text-align: left; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
    th { background: #f8fafc; font-size: 12px; text-transform: uppercase; letter-spacing: .06em; color: #64748b; }
    .status { display: inline-block; padding: 4px 9px; border-radius: 999px; font-weight: 700; font-size: 12px; background: #e2e8f0; }
    .passed { background: #dcfce7; color: #166534; }
    .failed, .timedOut, .interrupted { background: #fee2e2; color: #991b1b; }
    .skipped { background: #fef3c7; color: #92400e; }
    .error { max-width: 420px; color: #991b1b; font-size: 12px; white-space: pre-wrap; }
    footer { margin-top: 20px; color: #64748b; font-size: 13px; }
  </style>
</head>
<body>
<header>
  <h1>Playwright Automation Dashboard</h1>
  <p>Rahul Shetty Academy — Let's Shop | generated from Playwright JSON results</p>
</header>
<main>
  <div class="grid">
    <section class="card"><div class="label">Total executions</div><div class="metric">${total}</div></section>
    <section class="card"><div class="label">Passed</div><div class="metric">${passed}</div></section>
    <section class="card"><div class="label">Failed</div><div class="metric">${failed}</div></section>
    <section class="card"><div class="label">Pass rate</div><div class="metric">${passRate}%</div></section>
    <section class="card"><div class="label">Aggregated duration</div><div class="metric">${(durationMs / 1000).toFixed(1)}s</div></section>
  </div>
  <h2>Browser execution</h2>
  <div class="grid">${browserCards || '<section class="card">No browser results found.</section>'}</div>
  <h2>Test details</h2>
  <div class="table-wrap">
    <table>
      <thead><tr><th>Test</th><th>Browser</th><th>Status</th><th>Duration</th><th>Failure</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>
  <footer>Generated ${esc(generatedAt)}. This dashboard contains execution metadata only; credentials are not written to the report.</footer>
</main>
</body>
</html>`;

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(output, html);
console.log(`Dashboard written to ${output}`);
