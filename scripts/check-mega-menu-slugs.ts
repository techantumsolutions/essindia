import postgres from 'postgres';
import 'dotenv/config';

const sql = postgres(process.env.DATABASE_URL!, { prepare: false });

async function main() {
  // Check the mega menu category/sub slugs for ERP Overview, BI ROI Calculator, RPA in Retail
  const erpPage = await sql`
    SELECT p.title, p.slug, p.full_path,
           mc.name as cat_name, mc.slug as cat_slug,
           msc.name as sub_name, msc.slug as sub_slug
    FROM pages p
    LEFT JOIN mega_menu_categories mc ON mc.id = p.mega_menu_category_id
    LEFT JOIN mega_menu_sub_categories msc ON msc.id = p.mega_menu_sub_category_id
    WHERE p.title IN ('ERP Overview', 'BI ROI Calculator', 'RPA in Retail')
  `;
  console.log('Target pages with mega menu slugs:');
  console.log(JSON.stringify(erpPage, null, 2));

  // Also check navigation items
  const navItems = await sql`
    SELECT ni.id, ni.label, ni.slug
    FROM navigation_items ni
    WHERE ni.id IN (
      SELECT navigation_item_id FROM pages WHERE title IN ('ERP Overview', 'BI ROI Calculator', 'RPA in Retail')
    )
  `;
  console.log('\nNavigation items:');
  console.log(JSON.stringify(navItems, null, 2));
  
  await sql.end();
}

main().catch(console.error);
