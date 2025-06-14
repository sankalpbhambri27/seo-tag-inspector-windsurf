# SEO Tag Inspector

A full-stack web application that analyzes and visualizes SEO-related meta tags for any website. Built with React, TypeScript, TailwindCSS, Node.js, and Express.

## Features

- 🔍 Analyze any website's SEO meta tags
- 📊 Visual SEO score with detailed breakdown
- 👁️ Preview how your site appears in search results and social media
- 🌓 Light/Dark mode toggle
- 🎨 Modern, responsive UI with smooth animations
- 📱 Mobile-friendly design

## Tech Stack

- **Frontend**: React 18, TypeScript, TailwindCSS, Framer Motion
- **Backend**: Node.js, Express
- **Dependencies**:
  - Frontend: axios, @heroicons/react, framer-motion
  - Backend: cheerio, cors, axios

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/seo-tag-inspector.git
   cd seo-tag-inspector
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```
   The backend will start on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   ```
   The frontend will start on `http://localhost:3000`

3. **Open your browser**
   Visit `http://localhost:3000` to use the application.

## Usage

1. Enter a website URL in the search bar (e.g., `https://example.com`)
2. Click "Inspect" to analyze the website's SEO tags
3. View the detailed SEO report including:
   - Overall SEO score
   - Google search preview
   - Social media preview
   - Detailed tag analysis

## Project Structure

```
seo-tag-inspector/
├── backend/
│   ├── node_modules/
│   ├── package.json
│   └── server.js         # Express server and API endpoints
└── frontend/
    ├── public/
    └── src/
        ├── App.tsx       # Main application component
        ├── index.tsx     # Application entry point
        └── index.css     # Global styles
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
