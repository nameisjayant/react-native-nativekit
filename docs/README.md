# react-native-nativekit docs

The documentation website for [`@nameisjayant/react-native-nativekit`](https://www.npmjs.com/package/@nameisjayant/react-native-nativekit), built with Next.js and exported as a static site.

This folder is **not** part of the published npm package (the library's `package.json` `files` field only ships `src`, `lib`, `android`, `ios` and the podspec) and is not a Yarn workspace, so it has its own `node_modules` and uses npm.

```sh
cd docs
npm install
npm run dev     # http://localhost:3000
npm run build   # static site in docs/out
npm start       # serve docs/out
```

Content lives in `src/lib/data.ts` (shared constants) and the pages under `src/app`. Keep the snippets in sync with the library README when the API changes.

Pushing changes under `docs/` to `main` deploys the site to GitHub Pages via `.github/workflows/docs.yml` (enable Pages with **Source: GitHub Actions** in the repo settings first).
