/**
 * This script patches all block components to:
 * 1. Add buttonXFormType fields to their content interfaces
 * 2. Wire useCtaAction hook for each button
 * 3. Add the modalNode render
 *
 * Run once: npx tsx scripts/patch-cta-forms.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const BLOCKS_DIR = path.join(process.cwd(), 'src/components/blocks');

// Which files need button1+2 (dual button), buttonUrl (single), or ctaUrl (section-level cta)
const FILES = {
  dual: ['AomHero.tsx', 'AssHero.tsx', 'BiHero.tsx', 'ErpHero.tsx', 'OracleApexHero.tsx', 'OracleHero.tsx', 'RoiHero.tsx', 'RpaHero.tsx'],
  single_buttonUrl: ['BiIndustryServices.tsx', 'FmcgHero.tsx', 'FmcgUseCases.tsx', 'JudicialHero.tsx', 'OracleApexIntro.tsx', 'RetailHero.tsx', 'StaffingHero.tsx'],
  single_ctaUrl: ['AomWorkspace.tsx', 'AssFeaturesGrid.tsx', 'BlogSection.tsx', 'ErpModulesGrid.tsx', 'PortfolioSection.tsx', 'ServicesSection.tsx'],
};

function patchFile(filePath: string, type: 'dual' | 'single_buttonUrl' | 'single_ctaUrl') {
  let content = fs.readFileSync(filePath, 'utf-8');
  const filename = path.basename(filePath);

  // Check if already patched
  if (content.includes('useCtaAction')) {
    console.log(`  [SKIP] ${filename} — already patched`);
    return;
  }

  // 1. Add hook import after existing 'use client' and React import area
  const hookImport = `import { useCtaAction } from '@/hooks/useCtaAction';`;
  // Insert after the last import line block
  content = content.replace(
    /(import\s+.*?from\s+['"][^'"]+['"]\s*;?\s*\n)(?!import)/,
    `$1${hookImport}\n`
  );

  if (type === 'dual') {
    // Add interface fields
    content = content
      .replace(/(button1Url\?:\s*string;)/, `$1\n  button1FormType?: string;`)
      .replace(/(button2Url\?:\s*string;)/, `$1\n  button2FormType?: string;`);

    // Add defaults
    content = content
      .replace(/(const button1Url\s*=\s*content\?\.button1Url.*?;)/, `$1\n  const button1FormType = (content?.button1FormType || '') as import('@/hooks/useCtaAction').CtaFormType;`)
      .replace(/(const button2Url\s*=\s*content\?\.button2Url.*?;)/, `$1\n  const button2FormType = (content?.button2FormType || '') as import('@/hooks/useCtaAction').CtaFormType;`);

    // Add hooks — find the function body opening and insert
    content = content.replace(
      /(\n\s*const button2FormType[^;]+;\n)/,
      `$1\n  const { handleClick: handleBtn1Click, modalNode: modal1 } = useCtaAction(button1Url, button1FormType);\n  const { handleClick: handleBtn2Click, modalNode: modal2 } = useCtaAction(button2Url, button2FormType);\n`
    );

    // Replace onClick for button1
    content = content.replace(
      /onClick=\{[^}]*=>\s*\(\s*window\.location\.href\s*=\s*button1Url\s*\)\s*\}/g,
      `onClick={handleBtn1Click}`
    );
    // Replace onClick for button2
    content = content.replace(
      /onClick=\{[^}]*=>\s*\(\s*window\.location\.href\s*=\s*button2Url\s*\)\s*\}/g,
      `onClick={handleBtn2Click}`
    );

    // Insert modals before closing return tag - find last </section> or </div> before the export
    content = content.replace(
      /(\s*<\/section>\s*\);\s*\})\s*$/m,
      `\n      {modal1}\n      {modal2}\n    </section>\n  );\n}\n`
    );
  }

  if (type === 'single_buttonUrl') {
    content = content.replace(/(buttonUrl\?:\s*string;)/, `$1\n  buttonFormType?: string;`);
    content = content.replace(
      /(const buttonUrl\s*=\s*content\?\.buttonUrl.*?;)/,
      `$1\n  const buttonFormType = (content?.buttonFormType || '') as import('@/hooks/useCtaAction').CtaFormType;`
    );
    content = content.replace(
      /(\n\s*const buttonFormType[^;]+;\n)/,
      `$1\n  const { handleClick: handleBtnClick, modalNode } = useCtaAction(buttonUrl, buttonFormType);\n`
    );
    content = content.replace(
      /onClick=\{[^}]*=>\s*\(\s*window\.location\.href\s*=\s*buttonUrl\s*\)\s*\}/g,
      `onClick={handleBtnClick}`
    );
    content = content.replace(
      /(\s*<\/section>\s*\);\s*\})\s*$/m,
      `\n      {modalNode}\n    </section>\n  );\n}\n`
    );
  }

  if (type === 'single_ctaUrl') {
    content = content.replace(/(ctaUrl\?:\s*string;)/, `$1\n  ctaFormType?: string;`);
    content = content.replace(
      /(const ctaUrl\s*=\s*content\?\.ctaUrl.*?;)/,
      `$1\n  const ctaFormType = (content?.ctaFormType || '') as import('@/hooks/useCtaAction').CtaFormType;`
    );
    content = content.replace(
      /(\n\s*const ctaFormType[^;]+;\n)/,
      `$1\n  const { handleClick: handleCtaClick, modalNode } = useCtaAction(ctaUrl, ctaFormType);\n`
    );
    content = content.replace(
      /onClick=\{[^}]*=>\s*\(\s*window\.location\.href\s*=\s*ctaUrl\s*\)\s*\}/g,
      `onClick={handleCtaClick}`
    );
    content = content.replace(
      /(\s*<\/section>\s*\);\s*\})\s*$/m,
      `\n      {modalNode}\n    </section>\n  );\n}\n`
    );
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`  [OK]   ${filename}`);
}

console.log('\n=== Patching CTA Form support into block components ===\n');

for (const file of FILES.dual) {
  const fp = path.join(BLOCKS_DIR, file);
  if (fs.existsSync(fp)) patchFile(fp, 'dual');
  else console.log(`  [MISS] ${file}`);
}
for (const file of FILES.single_buttonUrl) {
  const fp = path.join(BLOCKS_DIR, file);
  if (fs.existsSync(fp)) patchFile(fp, 'single_buttonUrl');
  else console.log(`  [MISS] ${file}`);
}
for (const file of FILES.single_ctaUrl) {
  const fp = path.join(BLOCKS_DIR, file);
  if (fs.existsSync(fp)) patchFile(fp, 'single_ctaUrl');
  else console.log(`  [MISS] ${file}`);
}

console.log('\n=== Done ===\n');
