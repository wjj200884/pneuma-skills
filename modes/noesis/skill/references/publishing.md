# Save & Publish

Documentation sites live in a persistent local project directory (established in Phase 1).
The directory is a complete, self-contained Vite + React app with git initialized.

## Save (保存 / save)

When the user says "保存" / "save", sync workspace content to the project directory and commit.

1. **Sync docs content** from workspace to project directory:
   ```bash
   # Copy manifest and docs from workspace to project's public/
   cp manifest.json <project-dir>/public/manifest.json
   rsync -a --delete docs/ <project-dir>/public/docs/
   ```

2. **Commit changes:**
   ```bash
   cd <project-dir>
   git add -A
   git commit -m "docs: update documentation content"
   ```

If the project directory was initialized in Phase 1, `manifest.json` and `docs/` may already be written directly into `<project-dir>/public/`. In that case, just commit — no copy needed.

## Local Preview (预览 / preview)

```bash
cd <project-dir> && bun dev
```

Opens at `http://localhost:5173`. User can review before publishing.

## Publish (发布 / publish)

When the user says "发布" / "publish", push the project directory to GitHub.

1. **Check if remote exists:**
   ```bash
   cd <project-dir>
   git remote get-url origin 2>/dev/null
   ```

2. **If no remote — create repo and push:**
   ```bash
   cd <project-dir>
   gh repo create <user>/<repo-name> --public --source=. --push
   ```
   Ask the user to confirm the repo name before creating.

3. **If remote exists — push updates:**
   ```bash
   cd <project-dir>
   git push origin main
   ```

## Deploy (部署)

After pushing to GitHub, the user can enable GitHub Pages or connect to Vercel/Netlify.
For GitHub Pages with Vite, a build step is needed:

```bash
cd <project-dir> && bun run build
```

Build output is in `dist/`. This is outside the scope of the agent — just inform the user of their options if they ask.
