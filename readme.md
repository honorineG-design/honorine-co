# Honorine Co. Employee Feedback


- **Frontend:** HTML, CSS, JavaScript → Netlify
- **Backend:** Python, Flask → Render
- **AI Model:** distilbert-base-uncased-finetuned-sst-2-english (Hugging Face)
- **Database:** SQLite (local) / PostgreSQL (production)
- **Auth:** Flask-Login

---


```
ai-employee-analysis/
├── backend/
│   ├── app.py
│   ├── models.py
│   └── requirements.txt
├── frontend/
│   ├── index.html      
│   ├── login.html      
│   ├── reviews.html    
│   ├── admin.html      
│   ├── api.js          
│   └── style.css       
└── README.md
```

---

1. Open VS Code terminal
2. Run these commands one by one:
```
git init
git add .
git commit -m "Initial commit - Honorine Co. Employee Feedback ` 
git branch -M main
git remote add origin `https://github.com/YOUR_USERNAME/YOUR_REPO.git`
git push -u origin main
```


1. Go to https://render.com → Sign up / Log in
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Fill in these settings:
   - Name: `\honorine-co-backend`
   - Root Directory: `backend`
   - Runtime: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`
5. Under "Environment Variables", add:
   - `SECRET_KEY` = (any random long string, e.g. `mySuperSecretKey2024!`)
6. Click "Create Web Service"
7. Wait ~5 mins for first deploy. Copy your URL: `https://honorine-co-backend.onrender.com`


1. Open `frontend/api.js`
2. Replace `https://YOUR-RENDER-APP-NAME.onrender.com` with your actual Render URL
3. Save the file


1. Go to https://netlify.com → Sign up / Log in
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub → Select your repo
4. Fill in:
   - Publish directory: `frontend`
5. Click "Deploy site"
6. Your site is live! 


```
git add .
git commit -m "Update API URL to production"
git push
```
Netlify auto-deploys on every push.

---

1. Visit your Netlify URL
2. Click Register → create your first account (auto-becomes Admin!)
3. Log in → analyze some feedback
4. Visit /admin.html to see the dashboard

---

- Register / Login / Logout
- AI Sentiment Analysis (Positive / Negative)
- Confidence score with visual ring
- Star ratings per employee
- Department filtering
- Admin dashboard with stats & charts
- Delete feedback (admin only)
- Dark classy UI theme