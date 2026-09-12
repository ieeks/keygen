Du arbeitest im Repo `keygen`. Lies zuerst `CLAUDE.md` für Kontext und
Constraints, und `index.html` für den tatsächlichen Funktionsumfang.

## Aufgabe

Lege die Projektdokumentation an bzw. überarbeite sie. Schreib nichts
Erfundenes rein — lies den Code und dokumentiere, was wirklich drin ist.
Wenn ein Punkt unklar ist, markiere ihn mit `<!-- TODO: -->` statt zu raten.

### 1. `README.md` (überarbeiten)

Die bestehende Version ist ein Stub. Bau sie aus:

- Einzeiler oben, was das Tool macht
- Badge-Zeile: GitHub Pages Deploy-Status, Lizenz
- Screenshot-Platzhalter (`docs/screenshot.png`, Datei noch nicht da —
  verlinke sie trotzdem und notier's im TODO)
- Features als Liste, aus dem tatsächlichen Code abgeleitet
- "Warum" — kurzer Absatz: Web-Äquivalent zu `openssl rand -base64 32`,
  wenn kein Terminal zur Hand ist
- Lokal starten
- Deployment (GitHub Pages via Actions)
- Sicherheitshinweis: `crypto.getRandomValues()` als Browser-CSPRNG,
  Key verlässt den Browser nie, keine Requests, kein Persist
- Link zurück auf manuel.tools

Deutsch, knapp, keine Marketing-Sprache.

### 2. `CHANGELOG.md` (neu)

Format: [Keep a Changelog](https://keepachangelog.com/de/1.1.0/),
Versionierung nach [SemVer](https://semver.org/lang/de/).

- `## [Unreleased]` Sektion oben
- `## [1.0.0]` mit dem heutigen Datum als erster Release —
  Inhalt aus dem, was aktuell im Code steht
- Kategorien: Hinzugefügt / Geändert / Behoben / Entfernt
- Link-Referenzen am Dateiende auf die GitHub-Compare-URLs

### 3. `CONTRIBUTING.md` (neu)

Kurz halten — das ist ein Ein-Personen-Projekt, aber Konventionen
sollen festgehalten sein:

- Kein Build-Step, alles inline in `index.html` (mit Begründung)
- Commit-Konvention: Conventional Commits (`feat:`, `fix:`, `docs:`,
  `chore:`, `refactor:`)
- Branch-Konvention: `feat/`, `fix/`
- Vor dem Push: beide Farbschemata prüfen, Copy-Button testen,
  Byte-Grenzen 1 und 256 testen
- Hinweis: `CHANGELOG.md` bei jedem funktionalen Change mitpflegen

### 4. `SECURITY.md` (neu)

- Threat Model in drei Sätzen: was das Tool schützt, was nicht
- Explizit: keine Netzwerkaufrufe, kein LocalStorage, kein Logging,
  keine Analytics, keine externen Ressourcen (CSP-freundlich)
- Warum `crypto.getRandomValues()` und nicht `Math.random()`
- Restrisiken benennen: kompromittierter Browser, Clipboard-Zugriff
  durch andere Programme, Shoulder-Surfing, Browser-History bei
  Screenshot/Screensharing
- Empfehlung: für Produktionsschlüssel im Zweifel `openssl` lokal
- Kontakt für Meldungen: GitHub Issues

### 5. `LICENSE` (neu)

MIT, Copyright-Zeile: `Copyright (c) 2026 Manuel`.
Verlink die Lizenz im README.

### 6. `docs/DECISIONS.md` (neu)

Leichtgewichtige ADRs, ein Abschnitt pro Entscheidung mit
Kontext / Entscheidung / Konsequenz:

- Warum Single-File statt React/Vite (Abweichung vom sonstigen
  manuel.tools-Stack — Begründung: Auditierbarkeit, keine
  Supply-Chain-Fläche bei einem Krypto-Tool)
- Warum kein LocalStorage für die History
- Warum Base64 als Default und nicht Hex
- Warum GitHub Pages statt Firebase Hosting

## Abschluss

- Alle neuen Dateien im README verlinken
- Committe die Doku separat vom Code: `docs: add project documentation`
