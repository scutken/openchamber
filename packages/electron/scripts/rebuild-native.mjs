#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { rebuild } from '@electron/rebuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const electronDir = path.resolve(__dirname, '..');
const repoRoot = path.resolve(electronDir, '..', '..');
const require = createRequire(import.meta.url);

const electronPkg = require('electron/package.json');
const electronVersion = electronPkg.version;

console.log(`[electron] rebuilding native modules against Electron ${electronVersion}...`);

// Rebuild against the hoisted root node_modules (bun workspace layout).
// force=true re-links regardless of cached state; prebuild-install lookup is
// bypassed by @electron/rebuild in favor of direct node-gyp builds.
// bun-pty only works in Bun runtime; skip it on Windows where it has no
// prebuilt binaries and node-pty is the only PTY backend anyway.
const nativeModules = process.platform === 'win32'
  ? ['better-sqlite3', 'node-pty']
  : ['better-sqlite3', 'node-pty', 'bun-pty'];

await rebuild({
  buildPath: repoRoot,
  electronVersion,
  force: true,
  arch: process.env.ELECTRON_BUILDER_ARCH || process.arch,
  onlyModules: nativeModules,
});

console.log('[electron] native modules rebuilt successfully');
