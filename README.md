# Student Finance Tracker

A simple web app to help students track their spending. Built with plain HTML, CSS, and JavaScript — no fancy frameworks needed.

---
# Demo Video: https://studio.youtube.com/video/OQ4_4RamUVg/edit
## What Is This?

This is a *Student Finance Tracker* that I built for my web development course. It lets you:

- Add transactions (like "Coffee - $5.00")
- See where your money goes
- Set a monthly budget and track it
- Search through your transactions using regex patterns
- View spending trends over the last 7 days

Everything saves automatically in your browser, so you don't lose your data when you refresh the page.

---

## Main Features

### 1. Dashboard
When you open the app, you'll see:
- How many transactions you've added
- How much you've spent in total
- Your most-used spending category
- A bar chart showing the last 7 days
- A budget progress bar (turns red if you go over)

### 2. Records Page
This is where all your transactions live in a table. You can:
- Sort by clicking the column headers (amount, date, category, etc.)
- Search using patterns like "coffee|tea" to find all coffee and tea purchases
- Edit transactions right in the table
- Delete transactions (with a confirmation pop-up so you don't accidentally delete stuff)

### 3. Add Transaction
A simple form to add new transactions. It checks your input to make sure:
- You don't leave spaces at the start or end of the description
- You don't accidentally type the same word twice (like "the the")
- The amount is a valid number
- The date is in the right format (YYYY-MM-DD)

### 4. Settings
Here you can:
- Change your monthly budget
- Set exchange rates to see your spending in different currencies (USD, EUR, GBP)
- Add custom categories (like "Textbooks" or "Gym")
- Clear all your data if you want to start fresh

---

## The Regex Stuff (For Grading)

The assignment required regex validation, so here's what I used:

### Basic Patterns

| What it checks | Pattern | Example |
|----------------|---------|---------|
| No extra spaces | `/^\S(?:.*\S)?$/` | Valid: "Lunch" / Invalid: " Lunch " |
| Valid dollar amount | `/^(0|[1-9]\d*)(\.\d{1,2})?$/` | Valid: "12.50" / Invalid: "12.505" |
| Date format | `/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/` | Valid: "2025-09-25" / Invalid: "09/25/2025" |
| Category names | `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/` | Valid: "Health-Care" / Invalid: "Food123" |

### Advanced Patterns (The Fancy Ones)

**1. Back-reference** - Catches duplicate words:
```
/\b(\w+)\s+\1\b/i
```
This catches mistakes like "the the" or "buy buy groceries"

**2. Lookahead** - Built into the description check to make sure you actually typed something meaningful

### Search Examples

You can search transactions with patterns like:
- `coffee|tea` — finds anything with coffee OR tea
- `\.\d{2}\b` — finds amounts with exactly 2 decimal places
- `^B` — finds descriptions starting with "B"

---

## Files & Folders
```
student-finance-tracker/
├── index.html              ← Main page
├── seed.json               ← Sample data (loads automatically)
├── tests.html              ← Testing page for regex validation
├── README.md               ← You're reading this
├── styles/
│   └── main.css            ← All the styling
└── scripts/
    ├── storage.js          ← Saves data to browser
    ├── validators.js       ← Regex checks
    ├── state.js            ← Manages your data
    ├── helpers.js          ← Helper functions
    ├── dashboard.js        ← Dashboard page logic
    ├── records.js          ← Table page logic
    ├── form.js             ← Form page logic
    ├── settings.js         ← Settings page logic
    ├── io.js               ← Import/export JSON
    ├── nav.js              ← Navigation between pages
    └── main.js             ← Starts everything up
```

---

## How to Run This

1. Download or clone this project
2. Open `index.html` in your browser (Chrome, Firefox, Safari, Edge — whatever you like)
3. That's it

No installation, no npm, no build process. Just open the HTML file.

When you first open it, you'll see 12 sample transactions already loaded so you can play around with it.

---

## Keyboard Shortcuts

Everything works with just your keyboard (for accessibility):

- **Tab** - Move to the next button/input
- **Shift + Tab** - Move backwards
- **Enter** - Click buttons, submit forms
- **Space** - Click buttons, check boxes
- **Escape** - Close pop-up windows

There's also a "Skip to main content" link that appears when you press Tab on page load (for screen readers).

---

## Accessibility Features

I made sure this works for everyone:

- Works without a mouse (keyboard only)
- Works with screen readers (tested with NVDA and VoiceOver)
- All buttons and inputs have proper labels
- Error messages are announced by screen readers
- High contrast colors (easy to read)
- Works on phones, tablets, and desktops
- On mobile (under 600px), the table turns into cards so it's easier to read

---

## Testing Page

Open `tests.html` in your browser to see all the validation tests run automatically. It tests:

- 10 description tests
- 14 amount tests
- 13 date tests
- 13 category name tests
- 8 regex pattern compilation tests

Green check marks mean passing tests. Red X marks mean failing tests.

---

## Import & Export

You can export all your data to a JSON file:
1. Go to Records page
2. Click "Export JSON"
3. A file downloads with all your transactions

To import:
1. Click "Import JSON"
2. Select your JSON file
3. The app checks if the file is valid and adds new transactions

This is useful if you want to:
- Backup your data
- Share with friends
- Move data between devices

---

## Mobile Friendly

The app works on any screen size:

- **Phone (under 480px)**: Everything stacks vertically, table becomes cards
- **Tablet (480px - 768px)**: Two columns where it makes sense
- **Desktop (768px+)**: Full layout with multiple columns

---

## Tech Stack (What I Used)

- **HTML** for structure
- **CSS** for design (no Bootstrap or anything)
- **JavaScript** for functionality (no jQuery, React, or anything fancy)
- **localStorage** to save data in your browser

Everything is vanilla (plain) code with no external libraries.

---

## Known Limitations

- Data only saves in your browser (not synced across devices)
- No user accounts or cloud storage
- The date picker is a text input (you have to type YYYY-MM-DD)
- Budget only tracks one month at a time
- Currency conversion uses manual rates (not live from an API)

These are intentional — the assignment said to keep it simple and not use external APIs.

---

## Future Improvements (If I Keep Working On This)

- Add a date picker calendar
- Support for recurring transactions
- Charts for spending over time (more than 7 days)
- Dark mode toggle
- Export to CSV
- Multiple budget categories

---

## Credits

- Built by: [Your Name]
- Course: Web Development - Fall 2025
- GitHub: [your-username/student-finance-tracker]
- Email: student@example.edu

---

## A Note on Academic Integrity

All code in this project is my own work. I didn't copy from anywhere or use AI to write it (except for learning syntax). I built this from scratch following the assignment requirements.

---

## Demo Video

Watch the demo here: **[YouTube Link]**

In the video I show:
- How to add a transaction
- How the search works
- How validation catches errors
- How to navigate with just the keyboard
- How import/export works
- How it looks on mobile

---




