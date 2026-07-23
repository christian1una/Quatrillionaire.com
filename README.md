# Quatrillionaire.com form setup

Every form submission (main contact form + "Buying or selling?" popup)
creates a new lead in Follow Up Boss automatically. No email service, no
SMS/Twilio — Follow Up Boss handles notifying Christian directly, since his
email and phone are already tied to his FUB account.

## 1. Upload the project to Vercel
Upload the entire folder, including:
- `index.html`
- `api/lead.js`
- `vercel.json`

## 2. Add the environment variable
In Vercel: **Project → Settings → Environment Variables**

Add:
```
FUB_API_KEY = your Follow Up Boss API key
```

Get this key from Follow Up Boss: **Admin → API → Create API Key**

That's the only environment variable needed.

## 3. Redeploy
After adding the environment variable, redeploy the project so it picks up
the new value.

## 4. Test
Open the website in a private/incognito window and submit the "Buying or
selling?" popup or the main contact form. Then check Follow Up Boss →
People to confirm the new lead appears.

## Important
Never put API keys directly inside `index.html` or any file that ships to
the browser — `FUB_API_KEY` should only ever live in Vercel's Environment
Variables, where `api/lead.js` reads it server-side.
