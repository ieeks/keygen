Du arbeitest im Repo `keygen` — ein Single-File Web-Tool zur Erzeugung
kryptografisch sicherer Zufallsschlüssel. Lies zuerst `CLAUDE.md` für
Constraints und Design-Sprache.

## Aufgabe

Erweitere `index.html` um folgende Features. Halte dich strikt an die
Constraints in CLAUDE.md — kein Build-Step, keine externen Requests,
alles inline.

1. **Format-Toggle**: Umschalter zwischen `base64`, `base64url` und `hex`.
   Als Button-Gruppe im manuel.tools Stil (die aktive Option bekommt
   Akzent-Hintergrund `#c1502f` mit weißer Schrift, wie die "ALLE"-Kachel
   auf der Toolbox-Seite). Bei `base64url`: `+` → `-`, `/` → `_`,
   Padding `=` entfernen.

2. **Preset-Buttons** für 16 / 32 / 64 Bytes neben dem Zahlenfeld.

3. **Entropie-Anzeige**: unter dem Output eine dezente Zeile in
   `--text-secondary`, z.B. `256 bit entropie · 32 bytes`.

4. **Dark-Mode** via `@media (prefers-color-scheme: dark)`. Dunkle
   Variante der Palette: Hintergrund ca. `#1c1a16`, Karte `#26231d`,
   Text hell, Akzent bleibt terra (ggf. etwas heller: `#d96a48`).
   Prüfe jeden Kontrast — nichts darf im Dark Mode verschwinden.

5. **Session-History**: die letzten 3 generierten Keys als kompakte
   Liste unter dem Hauptoutput, jeweils gekürzt (erste 12 Zeichen + `…`)
   mit eigenem Copy-Button. Nur In-Memory in einem JS-Array — **nicht**
   in LocalStorage, nicht persistieren.

## Anforderungen

- Der Copy-Feedback-Text ("kopiert") soll nach 2 Sekunden wieder
  verschwinden statt dauerhaft stehenzubleiben.
- Alle Buttons brauchen ein `aria-label` wo der Text allein nicht reicht.
- Das Zahlenfeld weiterhin auf 1–256 klemmen.
- Nach der Änderung: `index.html` im Browser gegenchecken
  (`python3 -m http.server 8000`) und beide Farbschemata prüfen.
- Aktualisiere `README.md` mit den neuen Features und hake die
  erledigten Backlog-Punkte in `CLAUDE.md` ab.

Committe am Ende mit einer sauberen Message.
