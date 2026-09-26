// Typed access to the content extracted from the prototype (see scripts/extract-content.mjs).
import placesJson from './places.json';
import qaJson from './qa.json';
import statesJson from './states.json';
import animalsJson from './animals.json';
import businessJson from './business.json';
import guidesJson from './guides.json';
import staffJson from './staff.json';
import tasksJson from './tasks.json';

export type Block =
  | { type: 'p'; text: string }
  | { type: 'list'; items: { mark: 'tick' | 'cross' | 'dot'; sym: string; text: string }[] }
  | { type: 'steps'; items: string[] }
  | { type: 'links'; items: { url: string; label: string }[] };

export type Place = {
  id: string; cat: string; icon: string; name: string; hint: string; law: string; cite: string;
  exempt: boolean; can: string[]; cannot: string[]; notes: Block[];
};
export type QAItem = { group: string; verdict: 'myth' | 'true' | 'part'; said: string; q: string; answer: string[]; cite: string };
export type StateLaw = {
  name: string; law: string; tr: 'yes' | 'trainer_only' | 'no'; trNote: string;
  mc: string | null; mp: string | null; mh: boolean; horse: boolean; other: string | null; src: string; territory?: boolean;
};
export type Guide = { title: string; intro: string; cite: string; sections: { eyebrow: string; blocks: Block[] }[] };
export type FlowNode = { q: string; yes: string; no: string; note: string | null } | { end: 'ok' | 'no'; text: string };

export const PLACE_CATS: { id: string; label: string }[] = placesJson.categories;
export const PLACES: Place[] = placesJson.places as Place[];
export const QA_GROUPS: { id: string; label: string }[] = qaJson.groups;
export const QA: QAItem[] = qaJson.items as QAItem[];
export const STATES: Record<string, StateLaw> = statesJson as any;
export const STATE_LIST = Object.entries(STATES)
  .map(([code, s]) => ({ code, ...s }))
  .sort((a, b) => (a.territory === b.territory ? a.name.localeCompare(b.name) : a.territory ? 1 : -1));
export const ANIMAL_ROWS: string[][] = animalsJson.rows;
export const SD_JOBS: string[][] = animalsJson.jobs;
export const QUIZ: [string, string[], number, string][] = businessJson.quiz as any;
export const FLOW: Record<string, FlowNode> = businessJson.flow as any;
export const SCRIPTS: string[][] = businessJson.scripts;
export const GUIDES: Record<string, Guide> = guidesJson as any;
export const STAFF_TXT: Record<'en' | 'es', any> = staffJson as any;
export const TASK_IDEAS: string[] = tasksJson;

export const placeById = (id: string) => PLACES.find(p => p.id === id);
