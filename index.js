#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const GRAY = '\x1b[90m';

function run(dir) {
  return new Promise((resolve) => {
    exec('git pull', { cwd: dir }, (err, stdout, stderr) => {
      resolve({ err, stdout: stdout.trim(), stderr: stderr.trim() });
    });
  });
}

function isGitRepo(dir) {
  return fs.existsSync(path.join(dir, '.git'));
}

function loadConfig() {
  const configPath = path.join(__dirname, 'pull-all.config.json');
  if (!fs.existsSync(configPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch {
    console.error(`${YELLOW}⚠ 無法解析 pull-all.config.json${RESET}`);
    return null;
  }
}

async function main() {
  const parentDir = path.resolve(__dirname, '..');
  const entries = fs.readdirSync(parentDir, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => e.name);

  const config = loadConfig();
  let targets;

  if (config && Array.isArray(config.include)) {
    targets = [];
    for (const name of config.include) {
      const fullPath = path.join(parentDir, name);
      if (!fs.existsSync(fullPath)) {
        console.log(`${YELLOW}⚠ 找不到 ${name}${RESET}`);
        continue;
      }
      if (!isGitRepo(fullPath)) {
        console.log(`${GRAY}— ${name} 不是 git repo，跳過${RESET}`);
        continue;
      }
      targets.push({ name, fullPath });
    }
  } else {
    targets = entries
      .map(name => ({ name, fullPath: path.join(parentDir, name) }))
      .filter(({ fullPath }) => isGitRepo(fullPath));
  }

  if (targets.length === 0) {
    console.log('找不到任何 git repo。');
    return;
  }

  console.log(`正在 pull ${targets.length} 個 repo...\n`);

  const results = await Promise.allSettled(
    targets.map(({ name, fullPath }) =>
      run(fullPath).then(result => ({ name, ...result }))
    )
  );

  for (const result of results) {
    if (result.status === 'fulfilled') {
      const { name, err, stdout, stderr } = result.value;
      if (err) {
        console.log(`${RED}✗ ${name}${RESET}`);
        if (stderr) console.log(`  ${stderr}`);
      } else {
        console.log(`${GREEN}✓ ${name}${RESET}`);
        if (stdout && stdout !== 'Already up to date.') console.log(`  ${stdout}`);
      }
    }
  }
}

main();
