# Quick Deployment Guide - Vercel

## Prerequisites
- A Vercel account (free): https://vercel.com/signup
- Your custom domain purchased

## Option 1: Deploy via Vercel Dashboard (Easiest)

### Step 1: Prepare Repository
1. Open terminal in project folder:
   ```bash
   cd C:\Users\user\Documents\Clients\Endri\Safe-Water
   ```

2. Initialize git (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit with SEO optimization"
   ```

3. Push to GitHub:
   ```bash
   # Create a new repository on GitHub first
   git remote add origin https://github.com/YOUR-USERNAME/filtra-uji.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Connect to Vercel
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Click "Deploy"
5. Wait for deployment (30-60 seconds)

### Step 3: Add Custom Domain
1. Go to Project Settings → Domains
2. Add your domain (e.g., filtra-uji.com)
3. Follow DNS instructions provided by Vercel
4. Wait for SSL certificate (automatic, ~24 hours)

---

## Option 2: Deploy via CLI (Faster)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login
```bash
vercel login
```

### Step 3: Deploy
```bash
cd C:\Users\user\Documents\Clients\Endri\Safe-Water
vercel --prod
```

Follow the prompts and you're done!

---

## After Deployment

### Domain Configuration ✅ COMPLETE
Your domain **filtrameqera.al** is already configured in all files:
- ✅ `index.html` - All meta tags and structured data
- ✅ `sitemap.xml` - All URLs
- ✅ `robots.txt` - Sitemap reference

**No additional URL updates needed!**

Just deploy and connect your domain in Vercel dashboard.

---

## Verify Deployment

1. **Check Site is Live**: Visit your domain
2. **Test Mobile**: Open on phone or use Chrome DevTools
3. **Check Speed**: https://pagespeed.web.dev/
4. **Verify Schema**: https://search.google.com/test/rich-results
5. **Test Social Cards**: https://developers.facebook.com/tools/debug/

---

## Common Issues & Solutions

### Issue: 404 Errors
**Solution**: Make sure `vercel.json` is in root directory

### Issue: Images Not Loading
**Solution**: Check image paths are relative (`logo.png` not `/logo.png`)

### Issue: Slow Loading
**Solution**: Images too large - compress them first

### Issue: Domain Not Working
**Solution**: Wait 24-48 hours for DNS propagation

---

## Support

- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- Community: https://github.com/vercel/vercel/discussions

---

Good luck with your deployment! 🚀
