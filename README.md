# keygen

Zufälliger kryptografisch sicherer Schlüssel-Generator — das Web-Äquivalent zu `openssl rand -base64 32`.

Teil der [manuel.tools](https://manuel.tools) Toolbox. Kategorie: `dev`.

## Was es macht

- Erzeugt Zufallsbytes über `crypto.getRandomValues()` (Web Crypto API)
- Ausgabe als Base64, base64url (`-`/`_`, ohne Padding) oder Hex — Umschalten kodiert
  denselben Schlüssel neu, es wird kein neuer erzeugt
- Byte-Länge einstellbar (1–256, Default 32), Presets für 16 / 32 / 64
- Entropie-Anzeige in Bit, Warnung unterhalb von 16 Bytes
- Die letzten 3 Schlüssel der Sitzung, gekürzt und mit eigenem Copy-Button —
  nur im Arbeitsspeicher, nicht persistiert
- Copy-to-Clipboard, Rückmeldung blendet nach 2 Sekunden aus
- Dark Mode über `prefers-color-scheme`
- Läuft komplett clientseitig, keine Netzwerkaufrufe, kein Build-Step

## Lokal starten

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Deployment

GitHub Pages via Actions (`.github/workflows/deploy.yml`), Push auf `main` deployt automatisch.

Live: `https://ieeks.github.io/keygen/`

## Sicherheitshinweis

`crypto.getRandomValues()` ist der CSPRNG des Browsers und für Schlüsselmaterial geeignet.
Der Schlüssel verlässt niemals den Browser — kein Logging, kein Server, keine Analytics.

Sichere Zufallsquelle und ausreichende Schlüssellänge sind zwei verschiedene Dinge: Die
Quelle ist immer sicher, die nötige Länge hängt vom Einsatzzweck ab. 32 Bytes (256 bit)
sind der sinnvolle Standard für allgemeine Secrets; unterhalb von 16 Bytes warnt das Tool.
Die History liegt ausschließlich im Arbeitsspeicher und ist nach einem Reload weg.
