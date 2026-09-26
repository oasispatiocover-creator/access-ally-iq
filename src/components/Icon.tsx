import React from 'react';
import Svg, { Path, Circle, Rect, Ellipse } from 'react-native-svg';
import placeIcons from '../data/icons.json';

// UI icons (tab bar and controls) plus the place icons from the prototype.
const UI: Record<string, string> = {
  home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  places: '<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  qa: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M9.8 9.5a2.3 2.3 0 0 1 4.4.8c0 1.6-2.2 2-2.2 3.2M12 16.5h.01"/>',
  animals: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 10v10"/>',
  more: '<rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  phone: '<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M10 18h4"/>',
  speaker: '<path d="M11 5L6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>',
  chevron: '<path d="M9 6l6 6-6 6"/>',
  back: '<path d="M15 6l-6 6 6 6"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  share: '<path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
};

const ALL: Record<string, string> = { ...(placeIcons as Record<string, string>), ...UI };

const num = (v?: string) => (v == null ? undefined : Number(v));
function attrs(tag: string) {
  const o: Record<string, string> = {};
  for (const m of tag.matchAll(/([a-z-]+)="([^"]*)"/g)) o[m[1]] = m[2];
  return o;
}

// Parse each icon's markup once and reuse it.
const PARSED: Record<string, RegExpMatchArray[]> = {};
const parse = (name: string) => {
  const key = ALL[name] ? name : 'places';
  if (!PARSED[key]) PARSED[key] = [...ALL[key].matchAll(/<(path|circle|rect|ellipse)\b([^>]*)\/?>/g)];
  return PARSED[key];
};

export function Icon({ name, size = 22, color, strokeWidth = 2 }: { name: string; size?: number; color: string; strokeWidth?: number }) {
  const els = parse(name);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {els.map((m, i) => {
        const a = attrs(m[2]);
        if (m[1] === 'path') return <Path key={i} d={a.d} />;
        if (m[1] === 'circle') return <Circle key={i} cx={num(a.cx)} cy={num(a.cy)} r={num(a.r)} />;
        if (m[1] === 'ellipse') return <Ellipse key={i} cx={num(a.cx)} cy={num(a.cy)} rx={num(a.rx)} ry={num(a.ry)} />;
        return <Rect key={i} x={num(a.x)} y={num(a.y)} width={num(a.width)} height={num(a.height)} rx={num(a.rx)} />;
      })}
    </Svg>
  );
}
