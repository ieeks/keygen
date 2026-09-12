# Sicherheit

## Threat Model in drei Sätzen

Das Tool erzeugt Zufallswerte mit dem CSPRNG des Browsers und zeigt sie an —
mehr tut es nicht. Es schützt den erzeugten Wert davor, den Browser zu verlassen:
kein Server, keine Netzwerkanfrage, keine Speicherung. Es schützt dich **nicht**
vor einem kompromittierten Browser, einem kompromittierten Betriebssystem oder
davor, dass du den Schlüssel danach an der falschen Stelle ablegst.

## Was das Tool nicht tut

- **Keine Netzwerkaufrufe.** Kein `fetch`, kein `XMLHttpRequest`, kein
  WebSocket. Nach dem Laden der Seite geht nichts mehr raus.
- **Keine externen Ressourcen.** Keine CDNs, keine Webfonts, keine Bilder von
  fremden Hosts. Die Seite ist eine einzelne HTML-Datei und läuft offline. Damit
  ist sie auch CSP-freundlich: eine strikte Policy ohne `unsafe-*` für externe
  Quellen bricht nichts.
- **Kein Storage.** Kein LocalStorage, kein SessionStorage, keine IndexedDB,
  keine Cookies. Die Schlüssel-History der Sitzung liegt in einem JS-Array im
  Arbeitsspeicher und ist nach einem Reload weg.
- **Kein Logging, keine Analytics, keine Telemetrie.**

Der Smoke-Test in `scripts/smoke-test.mjs` prüft diese Punkte bei jedem Push und
Pull Request und blockiert den Deploy, wenn einer davon verletzt wird.

## Warum `crypto.getRandomValues()` und nicht `Math.random()`

`Math.random()` ist ein normaler Pseudozufallsgenerator. Er ist auf Geschwindigkeit
optimiert, nicht auf Unvorhersagbarkeit, sein Zustand ist vergleichsweise klein,
und aus genügend beobachteten Ausgaben lässt sich der weitere Verlauf berechnen.
Für Schlüsselmaterial ist er damit unbrauchbar.

`crypto.getRandomValues()` ist der kryptografisch sichere Zufallsgenerator des
Browsers und wird vom Betriebssystem gespeist. Er ist für genau diesen Zweck
gedacht.

## Sichere Quelle ist nicht dasselbe wie sicherer Schlüssel

Die Zufallsquelle ist immer sicher. Ob der erzeugte Wert als Schlüssel taugt,
hängt an seiner Länge — und die bestimmst du. 1 Byte hat 8 bit Entropie und ist
in Sekunden durchprobiert. 32 Bytes (256 bit) sind der sinnvolle Standard für
allgemeine Secrets und die Voreinstellung. Unterhalb von 16 Bytes zeigt das Tool
eine Warnung.

## Restrisiken

Diese Punkte kann das Tool grundsätzlich nicht abdecken:

- **Kompromittierter Browser oder kompromittiertes System.** Eine bösartige
  Erweiterung, ein Keylogger oder Schadsoftware sehen den Schlüssel genauso wie du.
- **Zwischenablage.** Nach dem Kopieren liegt der Schlüssel im Clipboard, auf das
  andere Programme zugreifen können — je nach System auch über die Zwischenablage-
  Historie oder eine Synchronisierung auf andere Geräte.
- **Blicke über die Schulter, Screenshots, Screensharing.** Der Schlüssel steht
  im Klartext auf dem Bildschirm, die History der letzten drei ebenso.
- **Auslieferungsweg.** Du lädst die Seite über HTTPS von GitHub Pages
  (`manuel.tools`, erzwungenes HTTPS). Wer den
  Auslieferungsweg oder das Repository kontrolliert, könnte eine veränderte
  Version ausspielen. Wenn du das ausschließen willst: Datei herunterladen,
  durchlesen, lokal öffnen.

## Für Produktionsschlüssel im Zweifel lokal

Wenn es auf jedes Detail ankommt, nimm das Original im Terminal:

```bash
openssl rand -base64 32
openssl rand -hex 32
```

Das spart Browser und Zwischenablage als zusätzliche Angriffsfläche.

## Etwas gefunden?

Bitte über die [GitHub Issues](https://github.com/ieeks/keygen/issues) melden.
