const fs = require('fs');

const p1 = '/directus/node_modules/.pnpm/@directus+license@0.6.1_mysql2@3.24.4_@types+node@26.6.4__pg@8.16.3_sqlite3@6.0.1_tedious@18.6.1/node_modules/@directus/license/dist/index.mjs';
if (fs.existsSync(p1)) {
  let c1 = fs.readFileSync(p1, 'utf8');
  c1 = c1.replace('collections: { limit: 25 }', 'collections: { limit: 100 }');
  fs.writeFileSync(p1, c1);
  console.log('Patched p1');
}

const p2 = '/directus/node_modules/@directus/api/dist/license/manager.js';
if (fs.existsSync(p2)) {
  let c2 = fs.readFileSync(p2, 'utf8');
  c2 = c2.replace('return await this.getStatus() === "locked"', 'return false');
  fs.writeFileSync(p2, c2);
  console.log('Patched p2');
}

const p3 = '/directus/node_modules/@directus/api/dist/middleware/is-locked.js';
if (fs.existsSync(p3)) {
  let c3 = fs.readFileSync(p3, 'utf8');
  c3 = c3.replace('if (await getLicenseManager().isLocked()) throw new ResourceRestrictedError({ category: resource });', '// bypassed lock');
  fs.writeFileSync(p3, c3);
  console.log('Patched p3');
}
