import { getSectionDefinition } from '../src/lib/cms/section-registry';

const meta = getSectionDefinition('rpa-cta');
console.log('rpa-cta definition:', meta);
console.log('rpa-cta fieldOrder:', meta?.fieldOrder);

const aboutMeta = getSectionDefinition('about-us-cta');
console.log('about-us-cta definition:', aboutMeta);
console.log('about-us-cta fieldOrder:', aboutMeta?.fieldOrder);
