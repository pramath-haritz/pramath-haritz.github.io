
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
            mobileMenu.classList.add('translate-x-full');
            
            window.scrollTo(0,0);

            // Hide all first
            [homeView, blogView, blogReadView].forEach(el => {
                if(!el.classList.contains('hidden')) {
                    el.style.opacity = '0';
                    setTimeout(() => el.classList.add('hidden'), 300);
                }
            });

            // Show target
            setTimeout(() => {
                if (viewName === 'home') {
                    homeView.classList.remove('hidden');
                    setTimeout(() => homeView.style.opacity = '1', 50);
                    initObservers();
                } else if (viewName === 'blog') {
                    blogView.classList.remove('hidden');
                    setTimeout(() => blogView.style.opacity = '1', 50);
                    // Only re-filter if coming from home, otherwise keep state
                    if(homeView.classList.contains('hidden') === false) filterBlogs('all');
                } else if (viewName === 'read') {
                    blogReadView.classList.remove('hidden');
                    setTimeout(() => blogReadView.style.opacity = '1', 50);
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

        menuBtn.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            if (isMenuOpen) {
                mobileMenu.classList.remove('translate-x-full');
                menuBtn.children[0].classList.add('rotate-45', 'translate-y-2');
                menuBtn.children[1].classList.add('-rotate-45', '-translate-y-1.5'); // Adjusted for gap
            } else {
                mobileMenu.classList.add('translate-x-full');
                menuBtn.children[0].classList.remove('rotate-45', 'translate-y-2');
                menuBtn.children[1].classList.remove('-rotate-45', '-translate-y-1.5');
            }
        });

        // Blog Functionality
        function renderBlogs(items) {
            const container = document.getElementById('blog-container');
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
            activeBtn.className = 'blog-filter active px-4 py-2 border border-black dark:border-white bg-black dark:bg-white text-white dark:text-black rounded-full transition-colors';

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
        });

    