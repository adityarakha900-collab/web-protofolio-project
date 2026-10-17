document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. THEME SWITCHER (DARK / LIGHT MODE)
    // ==========================================
    const themeToggleBtn = document.getElementById("theme-toggle");
    const htmlElement = document.documentElement;

    // Load stored theme or default to dark
    const savedTheme = localStorage.getItem("portfolio-theme") || "dark";
    htmlElement.setAttribute("data-theme", savedTheme);

    themeToggleBtn.addEventListener("click", () => {
        const currentTheme = htmlElement.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        
        htmlElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("portfolio-theme", newTheme);
        
        showToast(`Switched to ${newTheme === "dark" ? "Dark Mode 🌙" : "Light Mode ☀️"}`);
    });

    // ==========================================
    // 2. TYPING ANIMATION EFFECT
    // ==========================================
    const typingElement = document.getElementById("typing-text");
    const roles = [
        "Web Developer",
        "UI/UX Enthusiast",
        "Gunadarma Student",
        "PHP & MySQL Developer",
        "Front-End Creator"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2200; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 400; // Pause before typing next
        }

        setTimeout(typeEffect, typeSpeed);
    }

    if (typingElement) {
        typeEffect();
    }

    // ==========================================
    // 3. STICKY NAVBAR & SCROLLSPY
    // ==========================================
    const header = document.getElementById("header");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section[id]");
    const backToTopBtn = document.getElementById("back-to-top");

    function handleScroll() {
        const scrollY = window.scrollY;

        // Sticky header
        if (scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

        // Back to top button
        if (scrollY > 400) {
            backToTopBtn.classList.add("show");
        } else {
            backToTopBtn.classList.remove("show");
        }

        // ScrollSpy active link highlight
        sections.forEach((section) => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 120;
            const sectionId = section.getAttribute("id");

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach((link) => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${sectionId}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }

    window.addEventListener("scroll", handleScroll);

    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // ==========================================
    // 4. MOBILE NAVIGATION MENU TOGGLE
    // ==========================================
    const mobileToggle = document.getElementById("mobile-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            const icon = mobileToggle.querySelector("i");
            if (navMenu.classList.contains("active")) {
                icon.className = "fas fa-times";
            } else {
                icon.className = "fas fa-bars";
            }
        });

        // Close menu when clicking nav link
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("active");
                mobileToggle.querySelector("i").className = "fas fa-bars";
            });
        });
    }

    // ==========================================
    // 5. PROJECT CATEGORY FILTERING
    // ==========================================
    const filterBtns = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute("data-category");

                if (filterValue === "all" || cardCategory === filterValue) {
                    card.style.display = "flex";
                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "translateY(0)";
                    }, 50);
                } else {
                    card.style.opacity = "0";
                    card.style.transform = "translateY(20px)";
                    setTimeout(() => {
                        card.style.display = "none";
                    }, 300);
                }
            });
        });
    });

    // ==========================================
    // 6. PROJECT DETAIL MODAL
    // ==========================================
    const projectModal = document.getElementById("project-modal");
    const modalCloseBtn = document.getElementById("modal-close");
    const modalTitle = document.getElementById("modal-title");
    const modalDesc = document.getElementById("modal-desc");
    const demoBtns = document.querySelectorAll(".btn-demo-modal");

    demoBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const title = btn.getAttribute("data-title");
            const desc = btn.getAttribute("data-desc");

            modalTitle.textContent = title;
            modalDesc.textContent = desc;

            projectModal.classList.add("active");
        });
    });

    window.closeModal = function() {
        if (projectModal) {
            projectModal.classList.remove("active");
        }
    };

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener("click", closeModal);
    }

    if (projectModal) {
        projectModal.addEventListener("click", (e) => {
            if (e.target === projectModal) {
                closeModal();
            }
        });
    }

    // ==========================================
    // 7. CONTACT FORM SUBMISSION
    // ==========================================
    const contactForm = document.getElementById("contact-form");

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector("button[type='submit']");
            const originalBtnHtml = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Mengirim...`;

            setTimeout(() => {
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
                showToast("Pesan Anda berhasil dikirim ke Rakha! Terima kasih.");
            }, 1200);
        });
    }

    // ==========================================
    // 8. TOAST NOTIFICATION UTILITY
    // ==========================================
    window.showToast = function(message) {
        const toast = document.getElementById("toast");
        const toastMsg = document.getElementById("toast-message");

        if (toast && toastMsg) {
            toastMsg.textContent = message;
            toast.classList.add("show");

            setTimeout(() => {
                toast.classList.remove("show");
            }, 3500);
        }
    };

    // Copy to clipboard helper
    window.copyToClipboard = function(text, successMessage) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(successMessage || "Berhasil disalin ke clipboard!");
        }).catch(() => {
            showToast("Gagal menyalin teks.");
        });
    };

    // ==========================================
    // 9. SCROLL REVEAL ANIMATION
    // ==========================================
    const reveals = document.querySelectorAll(".reveal");

    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        const revealPoint = 100;

        reveals.forEach((element) => {
            const revealTop = element.getBoundingClientRect().top;
            if (revealTop < windowHeight - revealPoint) {
                element.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll(); // Trigger initial view check
});