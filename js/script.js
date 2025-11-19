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

// --- BLOG DATA ---
const blogs = [
    {
        id: 1,
        title: "Understanding Vision Transformers",
        category: "tech",
        date: "Oct 12, 2024",
        excerpt: "How attention mechanisms are reshaping computer vision beyond traditional CNN architectures.",
        readTime: "8 min read",
        content: `
            <p class="font-sans text-xl leading-relaxed mb-8">
                For the better part of the last decade, Convolutional Neural Networks (CNNs) have reigned supreme in computer vision. Their translation invariance and local inductive bias made them perfect for understanding images. However, the introduction of the Vision Transformer (ViT) marked a paradigm shift.
            </p>
            <h3 class="font-display text-2xl font-medium mt-12 mb-6">Breaking the Grid</h3>
            <p class="font-sans text-lg text-swiss-gray leading-relaxed mb-6">
                Unlike CNNs, which process pixels in rigid grids, Transformers treat images as sequences of patches. This allows the model to attend to global context from the very first layer. The self-attention mechanism computes relationships between every patch, enabling a holistic understanding of the scene that CNNs struggle to achieve without deep stacking.
            </p>
            <p class="font-sans text-lg text-swiss-gray leading-relaxed mb-6">
                In our experiments at Spectrum Lab, we've observed that while ViTs lack the inductive bias of CNNs—requiring more data to train—they scale remarkably well. When pre-trained on massive datasets, they develop robust representations that transfer surprisingly well to downstream tasks like medical imaging.
            </p>
            <blockquote class="border-l-2 border-black dark:border-white pl-6 my-12 italic font-display text-2xl">
                "The removal of inductive bias is not a bug, but a feature. It forces the model to learn the structure of the visual world from scratch."
            </blockquote>
            <p class="font-sans text-lg text-swiss-gray leading-relaxed">
                The future of vision likely isn't pure Transformers or pure CNNs, but hybrid architectures that leverage the efficiency of convolutions for low-level features and the global reasoning of attention for high-level semantics.
            </p>
        `
    },
    {
        id: 2,
        title: "The Swiss Style: Grid Systems in the Digital Age",
        category: "notes",
        date: "Sep 28, 2024",
        excerpt: "Why Josef Müller-Brockmann's principles matter more than ever in modern UI design.",
        readTime: "5 min read",
        content: `
            <p class="font-sans text-xl leading-relaxed mb-8">
                The International Typographic Style, or Swiss Style, emerged in the 1950s, emphasizing cleanliness, readability, and objectivity. In an era of chaotic digital interfaces, these principles provide a much-needed anchor.
            </p>
            <h3 class="font-display text-2xl font-medium mt-12 mb-6">Mathematical Beauty</h3>
            <p class="font-sans text-lg text-swiss-gray leading-relaxed mb-6">
                At the core of Swiss design is the grid. It is not a constraint, but a liberation. By defining a rigorous structure, the designer is free to play with asymmetry and negative space while maintaining harmony. In web design, CSS Grid and Flexbox have finally given us the tools to implement these print-based philosophies natively in the browser.
            </p>
            <p class="font-sans text-lg text-swiss-gray leading-relaxed">
                Modern minimalism often gets confused with "emptiness." True Swiss minimalism is about the *economy of means*—using the absolute minimum elements necessary to communicate the message effectively. It relies on strong typography (often Akzidenz-Grotesk or Helvetica) to carry the visual weight.
            </p>
        `
    },
    {
        id: 3,
        title: "Biomedical Signals: Noise vs. Information",
        category: "tech",
        date: "Aug 15, 2024",
        excerpt: "Preprocessing techniques using PyTorch for cleaner ECG data analysis.",
        readTime: "12 min read",
        content: `
            <p class="font-sans text-xl leading-relaxed mb-8">
                In biomedical signal processing, the signal-to-noise ratio is the enemy. ECG signals are notoriously noisy, plagued by muscle artifacts, power line interference, and baseline wander.
            </p>
            <p class="font-sans text-lg text-swiss-gray leading-relaxed mb-6">
                Traditional filtering methods (Butterworth, Chebyshev) are effective but rigid. Recently, we've been exploring deep learning approaches for denoising. By training autoencoders on synthetic noise injected into clean datasets, we can learn non-linear filters that preserve the QRS complex morphology better than linear filters.
            </p>
        `
    },
    {
        id: 4,
        title: "Coffee Extraction: A Chemical Perspective",
        category: "notes",
        date: "Jul 02, 2024",
        excerpt: "Exploring the variables of solubility and how grind size affects flavor clarity.",
        readTime: "4 min read",
        content: `
            <p class="font-sans text-xl leading-relaxed mb-8">
                Brewing coffee is essentially a chemistry experiment in solvation. The goal is to extract specific compounds (acids, sugars, lipids) from the cellulose matrix of the bean.
            </p>
            <p class="font-sans text-lg text-swiss-gray leading-relaxed mb-6">
                The grind size determines the surface area exposed to water. Finer grinds increase surface area and extraction rate but risk clogging the filter and over-extracting bitter tannins. Coarser grinds offer clarity but risk under-extraction, leading to sour, grassy notes.
            </p>
            <p class="font-sans text-lg text-swiss-gray leading-relaxed">
                For a V60, I aim for a Total Dissolved Solids (TDS) of around 1.35%, balancing the bright acidity of Ethiopian beans with a syrupy body.
            </p>
        `
    }
];

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
    
    // Close mobile menu if open
    if(mobileMenu) mobileMenu.classList.add('translate-x-full');
    
    window.scrollTo(0,0);

    // Hide all first
    [homeView, blogView, blogReadView].forEach(el => {
        if(el && !el.classList.contains('hidden')) {
            el.style.opacity = '0';
            setTimeout(() => el.classList.add('hidden'), 300);
        }
    });

    // Show target
    setTimeout(() => {
        if (viewName === 'home') {
            if(homeView) {
                homeView.classList.remove('hidden');
                setTimeout(() => homeView.style.opacity = '1', 50);
                initObservers();
                initHeroAnimation(); // Re-init animation
            }
        } else if (viewName === 'blog') {
            if(blogView) {
                blogView.classList.remove('hidden');
                setTimeout(() => blogView.style.opacity = '1', 50);
                // FIX: Always force filter to all when switching to blog view
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

function openBlog(id) {
    const blog = blogs.find(b => b.id === id);
    if (!blog) return;

    const contentArea = document.getElementById('blog-content-area');
    
    // Inject Content
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
            ${blog.content}
        </div>
    `;

    switchView('read');
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
    // Update Buttons
    document.querySelectorAll('.blog-filter').forEach(btn => {
        // Reset classes
        btn.className = 'blog-filter px-4 py-2 border border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black rounded-full transition-colors';
    });
    
    const activeBtn = document.getElementById(`btn-${category}`);
    if(activeBtn) {
        activeBtn.className = 'blog-filter active px-4 py-2 border border-black dark:border-white bg-black dark:bg-white text-white dark:text-black rounded-full transition-colors';
    }

    // Filter Logic
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
    initHeroAnimation(); // Start animation on load
});

// --- HERO FOURIER ANIMATION ---
let animationId; // Global to handle resize resets

function initHeroAnimation() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    
    // Cancel previous loop if resizing
    if (animationId) cancelAnimationFrame(animationId);

    const ctx = canvas.getContext('2d');
    
    // Resize
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const centerY = canvas.height / 2;
    const baseAmplitude = canvas.height / 8; 
    let time = 0;
    let cycle = 0; // Controls separation state

    // Helper: Get color based on current theme
    function getThemeColorStr() {
        const isDark = document.documentElement.classList.contains('dark');
        return isDark ? '255, 255, 255' : '5, 5, 5';
    }

    // Square Wave Harmonics (Odd frequencies: 1, 3, 5, 7, 9)
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
        cycle += 0.005; // Speed of decomposition cycle

        // Separation factor: Oscillates between 0 (merged) and 1 (fully separated)
        // Using sine squared to keep it positive and smooth
        const separation = (Math.sin(cycle) + 1) / 2;
        
        // Visualize Individual Components
        harmonics.forEach((h, index) => {
            ctx.beginPath();
            ctx.lineWidth = 1;
            // Calculate vertical offset for this harmonic when separated
            // Spread them out: center +/- offset
            // index 0 is center, others spread out
            const spreadY = (index - 2) * 60 * separation; 
            
            const currentAmplitude = baseAmplitude * h.amp;
            const opacity = 0.1 + (0.3 * separation); // More visible when separated

            ctx.strokeStyle = `rgba(${themeColor}, ${opacity})`;

            for (let x = 0; x < canvas.width; x++) {
                // Wave equation: y = A * sin(freq * (x + time))
                const y = centerY + spreadY + Math.sin(x * 0.01 * h.freq + time * h.freq) * currentAmplitude;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        });

        // Visualize Complex Sum (Resultant Wave)
        // Opacity fades slightly when fully decomposed to let components shine, but stays visible
        ctx.beginPath();
        ctx.lineWidth = 2; // Thicker line for the sum
        ctx.strokeStyle = `rgba(${themeColor}, ${0.8 - (0.4 * separation)})`; 

        for (let x = 0; x < canvas.width; x++) {
            let ySum = 0;
            // Sum all harmonics at this x
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

// Handle Resize
window.addEventListener('resize', () => {
    initHeroAnimation();
});
