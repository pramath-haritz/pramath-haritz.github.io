tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Space Grotesk', 'sans-serif'],
            },
            colors: {
                'swiss-black': '#050505',
                'swiss-white': '#FAFAFA',
                'swiss-gray': '#888888'
            },
            animation: {
                'marquee': 'marquee 25s linear infinite',
                'marquee-reverse': 'marquee 25s linear infinite reverse',
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-100%)' },
                }
            },
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        color: theme('colors.swiss-black'),
                        '--tw-prose-body': theme('colors.swiss-black'),
                        '--tw-prose-headings': theme('colors.swiss-black'),
                        '--tw-prose-links': theme('colors.swiss-black'),
                    },
                },
                invert: {
                    css: {
                        color: theme('colors.swiss-white'),
                        '--tw-prose-body': theme('colors.swiss-white'),
                        '--tw-prose-headings': theme('colors.swiss-white'),
                        '--tw-prose-links': theme('colors.swiss-white'),
                    },
                },
            }),
        }
    }
}

// --- BLOG SYSTEM ---
let blogs = [];
let blogsLoadedPromise = null;
const isJournalPage = window.location.pathname.includes('/journal');

// --- THEME LOGIC ---
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
} else {
    document.documentElement.classList.remove('dark')
}

function toggleTheme() {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.theme = 'light';
    } else {
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
    }
}

