import { access, copyFile } from 'fs/promises';
import { join } from 'path';

const PROJECT_ROOT = process.cwd();
const COMPONENT_PATHS = [
  join(PROJECT_ROOT, 'components/client'),
  join(PROJECT_ROOT, 'components/server'),
];

async function copyDefaultEnvFiles() {
  for (const path of COMPONENT_PATHS) {
    const defaultEnv = join(path, 'default.env');
    const envFile = join(path, '.env');

    try {
      await access(defaultEnv);
    } catch {
      console.warn(`⚠️ Warning: ${defaultEnv} not found, skipping.`);
      continue;
    }

    try {
      await access(envFile);
      console.warn(`⚠️ Warning: ${envFile} already exists. Skipping copy.`);
      continue;
    } catch {}

    await copyFile(defaultEnv, envFile);
    console.log(`✅ Copied ${defaultEnv} to ${envFile}`);
  }
}

/**
 * Top level executing
 */
(async () => {
  await copyDefaultEnvFiles();
})();
