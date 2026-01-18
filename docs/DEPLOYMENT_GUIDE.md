# MkDocs Deployment Guide

## Quick Start (5 minutes)

### 1. Install MkDocs
```bash
pip install mkdocs mkdocs-material pymdown-extensions
```

### 2. Navigate to docs directory
```bash
cd /docs
```

### 3. Serve locally (for preview)
```bash
mkdocs serve
```

Open browser: http://127.0.0.1:8000

### 4. Build static site
```bash
mkdocs build
```

This creates `/site` directory with HTML files.

---

## Deployment Options

### Option A: GitHub Pages (Recommended)

```bash
# From /docs directory
mkdocs gh-deploy

# This automatically:
# 1. Builds the site
# 2. Pushes to gh-pages branch
# 3. GitHub serves from https://yourusername.github.io/scbe-aethermoore-demo
```

**Setup required:**
1. Go to repo Settings → Pages
2. Source: Deploy from branch
3. Branch: gh-pages / (root)
4. Save

Site will be live at: `https://issdandavis.github.io/scbe-aethermoore-demo`

---

### Option B: Netlify (Alternative)

1. Sign up at netlify.com
2. Connect GitHub repo
3. Build command: `cd docs && mkdocs build`
4. Publish directory: `docs/site`
5. Deploy

---

### Option C: Custom Server

```bash
# Build site
mkdocs build

# Copy to server
scp -r site/* user@yourserver.com:/var/www/html/docs/

# Or use rsync
rsync -avz --delete site/ user@yourserver.com:/var/www/html/docs/
```

---

## File Structure After Build

```
docs/
├── mkdocs.yml              # Config
├── index.md                # Home page
├── guides/
│   └── sacred-tongue-tokenizer.md  # Your guide (created)
├── stylesheets/
│   └── extra.css           # White/silver text styling (created)
├── site/                   # Generated (after mkdocs build)
│   ├── index.html
│   ├── guides/
│   │   └── sacred-tongue-tokenizer/
│   │       └── index.html
│   └── ...
```

---

## Customization

### Change Site Name
Edit `mkdocs.yml`:
```yaml
site_name: Your Custom Name
```

### Add New Pages
1. Create markdown file in `/docs/`
2. Add to nav in `mkdocs.yml`:
```yaml
nav:
  - New Page: path/to/file.md
```

### Change Theme Colors
Edit `mkdocs.yml`:
```yaml
theme:
  palette:
    primary: indigo  # Change to blue, teal, etc.
    accent: deep purple
```

---

## Troubleshooting

### "mkdocs: command not found"
```bash
pip install --upgrade mkdocs
# Or if using pip3:
pip3 install --upgrade mkdocs
```

### CSS not loading
Check `mkdocs.yml` has:
```yaml
extra_css:
  - stylesheets/extra.css
```

And file exists at `/docs/stylesheets/extra.css`

### GitHub Pages not updating
```bash
# Force rebuild
mkdocs gh-deploy --force
```

### Math equations not rendering
Ensure `mkdocs.yml` has:
```yaml
markdown_extensions:
  - pymdownx.arithmatex:
      generic: true

extra_javascript:
  - https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js
```

---

## Best Practices

1. **Preview before deploy:**
   ```bash
   mkdocs serve
   # Check http://localhost:8000
   # Verify white/silver text on dark background
   ```

2. **Keep builds clean:**
   ```bash
   # Add to .gitignore
   site/
   ```

3. **Version control:**
   ```bash
   git add docs/
   git commit -m "Add Sacred Tongue guide and xAI demo"
   git push
   ```

4. **Update regularly:**
   ```bash
   # After editing docs
   mkdocs gh-deploy
   ```

---

## Visual Design Verification

### Check White/Silver Text Rendering

Open local preview (http://localhost:8000) and verify:

- [ ] Headings appear **white with subtle glow**
- [ ] Body text appears **silver** (not black)
- [ ] Code blocks have **amber text** on dark background
- [ ] Links are **cyan blue** with glow on hover
- [ ] Tables have **white headers**, **silver body**
- [ ] Admonition boxes have **white titles**
- [ ] No black text on dark background (unreadable)

If text is black:
1. Check `/docs/stylesheets/extra.css` exists
2. Verify `extra_css` in `mkdocs.yml`
3. Clear browser cache (Ctrl+Shift+R)

---

## Performance

### Build Time
- Small site (<50 pages): ~5 seconds
- Large site (500+ pages): ~60 seconds

### Site Size
- Your current setup: ~2-5MB (with Sacred Tongue guide)
- With images/diagrams: ~10-20MB

### Load Time
- First load: ~1-2 seconds
- Cached: <500ms

---

## Maintenance

### Weekly
- Check for broken links: `mkdocs build --strict`
- Update content as needed

### Monthly  
- Update MkDocs: `pip install --upgrade mkdocs mkdocs-material`
- Review analytics (if enabled)

### Quarterly
- Review navigation structure
- Archive outdated content
- Update theme/styling

---

## Support Resources

- MkDocs Docs: https://www.mkdocs.org
- Material Theme: https://squidfunk.github.io/mkdocs-material
- Markdown Guide: https://www.markdownguide.org

---

**Deployment Version:** 1.0  
**Last Updated:** January 17, 2026
