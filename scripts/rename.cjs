const path = require('path');
const { readdir, readFile, writeFile } = require('fs/promises');
const args = process.argv;
const cwdFlag = '--cwd';
const cwd = args[args.indexOf(cwdFlag) + 1];
const packageJsonFile = path.resolve(cwd, 'package.json');
const bundlesDir = path.resolve(cwd, 'bundles/@yarnpkg/');

const main = async () => {
  const files = await readdir(bundlesDir);
  const packageJson = JSON.parse(await readFile(packageJsonFile, { encoding: 'utf8' }));
  const name = packageJson.name;
  files.forEach(async (f) => {
    const fullpath = path.resolve(bundlesDir, f);
    const content = await readFile(fullpath, { encoding: 'utf8' });
    const fixedContent = content.replace(/name: ".+",/, `name: "${name}",`);
    await writeFile(fullpath, fixedContent, { encoding: 'utf8' });
  });
};

main();
