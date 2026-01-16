# Modern Expense Tracker MVP

A local-first, privacy-focused expense tracker with AI-powered categorization.

![Screenshot](https://via.placeholder.com/800x400?text=Expense+Tracker+Demo)

## Features

- 📝 **Manual Expense Entry**: Easy logging with smart defaults.
- 🤖 **AI Auto-Categorization**: Uses Hugging Face Inference API to categorize expenses automatically based on description.
- 📊 **Interactive Dashboard**: Visual insights with pie charts and monthly trends.
- 🔒 **Local-First**: All data is stored in your browser (IndexedDB). No backend required.
- 📤 **Export**: Download your data as CSV or JSON.
- 🌗 **Dark/Light Mode**: Fully responsive design.

## Architecture

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui-inspired components
- **State/Storage**: React Hooks + LocalForage (IndexedDB)
- **Charts**: Recharts
- **Icons**: Lucide React

## Setup & Run Locally

1. **Clone the repo**
   ```bash
   git clone <repo-url>
   cd expense-tracker-mvp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## Build & Deploy

This project is designed to be hosted on GitHub Pages or any static host.

1. **Build**
   ```bash
   npm run build
   ```
   This produces a `dist` folder.

2. **Deploy**
   - **GitHub Pages**: You can use the provided GitHub Actions workflow (if added) or simply upload the `dist` folder contents.
   - **Netlify/Vercel**: Connect your repo and set build command to `npm run build` and output dir to `dist`.

## Configuration

### AI Integration
To use the auto-categorization feature:
1. Go to **Settings** (Gear icon in top right).
2. Enter your **Hugging Face API Key**. (Get one for free at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)).
3. Save. The key is stored locally in your browser.

## Privacy Note
This app runs entirely in your browser.
- **Expenses Data**: Stored only on your device (IndexedDB).
- **AI Categorization**: Only the expense description and amount are sent to the Hugging Face API for classification. No other data is shared.

## License
MIT