// Load blogs from blogs.json, creating a promise to be awaited later
function loadBlogs() {
    blogsLoadedPromise = (async () => {
        try {
            const path = '/articles.json';
            const response = await fetch(`${path}?v=${new Date().getTime()}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            blogs = await response.json();
        } catch (error) {
            console.error("Error loading blogs:", error);
            const container = document.getElementById('blog-container');
            if (container) {
                container.innerHTML = '<p class="text-red-500">Error loading blog posts.</p>';
            }
            blogs = [];
        }
    })();
}

// --- APP LOGIC ---

// --- APP LOGIC ---

// Scroll Animation Observer
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

function initObservers() {
    document.querySelectorAll('.reveal-text').forEach(el => observer.observe(el));
}

// Navigation Switching
function switchView(viewName) {
    console.log('Switching view to:', viewName);
    if (viewName === 'home') {
        if (isJournalPage) {
            window.location.href = '../';
        } else {
            // Already on home, just scroll top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    } else if (viewName === 'blog') {
        if (!isJournalPage) {
            window.location.href = 'journal/';
        } else {
            // On journal page, show list view
            const blogView = document.getElementById('blog-view');
            const blogReadView = document.getElementById('blog-read-view');

            if (blogView && blogReadView) {
                console.log('Toggling blog views');
                blogReadView.classList.add('hidden');
                blogView.classList.remove('hidden');

                // Clear URL param
                const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                window.history.pushState({ path: newUrl }, '', newUrl);

                window.scrollTo(0, 0);
            } else {
                console.error('Blog views not found');
            }
        }
    }
}

function scrollToSection(id) {
    if (isJournalPage) {
        window.location.href = '../#' + id;
    } else {
        // Close menu if open
        toggleMobileMenu(false);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

function mobileNav(destination) {
    if (destination === 'blog') {
        if (isJournalPage) {
            switchView('blog');
            toggleMobileMenu(false);
        } else {
            window.location.href = 'journal/';
        }
    }
    else if (destination === 'home') window.location.href = isJournalPage ? '../' : './';
    else scrollToSection(destination);
}

// Fetch Markdown content and render blog post
async function openBlog(id) {
    if (!isJournalPage) {
        window.location.href = `journal/?id=${id}`;
        return;
    }

    if (blogsLoadedPromise) {
        await blogsLoadedPromise;
    }
    const blog = blogs.find(b => b.id === id);
    if (!blog) return;

    const contentArea = document.getElementById('blog-content-area');
    const blogView = document.getElementById('blog-view');
    const blogReadView = document.getElementById('blog-read-view');

    // Update URL
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?id=' + id;
    window.history.pushState({ path: newUrl }, '', newUrl);

    // Show loading state
    if (contentArea) {
        contentArea.innerHTML = `<div class="animate-pulse text-swiss-gray">Loading article...</div>`;
    }

    if (blogView) blogView.classList.add('hidden');
    if (blogReadView) blogReadView.classList.remove('hidden');

    window.scrollTo(0, 0);

    try {
        // Adjust path for journal subdirectory
        const filePath = isJournalPage ? '../' + blog.file : blog.file;
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let markdownText = await response.text();

        // Remove Frontmatter
        markdownText = markdownText.replace(/^---[\s\S]*?---/, '').trim();

        // Convert Markdown to HTML using marked.js
        const htmlContent = marked.parse(markdownText);

        if (contentArea) {
            contentArea.innerHTML = `
                <div class="mb-8 border-b border-black/10 dark:border-white/10 pb-8">
                    <div class="flex items-center gap-3 mb-6 text-xs font-mono uppercase tracking-widest text-swiss-gray">
                        <span>${blog.date}</span>
                        <span>—</span>
                        <span class="${blog.category === 'tech' ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}">${blog.category === 'tech' ? 'Technology' : 'Notes'}</span>
                        <span>—</span>
                        <span>${blog.readTime}</span>
                    </div>
                    <h1 class="font-display text-4xl md:text-6xl font-medium leading-tight mb-4">${blog.title}</h1>
                </div>
                <div class="prose prose-lg max-w-none font-serif dark:prose-invert">
                    ${htmlContent}
                </div>
            `;
        }
    } catch (error) {
        if (contentArea) contentArea.innerHTML = `<p class="text-red-500">Error loading content.</p>`;
        console.error("Error fetching blog content:", error);
    }
}

// Handle browser back/forward
window.onpopstate = function (event) {
    if (isJournalPage) {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');
        if (postId) {
            openBlog(parseInt(postId));
        } else {
            // Show list view
            const blogView = document.getElementById('blog-view');
            const blogReadView = document.getElementById('blog-read-view');
            if (blogView) blogView.classList.remove('hidden');
            if (blogReadView) blogReadView.classList.add('hidden');
        }
    }
};

// --- NEW MOBILE MENU LOGIC ---
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
let isMenuOpen = false;

function toggleMobileMenu(forceState) {
    isMenuOpen = forceState !== undefined ? forceState : !isMenuOpen;

    const spans = menuBtn.querySelectorAll('span');

    if (isMenuOpen) {
        // Open Menu
        mobileMenu.classList.remove('pointer-events-none', 'opacity-0');
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden'; // Lock scroll

        // Hamburger to X
        spans[0].classList.add('rotate-45', 'translate-y-1.5');
        spans[1].classList.add('-rotate-45', '-translate-y-1.5');
        spans[0].classList.remove('group-hover:w-8');
        spans[1].classList.remove('group-hover:w-8');
    } else {
        // Close Menu
        mobileMenu.classList.add('pointer-events-none', 'opacity-0');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = ''; // Unlock scroll

        // X to Hamburger
        spans[0].classList.remove('rotate-45', 'translate-y-1.5');
        spans[1].classList.remove('-rotate-45', '-translate-y-1.5');
        spans[0].classList.add('group-hover:w-8');
        spans[1].classList.add('group-hover:w-8');
    }
}

if (menuBtn) {
    menuBtn.addEventListener('click', () => toggleMobileMenu());
}

// --- RESUME POPUP LOGIC ---
function showResumePopup() {
    const popup = document.getElementById('resume-popup');
    if (popup) {
        popup.classList.remove('hidden');
        // Trigger reflow
        void popup.offsetWidth;
        popup.classList.remove('opacity-0');
        const content = popup.querySelector('div');
        content.classList.remove('scale-95');
        content.classList.add('scale-100');
        document.body.style.overflow = 'hidden'; // Lock scroll
    }
}

function closeResumePopup() {
    const popup = document.getElementById('resume-popup');
    if (popup) {
        popup.classList.add('opacity-0');
        const content = popup.querySelector('div');
        content.classList.remove('scale-100');
        content.classList.add('scale-95');
        document.body.style.overflow = ''; // Unlock scroll
        setTimeout(() => {
            popup.classList.add('hidden');
        }, 300);
    }
}

// Close popup on outside click
document.getElementById('resume-popup')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeResumePopup();
});

// Blog Functionality
function renderBlogs(items) {
    const container = document.getElementById('blog-container');
    if (!container) return;
    container.innerHTML = '';

    if (items.length === 0) {
        container.innerHTML = '<p class="text-swiss-gray font-mono text-sm">No entries found.</p>';
        return;
    }

    items.forEach(blog => {
        const article = document.createElement('article');
        article.className = 'group cursor-pointer border-b border-black/10 dark:border-white/10 pb-8 reveal-text active';
        article.setAttribute('onclick', `openBlog(${blog.id})`);

        article.innerHTML = `
            <div class="flex items-center gap-3 mb-3 text-xs font-mono uppercase tracking-widest text-swiss-gray">
                <span>${blog.date}</span>
                <span>—</span>
                <span class="${blog.category === 'tech' ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}">${blog.category === 'tech' ? 'Technology' : 'Notes'}</span>
            </div>
            <h2 class="font-display text-3xl md:text-4xl font-medium mb-3 group-hover:underline decoration-1 underline-offset-4">${blog.title}</h2>
            <p class="font-sans text-swiss-gray max-w-2xl text-lg leading-relaxed mb-4">${blog.excerpt}</p>
            <div class="flex items-center gap-2 font-mono text-xs uppercase group-hover:translate-x-2 transition-transform duration-300">
                Read Article <span>→</span>
            </div>
        `;
        container.appendChild(article);
    });
}

async function filterBlogs(category) {
    if (blogsLoadedPromise) {
        await blogsLoadedPromise;
    }

    document.querySelectorAll('.blog-filter').forEach(btn => {
        btn.className = 'blog-filter px-4 py-2 border border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black rounded-full transition-colors';
    });

    const activeBtn = document.getElementById(`btn-${category}`);
    if (activeBtn) {
        activeBtn.className = 'blog-filter active px-4 py-2 border border-black dark:border-white bg-black dark:bg-white text-white dark:text-black rounded-full transition-colors';
    }

    if (category === 'all') {
        renderBlogs(blogs);
    } else {
        const filtered = blogs.filter(b => b.category === category);
        renderBlogs(filtered);
    }
}

// Initialization
window.addEventListener('DOMContentLoaded', async () => {
    initObservers();
    initHeroAnimation();
    loadBlogs();

    // Check URL params for journal page
    if (isJournalPage) {
        if (blogsLoadedPromise) await blogsLoadedPromise;

        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');
        if (postId) {
            // We need to wait for blogs to load, which loadBlogs does asynchronously
            // But loadBlogs sets blogsLoadedPromise
            const blog = blogs.find(b => b.id === parseInt(postId));
            if (blog) {
                openBlog(parseInt(postId));
            }
        } else {
            // Ensure list view is visible
            const blogView = document.getElementById('blog-view');
            const blogReadView = document.getElementById('blog-read-view');
            if (blogView) blogView.classList.remove('hidden');
            if (blogReadView) blogReadView.classList.add('hidden');
            filterBlogs('all');
        }
    }
});

// --- HERO FOURIER ANIMATION ---
let animationId;

function initHeroAnimation() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    if (animationId) cancelAnimationFrame(animationId);

    const ctx = canvas.getContext('2d');

    // Set canvas size with dpr for crisp rendering (Improvement over original)
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const centerY = height / 2;
    const baseAmplitude = height / 8;

    let time = 0;
    let cycle = 0;

    function getThemeColorStr() {
        const isDark = document.documentElement.classList.contains('dark');
        return isDark ? '255, 255, 255' : '5, 5, 5';
    }

    const harmonics = [
        { freq: 1, amp: 1 },
        { freq: 3, amp: 1 / 3 },
        { freq: 5, amp: 1 / 5 },
        { freq: 7, amp: 1 / 7 },
        { freq: 9, amp: 1 / 9 }
    ];

    function animate() {
        const themeColor = getThemeColorStr();
        ctx.clearRect(0, 0, width, height);

        time += 0.01; // Slightly slower for elegance
        cycle += 0.005;

        // The "Breathing" effect: Waves separate and combine
        const separation = (Math.sin(cycle) + 1) / 2;

        // 1. Draw Individual Harmonics
        harmonics.forEach((h, index) => {
            ctx.beginPath();
            // Thicker lines than original
            ctx.lineWidth = 1.5;

            // Spread waves out vertically based on separation
            const spreadY = (index - 2) * 80 * separation;

            const currentAmplitude = baseAmplitude * h.amp;
            // Higher opacity than original
            const opacity = 0.15 + (0.4 * separation);

            ctx.strokeStyle = `rgba(${themeColor}, ${opacity})`;

            for (let x = 0; x < width; x++) {
                const y = centerY + spreadY + Math.sin(x * 0.01 * h.freq + time * h.freq) * currentAmplitude;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        });

        // 2. Draw Resultant Sum (The Combined Wave)
        ctx.beginPath();
        ctx.lineWidth = 3; // Bold line for the sum
        // Opacity inverse to separation (most visible when combined)
        ctx.strokeStyle = `rgba(${themeColor}, ${0.9 - (0.3 * separation)})`;

        for (let x = 0; x < width; x++) {
            let ySum = 0;
            harmonics.forEach(h => {
                ySum += Math.sin(x * 0.01 * h.freq + time * h.freq) * (baseAmplitude * h.amp);
            });
            ctx.lineTo(x, centerY + ySum);
        }
        ctx.stroke();

        animationId = requestAnimationFrame(animate);
    }

    animate();
}

window.addEventListener('resize', () => {
    initHeroAnimation();
});
