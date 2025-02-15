import crypto from 'crypto';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const ENV_PATH = join(process.cwd(), '.env');
const TEMPLATE_PATH = join(process.cwd(), 'templates/template.env');

// Generate a secure random password
function generatePassword(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}

const password: string = generatePassword();

// Check if --log-password flag is provided
const shouldLogPassword: boolean = process.argv.includes('--log-password');
if (shouldLogPassword) {
  console.warn(
    '⚠️ WARNING: Logging the password may expose sensitive credentials!',
  );
  console.log(`Generated Password: ${password}`);
}

let envContent: string;
if (existsSync(TEMPLATE_PATH)) {
  envContent = readFileSync(TEMPLATE_PATH, 'utf-8')
    .replace(/\{MYSQL_ROOT_PASSWORD\}/g, password)
    .replace(/\{MYSQL_DATABASE\}/g, 'database')
    .replace(/\{MYSQL_USER\}/g, 'user')
    .replace(/\{MYSQL_PASSWORD\}/g, password);
} else {
  console.warn(
    '⚠️ Warning: templates/template.env file not found. Using default values.',
  );
  envContent = `MYSQL_ROOT_PASSWORD=${password}\nMYSQL_DATABASE=database\nMYSQL_USER=user\nMYSQL_PASSWORD=${password}\n`;
}

// Truncate and write the .env file
writeFileSync(ENV_PATH, envContent, { flag: 'w' });
console.log('✅ .env file created or updated with database credentials.');
