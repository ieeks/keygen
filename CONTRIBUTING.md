# Mitarbeiten

Ein-Personen-Projekt, aber die Konventionen sollen festgehalten sein.

## Kein Build-Step

Alles liegt inline in `index.html` — HTML, CSS, JavaScript. Kein npm, kein
Bundler, keine Dependencies zur Laufzeit.

Das ist kein Purismus, sondern folgt aus dem Zweck: Wer einem Schlüsselgenerator
vertrauen soll, muss ihn prüfen können. Eine einzelne Datei liest man in ein paar
Minuten durch. Ein Bundle aus 300 npm-Paketen nicht — und jedes davon wäre eine
Stelle, an der jemand den Zufall oder die Ausgabe manipulieren könnte, ohne dass
es im Diff auffiele. Die Begründung steht ausführlich in
[`docs/DECISIONS.md`](docs/DECISIONS.md).

Praktisch heißt das: keine externen Ressourcen, keine CDNs, keine Fonts von
Google, keine Analytics. Das Tool muss offline funktionieren.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/):
`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`

## Branches

`feat/…` für Features, `fix/…` für Fehlerbehebungen.

## Vor dem Push

```bash
node scripts/smoke-test.mjs
```

Der Test läuft auch in CI, bei jedem Push und jedem Pull Request, und der Deploy
hängt per `needs: test` daran. Lokal gelaufen spart trotzdem eine Runde.

Dazu von Hand, weil der Test das nicht abdeckt:

- Beide Farbschemata ansehen (`prefers-color-scheme` im Browser umstellen)
- Copy-Button klicken — Rückmeldung muss erscheinen und nach 2 Sekunden verschwinden
- Byte-Grenzen 1 und 256 eingeben
- Bei UI-Änderungen: schmales Fenster (~360px) prüfen

Wer den Test um DOM-Elemente erweitert, muss den Stub in
`scripts/smoke-test.mjs` mitziehen — sonst wirft das Script beim Laden. Das ist
Absicht: eine halb umgesetzte Änderung soll laut werden.

## CHANGELOG

[`CHANGELOG.md`](CHANGELOG.md) bei jedem funktionalen Change mitpflegen, nach
[Keep a Changelog](https://keepachangelog.com/de/1.1.0/) und
[SemVer](https://semver.org/lang/de/).

## Architekturentscheidungen

Gehören als ADR nach [`docs/DECISIONS.md`](docs/DECISIONS.md), nicht ins README.
