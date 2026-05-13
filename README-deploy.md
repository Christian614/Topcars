Deploying to Vercel (quick)

1) Install Vercel CLI (if you don't have Node/npm install it first):

```powershell
npm i -g vercel
vercel login
```

2) From the project root (`c:\Users\LAPTOP\Desktop\cars`) run:

```powershell
vercel --prod
```

This will guide you through creating or linking a Vercel project and publish the site. By default it will serve static files from the root.

Important: Add your Firebase config to `index.html` before deploying (see `README.md`).

Optional: If you want to set environment variables in Vercel for config (not required for the current inline config), you can run:

```powershell
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
```

But the current scaffolding expects a `firebaseConfig` object inserted directly into `index.html`.
