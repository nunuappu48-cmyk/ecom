import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

const connectionString = 'postgresql://neondb_owner:npg_v0ulgMm9nyfH@ep-winter-hat-b4fx57jq-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require';

async function main() {
  console.log('Connecting to Neon database via HTTP serverless driver...');
  const sql = neon(connectionString);

  const version = await sql`SELECT version()`;
  console.log('✅ Successfully connected to Neon database!');
  console.log('Postgres:', version[0].version);

  const sqlFilePath = path.resolve('neon/schema_and_seed.sql');
  const fullSql = fs.readFileSync(sqlFilePath, 'utf8');

  // Split into individual SQL statements
  // Filter out comments and blank lines
  const statements = fullSql
    .split(/;\s*[\r\n]+/)
    .map(s => s.trim())
    .filter(s => {
      // Remove pure comment blocks
      const clean = s.replace(/--.*$/gm, '').trim();
      return clean.length > 0;
    });

  console.log(`Executing ${statements.length} SQL statement blocks...`);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    const preview = stmt.replace(/\s+/g, ' ').substring(0, 70);
    console.log(`[${i + 1}/${statements.length}] Running: ${preview}...`);
    try {
      await sql.query(stmt);
      console.log(`  -> Done.`);
    } catch (err) {
      console.error(`  ❌ Error executing statement [${i + 1}]:`, err.message);
      throw err;
    }
  }

  console.log('\n🎉 ALL TABLES, INDEXES, AND SEED PRODUCTS SUCCESSFULLY CREATED IN NEON!');

  // Verify created products
  const products = await sql`SELECT count(*)::int as count FROM public.products`;
  console.log(`Total products now in Neon public.products: ${products[0].count}`);

  const sample = await sql`SELECT id, name, category, price FROM public.products LIMIT 3`;
  console.log('Sample products in Neon:', sample);
}

main().catch(err => {
  console.error('\nMigration failed:', err);
  process.exit(1);
});
