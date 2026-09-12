# Changelog

Alle nennenswerten Änderungen an diesem Projekt werden hier festgehalten.

Das Format orientiert sich an [Keep a Changelog](https://keepachangelog.com/de/1.1.0/),
die Versionierung folgt [Semantic Versioning](https://semver.org/lang/de/).

## [Unreleased]

### Hinzugefügt

- Umschalter für das Farbschema oben rechts in der Karte

### Geändert

- Das Tool startet jetzt immer hell statt der Systemeinstellung zu folgen.
  `prefers-color-scheme` wird nicht mehr ausgewertet, das Schema hängt an einem
  `data-theme`-Attribut, das der Umschalter setzt. Die Wahl wird bewusst nicht
  persistiert — eine gespeicherte Einstellung bräuchte `localStorage`, und das
  Projekt schreibt nichts in den Browser-Speicher
- `color-scheme` wird jetzt gesetzt, damit native Bedienelemente wie die
  Spinner-Pfeile des Zahlenfelds zum gewählten Schema passen
- Der Storage-Check im Smoke-Test prüft auf echten Zugriff
  (`localStorage.`, `localStorage[`) statt auf die blosse Erwähnung des Wortes.
  Vorher machte ein Kommentar, der die Abwesenheit von Storage erklärt, den
  Build rot

### Behoben

- Die Dokumentation nannte durchgehend `ieeks.github.io/keygen` als Live-Adresse.
  Kanonisch ist die Custom Domain `https://manuel.tools/keygen/`

## [1.0.0] — 2026-09-12

Erster Release. Inhalt entspricht dem aktuellen Stand von `index.html`.

### Hinzugefügt

- Schlüsselerzeugung über `crypto.getRandomValues()` (Web Crypto API)
- Formatumschalter zwischen `base64`, `base64url` und `hex`. Das Umschalten
  kodiert dieselben Bytes neu und erzeugt bewusst keinen neuen Schlüssel
- Hinweiszeile unter dem Umschalter, die mit der Auswahl wechselt und angibt,
  wofür das jeweilige Format gedacht ist
- Byte-Länge von 1 bis 256 einstellbar, Voreinstellung 32, Presets für 16 / 32 / 64
- Entropie-Anzeige in Bit unter der Ausgabe
- Warnung unterhalb von 16 Bytes, damit kurze Werte nicht unbemerkt als sicherer
  Schlüssel durchgehen
- Session-History der letzten 3 Schlüssel, auf 12 Zeichen gekürzt, mit eigenem
  Copy-Button für den vollen Wert. Nur im Arbeitsspeicher, nicht persistiert
- Copy-to-Clipboard mit Rückmeldung, die nach 2 Sekunden ausblendet
- Dark Mode über `prefers-color-scheme`
- `role="status"` mit `aria-live` für die Rückmeldung, `<output>` für das
  Ergebnis, `aria-label` auf allen Buttons, deren Text allein nicht reicht
- Deployment auf GitHub Pages über Actions
- Smoke-Test (`scripts/smoke-test.mjs`) ohne Build-Step und ohne Dependencies,
  der in CI läuft und dem der Deploy per `needs` nachgeschaltet ist
- Projektdokumentation: CHANGELOG, CONTRIBUTING, SECURITY, LICENSE, ADRs

### Geändert

- Die Byte-Eingabe liest `valueAsNumber` statt `parseInt`. `parseInt` las `1e2`
  als 1 und schnitt Dezimalstellen still ab
- Werte unterhalb des Minimums werden auf 1 geklemmt statt auf die Voreinstellung
  32 zurückgesetzt. Nur ein leeres oder unlesbares Feld fällt noch auf 32
- Im Dark Mode trägt die Akzentfläche dunkle Schrift statt weißer, und der Rahmen
  ist aufgehellt — beide Werte fielen sonst durch die Kontrastprüfung
- Das Pages-Artefakt enthält nur noch `index.html`. Zuvor wurde das gesamte
  Repository-Root veröffentlicht, inklusive Projektdokumentation und Prompts

### Behoben

- Die Copy-Rückmeldung blieb nach einem fehlgeschlagenen Versuch dauerhaft auf
  „kopieren fehlgeschlagen" stehen, auch wenn ein späterer Versuch erfolgreich
  war. Der Text wird jetzt bei jedem Versuch neu gesetzt und ein laufender Timer
  vorher abgebrochen
- Das README nannte eine Hex-Ausgabe, die es im Code nicht gab. Hex existiert
  jetzt tatsächlich

<!-- TODO: Der Tag v1.0.0 ist noch nicht angelegt. Die beiden Links unten gehen
     erst, wenn er existiert: git tag v1.0.0 && git push origin v1.0.0 -->

[Unreleased]: https://github.com/ieeks/keygen/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/ieeks/keygen/releases/tag/v1.0.0
