==== README.md ====

AI Caption Creator — Quick Deploy

Files

index.html — frontend UI (root)

api/generate.js — serverless function for Vercel (or any Node-compatible serverless)


Setup (Vercel)

1. Create a new Vercel project using your GitHub repo or drag & drop.


2. Add an environment variable OPENAI_API_KEY with your OpenAI API key (Project Settings > Environment Variables).


3. Deploy. The frontend will call /api/generate automatically.



Setup (Netlify)

Netlify requires a slightly different function layout (use netlify/functions/generate.js). Convert accordingly, keep same logic, and set the environment variable in Netlify settings.


Local testing

Install Vercel CLI and run vercel dev to test serverless function locally.


Monetization quick wins

Add a BuyMeACoffee button (place HTML link in footer) — instant donations.

Add a small unobtrusive ad via an ad network when traffic grows.

Offer a paid "Pro pack" on Gumroad with long caption bundles or templates.


Notes & Safety

Respect copyright and avoid producing content that infringes others' IP.

Monitor API usage to avoid excessive billing.


-- End of bundle --