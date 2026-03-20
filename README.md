# 🩺 Heal I/O

> *Input your health. Output your insights.*

A full-stack personal health tracker built for individuals living with chronic illnesses (PCOS, diabetes, fibromyalgia, lupus, and more). Heal I/O transforms daily health logs into visual insights and doctor-ready PDF reports.

---

## 👥 Authors

| Name | GitHub | Feature Area |
|------|--------|-------------|
| Shriya Yarrapureddy Sarath | [@shriyays](https://github.com/shriyays) | Health Logging, Analytics, Reports |
| Deeksha Manjunatha Bankapur | [@deeksha26052003](https://github.com/deeksha26052003) | Medications, Doctor Visits |

---

## 📚 Class Link

**CS5610 — Web Development**
Northeastern University, Khoury College of Computer Sciences
[Course Link](https://johnguerra.co/classes/webDevelopment_fall_2024/)

---

## 🎯 Project Objective

Heal I/O gives chronic illness patients a single place to:
- Log daily symptoms, mood, energy, sleep, pain, meals, and cycle data
- Visualize trends and correlations (e.g. sleep vs. pain)
- Track medications and daily adherence
- Record doctor visits and prescriptions
- Generate doctor-ready health reports for any date range

Most patients only see their doctor for 15 minutes. Heal I/O captures everything in between.

---

## 📸 Screenshot

![Heal I/O Dashboard](docs/screenshot.png)

---

## 🚀 Features

### 📋 Health Logging & Insights *(Shriya)*
- Daily check-ins: symptoms, mood, energy, sleep, meals, cycle data
- Calendar activity dots (28-day view)
- Weekly bar charts (mood, energy, pain)
- Correlation analysis (sleep vs. pain buckets)
- Generate & export doctor-ready health reports (browser print → PDF)

### 💊 Medications & Doctor Visits *(Deeksha)*
- Add medications with dosage, frequency, reminder time
- Daily check-off with weekly adherence bar chart
- Mark medications as inactive (preserves history)
- Log doctor visits with notes, prescriptions, follow-up dates
- View upcoming follow-up appointments

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Database | MongoDB Atlas (native driver) |
| Auth | Passport.js (local strategy) + express-session |
| Real-time | Socket.io (medication reminders) |
| Linting | ESLint + Prettier |

> ⚠️ Does **not** use: Axios, Mongoose, CORS package (manual headers only)

---

## 🗂️ MongoDB Collections

| Collection | Owner | CRUD |
|-----------|-------|------|
| `users` | Shared | Create, Read |
| `daily_logs` | Shriya | Full CRUD |
| `medications` | Deeksha | Full CRUD |
| `adherence_logs` | Deeksha | Create, Read, Update |
| `doctorvisits` | Deeksha | Full CRUD |

---

## 📁 Project Structure

```
heal-io/
├── client/                          # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Bar.jsx              # Reusable animated bar
│   │   │   ├── Bar.css (via index)
│   │   │   ├── Logo.jsx             # Brand logo component
│   │   │   ├── Logo.css
│   │   │   ├── Navbar.jsx           # Sidebar navigation
│   │   │   ├── Navbar.css
│   │   │   ├── SliderField.jsx      # Labeled range slider
│   │   │   ├── SliderField.css
│   │   │   ├── WaveBackground.jsx   # Animated canvas waves
│   │   │   └── WaveBackground.css
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Auth state + fetch helpers
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx + .css
│   │   │   ├── DailyLog.jsx + .css
│   │   │   ├── Analytics.jsx + .css
│   │   │   ├── Medications.jsx + .css
│   │   │   ├── DoctorVisits.jsx + .css
│   │   │   ├── HealthReport.jsx + .css
│   │   │   ├── Login.jsx + .css
│   │   │   └── Register.jsx + .css
│   │   ├── App.jsx                  # Router + layout
│   │   ├── main.jsx
│   │   └── index.css                # Global shared styles
│   ├── index.html
│   ├── vite.config.js
│   ├── .eslintrc.cjs
│   └── package.json
├── server/                          # Express backend
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── dailylogs.controller.js
│   │   ├── medications.controller.js
│   │   └── doctorvisits.controller.js
│   ├── middleware/
│   │   ├── auth.js                  # isAuthenticated guard
│   │   └── cors.js                  # Manual CORS headers
│   ├── routes/
│   │   ├── auth.js
│   │   ├── dailylogs.js
│   │   ├── medications.js
│   │   └── doctorvisits.js
│   ├── db.js                        # MongoDB native driver
│   ├── passport.config.js           # Passport local strategy
│   ├── index.js                     # Express entry point
│   ├── seed.js                      # 1000+ synthetic records
│   ├── .env.example
│   ├── .eslintrc.cjs
│   └── package.json
├── .gitignore
├── .prettierrc
├── LICENSE
└── README.md
```

---

## ⚙️ Instructions to Build & Run

### Prerequisites
- Node.js 18+
- A MongoDB Atlas account (free tier works)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/heal-io.git
cd heal-io
```

### 2. Configure the server
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```
PORT=5001
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/healio
SESSION_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:5173
```

### 3. Install dependencies & seed the database
```bash
# Install server deps
cd server && npm install

# Seed 1000+ synthetic records
npm run seed

# Install client deps
cd ../client && npm install
```

### 4. Run development servers

**Terminal 1 — backend:**
```bash
cd server && npm run dev
# → Server running on port 5001
```

**Terminal 2 — frontend:**
```bash
cd client && npm run dev
# → http://localhost:5173
```

### 5. Open the app
Visit [http://localhost:5173](http://localhost:5173)

**Demo login (seeded):**
- Email: `sara@example.com`
- Password: `HealIO2024!`

---

## 🌐 Deployment

The app is deployed at: **[https://heal-io.onrender.com](https://heal-io.onrender.com)** *(update with real URL)*

---

## 🎬 Demo Video

[Watch the demo](https://youtu.be/YOUR_VIDEO_ID) *(update with real URL)*

---

## 📜 License

[MIT](LICENSE) © 2025 Shriya Yarrapureddy Sarath & Deeksha Manjunatha Bankapur
