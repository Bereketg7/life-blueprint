# Life Blueprint — Beginner Installation Guide

> This guide walks you through installing Life Blueprint on your iPhone or Android phone  
> with zero prior React Native or Expo experience required.

---

## What You Need

| Item | Required? | Where to Get It |
|------|-----------|----------------|
| A computer (macOS, Windows, or Linux) | ✅ Yes | — |
| Node.js 16 LTS or later | ✅ Yes | https://nodejs.org → click **LTS** |
| The "Expo Go" app on your phone | ✅ Yes | App Store (iPhone) or Google Play (Android) |
| Git | ✅ Yes | https://git-scm.com/downloads |
| Your phone and computer on the **same Wi-Fi** | ✅ Yes | Connect both to your home/office router |
| Xcode (macOS only) | 🔵 Optional | Mac App Store (only needed to build a native iOS binary) |
| Android Studio | 🔵 Optional | https://developer.android.com/studio (only needed for native Android build) |

---

## Step 1 — Install Node.js

1. Go to **https://nodejs.org**
2. Click the big green **LTS** button to download the installer
3. Run the installer and click **Next** through all the defaults
4. Open a new Terminal window (macOS/Linux) or Command Prompt (Windows)
5. Verify the installation:
   ```bash
   node --version
   # Should print something like: v20.11.0
   npm --version
   # Should print something like: 10.2.4
   ```

---

## Step 2 — Install Git

**macOS:** Git is usually pre-installed. Check with `git --version`. If not present, install Xcode Command Line Tools:
```bash
xcode-select --install
```

**Windows:** Download from https://git-scm.com/download/win and run the installer.

**Linux (Ubuntu/Debian):**
```bash
sudo apt update && sudo apt install git
```

---

## Step 3 — Download the App Code

```bash
# 1. Open Terminal / Command Prompt
# 2. Navigate to where you want to store the project
cd ~/Documents      # macOS / Linux
# cd C:\Users\YourName\Documents   # Windows

# 3. Download the code
git clone https://github.com/Bereketg7/life-blueprint.git

# 4. Enter the project folder
cd life-blueprint
```

---

## Step 4 — Install the App's Dependencies

```bash
npm install --legacy-peer-deps
```

This downloads all the libraries the app needs. It may take 1–3 minutes.

**Successful output looks like:**
```
added 812 packages in 43s
```

**If you see an error**, try:
```bash
npm install --force
```

---

## Step 5 — Start the Development Server

```bash
npm start
```

After a few seconds you will see a **QR code** in the terminal and output similar to:

```
Starting Metro Bundler
████████████████████
████████████████████   ← QR code (yours will be different)
████████████████████

  › Metro waiting on exp://192.168.1.5:8081
  › Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

  Press a │ open Android emulator
  Press i │ open iOS simulator
  Press w │ open web browser
  Press ? │ show all commands
```

> **Leave this terminal window open** while you use the app.

---

## Step 6 — Open the App on Your Phone

### iPhone

1. Install **Expo Go** from the App Store (search "Expo Go" by Expo Project)
2. Open your iPhone's built-in **Camera** app
3. Point it at the QR code on your computer screen
4. A banner saying **"Open in Expo Go"** appears — tap it
5. The app builds and opens on your phone (about 20–30 seconds the first time)

### Android

1. Install **Expo Go** from Google Play (search "Expo Go" by Expo Project)
2. Open the **Expo Go** app
3. Tap **"Scan QR Code"** and point it at the QR code on your screen
4. The app builds and opens (about 20–30 seconds the first time)

---

## Step 7 — Complete Onboarding

When the app opens for the first time, a welcome wizard guides you through 6 quick steps:

1. **Your Name & Email** — used to identify your profile locally
2. **Body Metrics** — age, gender, height, weight
3. **Your Goal** — choose from weight loss, muscle gain, general wellness, and more
4. **Health Conditions** — optional; helps personalise recommendations
5. **Nutrition Targets** — or tap "Auto-Calculate" to use the built-in formula
6. **Notification Preferences** — choose when you want reminders

After step 6 you land on the **Home** screen. You are ready to use all 15 features.

---

## Navigating the App

The bottom bar has 9 tabs:

| Tab | What it does |
|-----|-------------|
| 🏠 Home | Dashboard: streaks, today's quests, quick log buttons |
| 📊 Track | Log activities, sleep, meals, and mood |
| 📅 Plan | Create and manage goals and multi-week plans |
| 🧠 Mind | Awareness scores and health projections |
| 👥 Social | Friends, 30-day challenges, leaderboard |
| 🏥 Health | Doctor shares, lab results, prescriptions |
| 📈 Reports | Weekly / monthly / quarterly health summaries |
| ⚙️ Settings | Themes, accessibility, connected devices |
| 👤 Profile | XP level, badges, battle pass |

---

## Quick Feature Tour (5 minutes)

### Log your first activity
1. Tap **Track** tab → **Add Activity**
2. Choose type (e.g. Running), enter duration (e.g. 30 min), intensity (Moderate)
3. Tap **Save** — your XP bar on the Profile tab increases

### Check your consistency score
1. Tap **Mind** tab
2. The score (0–100) updates after each log entry
3. Scroll down to see 1-month, 3-month, 6-month, and 12-month health projections

### Complete a daily quest
1. Tap **Home** tab
2. Under "Today's Quests" find an open quest (e.g. "Walk 5 000 steps")
3. Log the corresponding activity — the quest auto-completes and awards XP + coins

### Try the AI Coach
1. Tap **Mind** tab → **AI Coach**
2. Type "What should I eat today?" or speak a voice command
3. The coach replies with personalised advice based on your profile

### Switch to Dark Mode
1. Tap **Settings** tab
2. Under **Appearance**, tap **Dark**
3. The theme applies instantly across all screens

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| QR code won't scan | Make sure your phone and computer are on the **same Wi-Fi network** |
| "Network response timed out" | Restart the dev server: press `Ctrl+C` then run `npm start` again |
| App shows a red error screen | Read the error message; most can be fixed by running `npm install --legacy-peer-deps` again |
| Metro bundler is stuck | Press `Ctrl+C` then run `npm start -- --reset-cache` |
| "Cannot find module" error | Run `npm install --legacy-peer-deps` |
| App crashes on the Profile tab | Restart the app once to let the database schema initialise |
| Slow first load | Normal — Metro compiles the JavaScript bundle on first run; subsequent loads are faster |
| `npm error peer` | Use `npm install --legacy-peer-deps` or `npm install --force` |

---

## Running the Test Suite (optional)

```bash
npm test
# Expected output: 215 tests passing across 15 test suites
```

---

## Stopping the Development Server

Press **`Ctrl+C`** in the terminal where `npm start` is running.

---

## Next Steps

Once you're comfortable with the basics, explore these enhancements from the Feature Audit:

- **Connect a wearable device** (Settings → Devices → Connect) to import real step / heart-rate data
- **Invite a friend** (Social tab → Add Friend) to start a 30-day challenge
- **View your Battle Pass** (Profile tab → Battle Pass) to track seasonal rewards

For a full description of all 15 features, gaps, and improvement recommendations, see [FEATURE_AUDIT.md](./FEATURE_AUDIT.md).
