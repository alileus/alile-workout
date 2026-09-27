# Vercel setup (later)

Repository setup does not create a Vercel project, deploy, or change DNS.

1. Import alileus/alile-workout with the GitHub integration. Select Next.js and repository root, Node 24.x, install command npm ci and build command npm run build.
2. **Before the first deployment**, set Project Settings → Environments → Production → Branch Tracking to **production**. Vercel defaults to main. If import cannot set it initially, cancel the initial deployment, change the setting, then deploy the correct branch.
3. Assign workout.alile.us to Production. Assign workout.alile.dev specifically to the **main** Git branch in Preview. PR branches keep separate Vercel URLs.
4. Add only the DNS records Vercel displays for these hostnames and verify HTTPS.
5. Vercel injects VERCEL_ENV. Do not override it. No application secrets are needed.
6. Push main to update testing. Promote through a main → production PR; merging triggers the live deployment.

## Verification

Production robots permits crawling, sitemap lists localized pages and canonical URLs point to https://workout.alile.us.

Other builds return a blocking robots file, empty sitemap, noindex metadata and X-Robots-Tag: noindex, nofollow. Indexing controls are not access controls; use Vercel Deployment Protection if required.

/api/og?region=chest-clavicular-head returns a 1200×630 PNG with a dynamic anatomy highlight and no locale-sensitive text.

Configure GitHub rulesets for both branches: require the quality CI check, reviewed PRs, and prevent force pushes/deletion. These account-side settings are not enacted by workflow files. Enable private vulnerability reporting under Security settings.

Vercel's Git integration handles deployments. No GitHub Actions deployment token is necessary. Roll back through Vercel, then follow with a corrective PR.

References: [Git deployments](https://vercel.com/docs/git), [environments](https://vercel.com/docs/deployments/environments), [metadata](https://nextjs.org/docs/app/getting-started/metadata-and-og-images).
