// Smoke-Test ohne Build-Step und ohne Dependencies — laeuft mit blankem Node.
//
//   node scripts/smoke-test.mjs
//
// Der Test liest das echte index.html, schneidet das Inline-Script heraus und
// fuehrt es in einem vm-Context mit minimalem DOM-Stub aus. Damit prueft er den
// tatsaechlich ausgelieferten Code, keine Kopie davon.
import { readFileSync } from 'node:fs';
import { createContext, Script } from 'node:vm';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(root, 'index.html'), 'utf8');

let failed = 0;
const check = (label, ok, detail = '') => {
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? '  — ' + detail : ''}`);
};

// --- 1. Constraints aus CLAUDE.md -----------------------------------------
check('kein Math.random', !/Math\.random/.test(html));
check('kein localStorage/sessionStorage', !/(local|session)Storage/.test(html));
check('kein fetch/XHR', !/\bfetch\s*\(|XMLHttpRequest/.test(html));
check('keine externen Ressourcen', !/(src|href)\s*=\s*["']https?:/i.test(html));
check('crypto.getRandomValues wird benutzt', /crypto\.getRandomValues/.test(html));

// --- 2. Syntaxpruefung ------------------------------------------------------
const match = html.match(/<script>([\s\S]*?)<\/script>/);
if (!match) {
  check('Inline-Script gefunden', false);
  process.exit(1);
}
let script;
try {
  script = new Script(match[1], { filename: 'index.html<script>' });
  check('Inline-Script ist syntaktisch gueltig', true);
} catch (e) {
  check('Inline-Script ist syntaktisch gueltig', false, e.message);
  process.exit(1);
}

// --- 3. Minimaler DOM-Stub --------------------------------------------------
const el = (id = '', attrs = {}) => {
  const node = {
    id, textContent: '', className: '', hidden: false, type: '', value: '',
    children: [], dataset: { ...attrs }, listeners: {},
    classList: { toggle() {}, add() {}, remove() {} },
    setAttribute(k, v) { if (k.startsWith('data-')) node.dataset[k.slice(5)] = v; },
    getAttribute(k) { return node.dataset[k.replace(/^data-/, '')]; },
    addEventListener(type, fn) { (node.listeners[type] ||= []).push(fn); },
    append(...kids) { node.children.push(...kids); },
    replaceChildren(...kids) { node.children = kids; },
    click() { (node.listeners.click || []).forEach(fn => fn()); },
    change() { (node.listeners.change || []).forEach(fn => fn()); },
    // Semantik eines <input type="number">: leer oder unlesbar ergibt NaN,
    // 1e999 weist der Browser ab — deshalb auch hier NaN statt Infinity.
    get valueAsNumber() {
      if (String(node.value).trim() === '') return NaN;
      const n = Number(node.value);
      return Number.isFinite(n) ? n : NaN;
    },
  };
  return node;
};

const nodes = {
  bytes: el('bytes'), output: el('output'), entropy: el('entropy'),
  'weak-warning': el('weak-warning'), 'copied-msg': el('copied-msg'),
  'history-wrap': el('history-wrap'), history: el('history'),
  gen: el('gen'), 'copy-btn': el('copy-btn'),
};
nodes.bytes.value = '32';
const formatBtns = ['base64', 'base64url', 'hex'].map(f => el('', { format: f }));
const presetBtns = ['16', '32', '64'].map(p => el('', { preset: p }));

const ctx = createContext({
  document: {
    getElementById: id => nodes[id],
    querySelectorAll: sel => sel === '[data-format]' ? formatBtns
      : sel === '[data-preset]' ? presetBtns : [],
    createElement: () => el(),
  },
  navigator: { clipboard: { writeText: async () => {} } },
  crypto, btoa, setTimeout, clearTimeout, console,
});
script.runInContext(ctx);

// --- 4. Hilfen --------------------------------------------------------------
const setBytes = v => { nodes.bytes.value = String(v); nodes.bytes.change(); };
const out = () => nodes.output.textContent;
const pick = fmt => formatBtns[['base64', 'base64url', 'hex'].indexOf(fmt)].click();
const b64len = s => Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64').length;

check('Initiales Rendern erzeugt einen Schluessel', out().length > 0, `${out().length} Zeichen`);

// --- 5. Laengen: 1 / 32 / 256 Byte -----------------------------------------
for (const n of [1, 32, 256]) {
  pick('base64');
  setBytes(n);
  const b64 = out();
  check(`${n} Byte: base64 dekodiert auf ${n} Byte`, b64len(b64) === n, `${b64len(b64)} Byte`);
  check(`${n} Byte: base64-Zeichensatz`, /^[A-Za-z0-9+/]+={0,2}$/.test(b64));

  pick('hex');
  const hex = out();
  check(`${n} Byte: hex-Zeichensatz und Laenge`, /^[0-9a-f]+$/.test(hex) && hex.length === n * 2, `${hex.length} Zeichen`);
  check(`${n} Byte: hex und base64 sind derselbe Schluessel`, Buffer.from(hex, 'hex').toString('base64') === b64);

  pick('base64url');
  const url = out();
  check(`${n} Byte: base64url ohne + / =`, !/[+/=]/.test(url));
  check(`${n} Byte: base64url entspricht base64`, url === b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''));
}

// --- 6. Byte-Eingabe --------------------------------------------------------
pick('base64');
for (const [input, expected] of [['', 32], ['0', 1], ['-5', 1], ['3.9', 4], ['1e2', 100], ['256', 256], ['257', 256], ['abc', 32]]) {
  setBytes(input);
  check(`Eingabe ${JSON.stringify(input)} -> ${expected} Byte`, b64len(out()) === expected, `${b64len(out())} Byte`);
}

// --- 7. Entropie-Anzeige und Warnung ---------------------------------------
setBytes(32);
check('Entropie-Zeile bei 32 Byte', nodes.entropy.textContent === '256 bit entropie · 32 bytes', nodes.entropy.textContent);
check('keine Warnung bei 32 Byte', nodes['weak-warning'].hidden === true);
setBytes(8);
check('Warnung bei 8 Byte', nodes['weak-warning'].hidden === false);

// --- 8. History -------------------------------------------------------------
setBytes(32);
const seen = new Set([out()]);
for (let i = 0; i < 5; i++) { nodes.gen.click(); seen.add(out()); }
check('History haelt hoechstens 3 Eintraege', nodes.history.children.length === 3, `${nodes.history.children.length}`);
check('alle erzeugten Schluessel sind verschieden', seen.size === 6, `${seen.size} von 6`);

console.log(failed === 0 ? '\nAlle Checks bestanden.' : `\n${failed} Check(s) fehlgeschlagen.`);
process.exit(failed === 0 ? 0 : 1);
