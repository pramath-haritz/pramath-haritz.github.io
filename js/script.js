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
            const response = await fetch(`articles.json?v=${new Date().getTime()}`);
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

    // Close mobile menu if open
    toggleMobileMenu(false);

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
                setTimeout(() => {
                    blogView.style.opacity = '1';
                    filterBlogs('all');
                }, 50);
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
    // First ensure we are on home view
    const homeView = document.getElementById('home-view');
    if (homeView.classList.contains('hidden')) {
        switchView('home');
        // Wait for transition then scroll
        setTimeout(() => {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 400);
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
    if(destination === 'blog') switchView('blog');
    else if (destination === 'home') switchView('home');
    else scrollToSection(destination);
}

// Fetch Markdown content and render blog post
async function openBlog(id) {
    if (blogsLoadedPromise) {
        await blogsLoadedPromise;
    }
    const blog = blogs.find(b => b.id === id);
    if (!blog) return;

    const contentArea = document.getElementById('blog-content-area');

    // Show loading state
    contentArea.innerHTML = `<div class="animate-pulse text-swiss-gray">Loading article...</div>`;
    switchView('read');

    try {
        const response = await fetch(blog.file);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const markdownText = await response.text();

        // Convert Markdown to HTML using marked.js
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
        contentArea.innerHTML = `<p class="text-red-500">Error loading content.</p>`;
        console.error("Error fetching blog content:", error);
    }
}

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
    loadBlogs();
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
