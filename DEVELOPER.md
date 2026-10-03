# Website developer guide

This repository contains the public Chalk Arcade website, marketing assets, and legal and support pages. It does not contain the mobile game, its backend, signing material or release credentials.

The site is dependency-free static HTML, CSS and JavaScript. There is no build step or environment configuration needed to preview it.

## Local preview

From the repository root:

```bash
python3 -m http.server 8788 --bind 127.0.0.1
```

Open [localhost:8788](http://localhost:8788/?stay=1). The `?stay=1` parameter prevents the homepage's automatic App Store or Google Play redirect on mobile.

This simple preview server does not apply `_headers`, `_redirects` or the Nginx configuration. Use the Docker preview to check production-style headers, redirects and health checks.

## Docker preview

```bash
docker build -t chalk-arcade-site .
docker run --rm -p 127.0.0.1:8788:8080 chalk-arcade-site
```

Open [localhost:8788](http://localhost:8788/?stay=1). The container exposes `/healthz` and serves only the public files copied explicitly in `Dockerfile`. `PORT` defaults to `8080`.

## Site structure

| Path | Purpose |
| --- | --- |
| `index.html` | Landing page and download links |
| `assets/site-config.js` | Public store URLs, publication flags and redirect delay |
| `assets/site.js` | Platform detection, store buttons and cancelable mobile redirect |
| `assets/site.css` | Shared styles |
| `assets/campaign-2026-09/` | Gameplay imagery and preview video reused by the README |
| `privacy/` | Privacy policy |
| `terms/` | Terms of use |
| `support/` | Support and FAQ |
| `delete-account/` | In-app and outside-app account deletion instructions |
| `404.html`, `robots.txt`, `sitemap.xml` | Not-found page and search indexing |

The server configurations redirect `/privacy-policy`, `/terms-of-use`, `/terms-of-service`, `/account-deletion`, `/data-deletion` and `/help` to their canonical pages.

## Updating download links

The current public destinations are:

- App Store: <https://apps.apple.com/app/id6806648338>
- Google Play: <https://play.google.com/store/apps/details?id=ch.prab.chalkarcade>

Apple's app-ID URL avoids hard-coding a country or a title slug that could change after a rename.

Keep `assets/site-config.js`, the fallback links in `index.html`, and `README.md` in sync. Set a store's `published` flag to `true` only after its public listing opens successfully. If changing the configuration, also update the script's cache-busting query in `index.html`.

The README uses official store badge images and local gameplay images. Plain-text store links remain available if a badge cannot load. No campaign screenshot is fetched from a private repository.

## Deploying the website

For the existing server, use the Docker image or copy only this public-file allowlist to the web root:

```text
index.html
404.html
robots.txt
sitemap.xml
assets/
privacy/
terms/
support/
delete-account/
```

Do not serve the repository root directly in production. Git metadata, README and developer documents, Docker files, Nginx templates, local configuration and any private files must stay outside the web root. The Dockerfile uses explicit copies to enforce this separation.

`_headers` and `_redirects` are Cloudflare Pages build inputs, not public content. Nginx uses `nginx.conf.template` instead; it does not interpret the Cloudflare files. Keep both configurations aligned when changing security headers or canonical redirects.

## Privacy policy revisions

`privacy/index.html` carries a `<meta name="chalk-privacy-revision">` marker. Whenever the policy changes, update the marker and its effective/last-updated date. After deployment, check the live page rather than assuming the upload has replaced the previous revision.

## Checks before publishing

- Confirm the store links open the correct app, and the website works with and without `?stay=1`.
- Check the README and website on a narrow screen, including images and download buttons.
- Verify support, privacy, terms, account deletion and legacy redirects.
- Keep screenshots and feature descriptions accurate for the publicly available app.
- Inspect `git status` and the exact staged diff before committing. Keep passwords, tokens, service-account files, signing keys and environment files out of this public repo. `.gitignore` helps prevent mistakes but is not a secret scanner and does not protect files already tracked.
- Do not copy the private game repository or its release guide here. If a credential is ever published, revoke or rotate it; deleting it in a later commit does not remove the exposure.

## Future game-repository submodule

This is a standalone website repository for now. No submodule has been configured as part of this documentation update.

After this repository has its first reviewed commit published, the private game repository can add it as a submodule at the agreed path. Website changes should be committed here first; the game repository can then advance its submodule pointer to that commit. Keep game source and credentials in the private repository, not inside the website submodule.
