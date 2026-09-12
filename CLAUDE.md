# keygen — Projektkontext für Claude Code

## Was das ist
Single-File Web-Tool: kryptografisch sicherer Zufallsschlüssel-Generator.
Web-Äquivalent zu `openssl rand -base64 32`. Teil der manuel.tools Toolbox.

## Constraints (nicht verhandelbar)
- **Kein Build-Step.** Alles in `index.html` — HTML, CSS, JS inline. Kein npm, kein Vite, kein Bundler.
- **Keine externen Requests.** Keine CDNs, keine Fonts von Google, keine Analytics. Muss offline funktionieren.
- **Nur `crypto.getRandomValues()`** für Zufall. Niemals `Math.random()`.
- Schlüssel darf den Browser nie verlassen — kein Logging, kein `fetch`, kein LocalStorage-Persist.

## Design
manuel.tools Design-Sprache:
- Hintergrund `#ece7db` (beige), Karte weiß, Rahmen 2px `#17140f`
- Akzent `#c1502f` (terra), Karte hat `box-shadow: 6px 6px 0` in Akzentfarbe
- Monospace (`Courier New`) für UI, kursive Serif (Georgia) für die Überschrift
- Labels uppercase mit `letter-spacing`
- Buttons: 2px Rahmen, 8px Radius, `scale(0.97)` auf `:active`

## Deployment
GitHub Pages via `.github/workflows/deploy.yml`. Push auf `main` → live auf `ieeks.github.io/keygen`.

## Offene Punkte / Backlog
- [x] Hex-Output zusätzlich zu Base64 (Toggle)
- [x] Base64url-Variante (`-` und `_` statt `+` und `/`, ohne Padding) — für JWT/URL-Secrets
- [x] Preset-Buttons: 16 / 32 / 64 Bytes
- [x] Entropie-Anzeige in Bit
- [x] Dark-Mode (inzwischen als Umschalter statt über `prefers-color-scheme`)
- [x] History der letzten 3 Keys in der Session (nur In-Memory, nicht persistiert)

Offen aus dem Review in Issue #2:
- [x] `valueAsNumber` statt `parseInt` für die Byte-Eingabe (Finding 4)
- [x] Smoke-Test vor dem Deploy (Finding 5)
- [x] Pages-Artefakt auf die App beschränken statt `path: '.'` (Finding 6)

## Byte-Eingabe
`valueAsNumber`, nicht `parseInt` — letzteres liest `1e2` als 1 und schneidet
Dezimalstellen still ab. Regel: leeres oder unlesbares Feld → Default 32; ein
lesbarer Wert wird gerundet und auf 1–256 geklemmt. „Außerhalb des Bereichs" und
„gar nichts eingegeben" sind bewusst zwei verschiedene Fälle.

## Tests
`node scripts/smoke-test.mjs` — ohne Build-Step, ohne Dependencies. Der Test liest
`index.html`, schneidet das Inline-Script heraus und führt es mit einem DOM-Stub in
`node:vm` aus, prüft also den ausgelieferten Code und keine Kopie. Bei funktionalen
Änderungen mitpflegen. Läuft in CI auf Push und Pull Request, der Deploy hängt per
`needs: test` daran.

## Pages-Artefakt
`deploy.yml` baut ein `_site/` und lädt nur das hoch. Neue statische Assets
müssen dort bewusst ergänzt werden — Allowlist, damit nicht versehentlich
wieder Doku und Prompts auf der Live-Site landen.

## Farbschema
Das Tool startet **immer hell** und folgt nicht `prefers-color-scheme`. Dunkel hängt
an `:root[data-theme="dark"]`, gesetzt vom Umschalter oben rechts. Die Wahl wird
**nicht** persistiert: Das würde `localStorage` brauchen, und das Projekt schreibt
nichts in den Browser-Speicher — auch keine Bedienvorliebe. Der Smoke-Test erzwingt das.

Im Dark Mode trägt der Akzent **dunkle** Schrift (`--on-accent: #17140f`), nicht weiße —
weiß auf `#d96a48` erreicht nur 3.44:1 und fällt durch. Der Rahmen wird zu `#7a7466`,
weil `#17140f` auf dunklem Grund unsichtbar wäre (1.65:1).

## Doku-Konventionen
- `CHANGELOG.md` nach Keep a Changelog, SemVer — bei jedem funktionalen Change mitpflegen
- Commits nach Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`)
- Architekturentscheidungen kommen als ADR nach `docs/DECISIONS.md`, nicht ins README
- Doku auf Deutsch, knapp, keine Marketing-Sprache

## Prompts
`prompts/01-features.md` → Code, `prompts/02-docs.md` → Doku. In der Reihenfolge ausführen.
