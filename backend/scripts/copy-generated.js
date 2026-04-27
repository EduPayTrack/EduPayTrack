const fs = require('fs');
const path = require('path');

const sourceDir = path.resolve(__dirname, '../src/generated');
const targetDir = path.resolve(__dirname, '../dist/generated');

function copyDirectory(source, target) {
  if (!fs.existsSync(source)) {
    throw new Error(`Generated Prisma directory not found: ${source}`);
  }

  fs.mkdirSync(target, { recursive: true });

  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, targetPath);
      continue;
    }

    fs.copyFileSync(sourcePath, targetPath);
  }
}

copyDirectory(sourceDir, targetDir);
console.log(`Copied generated Prisma client to ${targetDir}`);
