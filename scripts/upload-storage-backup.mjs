import { createClient } from '@supabase/supabase-js';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const backupRootArg = args.find((arg) => !arg.startsWith('--'));
const overwrite = args.includes('--overwrite');

if (!backupRootArg) {
  console.error('Usage: npm run restore:storage -- <backup-root>');
  process.exit(1);
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error('Missing SUPABASE_URL (or VITE_SUPABASE_URL).');
  process.exit(1);
}

if (!serviceRoleKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return [fullPath];
  }));
  return files.flat();
}

function getContentType(filePath) {
  switch (path.extname(filePath).toLowerCase()) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    case '.gif':
      return 'image/gif';
    case '.svg':
      return 'image/svg+xml';
    case '.avif':
      return 'image/avif';
    case '.pdf':
      return 'application/pdf';
    default:
      return 'application/octet-stream';
  }
}

async function listExistingObjects(bucketName) {
  const existing = new Set();
  const queue = [''];

  while (queue.length) {
    const prefix = queue.shift();
    const { data, error } = await supabase.storage.from(bucketName).list(prefix, {
      limit: 1000,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' },
    });

    if (error) {
      throw new Error(`Failed listing ${bucketName}/${prefix}: ${error.message}`);
    }

    for (const item of data ?? []) {
      const itemPath = prefix ? `${prefix}/${item.name}` : item.name;
      if (item.id) {
        existing.add(itemPath);
      } else {
        queue.push(itemPath);
      }
    }
  }

  return existing;
}

async function main() {
  const backupRoot = path.resolve(backupRootArg);
  const rootEntries = await fs.readdir(backupRoot, { withFileTypes: true });
  const projectDirs = rootEntries.filter((entry) => entry.isDirectory());

  if (projectDirs.length !== 1) {
    throw new Error(`Expected exactly one project directory inside ${backupRoot}.`);
  }

  const projectRoot = path.join(backupRoot, projectDirs[0].name);
  const bucketEntries = await fs.readdir(projectRoot, { withFileTypes: true });
  const bucketDirs = bucketEntries.filter((entry) => entry.isDirectory());

  if (!bucketDirs.length) {
    throw new Error(`No bucket directories found inside ${projectRoot}.`);
  }

  let uploaded = 0;

  for (const bucket of bucketDirs) {
    const bucketRoot = path.join(projectRoot, bucket.name);
    const files = await walk(bucketRoot);
    const existing = await listExistingObjects(bucket.name);

    for (const filePath of files) {
      const objectPath = path.relative(bucketRoot, filePath).replaceAll(path.sep, '/');
      if (!overwrite && existing.has(objectPath)) {
        continue;
      }
      const fileBuffer = await fs.readFile(filePath);
      const { error } = await supabase.storage
        .from(bucket.name)
        .upload(objectPath, fileBuffer, {
          upsert: true,
          contentType: getContentType(filePath),
        });

      if (error) {
        throw new Error(`Failed uploading ${bucket.name}/${objectPath}: ${error.message}`);
      }

      uploaded += 1;
      if (uploaded % 25 === 0) {
        console.log(`Uploaded ${uploaded} files...`);
      }
    }
  }

  console.log(`Storage restore complete. Uploaded ${uploaded} files.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
