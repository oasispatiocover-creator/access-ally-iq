import { PLACES, QA, GUIDES, STATES } from '../data';
import type { Block } from '../data';

export type Hit = { kind: string; title: string; text: string; href: string | { pathname: string; params?: Record<string, string> }; stateCode?: string };

const blocksText = (bs: Block[]) => bs.map(b => b.type === 'p' ? b.text : b.type === 'steps' ? b.items.join(' ') : b.type === 'list' ? b.items.map(i => i.text).join(' ') : b.items.map(i => i.label).join(' ')).join(' ');

let index: Hit[] | null = null;
function build(): Hit[] {
  const idx: Hit[] = [];
  PLACES.forEach(p => idx.push({ kind: 'Place', title: p.name, text: [p.hint, p.law, p.can.join(' '), p.cannot.join(' '), blocksText(p.notes)].join(' '), href: { pathname: '/place/[id]', params: { id: p.id } } }));
  QA.forEach((q, i) => idx.push({ kind: 'Q&A', title: q.q, text: q.said + ' ' + q.answer.join(' '), href: { pathname: '/qa', params: { open: String(i) } } }));
  Object.entries(GUIDES).forEach(([k, g]) => idx.push({ kind: 'Guide', title: g.title, text: g.intro + ' ' + g.sections.map(s => s.eyebrow + ' ' + blocksText(s.blocks)).join(' '), href: { pathname: '/guide/[id]', params: { id: k } } }));
  const tools: [string, string, string][] = [
    ['Dog profile', '/profile', 'name task emergency contact photo vaccination microchip'],
    ['Incident log', '/log', 'write down what happened record'],
    ['Write a complaint', '/letter', 'complaint letter Justice Department DOJ civil rights'],
    ['Asking your landlord', '/request/housing', 'housing apartment landlord emotional support animal HUD fair housing letter'],
    ['Asking your employer', '/request/work', 'work job employer accommodation EEOC letter'],
    ['Staff quiz', '/quiz', 'training employees test'],
    ['Sample service animal policy', '/policy', 'business policy template'],
    ['Sign wording', '/signs', 'no pets sign door'],
    ['Restaurants and the health code', '/foodcode', 'FDA Food Code health inspector kitchen'],
    ['QR code door poster', '/poster', 'QR code sign poster print'],
    ['Trained business directory', '/directory', 'listing decal'],
    ['Free help', '/help', 'ADA National Network Protection Advocacy lawyer phone JAN'],
    ['Privacy', '/privacy', 'data delete'],
    ['Which animals count', '/animals', 'emotional support therapy miniature horse breed pit bull cat monkey'],
  ];
  tools.forEach(([t, h, text]) => idx.push({ kind: 'Tool', title: t, text, href: h }));
  Object.entries(STATES).forEach(([code, s]) => idx.push({ kind: s.territory ? 'Territory' : 'State', title: s.name + ' law', text: [s.name, s.trNote, s.mp || '', s.other || ''].join(' '), href: '/', stateCode: code }));
  return idx;
}

export function search(q: string): Hit[] {
  const query = q.trim().toLowerCase();
  if (query.length < 2) return [];
  index = index || build();
  const terms = query.split(/\s+/);
  return index
    .map(it => {
      const t = it.title.toLowerCase(), b = it.text.toLowerCase();
      if (!terms.every(w => t.includes(w) || b.includes(w))) return null;
      return { it, score: terms.reduce((n, w) => n + (t.includes(w) ? 5 : 0) + (b.split(w).length - 1), 0) };
    })
    .filter(Boolean)
    .sort((a, b) => b!.score - a!.score)
    .slice(0, 30)
    .map(x => x!.it);
}

export function snippet(text: string, q: string) {
  const w = q.trim().toLowerCase().split(/\s+/)[0] || '';
  const clean = text.replace(/\*\*/g, '');
  const pos = clean.toLowerCase().indexOf(w);
  const start = Math.max(0, pos - 40);
  return (start > 0 ? '…' : '') + clean.slice(start, start + 130).trim() + '…';
}
