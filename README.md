# 🧭 Trakr – Smart Job Application Tracker (Chrome Extension)

Tired of losing track of where you applied?  
**Trakr** automatically extracts company names and roles from job boards like LinkedIn and Jobright, then saves them locally — no manual input required.

---

## ✨ Features

- 📌 One-click “Track” button to save any job
- 🧠 Auto-detects **Company**, **Role**, **Date**, and **Status**
- 🔍 Search & filter by company name
- 🗑️ Delete individual jobs or clear all
- 📤 Export jobs as formatted CSV
- 🧱 Works with **LinkedIn, Jobright, Indeed, Wellfound, Lever, Greenhouse**

---

## 🧰 Tech Stack

- HTML, CSS, JavaScript
- Chrome Extension API (Manifest V3)
- `chrome.storage.sync` for persistent local data
- DOM parsing & content-script messaging

---

## 🚀 How to Install Locally

1. Clone the repo
   ```bash
   git clone https://github.com/<yourusername>/Trakr.git
   ```
2. Go to chrome://extensions/
3. Enable Developer Mode
4. Click Load unpacked → select the Trakr/ folder
5. Open a job page → click the Trakr icon → Track this job
