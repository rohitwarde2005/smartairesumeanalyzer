# Smart Resume AI — HTML/CSS/JS Edition

This project recreates and upgrades the supplied Streamlit Smart Resume AI interface as a front-end SPA.

## Files
- `index.html` — application shell and CDN libraries
- `styles.css` — responsive design system, dark/light themes, animations
- `app.js` — navigation, analyzer, builder, dashboard, jobs, feedback and admin logic

## Run
Open `index.html` in a modern browser.

For best results, serve the folder with a small static server, e.g. VS Code Live Server.

## Included features
- Responsive sidebar + mobile navigation
- Home dashboard
- Resume Analyzer
  - PDF text extraction through PDF.js
  - DOCX text extraction through Mammoth
  - TXT upload
  - pasted text
  - role-specific keyword analysis
  - ATS-style score
  - format / impact / keyword metrics
  - matched and missing skills
  - improvement suggestions
- Resume Builder
  - Modern / Classic / Minimal templates
  - dynamic experience, project and education sections
  - live preview
  - local draft persistence
  - browser print / Save as PDF through browser print
- Analytics Dashboard
  - KPI cards
  - ATS score chart
  - skill coverage chart
  - local activity insights
- Smart Job Search
  - search
  - category filter
  - type filter
  - sample job catalogue
- Feedback
  - 1–5 rating
  - feature request
  - improvement feedback
- Dark / light mode with CSS variables
- Admin panel
  - ID: `admin`
  - Password: `admin`
  - overview
  - feedback table
  - analyses table
  - JSON export
  - reset demo data

## Important production note
The admin credentials are intentionally client-side because this is a pure HTML/CSS/JS demo. They are NOT secure authentication. For an industry production deployment, use a backend with hashed passwords, sessions/JWT, authorization, database storage and server-side file/AI processing.

The current analyzer is an ATS-style keyword engine, not a real LLM. You can later connect the same UI to an API such as your own Python/Node backend or an AI service.
