# 🌸 Mama Lita's Free Finance Dashboard

The free public version of the Mama Lita's Family Finance Dashboard.
Includes budget tracking, savings goals, debt payoff planner, and an upgrade prompt to the paid private version.

---

## 🚀 Deploy to Vercel

1. Go to **github.com** → create repository `mamalitas-free-dashboard`
2. Upload all files inside this folder (not the folder itself)
3. Go to **vercel.com** → Add New Project → select `mamalitas-free-dashboard` → Deploy
4. Live in ~2 minutes!

---

## ⚙️ Before You Deploy — Update Your Links

Open `src/App.jsx` and find these 3 lines near the top:

```js
const PAID_DASHBOARD_URL = "https://mamalitas-client-dashboard.vercel.app";
const PURCHASE_URL = "https://gumroad.com/your-product-link";
const COACH_EMAIL = "hello@mamalitas.com";
```

Replace with:
- `PAID_DASHBOARD_URL` → your paid client dashboard Vercel URL
- `PURCHASE_URL` → your Gumroad, Stripe, or payment page link
- `COACH_EMAIL` → your real email address

---

## 💰 Monetization Built In

The free dashboard includes:
- A dismissable **upgrade banner** on the Budget tab
- A **👑 Upgrade** button in the header on every tab
- A full **Upgrade tab** with Free vs Premium comparison table and $27 CTA
- A **testimonial** placeholder (swap in a real one when you get it!)

---

## 📁 Project Files

```
mamalitas-free/
├── public/index.html     ← Browser shell
├── src/
│   ├── index.js          ← Entry point
│   └── App.jsx           ← Full free dashboard + upgrade flow
├── package.json
├── vercel.json
└── README.md
```

---

## 🔗 Your Complete Mama Lita's Tool Suite

| Tool | URL | Purpose |
|------|-----|---------|
| 💰 Free Dashboard | `mamalitas-free-dashboard.vercel.app` | Public — drives upgrades |
| 👜 Client Dashboard | `mamalitas-client-dashboard.vercel.app` | Paid — private per client |
| ✨ Content Hub | `mamalitas-content-hub.vercel.app` | Your content creation tool |

---

Built with love for every mama building something beautiful. 🤍
*Simply Mama Lita's — Faith · Family · Finance*
