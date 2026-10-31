# Deployment Guide — Linux Unlocked

Linux Unlocked is a 100% static, client-side web application built with React, TypeScript, Tailwind CSS, and Three.js. It requires **₹0 in hosting or server costs** and can be deployed to any modern static web host.

---

## 1. Production Build

To compile the production build:

```bash
# 1. Clean verify dependencies and typechecks
npm run typecheck
npm run lint
npm test

# 2. Compile and optimize client bundles
npm run build
```

The output is emitted to the `dist/` directory:
- `dist/index.html`: Entry point with pre-configured GitHub Pages SPA redirection scripts and metadata.
- `dist/assets/`: Rollup-chunked, hashed JavaScript, CSS, and GLSL chunks (`vendor-react`, `vendor-three`, `vendor-gsap`, `vendor-ui`, etc.).
- `dist/_redirects`: Cloudflare Pages and Netlify SPA routing fallback.
- `dist/_headers`: Security headers and cache directives.
- `dist/404.html`: GitHub Pages SPA redirection fallback.

---

## 2. Deployment Targets (₹0 Budget)

### Option A: Cloudflare Pages (Recommended)

Cloudflare Pages provides free unlimited bandwidth, worldwide edge distribution, and automatic recognition of `_redirects` and `_headers`.

#### Method 1: Git Integration (Zero CLI)
1. Push your repository to GitHub / GitLab.
2. In the [Cloudflare Dashboard](https://dash.cloudflare.com/), navigate to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select your repository.
4. Configure Build settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node.js Version**: `20.x` or `22.x` (Add environment variable `NODE_VERSION=22` if needed)
5. Click **Save and Deploy**.

#### Method 2: Direct CLI Deployment (Wrangler)
```bash
# Build the project
npm run build

# Deploy directly via Wrangler
npx wrangler pages deploy dist --project-name linux-unlocked
```

---

### Option B: GitHub Pages

GitHub Pages is free for public repositories. Because GitHub Pages does not support native `_redirects`, Linux Unlocked includes a dual-redirect mechanism:
- `public/404.html` captures requests for non-root paths (e.g. `/terminal` or `/atlas`) and redirects them to `/?p=<path>`.
- `index.html` decodes the query parameter and restores the URL before React Router initializes.

#### Setup:
1. In your GitHub repository, go to **Settings** > **Pages**.
2. Under **Build and deployment**:
   - **Source**: Select **GitHub Actions**.
3. Create `.github/workflows/deploy.yml` in your project with the following workflow:

```yaml
name: Deploy Linux Unlocked to GitHub Pages

on:
  push:
    branches: [master, main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  build-and-deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run verification checks
        run: |
          npm run typecheck
          npm run lint
          npm test

      - name: Build production bundle
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

### Option C: Vercel or Netlify

#### Vercel
```bash
npx vercel --prod
```
- Framework Preset: `Vite`
- Root Directory: `./`
- Build Command: `npm run build`
- Output Directory: `dist`

#### Netlify
```bash
npx netlify deploy --prod --dir=dist
```
- The included `public/_redirects` file (`/* /index.html 200`) ensures client-side routing works immediately without additional configuration.

---

## 3. Post-Deployment Verification Checklist

Once deployed to your production URL, complete the following sanity checks:

1. **Root Route (`/`)**:
   - Hero section renders smoothly.
   - Native Three.js 3D canvas loads and reacts to mouse/touch drag.
   - FPS counter stabilizes at 60 FPS (or display refresh rate).
2. **Deep Linking (SPA Routing)**:
   - Direct refresh on `https://<domain>/terminal` loads the terminal without a 404 error.
   - Direct refresh on `https://<domain>/distros` and `https://<domain>/atlas` works seamlessly.
3. **Interactive Simulations**:
   - Navigate to `/terminal`, execute `ls -la`, `cat /etc/os-release`, and pipes `cat /var/log/syslog | grep error`.
   - Open `/desktop`, launch the File Manager and Terminal windows, and drag them around.
4. **Security Headers Check**:
   ```bash
   curl -I https://<your-domain>/
   ```
   Verify `X-Content-Type-Options: nosniff` and `X-Frame-Options: DENY` are present.
5. **Mobile Responsiveness**:
   - Inspect on a mobile device or responsive devtools mode (375px width).
   - Verify hamburger navigation drawer works and desktop windows scale properly.

---

## 4. Rollback Procedure

Because Linux Unlocked is 100% static:
- **Cloudflare Pages / Vercel / Netlify**: Open the deployment dashboard, find the previously successful deployment, and click **Rollback to this deployment**. Rollback takes under 5 seconds.
- **GitHub Pages**: Revert the commit in Git (`git revert HEAD && git push`) or re-run the previous GitHub Actions workflow run.
