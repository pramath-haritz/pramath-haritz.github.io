# Pramath Haritz | Portfolio

A personal portfolio and blog website built with modern web technologies, focusing on minimalism, performance, and ease of maintenance.

## 🚀 Tech Stack

- **Core**: HTML5, Vanilla JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (via CDN for simplicity)
- **Markdown Parsing**: [Marked.js](https://github.com/markedjs/marked)
- **Fonts**: Inter & Space Grotesk (Google Fonts)
- **Icons**: Heroicons (SVG)

## 🛠️ Getting Started

Since this project uses ES modules and `fetch` requests for the blog system, it requires a local server to run (opening `index.html` directly will cause CORS errors).

### Prerequisites
- Python 3.x OR Node.js

### Running Locally

**Option 1: Using Python (Recommended)**
```bash
# Run this in the project root
python3 -m http.server
# Open http://localhost:8000
```

**Option 2: Using Node.js**
```bash
npx serve .
# Open the URL shown in terminal
```

## 📝 Blog Workflow

The blog system is automated to read Markdown files from the `posts/` directory.

### Adding a New Post

1.  **Create a File**: Add a new `.md` file in the `posts/` directory.
2.  **Add Frontmatter**: Include the following metadata at the top of your file:
    ```markdown
    ---
    id: 2
    title: "Your Post Title"
    category: "tech"  # or "notes"
    date: "Nov 24, 2025"
    excerpt: "A brief summary of the post."
    ---
    ```
3.  **Generate JSON**: Run the automation script to update the blog index:
    ```bash
    node generate_articles.js
    ```
4.  **Verify**: Check `articles.json` to ensure your post was added.

## 📂 Project Structure

```
.
├── assets/              # Images, icons, and static assets
├── css/                 # Custom CSS overrides
├── js/                  # Application logic
│   └── script.js        # Main logic (routing, animations, blog rendering)
├── posts/               # Markdown blog posts
├── articles.json        # Generated blog index (Do not edit manually)
├── generate_articles.js # Script to generate articles.json
├── index.html           # Main entry point
├── tailwind.config.js   # Tailwind configuration
└── README.md            # Documentation
```

## 🎨 Customization

### Tailwind Configuration
The project uses a custom Tailwind configuration defined in `tailwind.config.js` (and mirrored in `script.js` for dynamic usage).

- **Colors**:
  - `swiss-black`: `#050505`
  - `swiss-white`: `#FAFAFA`
  - `swiss-gray`: `#888888`
- **Fonts**:
  - Sans: `Inter`
  - Display: `Space Grotesk`


© 2025 Pramath Haritz. All rights reserved.
