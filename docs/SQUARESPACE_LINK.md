# Linking luckytile.club to the Hand Calculator

This guide explains how to connect your Squarespace site ([luckytile.club](https://luckytile.club/)) to the deployed LTC Hand Calculator.

## Prerequisites

1. Deploy this app (e.g. to Vercel) and note your public URL  
   Example: `https://ltc-credits.vercel.app`
2. Have Squarespace admin access to luckytile.club

---

## Option A: Add a navigation link (recommended)

Best for a permanent “Hand Calculator” or “Score Your Hand” entry in the site menu.

1. Log in to Squarespace → **Pages**
2. Click **+** to add a new page, or use an existing page (e.g. a “Play” or “Resources” page)
3. For a **link-only** nav item:
   - Add a **Link** page (not a blank page)
   - Set the URL to your deployed calculator, e.g. `https://ltc-credits.vercel.app`
   - Title it **Hand Calculator** or **Score Your Hand**
4. Go to **Pages** → drag the new link into your main navigation
5. Save and publish

Visitors will click the nav item and land directly on the calculator.

---

## Option B: Button on the homepage

Match the existing “RSVP NOW” / “Work With Us” style with a new CTA.

1. Edit the **Home** page in Squarespace
2. Add a **Button** block near the Social or “Join the club” section
3. Button text: **Score Your Hand** or **Hand Calculator**
4. Link: your deployed URL (open in **New Window** if you want to keep luckytile.club open)
5. Style: use your primary solid button (coral/green) to match existing CTAs
6. Publish

---

## Option C: Embed in a Squarespace page (iframe)

Use this if you want the calculator to appear *inside* a luckytile.club URL (e.g. `luckytile.club/hand-calculator`).

1. Create a new **Blank** page: `/hand-calculator`
2. Add a **Code** block
3. Paste:

```html
<iframe
  src="https://YOUR-DEPLOYED-URL.vercel.app"
  title="LTC Hand Calculator"
  width="100%"
  height="900"
  style="border: none; min-height: 90vh;"
  loading="lazy"
></iframe>
```

4. Replace `YOUR-DEPLOYED-URL` with your actual domain
5. Add the page to navigation if desired
6. Publish

**Note:** Some Squarespace plans restrict iframes to trusted domains. If the embed is blank, use Option A or B instead.

---

## Option D: Custom domain subdomain

For a URL like `calc.luckytile.club`:

1. In Vercel (or your host), add domain `calc.luckytile.club`
2. In your DNS provider, add a CNAME: `calc` → `cname.vercel-dns.com` (or your host’s target)
3. Link from Squarespace using `https://calc.luckytile.club`

This keeps the calculator on-brand while hosting the app separately.

---

## Suggested copy for luckytile.club

**Nav label:** Hand Calculator  

**Short blurb (for a text block above the button):**

> Just won a hand and not sure of the score? Upload a photo or enter your tiles — we’ll break it down for your rule set. New players welcome.

**Footer link (optional):** Add “Hand Calculator” next to Instagram / playlist links.

---

## Testing the link

1. Open luckytile.club in an incognito window
2. Click your new link
3. Confirm the calculator loads, rule dropdown works, and scoring runs (with `OPENROUTER_API_KEY` set on the server)

If scoring fails with “OPENROUTER_API_KEY is not configured”, add the key in your hosting provider’s environment variables and redeploy.
