# NyayAI — Deploy to Live in 15 Minutes (100% Free)

## What you have
A complete Next.js app powered by Google Gemini (free forever tier).
No credit card. No paid APIs. Zero upfront cost.

---

## Step 1 — Get your FREE Gemini API Key (2 min)

1. Go to https://aistudio.google.com
2. Sign in with your **Google account** (Gmail is fine)
3. Click **"Get API Key"** → **"Create API key"**
4. Copy the key — looks like: `AIzaSyXXXXXXXXXXXXXXXXX`

That's it. Free. No billing. No card.

---

## Step 2 — Set up locally (3 min)

```bash
cd nyayai
npm install
cp .env.example .env.local
```

Open `.env.local` and paste your key:
```
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXX
```

Run it:
```bash
npm run dev
```
Open http://localhost:3000 — full app running locally. Try generating a letter!

---

## Step 3 — Push to GitHub (3 min)

```bash
git init
git add .
git commit -m "NyayAI launch"
```

Go to github.com → New Repository → name it `nyayai` → copy the commands it shows you:
```bash
git remote add origin https://github.com/YOUR_USERNAME/nyayai.git
git push -u origin main
```

---

## Step 4 — Deploy on Vercel (5 min)

1. Go to https://vercel.com — sign up free with GitHub
2. Click **"Add New Project"** → import your `nyayai` repo
3. Under **Environment Variables** add:
   - Name:  `GEMINI_API_KEY`
   - Value: your key from Step 1
4. Click **Deploy**

~2 minutes later you have a live URL: `https://nyayai.vercel.app`

---

## Step 5 — Custom Domain (optional)

Buy `nyayai.in` on GoDaddy (~₹800/year)
Vercel → Settings → Domains → add it. Done in 5 min.

---

## Costs

| Thing          | Cost         |
|----------------|--------------|
| Gemini API     | ₹0 (free tier: 15 requests/min, 1M tokens/day) |
| Vercel hosting | ₹0 (free hobby tier) |
| Domain         | ~₹800/year (optional) |

**Revenue at ₹149/letter with 500 users/month = ₹74,500/month**
Running cost = ₹0 until massive scale.

---

## Adding Payments Later

Sign up at razorpay.com → get Key ID + Secret → add to .env.local.
I can write the full payment integration code when you're ready.

---

## File Structure

```
nyayai/
├── pages/
│   ├── _app.js           # App wrapper
│   ├── index.js          # Full UI (hero → form → result)
│   └── api/
│       └── generate.js   # Backend: calls Gemini API (free)
├── styles/
│   └── globals.css
├── .env.example          # Template — copy to .env.local
├── .gitignore
├── next.config.js
└── package.json
```
