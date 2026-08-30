# Development workflow

- `local` is the integration branch for local development and testing.
- `main` is the production branch. Cloudflare should deploy only this branch.
- Run `npm run start:local` for the local frontend. It uses
  `http://localhost:8080/api`.
- `npm run build` creates the production bundle and uses
  `https://api.olivepilatesstudio.com.tr/api`.
- Merge reviewed changes from `local` into `main` to release them.
