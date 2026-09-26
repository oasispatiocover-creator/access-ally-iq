// Extracts all app content from the web prototype (prototype/index.html)
// into JSON files under src/data/. Run with: node scripts/extract-content.mjs
// The prototype stays the single source of truth for legal content until a CMS exists.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = fs.readFileSync(path.join(root, 'prototype/index.html'), 'utf8');
const script = html.slice(html.lastIndexOf('<script>') + 8, html.lastIndexOf('</script>'));

// A permissive fake DOM so the prototype script can run without a browser.
const anyObj = () => new Proxy(function () {}, {
  get: (t, k) => (k === Symbol.toPrimitive ? () => '' : k === 'value' ? '' : anyObj()),
  set: () => true,
  apply: () => anyObj(),
});
const fakeDoc = {
  getElementById: () => anyObj(),
  querySelectorAll: () => [],
  querySelector: () => null,
  addEventListener: () => {},
  createElement: () => anyObj(),
  head: anyObj(),
  body: anyObj(),
  documentElement: anyObj(),
};
const store = {};
const ctx = {
  document: fakeDoc,
  window: { scrollTo() {}, scrollY: 0 },
  localStorage: { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = v; }, removeItem: k => { delete store[k]; } },
  navigator: {},
  setTimeout, clearTimeout, console,
  Image: function () {},
  URL: { createObjectURL: () => '', revokeObjectURL() {} },
};
ctx.window.claude = undefined;
vm.createContext(ctx);

const collect = `
;(function(){
  const guideOut = {};
  const realGuide = guide;
  guide = function(title, intro, sections, cite){ return { title, intro, sections: sections.map(s => ({ eyebrow: s[0], html: s[1] })), cite }; };
  for (const k of Object.keys(GUIDES)) {
    const v = GUIDES[k]();
    if (typeof v === 'object') guideOut[k] = v;
  }
  guide = realGuide;
  const staff = {};
  for (const lang of Object.keys(STAFF_TXT)) {
    const t = Object.assign({}, STAFF_TXT[lang]);
    t.training = t.training('{STATE}', '{LAW}');
    staff[lang] = t;
  }
  globalThis.__out = { ICONS, PLACES, PLACE_CATS, QA, QA_GROUPS, STATES, ANIMAL_ROWS, SD_JOBS, QUIZ, FLOW, SCRIPTS, TASK_IDEAS, STAFF: staff, GUIDES: guideOut };
})();`;

vm.runInContext(script + collect, ctx, { filename: 'prototype.js' });
const out = JSON.parse(JSON.stringify(ctx.__out));

// ---------- HTML snippet -> simple blocks ----------
// Inline text keeps **bold** markers and \n for line breaks; everything else is plain text.
const decode = s => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
function inline(h) {
  return decode(
    String(h)
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**')
      .replace(/<[^>]+>/g, '')
  ).replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').trim();
}
function toBlocks(h) {
  const blocks = [];
  let s = String(h);
  const re = /<ul class="rules">([\s\S]*?)<\/ul>|<ol class="steps">([\s\S]*?)<\/ol>|<div class="links"[^>]*>([\s\S]*?)<\/div>|<p[^>]*>([\s\S]*?)<\/p>/g;
  let last = 0, m;
  const pushText = t => { const x = inline(t); if (x) blocks.push({ type: 'p', text: x }); };
  while ((m = re.exec(s))) {
    pushText(s.slice(last, m.index));
    last = re.lastIndex;
    if (m[1] != null) {
      const items = [...m[1].matchAll(/<li><span class="(\w+)"[^>]*>([\s\S]*?)<\/span><span>([\s\S]*?)<\/span><\/li>/g)]
        .map(x => ({ mark: x[1] === 'cross' ? 'cross' : x[1] === 'dot' ? 'dot' : 'tick', sym: decode(x[2]), text: inline(x[3]) }));
      blocks.push({ type: 'list', items });
    } else if (m[2] != null) {
      const items = [...m[2].matchAll(/<li><span>([\s\S]*?)<\/span><\/li>/g)].map(x => inline(x[1]));
      blocks.push({ type: 'steps', items });
    } else if (m[3] != null) {
      const items = [...m[3].matchAll(/<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map(x => ({ url: decode(x[1]), label: inline(x[2].replace(/<span>[\s\S]*?<\/span>/g, '')) }));
      blocks.push({ type: 'links', items });
    } else if (m[4] != null) {
      pushText(m[4]);
    }
  }
  pushText(s.slice(last));
  return blocks;
}

// Places: notes may contain <br>, <b> and a links div.
const places = out.PLACES.map(p => ({
  id: p.id, cat: p.cat, icon: p.icon, name: p.name, hint: p.hint, law: p.law, cite: p.cite,
  exempt: !!p.ex,
  can: p.can.map(inline), cannot: p.cannot.map(inline),
  notes: toBlocks(p.notes),
}));
const qa = out.QA.map(q => ({ group: q.g, verdict: q.v, said: inline(q.said), q: inline(q.q), answer: q.a.map(inline), cite: q.cite }));
const guides = Object.fromEntries(Object.entries(out.GUIDES).map(([k, g]) => [k, {
  title: g.title, intro: g.intro, cite: g.cite || '',
  sections: g.sections.map(s => ({ eyebrow: inline(s.eyebrow), blocks: toBlocks(s.html) })),
}]));
const flow = Object.fromEntries(Object.entries(out.FLOW).map(([k, v]) => [k, v.end ? { end: v.end, text: inline(v.text) } : { q: v.q, yes: v.yes, no: v.no, note: v.note || null }]));

const files = {
  'places.json': { categories: out.PLACE_CATS, places },
  'qa.json': { groups: out.QA_GROUPS, items: qa },
  'states.json': out.STATES,
  'animals.json': { rows: out.ANIMAL_ROWS, jobs: out.SD_JOBS },
  'business.json': { quiz: out.QUIZ, flow, scripts: out.SCRIPTS },
  'guides.json': guides,
  'staff.json': out.STAFF,
  'tasks.json': out.TASK_IDEAS,
  'icons.json': out.ICONS,
};
const dir = path.join(root, 'src/data');
fs.mkdirSync(dir, { recursive: true });
for (const [name, data] of Object.entries(files)) fs.writeFileSync(path.join(dir, name), JSON.stringify(data, null, 2) + '\n');
console.log(`places ${places.length}, qa ${qa.length}, states ${Object.keys(out.STATES).length}, guides ${Object.keys(guides).length}, quiz ${out.QUIZ.length}`);
