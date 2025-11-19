// ... (Keep all your tailwind.config and theme toggle code exactly as it is) ...
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
            }
        }
    }
}

// Check for saved theme preference
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

// --- BLOG DATA SYSTEM ---
let blogs = []; // Now empty, populated via fetch

// Fetch the blogs.json file
async function loadBlogs() {
    try {
        // Note: Ensure blogs.json is in the same directory as index.html
        const response = await fetch('blogs.json');
        if (!response.ok) throw new Error('Failed to load blog list');
        blogs = await response.json();
        // Initial render (shows all)
        renderBlogs(blogs);
    } catch (error) {
        console.error("Error loading blogs:", error);
        const container = document.getElementById('blog-container');
        if(container) container.innerHTML = '<p class="text-swiss-gray">Failed to load journal entries.</p>';
    }
}

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
    const homeView = document.getElementById('home-view');
    const blogView = document.getElementById('blog-view');
    const blogReadView = document.getElementById('blog-read-view');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if(mobileMenu) mobileMenu.classList.add('translate-x-full');
    
    window.scrollTo(0,0);

    [homeView, blogView, blogReadView].forEach(el => {
        if(el && !el.classList.contains('hidden')) {
            el.style.opacity = '0';
            setTimeout(() => el.classList.add('hidden'), 300);
        }
    });

    setTimeout(() => {
        if (viewName === 'home') {
            if(homeView) {
                homeView.classList.remove('hidden');
                setTimeout(() => homeView.style.opacity = '1', 50);
                initObservers();
                initHeroAnimation(); 
            }
        } else if (viewName === 'blog') {
            if(blogView) {
                blogView.classList.remove('hidden');
                setTimeout(() => blogView.style.opacity = '1', 50);
                filterBlogs('all'); 
            }
        } else if (viewName === 'read') {
            if(blogReadView) {
                blogReadView.classList.remove('hidden');
                setTimeout(() => blogReadView.style.opacity = '1', 50);
            }
        }
    }, 300);
}

function scrollToSection(id) {
    switchView('home');
    setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }, 400); 
}

function mobileNav(destination) {
    if(destination === 'blog') switchView('blog');
    else scrollToSection(destination);
}

// UPDATED: Fetch Markdown content when opening a blog
async function openBlog(id) {
    const blog = blogs.find(b => b.id === id);
    if (!blog) return;

    const contentArea = document.getElementById('blog-content-area');
    
    // Show loading state
    contentArea.innerHTML = `<div class="animate-pulse text-swiss-gray">Loading article...</div>`;
    switchView('read');

    try {
        // Fetch the actual markdown file
        const response = await fetch(blog.file);
        if (!response.ok) throw new Error('Failed to load article content');
        const markdownText = await response.text();
        
        // Convert Markdown to HTML using marked.js
        // Ensure marked is loaded in index.html: <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
        const htmlContent = marked.parse(markdownText);

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
    } catch (error) {
        contentArea.innerHTML = `<p class="text-red-500">Error loading content. Please try again later.</p>`;
        console.error(error);
    }
}

// Mobile Menu Toggle
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
let isMenuOpen = false;

if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            mobileMenu.classList.remove('translate-x-full');
            menuBtn.children[0].classList.add('rotate-45', 'translate-y-2');
            menuBtn.children[1].classList.add('-rotate-45', '-translate-y-1.5'); 
        } else {
            mobileMenu.classList.add('translate-x-full');
            menuBtn.children[0].classList.remove('rotate-45', 'translate-y-2');
            menuBtn.children[1].classList.remove('-rotate-45', '-translate-y-1.5');
        }
    });
}

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

function filterBlogs(category) {
    document.querySelectorAll('.blog-filter').forEach(btn => {
        btn.className = 'blog-filter px-4 py-2 border border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black rounded-full transition-colors';
    });
    
    const activeBtn = document.getElementById(`btn-${category}`);
    if(activeBtn) {
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
window.addEventListener('DOMContentLoaded', () => {
    initObservers();
    initHeroAnimation();
    loadBlogs(); // Fetches JSON on load
});

// --- HERO FOURIER ANIMATION ---
let animationId; 

function initHeroAnimation() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    
    if (animationId) cancelAnimationFrame(animationId);

    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const centerY = canvas.height / 2;
    const baseAmplitude = canvas.height / 8; 
    let time = 0;
    let cycle = 0; 

    function getThemeColorStr() {
        const isDark = document.documentElement.classList.contains('dark');
        return isDark ? '255, 255, 255' : '5, 5, 5';
    }

    const harmonics = [
        { freq: 1, amp: 1 },
        { freq: 3, amp: 1/3 },
        { freq: 5, amp: 1/5 },
        { freq: 7, amp: 1/7 },
        { freq: 9, amp: 1/9 }
    ];

    function animate() {
        const themeColor = getThemeColorStr();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        time += 0.015;
        cycle += 0.005;

        const separation = (Math.sin(cycle) + 1) / 2;
        
        harmonics.forEach((h, index) => {
            ctx.beginPath();
            ctx.lineWidth = 1;
            const spreadY = (index - 2) * 60 * separation; 
            
            const currentAmplitude = baseAmplitude * h.amp;
            const opacity = 0.1 + (0.3 * separation);

            ctx.strokeStyle = `rgba(${themeColor}, ${opacity})`;

            for (let x = 0; x < canvas.width; x++) {
                const y = centerY + spreadY + Math.sin(x * 0.01 * h.freq + time * h.freq) * currentAmplitude;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        });

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = `rgba(${themeColor}, ${0.8 - (0.4 * separation)})`; 

        for (let x = 0; x < canvas.width; x++) {
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