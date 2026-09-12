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
- Hex-Output zusätzlich zu Base64 (Toggle)
- Base64url-Variante (`-` und `_` statt `+` und `/`, ohne Padding) — für JWT/URL-Secrets
- Preset-Buttons: 16 / 32 / 64 Bytes
- Entropie-Anzeige in Bit
- Dark-Mode über `prefers-color-scheme`
- History der letzten 3 Keys in der Session (nur In-Memory, nicht persistiert)

## Doku-Konventionen
- `CHANGELOG.md` nach Keep a Changelog, SemVer — bei jedem funktionalen Change mitpflegen
- Commits nach Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`)
- Architekturentscheidungen kommen als ADR nach `docs/DECISIONS.md`, nicht ins README
- Doku auf Deutsch, knapp, keine Marketing-Sprache

## Prompts
`prompts/01-features.md` → Code, `prompts/02-docs.md` → Doku. In der Reihenfolge ausführen.
