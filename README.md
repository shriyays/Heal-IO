
# 🩺 Heal I/O
> *Your doctor sees you for 15 minutes. Heal I/O captures everything in between.*

Heal I/O is a full-stack personal health tracker that transforms daily health logs into visual insights and doctor-ready reports — built for individuals living with chronic illnesses such as PCOS, diabetes, fibromyalgia, lupus, and more.

---

## 👥 Team

| Name | GitHub |
|------|--------|
| Deeksha Manjunatha Bankapur | [@deeksha26052003](https://github.com/deeksha26052003) |
| Shriya Yarrapureddy Sarath | [@shriyays](https://github.com/shriyays) |

---

## 🚀 Features

### 📋 Health Logging & Insights *(Shriya)*
- Daily check-ins: symptoms, mood, energy, sleep, meals, cycle data
- Calendar heatmap colored by pain severity
- Correlation charts (sleep vs. pain/fatigue)
- Trend lines across 7 / 30 / 90-day windows
- Generate & export doctor-ready PDF health reports for any date range

### 💊 Medications & Medical History *(Deeksha)*
- Add medications with dosage, frequency, and reminder time
- Real-time in-app medication reminders
- Daily medication check-off + weekly adherence tracking
- Mark medications as inactive without losing history
- Log doctor visits with notes and prescriptions
- Dashboard view of upcoming follow-up appointments

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js |
| Backend | Node.js + Express |
| Database | MongoDB (5 collections) |
| Auth | JWT |
| PDF Export | (TBD — e.g. jsPDF / Puppeteer) |
| Notifications | (TBD — e.g. Web Push API) |

---

## 🗂️ MongoDB Collections

1. `users` — auth & profile
2. `daily_logs` — symptoms, mood, energy, sleep, diet, cycle
3. `medications` — name, dosage, frequency, reminder, active status
4. `adherence_logs` — daily medication taken records
5. `visits` — doctor visits, notes, prescriptions, follow-up dates

---

## 👤 User Personas

**Sara, 26 — Software Developer**
Diagnosed with PCOS. Tracks inconsistently and walks into appointments unable to recall her symptoms. Needs fast daily logging + automatic pattern detection.

**James, 34 — High School Teacher**
Managing Type 2 diabetes. Struggles with medication adherence during busy weeks. Needs reminders and clear sleep/diet → energy correlations.

---

## 📁 Project Structure
```
heal-io/
├── client/          # React frontend
├── server/          # Express backend
│   ├── routes/
│   ├── models/
│   └── controllers/
├── .env.example
└── README.md
```

---

## ⚙️ Getting Started

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/heal-io.git
cd heal-io

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install

# Add your environment variables
cp .env.example .env

# Run dev servers
npm run dev
```

---

## 📌 Course
CS5610 — Web Development | Northeastern University, Khoury College of Computer Sciences
