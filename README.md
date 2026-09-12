# keygen

Kryptografisch sichere Zufallsschlüssel im Browser — ohne Server, ohne Build-Step,
ohne eine einzige Netzwerkanfrage.

[![Deploy](https://github.com/ieeks/keygen/actions/workflows/deploy.yml/badge.svg)](https://github.com/ieeks/keygen/actions/workflows/deploy.yml)
[![Lizenz: MIT](https://img.shields.io/badge/Lizenz-MIT-c1502f)](LICENSE)

**Live: [ieeks.github.io/keygen](https://ieeks.github.io/keygen/)**

![Screenshot des Tools](docs/screenshot.png)

<!-- TODO: docs/screenshot.png existiert noch nicht. Screenshot aufnehmen und
     ablegen — bis dahin bleibt das Bild oben ein toter Link. -->

Teil der [manuel.tools](https://manuel.tools) Toolbox. Kategorie: `dev`.

## Warum

`openssl rand -base64 32` ist die richtige Antwort, wenn ein Terminal offen ist.
Manchmal ist keins da: fremder Rechner, Handy, oder man steht in einem Formular,
das jetzt ein Secret will. Dann tippt man erfahrungsgemäß etwas aus dem Kopf,
und das ist schlechter als jeder Zufallsgenerator.

Dieses Tool ist dieselbe Operation als Webseite — und zwar so gebaut, dass man
ihr das zutrauen kann: eine Datei, kein Server, keine Requests, nachlesbar in ein
paar Minuten.

## Funktionsumfang

- Zufallsbytes über `crypto.getRandomValues()`, den CSPRNG des Browsers
- Byte-Länge 1–256, Voreinstellung 32, Presets für 16 / 32 / 64
- Entropie-Anzeige in Bit, Warnung unterhalb von 16 Bytes
- Drei Ausgabeformate, umschaltbar ohne neuen Schlüssel zu erzeugen
- Die letzten 3 Schlüssel der Sitzung, gekürzt, je mit eigenem Copy-Button —
  nur im Arbeitsspeicher, nach einem Reload weg
- Copy-to-Clipboard, Rückmeldung blendet nach 2 Sekunden aus
- Dark Mode über `prefers-color-scheme`
- Läuft komplett clientseitig und offline

### Welches Format wann

Alle drei kodieren dieselben Zufallsbytes. Die Wahl ändert die Schreibweise,
nicht die Stärke — 32 Bytes sind in jedem Format 256 bit.

| Format | Länge bei 32 Byte | Wofür |
| --- | --- | --- |
| `base64` | 44 Zeichen | Standard. `.env`-Dateien, Configs, Secrets in Umgebungsvariablen |
| `base64url` | 43 Zeichen | Sobald der Wert in eine URL kommt: JWTs, Links, Dateinamen |
| `hex` | 64 Zeichen | Wenn ein Tool Hex verlangt, oder der Wert durch Kanäle muss, die an Sonderzeichen scheitern |

Der Grund für `base64url`: In einer URL steht `+` für ein Leerzeichen. Ein
base64-Schlüssel mit `+` darin kommt am anderen Ende verstümmelt an — und nur
dann, wenn zufällig ein `+` enthalten ist, was den Fehler sporadisch und
entsprechend lästig macht. `base64url` nutzt `-` und `_` und lässt das Padding weg.

## Lokal starten

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

`index.html` lässt sich auch direkt im Browser öffnen — es gibt nichts zu bauen.

## Tests

```bash
node scripts/smoke-test.mjs
```

Ohne Build-Step und ohne Dependencies. Der Test liest das echte `index.html`,
schneidet das Inline-Script heraus und führt es in `node:vm` mit einem minimalen
DOM-Stub aus — geprüft wird also der ausgelieferte Code, keine Kopie davon.

Abgedeckt sind Syntax, die Constraints selbst (kein `Math.random`, kein Storage,
keine externen Ressourcen), Ausgabelängen für 1 / 32 / 256 Byte, alle drei
Zeichensätze, die Byte-Eingabe inklusive Randfälle, Entropie-Zeile, Warnschwelle,
History-Limit und die Format-Hinweise.

Läuft in CI bei jedem Push und jedem Pull Request. Der Deploy startet erst, wenn
der Test grün ist.

## Deployment

GitHub Pages über Actions (`.github/workflows/deploy.yml`). Push auf `main`
deployt automatisch, nachdem der Test durchgelaufen ist.

Das Pages-Artefakt enthält nur die Anwendung — Dokumentation und Prompts werden
nicht mit veröffentlicht. Neue statische Assets müssen im Workflow bewusst
ergänzt werden.

## Sicherheit

`crypto.getRandomValues()` ist der kryptografisch sichere Zufallsgenerator des
Browsers und für Schlüsselmaterial geeignet. Der Schlüssel verlässt den Browser
nie: keine Netzwerkanfrage, kein Server, kein Storage, kein Logging, keine
Analytics.

Sichere Zufallsquelle und ausreichende Schlüssellänge sind zwei verschiedene
Dinge. Die Quelle ist immer sicher; die nötige Länge hängt vom Einsatzzweck ab.
32 Bytes sind der sinnvolle Standard, unterhalb von 16 Bytes warnt das Tool.

Threat Model, Restrisiken und der Hinweis, wann man besser doch `openssl` im
Terminal nimmt: [`SECURITY.md`](SECURITY.md).

## Dokumentation

- [`CHANGELOG.md`](CHANGELOG.md) — Änderungen nach Keep a Changelog
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — Konventionen, Checks vor dem Push
- [`SECURITY.md`](SECURITY.md) — Threat Model und Restrisiken
- [`docs/DECISIONS.md`](docs/DECISIONS.md) — Architekturentscheidungen als ADRs
- [`LICENSE`](LICENSE) — MIT

## Lizenz

[MIT](LICENSE) — Copyright (c) 2026 Manuel
