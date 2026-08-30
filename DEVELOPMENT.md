# Development workflow

- `develop` is the integration branch for development and testing.
- `main` is the production branch. Cloudflare should deploy only this branch.
- Run `npm run start:local` for the local frontend. It uses
  `http://localhost:8080/api`.
- `npm run build` creates the production bundle and uses
  `https://api.olivepilatesstudio.com.tr/api`.
- Merge reviewed changes from `develop` into `main` to release them.
