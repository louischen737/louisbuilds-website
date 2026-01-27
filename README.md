# Louis Builds Website

GitHub Pages website for louisbuilds.me, hosting multiple product pages.

## Directory Structure

```
louisbuilds-website/
├── index.html              # Personal homepage (to be created)
├── tappause/
│   ├── index.html          # TapPause product homepage
│   ├── privacy-policy.html # Privacy Policy
│   ├── terms-of-use.html   # Terms of Use
│   └── support.html        # Support page
└── README.md               # This file
```

## Setup Instructions

### 1. Create GitHub Repository

1. Create a new repository named `louisbuilds-website` (or your preferred name)
2. Make it public (required for free GitHub Pages)
3. Push this directory to the repository

### 2. Enable GitHub Pages

1. Go to repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main` (or `master`)
4. Folder: `/ (root)`
5. Save

### 3. Configure Custom Domain

1. In repository Settings → Pages, add custom domain: `louisbuilds.me`
2. This will create a `CNAME` file automatically

### 4. DNS Configuration (阿里云)

In your Aliyun DNS settings, add:

**Type**: CNAME  
**Name**: @ (or leave blank for root domain)  
**Value**: `your-username.github.io` (replace with your GitHub username)

**For subdomain** (if needed):
**Type**: CNAME  
**Name**: www  
**Value**: `your-username.github.io`

### 5. Wait for DNS Propagation

- DNS changes can take up to 48 hours
- GitHub Pages will automatically provision HTTPS certificate
- Check status in repository Settings → Pages

## URLs

After setup, your pages will be accessible at:

- Personal homepage: `https://louisbuilds.me`
- TapPause homepage: `https://louisbuilds.me/tappause`
- Privacy Policy: `https://louisbuilds.me/tappause/privacy-policy.html`
- Terms of Use: `https://louisbuilds.me/tappause/terms-of-use.html`
- Support: `https://louisbuilds.me/tappause/support.html`

## App Store Connect URLs

Use these URLs in App Store Connect:

- **Marketing URL**: `https://louisbuilds.me/tappause`
- **Privacy Policy URL**: `https://louisbuilds.me/tappause/privacy-policy.html`
- **Support URL**: `https://louisbuilds.me/tappause/support.html`

## Adding New Products

To add a new product:

1. Create a new directory (e.g., `product-name/`)
2. Add `index.html`, `privacy-policy.html`, `terms-of-use.html`, `support.html`
3. Follow the same structure and styling as TapPause pages

## Notes

- All pages use dark theme (#1C1C1E background)
- Minimal, quiet design consistent with TapPause app
- No JavaScript required (pure HTML + CSS)
- Fast loading, SEO-friendly

## Image Assets

**Important**: You need to add the pause symbol image:

1. Take a screenshot of the TapPause home screen (pause symbol centered on dark background)
2. Save as `pause-symbol.png` in `tappause/` directory
3. Image should be:
   - Square or near-square
   - Retina quality
   - Dark background (#1C1C1E)
   - White pause symbol centered
   - No phone frame, no shadows

## Maintenance

- Update content by editing HTML files
- Push changes to GitHub
- Pages update automatically (may take a few minutes)
