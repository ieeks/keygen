# Rollout — Schritt für Schritt

## 1. Repo anlegen und pushen

```bash
cd keygen
git init
git add .
git commit -m "feat: initial keygen tool"
gh repo create ieeks/keygen --public --source=. --push
```

## 2. GitHub Pages aktivieren

```bash
gh api -X POST repos/ieeks/keygen/pages -f build_type=workflow
```

Alternativ im Web: Settings → Pages → Source = **GitHub Actions**.
Danach live auf `https://ieeks.github.io/keygen/`.

## 3. Claude Code laufen lassen

In dieser Reihenfolge:

```bash
claude < prompts/01-features.md   # Format-Toggle, Presets, Dark Mode, History
claude < prompts/02-docs.md       # README, CHANGELOG, CONTRIBUTING, SECURITY, LICENSE, ADRs
```

`02` liest den fertigen Code aus `01`, deshalb nicht vertauschen.

## 4. In manuel.tools eintragen

Neue Kachel in der Toolbox, Kategorie `dev`:

```js
{
  title: "Key Generator",
  subtitle: "Dev · Crypto",
  description: "Kryptografisch sichere Zufallsschlüssel. Base64, base64url, hex. Läuft offline im Browser.",
  url: "https://ieeks.github.io/keygen/",
  category: "dev",
  status: "live"
}
```

Icon-Vorschlag: Schlüssel oder Würfel, passend zum bestehenden Line-Icon-Set.

## Hinweis zum Pages-Artifact

`.github/workflows/deploy.yml` lädt das Repo-Root hoch, also landen
`CLAUDE.md` und `prompts/` mit auf der Live-Seite. Wenn du das nicht
willst, entweder `path:` auf einen Unterordner umstellen oder die
Dateien nur lokal halten.
