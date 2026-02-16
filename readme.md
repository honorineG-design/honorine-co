# Honorine Co. Employee Feedback

AI-powered HR tool using DistilBERT (Hugging Face) for sentiment analysis of employee feedback.

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript → Netlify
- **Backend:** Python, Flask → Railway
- **AI Model:** distilbert-base-uncased-finetuned-sst-2-english (Hugging Face)
- **Database:** SQLite (local) / PostgreSQL (production)
- **Auth:** Flask-Login


Honorine Co./
├── backend/
│   ├── app.py
│   ├── models.py
│   └── requirements.txt
├── frontend/
│   ├── index.html      
│   ├── login.html      
│   ├── analyze.html    
│   ├── reviews.html    
│   ├── admin.html      
│   ├── api.js          
│   └── style.css       
├── railway.json        
└── README.md
```

---
1. Open VS Code terminal
2. Run these commands one by one:
```
git init
git add .
git commit -m "Initial commit - Honorine Co. Employee Feedback"
git branch -M main
git remote add origin https://github.com/honorineG-design/Honorine-Co..git
git push -u origin main
```

1. Go to https://railway.app → Sign up with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your Honorine-Co. repo
4. Click "Deploy Now"
5. Go to the Variables tab and add:
   - `SECRET_KEY` = (`HonorineCo2026!`)
6. Go to Settings → Public Networking → click "Generate Domain"
7. Copy your Railway URL: `https://honorine-co-production.up.railway.app`

1. Open `frontend/api.js`
2. Replace `https://YOUR-RENDER-APP-NAME.onrender.com` with your actual Railway URL
3. Save the file

1. Go to https://netlify.com → Sign up / Log in
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub → Select your Honorine-Co. repo
4. Fill in:
   - Publish directory: `frontend`
5. Click "Deploy site"
6. Your site is live! 

```
git add .
git commit -m "Update API URL to Railway"
git push
```
Netlify auto-deploys on every push.

---
1. Visit your Netlify URL
2. Click Register → create your first account (auto-becomes Admin!)
3. Log in → submit a review
4. Visit /analyze.html to run AI sentiment analysis
5. Visit /admin.html to see the full dashboard

---

- Register / Login / Logout
- Submit employee reviews (name, department, rating, comments)
- AI Sentiment Analysis (Positive / Negative)
- Confidence score with visual ring
- Star ratings per employee
- Department filtering
- Admin dashboard with stats & charts
- Delete feedback (admin only)
