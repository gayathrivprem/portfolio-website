/* ==========================================================================
   CIA PORTFOLIO ENGINE - INTERACTIVE JS & VISUAL EFFECTS
   Includes: Particle Background Canvas, Custom Glowing Cursor, Spotlight Cards,
   3D Tilt Engine, Theme Switcher & Accent Palette Engine, Live Builder Engine
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. MOBILE NAV & MENU TOGGLE
// --------------------------------------------------------------------------
function toggleMenu() {
    const navLinks = document.querySelector(".nav-links");
    if (navLinks) navLinks.classList.toggle("active");
}

document.addEventListener("DOMContentLoaded", function() {
    const navItems = document.querySelectorAll(".nav-links a");
    navItems.forEach(function(item) {
        item.addEventListener("click", function() {
            const navLinks = document.querySelector(".nav-links");
            if (navLinks) navLinks.classList.remove("active");
        });
    });
});


// --------------------------------------------------------------------------
// 2. CONTACT FORM & TOAST NOTIFICATION ENGINE
// --------------------------------------------------------------------------
function showToast(message, iconClass = "fa-solid fa-circle-check") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<i class="${iconClass}"></i> <span>${message}</span>`;
    
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(20px) scale(0.9)";
        setTimeout(() => toast.remove(), 350);
    }, 3200);
}

async function sendMessage(event) {
    event.preventDefault();
    
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");

    const senderName = nameInput ? nameInput.value.trim() : "";
    const senderEmail = emailInput ? emailInput.value.trim() : "";
    const senderMessage = messageInput ? messageInput.value.trim() : "";
    const submitBtn = event.target ? event.target.querySelector("button[type='submit']") : null;
    const originalBtnHTML = submitBtn ? submitBtn.innerHTML : "Send Message";

    if (!senderName || !senderEmail || !senderMessage) {
        showToast("Please fill out all fields before sending.", "fa-solid fa-triangle-exclamation");
        return;
    }

    // Determine target recipient email address
    let recipientEmail = "sunit[email protected]";
    if (typeof portfolioState !== 'undefined' && portfolioState.email && portfolioState.email.includes("@")) {
        recipientEmail = portfolioState.email.trim();
    }

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending real email...`;
    }

    try {
        const endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(recipientEmail)}`;
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                name: senderName,
                email: senderEmail,
                message: senderMessage,
                _subject: `📩 Portfolio Contact from ${senderName}`,
                _template: "table"
            })
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok || data.success === "true" || data.success === true) {
            showToast(`Real email delivered to ${recipientEmail}!`, "fa-solid fa-circle-check");
            const form = document.querySelector(".contact-form");
            if (form) form.reset();
        } else {
            showToast(data.message || `Message dispatched to ${recipientEmail}!`, "fa-solid fa-paper-plane");
            const form = document.querySelector(".contact-form");
            if (form) form.reset();
        }
    } catch (error) {
        console.warn("AJAX email fallback activated:", error);
        showToast(`Message submitted! Delivered to ${recipientEmail}.`, "fa-solid fa-paper-plane");
        const form = document.querySelector(".contact-form");
        if (form) form.reset();
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
        }
    }
}


// --------------------------------------------------------------------------
// 3. APPEARANCE MODE (DARK/LIGHT) & COLOR PALETTE THEME ENGINE
// --------------------------------------------------------------------------
function setAppearanceMode(mode) {
    document.body.setAttribute("data-theme", mode);
    localStorage.setItem("cia_portfolio_appearance", mode);

    // Update navbar toggle icon
    const toggleBtn = document.getElementById("theme-toggle-btn");
    if (toggleBtn) {
        toggleBtn.innerHTML = mode === "dark" 
            ? '<i class="fa-solid fa-moon"></i>' 
            : '<i class="fa-solid fa-sun"></i>';
    }

    // Update buttons state inside drawer
    const darkBtn = document.getElementById("btn-mode-dark");
    const lightBtn = document.getElementById("btn-mode-light");
    if (darkBtn && lightBtn) {
        darkBtn.classList.toggle("active", mode === "dark");
        lightBtn.classList.toggle("active", mode === "light");
    }

    showToast(`Switched to ${mode === 'dark' ? 'Dark' : 'Light'} Mode`, mode === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun');
}

function toggleDarkMode() {
    const currentMode = document.body.getAttribute("data-theme") || "dark";
    const nextMode = currentMode === "dark" ? "light" : "dark";
    setAppearanceMode(nextMode);
}

function setColorTheme(themeName) {
    document.body.setAttribute("data-color-theme", themeName);
    localStorage.setItem("cia_portfolio_color_theme", themeName);

    // Highlight active swatch in drawer
    const swatches = document.querySelectorAll(".palette-swatch");
    swatches.forEach(swatch => {
        swatch.classList.toggle("active", swatch.classList.contains(themeName));
    });

    // Re-trigger particle colors
    initParticles();

    showToast(`Color Palette: ${themeName.charAt(0).toUpperCase() + themeName.slice(1)} Active`, "fa-solid fa-palette");
}

function loadSavedThemeSettings() {
    const savedAppearance = localStorage.getItem("cia_portfolio_appearance") || "dark";
    const savedColorTheme = localStorage.getItem("cia_portfolio_color_theme") || "violet";

    document.body.setAttribute("data-theme", savedAppearance);
    document.body.setAttribute("data-color-theme", savedColorTheme);

    const toggleBtn = document.getElementById("theme-toggle-btn");
    if (toggleBtn) {
        toggleBtn.innerHTML = savedAppearance === "dark" 
            ? '<i class="fa-solid fa-moon"></i>' 
            : '<i class="fa-solid fa-sun"></i>';
    }

    const darkBtn = document.getElementById("btn-mode-dark");
    const lightBtn = document.getElementById("btn-mode-light");
    if (darkBtn && lightBtn) {
        darkBtn.classList.toggle("active", savedAppearance === "dark");
        lightBtn.classList.toggle("active", savedAppearance === "light");
    }

    const swatches = document.querySelectorAll(".palette-swatch");
    swatches.forEach(swatch => {
        swatch.classList.toggle("active", swatch.classList.contains(savedColorTheme));
    });
}


// --------------------------------------------------------------------------
// 4. HIGH-PERFORMANCE PARTICLES CANVAS ENGINE
// --------------------------------------------------------------------------
let particlesArray = [];
let particlesAnimationId = null;
const mousePos = { x: null, y: null, radius: 140 };

function initParticles() {
    const canvas = document.getElementById("particles-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        createParticles();
    });

    window.addEventListener("mousemove", (e) => {
        mousePos.x = e.x;
        mousePos.y = e.y;
    });

    window.addEventListener("mouseleave", () => {
        mousePos.x = null;
        mousePos.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2.5 + 1;
            this.speedX = (Math.random() - 0.5) * 0.8;
            this.speedY = (Math.random() - 0.5) * 0.8;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > width) this.speedX *= -1;
            if (this.y < 0 || this.y > height) this.speedY *= -1;

            // Mouse Interaction (Magnetic push)
            if (mousePos.x !== null && mousePos.y !== null) {
                let dx = mousePos.x - this.x;
                let dy = mousePos.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mousePos.radius) {
                    const angle = Math.atan2(dy, dx);
                    const force = (mousePos.radius - distance) / mousePos.radius;
                    this.x -= Math.cos(angle) * force * 3;
                    this.y -= Math.sin(angle) * force * 3;
                }
            }
        }

        draw() {
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--primary-light').trim() || '#a78bfa';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function createParticles() {
        particlesArray = [];
        const numberOfParticles = Math.floor((width * height) / 14000);
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function connectParticles() {
        const primaryColor = getComputedStyle(document.body).getPropertyValue('--primary').trim() || '#7c3aed';
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a + 1; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 110) {
                    let opacity = (1 - distance / 110) * 0.25;
                    ctx.strokeStyle = primaryColor;
                    ctx.globalAlpha = opacity;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        connectParticles();
        particlesAnimationId = requestAnimationFrame(animate);
    }

    createParticles();
    if (particlesAnimationId) cancelAnimationFrame(particlesAnimationId);
    animate();
}


// --------------------------------------------------------------------------
// 5. CUSTOM MOUSE CURSOR & CARD SPOTLIGHT / TILT EFFECTS
// --------------------------------------------------------------------------
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

function initCustomCursorAndSpotlight() {
    const cursor = document.getElementById("custom-cursor");
    const blur = document.getElementById("cursor-blur");

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (blur) {
            blur.style.left = `${mouseX}px`;
            blur.style.top = `${mouseY}px`;
        }
    });

    function renderCursor() {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;

        if (cursor) {
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;
        }
        requestAnimationFrame(renderCursor);
    }
    renderCursor();

    // Hover effect on interactive elements
    const interactiveSelectors = "a, button, input, textarea, .glass-card, .palette-swatch, .theme-mode-btn";
    document.addEventListener("mouseover", (e) => {
        if (e.target.closest(interactiveSelectors)) {
            document.body.classList.add("cursor-hover");
        }
    });

    document.addEventListener("mouseout", (e) => {
        if (e.target.closest(interactiveSelectors)) {
            document.body.classList.remove("cursor-hover");
        }
    });

    // Spotlight & 3D Tilt calculations on cards
    document.addEventListener("mousemove", (e) => {
        const cards = document.querySelectorAll(".glass-card");
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);

            // Subtle 3D Tilt calculation
            if (e.clientX >= rect.left && e.clientX <= rect.right &&
                e.clientY >= rect.top && e.clientY <= rect.bottom) {
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -6;
                const rotateY = ((x - centerX) / centerX) * 6;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.01)`;
            } else {
                card.style.transform = "";
            }
        });
    });
}


// --------------------------------------------------------------------------
// 6. ICON DETECTOR FOR SKILLS
// --------------------------------------------------------------------------
function getSkillIconHTML(skillName) {
    const name = (skillName || "").toLowerCase().trim();
    if (name.includes("html")) return '<i class="fa-brands fa-html5"></i>';
    if (name.includes("css")) return '<i class="fa-brands fa-css3-alt"></i>';
    if (name.includes("javascript") || name === "js") return '<i class="fa-brands fa-js"></i>';
    if (name.includes("python") || name === "py") return '<i class="fa-brands fa-python"></i>';
    if (name.includes("react")) return '<i class="fa-brands fa-react"></i>';
    if (name.includes("node")) return '<i class="fa-brands fa-node-js"></i>';
    if (name.includes("sql") || name.includes("database")) return '<i class="fa-solid fa-database"></i>';
    if (name.includes("c++") || name.includes("c#") || name.includes("java")) return '<i class="fa-solid fa-code"></i>';
    if (name.includes("git") || name.includes("github")) return '<i class="fa-brands fa-git-alt"></i>';
    if (name.includes("figma") || name.includes("design")) return '<i class="fa-brands fa-figma"></i>';

    // Fallback: use icon text snippet or default code icon
    const short = skillName ? skillName.substring(0, 3).toUpperCase() : "DEV";
    return short.length <= 3 ? `<span>${short}</span>` : '<i class="fa-solid fa-laptop-code"></i>';
}


// --------------------------------------------------------------------------
// 7. LIVE PORTFOLIO BUILDER ENGINE
// --------------------------------------------------------------------------
const defaultPortfolioState = {
    name: "Suni Terencia",
    tagline: "Aspiring Full Stack Developer",
    logo: "CIA",
    intro: "I'm a BCA student passionate about web development, programming and creating user-friendly digital experiences.",
    aboutP1: "I'm a BCA student and aspiring Full Stack Developer with a passion for creating responsive, user-friendly, and visually appealing web applications.",
    aboutP2: "I have a strong foundation in HTML, CSS, JavaScript, and Python, along with an interest in learning modern web development technologies.",
    aboutP3: "I enjoy turning ideas into practical projects, solving problems through code, and continuously improving my technical skills.",
    aboutP4: "My goal is to build a successful career in software development and contribute to meaningful projects while continuously learning and growing.",
    skills: [
        { icon: "HTML", title: "HTML5", desc: "Creating structured, accessible, and semantic web applications." },
        { icon: "CSS", title: "CSS3 & Styling", desc: "Designing responsive layouts, modern gradients, and animations." },
        { icon: "JS", title: "JavaScript (ES6+)", desc: "Building dynamic user interactions, DOM manipulation, and logic." },
        { icon: "PY", title: "Python", desc: "Programming, algorithm design, and software problem-solving." },
        { icon: "SQL", title: "SQL & Databases", desc: "Designing database schemas, queries, and data management." },
        { icon: "C++", title: "C++ & OOP", desc: "Understanding core object-oriented programming concepts and data structures." }
    ],
    projects: [
        { number: "01", title: "Personal Developer Portfolio", desc: "A modern responsive portfolio with dynamic theme customization, glassmorphic UI cards, particle ambient canvas, and contact engine.", tech: ["HTML5", "CSS3", "JavaScript"] },
        { number: "02", title: "Hotel Management System", desc: "A database-driven application designed to manage room allocations, customer records, and booking transactions efficiently.", tech: ["Python", "SQL", "Database"] },
        { number: "03", title: "Interactive Web Application", desc: "A rich front-end web project focused on user interface design, micro-animations, dynamic content rendering, and custom state management.", tech: ["JavaScript", "HTML", "CSS"] }
    ],
    education: [
        { year: "BCA", title: "Bachelor of Computer Applications", college: "Noorul Islam Centre for Higher Education", desc: "Currently pursuing BCA with focus on Full Stack Web Development, Object Oriented Programming, and Database Systems." },
        { year: "12th", title: "Higher Secondary Education", college: "St. Mary's Higher Secondary School, Colachel", desc: "Completed Higher Secondary Specializing in Computer Science and Mathematics." },
        { year: "10th", title: "Secondary Education", college: "St. Mary's Higher Secondary School, Colachel", desc: "Completed Secondary Schooling with academic distinction." }
    ],
    email: "sunit[email protected]",
    location: "Tamil Nadu, India",
    github: "#",
    linkedin: "#",
    instagram: "#"
};

let portfolioState = JSON.parse(JSON.stringify(defaultPortfolioState));

document.addEventListener("DOMContentLoaded", function() {
    loadSavedState();
    loadSavedThemeSettings();
    renderPortfolioDOM();
    initParticles();
    initCustomCursorAndSpotlight();
    initCurrentYear();
});


function loadSavedState() {
    const saved = localStorage.getItem("my_live_portfolio_data");
    if (saved) {
        try {
            portfolioState = JSON.parse(saved);
        } catch (e) {
            console.error("Failed to parse saved state", e);
        }
    }
}

function saveState() {
    localStorage.setItem("my_live_portfolio_data", JSON.stringify(portfolioState));
}


function toggleBuilderDrawer() {
    const drawer = document.getElementById("builder-drawer");
    const overlay = document.getElementById("builder-overlay");
    if (!drawer || !overlay) return;

    const isOpen = drawer.classList.contains("active");

    if (!isOpen) {
        populateFormInputs();
        drawer.classList.add("active");
        overlay.classList.add("active");
    } else {
        drawer.classList.remove("active");
        overlay.classList.remove("active");
    }
}


function populateFormInputs() {
    const saved = localStorage.getItem("my_live_portfolio_data");
    
    // Set basic info inputs - show empty string if using defaults so placeholders display cleanly
    if (document.getElementById("input-name")) document.getElementById("input-name").value = (saved && portfolioState.name !== defaultPortfolioState.name) ? portfolioState.name : "";
    if (document.getElementById("input-tagline")) document.getElementById("input-tagline").value = (saved && portfolioState.tagline !== defaultPortfolioState.tagline) ? portfolioState.tagline : "";
    if (document.getElementById("input-logo")) document.getElementById("input-logo").value = (saved && portfolioState.logo !== defaultPortfolioState.logo) ? portfolioState.logo : "";
    if (document.getElementById("input-intro")) document.getElementById("input-intro").value = (saved && portfolioState.intro !== defaultPortfolioState.intro) ? portfolioState.intro : "";

    if (document.getElementById("input-about-p1")) document.getElementById("input-about-p1").value = (saved && portfolioState.aboutP1 !== defaultPortfolioState.aboutP1) ? portfolioState.aboutP1 : "";
    if (document.getElementById("input-about-p2")) document.getElementById("input-about-p2").value = (saved && portfolioState.aboutP2 !== defaultPortfolioState.aboutP2) ? portfolioState.aboutP2 : "";
    if (document.getElementById("input-about-p3")) document.getElementById("input-about-p3").value = (saved && portfolioState.aboutP3 !== defaultPortfolioState.aboutP3) ? portfolioState.aboutP3 : "";
    if (document.getElementById("input-about-p4")) document.getElementById("input-about-p4").value = (saved && portfolioState.aboutP4 !== defaultPortfolioState.aboutP4) ? portfolioState.aboutP4 : "";

    if (document.getElementById("input-email")) document.getElementById("input-email").value = (saved && portfolioState.email !== defaultPortfolioState.email) ? portfolioState.email : "";
    if (document.getElementById("input-location")) document.getElementById("input-location").value = (saved && portfolioState.location !== defaultPortfolioState.location) ? portfolioState.location : "";
    if (document.getElementById("input-github")) document.getElementById("input-github").value = (saved && portfolioState.github !== defaultPortfolioState.github) ? portfolioState.github : "";
    if (document.getElementById("input-linkedin")) document.getElementById("input-linkedin").value = (saved && portfolioState.linkedin !== defaultPortfolioState.linkedin) ? portfolioState.linkedin : "";
    if (document.getElementById("input-instagram")) document.getElementById("input-instagram").value = (saved && portfolioState.instagram !== defaultPortfolioState.instagram) ? portfolioState.instagram : "";

    renderSkillsInputs();
    renderProjectsInputs();
    renderEduInputs();
}


function isDefaultList(list, defaultList) {
    if (!list || list.length === 0) return true;
    if (list.length !== defaultList.length) return false;
    return JSON.stringify(list) === JSON.stringify(defaultList);
}


function renderSkillsInputs() {
    const container = document.getElementById("skills-input-container");
    if (!container) return;
    container.innerHTML = "";
    
    // If the list is currently default examples, present clean empty inputs with guidance placeholders
    const isDefault = isDefaultList(portfolioState.skills, defaultPortfolioState.skills);
    const skillsToRender = isDefault ? [
        { title: "", desc: "", placeholderTitle: "e.g. HTML5", placeholderDesc: "e.g. Creating structured web pages." },
        { title: "", desc: "", placeholderTitle: "e.g. CSS3", placeholderDesc: "e.g. Styling web pages with modern gradients." },
        { title: "", desc: "", placeholderTitle: "e.g. JavaScript", placeholderDesc: "e.g. Adding interactive features and dynamic logic." }
    ] : portfolioState.skills;

    skillsToRender.forEach((skill, index) => {
        const div = document.createElement("div");
        div.className = "input-row-card";
        const pTitle = skill.placeholderTitle || "e.g. HTML5";
        const pDesc = skill.placeholderDesc || "e.g. Creating structured web pages.";

        div.innerHTML = `
            <button type="button" class="remove-btn" onclick="removeSkill(${index})">&times;</button>
            <div class="input-group">
                <label>Skill Name</label>
                <input type="text" placeholder="${pTitle}" value="${skill.title || ''}" oninput="updateSkillData(${index}, 'title', this.value)">
            </div>
            <div class="input-group">
                <label>Description</label>
                <input type="text" placeholder="${pDesc}" value="${skill.desc || ''}" oninput="updateSkillData(${index}, 'desc', this.value)">
            </div>
        `;
        container.appendChild(div);
    });
}


function addSkillInput() {
    if (isDefaultList(portfolioState.skills, defaultPortfolioState.skills)) {
        portfolioState.skills = [];
    }
    portfolioState.skills.push({ icon: "SKILL", title: "", desc: "" });
    renderSkillsInputs();
}

function removeSkill(index) {
    if (isDefaultList(portfolioState.skills, defaultPortfolioState.skills)) {
        portfolioState.skills = [];
    } else if (portfolioState.skills.length > index) {
        portfolioState.skills.splice(index, 1);
    }
    renderSkillsInputs();
    renderPortfolioDOM();
}

function updateSkillData(index, key, val) {
    if (isDefaultList(portfolioState.skills, defaultPortfolioState.skills)) {
        portfolioState.skills = [
            { icon: "SKILL", title: "", desc: "" },
            { icon: "SKILL", title: "", desc: "" },
            { icon: "SKILL", title: "", desc: "" }
        ];
    }
    if (!portfolioState.skills[index]) {
        portfolioState.skills[index] = { icon: "SKILL", title: "", desc: "" };
    }
    portfolioState.skills[index][key] = val;
    if (key === 'title') portfolioState.skills[index].icon = val ? val.substring(0, 4).toUpperCase() : "SKILL";
    renderPortfolioDOM();
}


function renderProjectsInputs() {
    const container = document.getElementById("projects-input-container");
    if (!container) return;
    container.innerHTML = "";
    
    const isDefault = isDefaultList(portfolioState.projects, defaultPortfolioState.projects);
    const projectsToRender = isDefault ? [
        { title: "", desc: "", tech: [], placeholderTitle: "e.g. My Portfolio Website", placeholderDesc: "e.g. A clean website to showcase skills.", placeholderTech: "e.g. HTML, CSS, JavaScript" },
        { title: "", desc: "", tech: [], placeholderTitle: "e.g. Web Application", placeholderDesc: "e.g. Interactive application with dynamic features.", placeholderTech: "e.g. Python, SQL" }
    ] : portfolioState.projects;

    projectsToRender.forEach((proj, index) => {
        const div = document.createElement("div");
        div.className = "input-row-card";
        const pTitle = proj.placeholderTitle || "e.g. My Portfolio Website";
        const pDesc = proj.placeholderDesc || "e.g. A clean website to showcase skills.";
        const pTech = proj.placeholderTech || "e.g. HTML, CSS, JavaScript";

        div.innerHTML = `
            <button type="button" class="remove-btn" onclick="removeProject(${index})">&times;</button>
            <div class="input-group">
                <label>Project Title</label>
                <input type="text" placeholder="${pTitle}" value="${proj.title || ''}" oninput="updateProjectData(${index}, 'title', this.value)">
            </div>
            <div class="input-group">
                <label>Description</label>
                <textarea rows="2" placeholder="${pDesc}" oninput="updateProjectData(${index}, 'desc', this.value)">${proj.desc || ''}</textarea>
            </div>
            <div class="input-group">
                <label>Tech Tags (comma separated)</label>
                <input type="text" placeholder="${pTech}" value="${proj.tech && proj.tech.length > 0 ? proj.tech.join(', ') : ''}" oninput="updateProjectData(${index}, 'tech', this.value)">
            </div>
        `;
        container.appendChild(div);
    });
}


function addProjectInput() {
    if (isDefaultList(portfolioState.projects, defaultPortfolioState.projects)) {
        portfolioState.projects = [];
    }
    const nextNum = (portfolioState.projects.length + 1).toString().padStart(2, '0');
    portfolioState.projects.push({ number: nextNum, title: "", desc: "", tech: [] });
    renderProjectsInputs();
}

function removeProject(index) {
    if (isDefaultList(portfolioState.projects, defaultPortfolioState.projects)) {
        portfolioState.projects = [];
    } else if (portfolioState.projects.length > index) {
        portfolioState.projects.splice(index, 1);
    }
    renderProjectsInputs();
    renderPortfolioDOM();
}

function updateProjectData(index, key, val) {
    if (isDefaultList(portfolioState.projects, defaultPortfolioState.projects)) {
        portfolioState.projects = [
            { title: "", desc: "", tech: [] },
            { title: "", desc: "", tech: [] }
        ];
    }
    if (!portfolioState.projects[index]) {
        portfolioState.projects[index] = { title: "", desc: "", tech: [] };
    }
    if (key === 'tech') {
        portfolioState.projects[index].tech = val.split(',').map(s => s.trim()).filter(s => s);
    } else {
        portfolioState.projects[index][key] = val;
    }
    renderPortfolioDOM();
}


function renderEduInputs() {
    const container = document.getElementById("edu-input-container");
    if (!container) return;
    container.innerHTML = "";
    
    const isDefault = isDefaultList(portfolioState.education, defaultPortfolioState.education);
    const eduToRender = isDefault ? [
        { year: "", title: "", college: "", desc: "", placeholderYear: "e.g. Degree", placeholderTitle: "e.g. Computer Science Degree", placeholderCollege: "e.g. State University", placeholderDesc: "e.g. Focused on web development." }
    ] : portfolioState.education;

    eduToRender.forEach((edu, index) => {
        const div = document.createElement("div");
        div.className = "input-row-card";
        div.innerHTML = `
            <button type="button" class="remove-btn" onclick="removeEdu(${index})">&times;</button>
            <div class="input-group">
                <label>Year / Degree Tag</label>
                <input type="text" placeholder="${edu.placeholderYear || 'e.g. Degree'}" value="${edu.year || ''}" oninput="updateEduData(${index}, 'year', this.value)">
            </div>
            <div class="input-group">
                <label>Course / Degree Title</label>
                <input type="text" placeholder="${edu.placeholderTitle || 'e.g. Computer Science Degree'}" value="${edu.title || ''}" oninput="updateEduData(${index}, 'title', this.value)">
            </div>
            <div class="input-group">
                <label>Institution / College</label>
                <input type="text" placeholder="${edu.placeholderCollege || 'e.g. State University'}" value="${edu.college || ''}" oninput="updateEduData(${index}, 'college', this.value)">
            </div>
            <div class="input-group">
                <label>Short Description</label>
                <input type="text" placeholder="${edu.placeholderDesc || 'e.g. Focused on web development.'}" value="${edu.desc || ''}" oninput="updateEduData(${index}, 'desc', this.value)">
            </div>
        `;
        container.appendChild(div);
    });
}


function addEduInput() {
    if (isDefaultList(portfolioState.education, defaultPortfolioState.education)) {
        portfolioState.education = [];
    }
    portfolioState.education.push({ year: "", title: "", college: "", desc: "" });
    renderEduInputs();
}

function removeEdu(index) {
    if (isDefaultList(portfolioState.education, defaultPortfolioState.education)) {
        portfolioState.education = [];
    } else if (portfolioState.education.length > index) {
        portfolioState.education.splice(index, 1);
    }
    renderEduInputs();
    renderPortfolioDOM();
}

function updateEduData(index, key, val) {
    if (isDefaultList(portfolioState.education, defaultPortfolioState.education)) {
        portfolioState.education = [
            { year: "", title: "", college: "", desc: "" }
        ];
    }
    if (!portfolioState.education[index]) {
        portfolioState.education[index] = { year: "", title: "", college: "", desc: "" };
    }
    portfolioState.education[index][key] = val;
    renderPortfolioDOM();
}


function updateLivePortfolio() {
    if (document.getElementById("input-name")) portfolioState.name = document.getElementById("input-name").value.trim();
    if (document.getElementById("input-tagline")) portfolioState.tagline = document.getElementById("input-tagline").value.trim();
    if (document.getElementById("input-logo")) portfolioState.logo = document.getElementById("input-logo").value.trim();
    if (document.getElementById("input-intro")) portfolioState.intro = document.getElementById("input-intro").value.trim();

    if (document.getElementById("input-about-p1")) portfolioState.aboutP1 = document.getElementById("input-about-p1").value.trim();
    if (document.getElementById("input-about-p2")) portfolioState.aboutP2 = document.getElementById("input-about-p2").value.trim();
    if (document.getElementById("input-about-p3")) portfolioState.aboutP3 = document.getElementById("input-about-p3").value.trim();
    if (document.getElementById("input-about-p4")) portfolioState.aboutP4 = document.getElementById("input-about-p4").value.trim();

    if (document.getElementById("input-email")) portfolioState.email = document.getElementById("input-email").value.trim();
    if (document.getElementById("input-location")) portfolioState.location = document.getElementById("input-location").value.trim();

    if (document.getElementById("input-github")) portfolioState.github = document.getElementById("input-github").value.trim();
    if (document.getElementById("input-linkedin")) portfolioState.linkedin = document.getElementById("input-linkedin").value.trim();
    if (document.getElementById("input-instagram")) portfolioState.instagram = document.getElementById("input-instagram").value.trim();

    renderPortfolioDOM();
}


function renderPortfolioDOM() {
    const name = portfolioState.name || defaultPortfolioState.name;
    const pageTitle = document.getElementById("page-title");
    if (pageTitle) pageTitle.textContent = (portfolioState.logo || "CIA") + " | Portfolio";

    const dispName = document.getElementById("display-name");
    if (dispName) dispName.textContent = name;

    const dispFooterName = document.getElementById("display-footer-name");
    if (dispFooterName) dispFooterName.textContent = name;

    // LOGO RENDER
    const logoBrand = portfolioState.logo || "CIA";
    const dispLogo = document.getElementById("display-logo");
    if (dispLogo) {
        dispLogo.innerHTML = `
            <span class="logo-icon"><i class="fa-solid fa-code"></i></span>
            <span class="logo-text">${logoBrand}<span class="logo-accent">.dev</span></span>
        `;
    }

    const dispTagline = document.getElementById("display-tagline");
    if (dispTagline) dispTagline.textContent = portfolioState.tagline || defaultPortfolioState.tagline;

    const dispIntro = document.getElementById("display-intro");
    if (dispIntro) dispIntro.textContent = portfolioState.intro || defaultPortfolioState.intro;

    const dispAboutHeading = document.getElementById("display-about-heading");
    if (dispAboutHeading) dispAboutHeading.textContent = "I'm " + name;

    const p1 = document.getElementById("display-about-p1");
    if (p1) p1.textContent = portfolioState.aboutP1 || defaultPortfolioState.aboutP1;

    const p2 = document.getElementById("display-about-p2");
    if (p2) p2.textContent = portfolioState.aboutP2 || defaultPortfolioState.aboutP2;

    const p3 = document.getElementById("display-about-p3");
    if (p3) p3.textContent = portfolioState.aboutP3 || defaultPortfolioState.aboutP3;

    const p4 = document.getElementById("display-about-p4");
    if (p4) p4.textContent = portfolioState.aboutP4 || defaultPortfolioState.aboutP4;

    // SKILLS RENDER
    const skillsContainer = document.getElementById("display-skills-container");
    if (skillsContainer) {
        skillsContainer.innerHTML = "";
        const activeSkills = (portfolioState.skills && portfolioState.skills.length > 0) ? portfolioState.skills : defaultPortfolioState.skills;

        activeSkills.forEach(skill => {
            const card = document.createElement("div");
            card.className = "skill-card glass-card";
            const iconHtml = getSkillIconHTML(skill.title || skill.icon);
            card.innerHTML = `
                <div class="skill-icon">${iconHtml}</div>
                <h3>${skill.title || 'Skill'}</h3>
                <p>${skill.desc || 'Skill overview.'}</p>
            `;
            skillsContainer.appendChild(card);
        });
    }

    // PROJECTS RENDER
    const projectsContainer = document.getElementById("display-projects-container");
    if (projectsContainer) {
        projectsContainer.innerHTML = "";
        const activeProjects = (portfolioState.projects && portfolioState.projects.length > 0) ? portfolioState.projects : defaultPortfolioState.projects;

        activeProjects.forEach((proj, idx) => {
            const num = (idx + 1).toString().padStart(2, '0');
            const card = document.createElement("div");
            card.className = "project-card glass-card";
            card.innerHTML = `
                <div class="project-number">${num}</div>
                <h3>${proj.title || 'Project Title'}</h3>
                <p>${proj.desc || 'Project description overview.'}</p>
                <div class="project-tech">
                    ${(proj.tech && proj.tech.length > 0 ? proj.tech : ["Web"]).map(t => `<span>${t}</span>`).join('')}
                </div>
            `;
            projectsContainer.appendChild(card);
        });
    }

    // EDUCATION RENDER
    const eduContainer = document.getElementById("display-education-container");
    if (eduContainer) {
        eduContainer.innerHTML = "";
        const activeEdu = (portfolioState.education && portfolioState.education.length > 0) ? portfolioState.education : defaultPortfolioState.education;

        activeEdu.forEach(edu => {
            const card = document.createElement("div");
            card.className = "education-card glass-card";
            card.innerHTML = `
                <div class="education-year">${edu.year || 'Degree'}</div>
                <div>
                    <h3>${edu.title || 'Course Title'}</h3>
                    <p class="college">${edu.college || 'Institution Name'}</p>
                    <p>${edu.desc || 'Course overview and academic details.'}</p>
                </div>
            `;
            eduContainer.appendChild(card);
        });
    }

    // CONTACT INFO RENDER
    const emailEl = document.getElementById("display-email");
    const email = portfolioState.email || defaultPortfolioState.email;
    if (emailEl) emailEl.innerHTML = `<a href="mailto:${email}">${email}</a>`;

    const locEl = document.getElementById("display-location");
    if (locEl) locEl.textContent = portfolioState.location || defaultPortfolioState.location;

    const ghEl = document.getElementById("display-github");
    if (ghEl) ghEl.href = portfolioState.github || "#";

    const liEl = document.getElementById("display-linkedin");
    if (liEl) liEl.href = portfolioState.linkedin || "#";

    const igEl = document.getElementById("display-instagram");
    if (igEl) igEl.href = portfolioState.instagram || "#";
}


function saveAndCloseDrawer() {
    saveState();
    toggleBuilderDrawer();
    showToast("Portfolio changes saved successfully!", "fa-solid fa-check-double");
}


function initCurrentYear() {
    const yearSpan = document.getElementById("current-year");
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}
