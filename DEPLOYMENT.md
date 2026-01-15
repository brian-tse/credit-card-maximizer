# CardMax Deployment Guide

## Deploy to cards.briantse.com

### Step 1: Deploy to Netlify

1. Go to https://netlify.com and sign up (free)
2. From dashboard, drag & drop the `credit-card-tracker` folder
3. Netlify gives you a URL like `random-name-123.netlify.app`

### Step 2: Add Custom Domain in Netlify

1. Site settings → Domain management → Add custom domain
2. Enter: `cards.briantse.com`
3. Note the Netlify URL for Step 3

### Step 3: Configure Squarespace DNS

1. Squarespace → Settings → Domains → briantse.com → DNS Settings
2. Add new CNAME record:
   - Host: `cards`
   - Type: `CNAME`
   - Value: `your-site-name.netlify.app`

### Step 4: Enable HTTPS

1. Wait 5-30 minutes for DNS propagation
2. In Netlify, click "Provision SSL certificate"

---

## Alternative: Vercel Deployment

1. Go to https://vercel.com and sign up
2. Import your project (drag & drop or GitHub)
3. Add custom domain: `cards.briantse.com`
4. Add CNAME record in Squarespace pointing to `cname.vercel-dns.com`

---

## Updating Your Site

**If using drag & drop:** Re-upload the folder to Netlify

**If using GitHub:** Push changes to your repo, Netlify auto-deploys

---

## Troubleshooting

- **DNS not working:** Wait up to 48 hours, check CNAME spelling
- **SSL error:** Ensure DNS is verified first, then provision certificate
- **404 errors:** Make sure index.html is in the root folder
