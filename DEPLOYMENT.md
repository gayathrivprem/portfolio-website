# 🚀 How to Deploy Your Portfolio to Vercel

Your portfolio project in [`C:\Users\ELCOT\.gemini\antigravity-ide\scratch\portfolio-website`](file:///C:/Users/ELCOT/.gemini/antigravity-ide/scratch/portfolio-website) is now **100% Vercel-Ready** with `vercel.json` and `package.json` pre-configured!

---

## ⚡ Method 1: Deploying via Vercel CLI (1-Command Deployment)

1. Open your terminal in the portfolio folder:
   ```bash
   cd C:\Users\ELCOT\.gemini\antigravity-ide\scratch\portfolio-website
   ```

2. Run the Vercel deploy command:
   ```bash
   npx vercel
   ```

3. Follow the quick prompts in your terminal:
   - **Set up and deploy?** Type `y` and press Enter.
   - **Which scope?** Press Enter for default.
   - **Link to existing project?** Type `n`.
   - **What's your project's name?** Press Enter (uses `cia-portfolio`).
   - **In which directory is your code located?** Press Enter (`./`).

4. To deploy to **Production** with your live custom domain URL, run:
   ```bash
   npx vercel --prod
   ```

---

## 🐙 Method 2: Deploying via GitHub & Vercel Dashboard (Continuous Deployment)

1. **Push your portfolio folder to a GitHub repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Vercel deployment"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Sign in with your GitHub account.
   - Select your repository and click **Deploy**.
   - Vercel will automatically detect `vercel.json` and build your live portfolio URL (e.g. `https://cia-portfolio.vercel.app`)!

---

## 📁 Pre-configured Vercel Files Included

- [`vercel.json`](file:///C:/Users/ELCOT/.gemini/antigravity-ide\scratch\portfolio-website\vercel.json) — Routes & clean URLs configuration
- [`package.json`](file:///C:/Users/ELCOT/.gemini/antigravity-ide\scratch\portfolio-website\package.json) — Project manifest & deploy scripts
- [`index.html`](file:///C:/Users/ELCOT/.gemini/antigravity-ide\scratch\portfolio-website\index.html) — Portfolio HTML structure & CIA.dev logo
- [`style.css`](file:///C:/Users/ELCOT/.gemini/antigravity-ide\scratch\portfolio-website\style.css) — Styling & animations
- [`script.js`](file:///C:/Users/ELCOT/.gemini/antigravity-ide\scratch\portfolio-website\script.js) — Live customization engine
