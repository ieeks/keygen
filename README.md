# keygen

Zufälliger kryptografisch sicherer Schlüssel-Generator — das Web-Äquivalent zu `openssl rand -base64 32`.

Teil der [manuel.tools](https://manuel.tools) Toolbox. Kategorie: `dev`.

## Was es macht

- Erzeugt Zufallsbytes über `crypto.getRandomValues()` (Web Crypto API)
- Kodiert als Base64 oder Hex
- Byte-Länge einstellbar (1–256, Default 32)
- Copy-to-Clipboard
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
