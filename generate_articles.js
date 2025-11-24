const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, 'posts');
const outputFile = path.join(__dirname, 'articles.json');

// Helper to calculate read time
function calculateReadTime(content) {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
}

// Helper to parse Frontmatter
function parseFrontmatter(fileContent) {
    const frontmatterRegex = /^---\s*([\s\S]*?)\s*---/;
    const match = frontmatterRegex.exec(fileContent);

    if (!match) return null;

    const frontmatterBlock = match[1];
    const body = fileContent.replace(frontmatterRegex, '').trim();

    const metadata = {};
    frontmatterBlock.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
            let value = valueParts.join(':').trim();
            // Remove quotes if present
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }
            metadata[key.trim()] = value;
        }
    });

    return { metadata, body };
}

function generateArticles() {
    if (!fs.existsSync(postsDir)) {
        console.error(`Directory not found: ${postsDir}`);
        return;
    }

    const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
    const articles = [];

    files.forEach(file => {
        const filePath = path.join(postsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const parsed = parseFrontmatter(content);

        if (parsed && parsed.metadata) {
            const { metadata, body } = parsed;

            // Ensure required fields exist
            if (!metadata.title || !metadata.date) {
                console.warn(`Skipping ${file}: Missing title or date in frontmatter.`);
                return;
            }

            articles.push({
                id: parseInt(metadata.id) || Date.now(), // Fallback ID if not provided
                title: metadata.title,
                category: metadata.category || 'notes',
                date: metadata.date,
                excerpt: metadata.excerpt || body.slice(0, 100) + '...',
                readTime: calculateReadTime(body),
                file: `posts/${file}`
            });
        } else {
            console.warn(`Skipping ${file}: No valid frontmatter found.`);
        }
    });

    // Sort by ID descending (assuming newer posts have higher IDs) or Date
    // For now, let's respect the order in the array or sort by ID
    articles.sort((a, b) => b.id - a.id);

    fs.writeFileSync(outputFile, JSON.stringify(articles, null, 4));
    console.log(`Successfully generated articles.json with ${articles.length} posts.`);
}

generateArticles();
