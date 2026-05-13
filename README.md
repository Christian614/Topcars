cd 'C:\Users\LAPTOP\Desktop\cars'

git init
git add .
git commit -m "Initial site commit"

git remote add origin https://github.com/Christian614/Topcars.git
git branch -M main
git push -u origin main# Top Cars - Firebase Auth Setup

This project uses Firebase Authentication for real user sign-up and sign-in.

Steps to enable Firebase Auth:

1. Create a Firebase project:
   - Go to https://console.firebase.google.com/ and create a new project.

2. Add a web app to your project:
   - In the Firebase console, select your project → click the gear (Project settings) → "Add app" → choose Web.
   - Register the app and copy the Firebase config object (it looks like a JS object with apiKey, authDomain, projectId, etc.).

3. Enable Authentication providers:
   - In the Firebase console go to "Authentication" → "Sign-in method".
   - Enable "Email/Password".
   - (Optional) Enable "Google" provider and add your app's OAuth settings if required.

4. Paste config into `index.html`:
   - Open `index.html` and find the Firebase initializer near the bottom. Replace the `firebaseConfig` placeholder by adding this above the initializer script:

```html
<script>
  const firebaseConfig = {
    apiKey: "...",
    authDomain: "...",
    projectId: "...",
    storageBucket: "...",
    messagingSenderId: "...",
    appId: "..."
  };
</script>
```

5. Deploy the site (GitHub Pages, Netlify, Vercel, etc.).

Notes:
- Firebase client SDK handles secure session management. Users will stay signed in across page loads on the same site origin unless they sign out.
- For production, consider setting up Firebase Hosting or adding proper OAuth redirect domains in the Firebase console.

If you want, I can:
- Add Google sign-in button visuals and style it to match the modal.
- Deploy the site to Firebase Hosting for you (I can prepare the steps and commands).
