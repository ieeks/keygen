# Architekturentscheidungen

Leichtgewichtige ADRs, ein Abschnitt pro Entscheidung. Neue Entscheidungen kommen
unten dazu, alte werden nicht umgeschrieben — höchstens als überholt markiert.

## 1. Single-File statt React/Vite

**Kontext.** Der Rest der manuel.tools-Toolbox läuft auf einem Standard-Frontend-Stack.
Für dieses Tool wäre das der naheliegende Weg gewesen: gleiche Komponenten, gleiches
Build-Setup, gleiche Gewohnheiten.

**Entscheidung.** Alles inline in einer einzigen `index.html` — HTML, CSS, JavaScript.
Kein npm, kein Bundler, keine Dependency zur Laufzeit. Bewusste Abweichung vom
sonstigen Stack.

**Konsequenz.** Ein Schlüsselgenerator ist nur so vertrauenswürdig wie das, was
tatsächlich im Browser läuft. Eine Datei kann man in ein paar Minuten komplett lesen;
bei einem Bundle aus hunderten transitiven Paketen ist das nicht praktikabel. Jede
Dependency wäre eine Stelle, an der sich der Zufall oder die Ausgabe manipulieren
ließe, ohne dass es im Diff des Projekts sichtbar würde. Diese Angriffsfläche
existiert hier nicht.

Der Preis: keine Wiederverwendung der Toolbox-Komponenten, DOM-Manipulation von Hand,
und Tests brauchen einen eigenen Weg, den Code auszuführen (siehe ADR 6). Bei einem
Tool dieser Größe ist das tragbar — bei einem großen Frontend wäre es das nicht.

## 2. Kein LocalStorage für die History

**Kontext.** Das Tool zeigt die letzten drei erzeugten Schlüssel. Naheliegend wäre,
sie über Reloads hinweg zu behalten.

**Entscheidung.** Die History lebt in einem JavaScript-Array im Arbeitsspeicher und
ist nach einem Reload weg. Kein LocalStorage, kein SessionStorage, keine IndexedDB.

**Konsequenz.** Persistierte Schlüssel wären Schlüsselmaterial, das ungefragt auf der
Festplatte landet — auslesbar durch jeden XSS auf derselben Origin, überdauernd auf
geteilten oder fremden Rechnern, und für den Nutzer unsichtbar. Der Komfortgewinn
wiegt das nicht auf: Wer den Schlüssel braucht, kopiert ihn sofort.

Der Preis ist der erwartbare: ein versehentlicher Reload verliert die History. Das
ist der gewollte Kompromiss, und die Überschrift „nur in dieser Sitzung" sagt es an.

## 3. Base64 als Default, nicht Hex

**Kontext.** Das Tool kann base64, base64url und hex. Eines davon muss beim Öffnen
aktiv sein.

**Entscheidung.** `base64`.

**Konsequenz.** Base64 ist kompakter — 32 Bytes sind 44 Zeichen statt 64 in Hex — und
es ist die Form, die in Konfigurationsdateien und Umgebungsvariablen am häufigsten
vorkommt. Dazu passt es zur erklärten Referenz des Tools, `openssl rand -base64 32`.

Der Haken ist bekannt: Base64 enthält `+` und `/`. In einer URL steht `+` für ein
Leerzeichen, ein so übertragener Schlüssel kommt verstümmelt an — und zwar nur dann,
wenn zufällig ein `+` enthalten ist, was den Fehler unangenehm sporadisch macht.
Deshalb gibt es base64url als gleichwertige Option und seit dem Formatumschalter eine
Hinweiszeile, die genau darauf zeigt. Hex bleibt für die Fälle, in denen ein Gegenüber
es verlangt oder der Wert durch Kanäle muss, die an Sonderzeichen scheitern.

## 4. GitHub Pages statt Firebase Hosting

**Kontext.** Das Tool ist eine einzelne statische Datei. Firebase Hosting wäre im
Rahmen der übrigen Infrastruktur verfügbar gewesen.

**Entscheidung.** GitHub Pages, deployt über GitHub Actions aus demselben Repository.

**Konsequenz.** Für eine statische Datei ohne Backend bringt Firebase keinen Vorteil,
kostet aber ein zweites Konto, ein zweites Deployment-Setup und Credentials, die
irgendwo liegen müssen. Pages deployt aus dem Repository, das ohnehin die Quelle ist;
es gibt kein Geheimnis zu verwalten, und wer den Code prüfen will, sieht im selben
Repository, was ausgeliefert wird.

Der Preis: Pages erlaubt keine eigenen HTTP-Header. Eine Content-Security-Policy lässt
sich damit nur über ein `<meta http-equiv>` im Dokument setzen, nicht als Header, und
Dinge wie HSTS-Feinheiten sind gar nicht steuerbar. Für ein Tool, das ohnehin keine
externen Ressourcen lädt, ist der praktische Verlust gering — aber es ist der Punkt,
an dem diese Entscheidung irgendwann zu überdenken wäre.

<!-- TODO: Eine CSP per <meta http-equiv="Content-Security-Policy"> ist bislang nicht
     gesetzt. Wäre bei einem Tool ohne externe Ressourcen billig zu haben. -->

## 5. Pages-Artefakt als Allowlist

**Kontext.** Der Deploy-Workflow lud ursprünglich mit `path: '.'` das gesamte
Repository-Root hoch. Damit lagen `CLAUDE.md`, `SETUP.md` und der Ordner `prompts/`
mit auf der Live-Site.

**Entscheidung.** Der Workflow baut ein `_site/` und kopiert nur die Dateien hinein,
die tatsächlich zur Anwendung gehören. Neue statische Assets müssen dort bewusst
ergänzt werden.

**Konsequenz.** Eine Allowlist statt einer Ausschlussliste. Bei einer Ausschlussliste
ist der Standardfall „wird veröffentlicht", und jede neue Datei muss aktiv
ausgenommen werden — vergisst man das einmal, steht sie im Netz. Hier ist der
Standardfall „wird nicht veröffentlicht". Für ein Tool, dessen Zusage die Abwesenheit
von Überraschungen ist, ist das die richtige Richtung des Fehlers.

Der Preis: Wer ein Asset ergänzt und den Workflow nicht anpasst, wundert sich über
einen 404. Der Publish-Schritt loggt deshalb den Inhalt des Artefakts.

## 6. Smoke-Test führt den echten Inline-Code aus

**Kontext.** Der Deploy veröffentlichte jeden Push auf `main` ungeprüft. Ein
Syntaxfehler oder eine Regression wäre trotz erfolgreichem Deploy-Job live gegangen.
Ein Testframework scheidet nach ADR 1 aus.

**Entscheidung.** `scripts/smoke-test.mjs` liest `index.html`, schneidet das
Inline-`<script>` heraus und führt es in `node:vm` mit einem minimalen DOM-Stub aus.
Reines Node, kein `package.json`, keine Dependency.

**Konsequenz.** Der Test prüft den tatsächlich ausgelieferten Code und keine
nachgebaute Kopie der Logik — eine Änderung an den Encodern oder an der
Byte-Eingabe schlägt wirklich durch. Er prüft außerdem die Constraints aus ADR 1
selbst: kein `Math.random`, kein Storage, keine externen Ressourcen.

Der Preis ist der DOM-Stub. Er bildet das Browserverhalten nur so weit nach, wie der
Code es braucht, und muss mitgezogen werden, wenn neue Elemente dazukommen —
andernfalls wirft das Script beim Laden. Das ist als Bremse gewollt: Eine halb
umgesetzte Änderung wird laut, statt still durchzurutschen.
