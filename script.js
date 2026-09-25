// ================= MOBILE MENU =================

function toggleMenu() {
    const navLinks = document.querySelector(".nav-links");
    navLinks.classList.toggle("active");
}

const navItems = document.querySelectorAll(".nav-links a");
navItems.forEach(function(item) {
    item.addEventListener("click", function() {
        document.querySelector(".nav-links").classList.remove("active");
    });
});


// ================= CONTACT FORM =================

function sendMessage(event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    alert("Thank you, " + name + "! Your message has been received.");
    document.querySelector(".contact-form").reset();
}


// ================= LIVE PORTFOLIO BUILDER ENGINE =================

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
        { icon: "HTML", title: "HTML", desc: "Creating structured and semantic web pages." },
        { icon: "CSS", title: "CSS", desc: "Designing responsive and attractive websites." },
        { icon: "JS", title: "JavaScript", desc: "Adding functionality and interactivity to websites." },
        { icon: "PY", title: "Python", desc: "Programming, problem solving and application development." },
        { icon: "SQL", title: "SQL", desc: "Working with databases and managing data." },
        { icon: "C++", title: "C++", desc: "Understanding programming concepts and data structures." }
    ],
    projects: [
        { number: "01", title: "Personal Portfolio", desc: "A responsive personal portfolio website created to showcase my skills, projects, education and contact information.", tech: ["HTML", "CSS", "JavaScript"] },
        { number: "02", title: "Hotel Management System", desc: "A database-based project designed to manage guests, rooms and booking information efficiently.", tech: ["SQL", "Database"] },
        { number: "03", title: "Web Development Project", desc: "A responsive web application created to practice front-end development and user interface design.", tech: ["HTML", "CSS", "JavaScript"] }
    ],
    education: [
        { year: "BCA", title: "Bachelor of Computer Applications", college: "Noorul Islam Centre for Higher Education", desc: "Currently pursuing BCA with an interest in Full Stack Development, programming and database technologies." },
        { year: "12th", title: "Higher Secondary Education", college: "St. Mary's Higher Secondary School, Colachel", desc: "Completed Higher Secondary Education." },
        { year: "10th", title: "Secondary Education", college: "St. Mary's Higher Secondary School, Colachel", desc: "Completed Secondary Education." }
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
    renderPortfolioDOM();
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
    if (saved) {
        document.getElementById("input-name").value = portfolioState.name || "";
        document.getElementById("input-tagline").value = portfolioState.tagline || "";
        document.getElementById("input-logo").value = portfolioState.logo || "";
        document.getElementById("input-intro").value = portfolioState.intro || "";

        document.getElementById("input-about-p1").value = portfolioState.aboutP1 || "";
        document.getElementById("input-about-p2").value = portfolioState.aboutP2 || "";
        document.getElementById("input-about-p3").value = portfolioState.aboutP3 || "";
        document.getElementById("input-about-p4").value = portfolioState.aboutP4 || "";

        document.getElementById("input-email").value = portfolioState.email || "";
        document.getElementById("input-location").value = portfolioState.location || "";
        document.getElementById("input-github").value = portfolioState.github || "";
        document.getElementById("input-linkedin").value = portfolioState.linkedin || "";
        document.getElementById("input-instagram").value = portfolioState.instagram || "";
    } else {
        const inputs = document.querySelectorAll("#builder-drawer input, #builder-drawer textarea");
        inputs.forEach(input => input.value = "");
    }

    renderSkillsInputs();
    renderProjectsInputs();
    renderEduInputs();
}


function clearAllInputsToPlaceholders() {
    const inputs = document.querySelectorAll("#builder-drawer input, #builder-drawer textarea");
    inputs.forEach(input => input.value = "");
    
    portfolioState.skills = [];
    portfolioState.projects = [];
    portfolioState.education = [];

    renderSkillsInputs();
    renderProjectsInputs();
    renderEduInputs();

    updateLivePortfolio();
}


function renderSkillsInputs() {
    const container = document.getElementById("skills-input-container");
    container.innerHTML = "";
    
    const skillsToRender = portfolioState.skills.length > 0 ? portfolioState.skills : [
        { title: "", desc: "", placeholderTitle: "e.g. HTML", placeholderDesc: "e.g. Making the structure of web pages." },
        { title: "", desc: "", placeholderTitle: "e.g. CSS", placeholderDesc: "e.g. Styling web pages with colors and layouts." },
        { title: "", desc: "", placeholderTitle: "e.g. JavaScript", placeholderDesc: "e.g. Adding interactive features and buttons." }
    ];

    skillsToRender.forEach((skill, index) => {
        const div = document.createElement("div");
        div.className = "input-row-card";
        const pTitle = skill.placeholderTitle || "e.g. HTML";
        const pDesc = skill.placeholderDesc || "e.g. Making the structure of web pages.";

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
    portfolioState.skills.push({ icon: "SKILL", title: "", desc: "" });
    renderSkillsInputs();
}

function removeSkill(index) {
    if (portfolioState.skills.length > index) {
        portfolioState.skills.splice(index, 1);
    }
    renderSkillsInputs();
    renderPortfolioDOM();
}

function updateSkillData(index, key, val) {
    if (!portfolioState.skills[index]) {
        portfolioState.skills[index] = { icon: "SKILL", title: "", desc: "" };
    }
    portfolioState.skills[index][key] = val;
    if (key === 'title') portfolioState.skills[index].icon = val ? val.substring(0, 4).toUpperCase() : "SKILL";
    renderPortfolioDOM();
}


function renderProjectsInputs() {
    const container = document.getElementById("projects-input-container");
    container.innerHTML = "";
    
    const projectsToRender = portfolioState.projects.length > 0 ? portfolioState.projects : [
        { title: "", desc: "", tech: [], placeholderTitle: "e.g. My Portfolio Website", placeholderDesc: "e.g. A clean website to showcase my skills and work.", placeholderTech: "e.g. HTML, CSS, JavaScript" },
        { title: "", desc: "", tech: [], placeholderTitle: "e.g. Online Store App", placeholderDesc: "e.g. A shopping website to browse items and check out.", placeholderTech: "e.g. Python, SQL" }
    ];

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
    const nextNum = (portfolioState.projects.length + 1).toString().padStart(2, '0');
    portfolioState.projects.push({ number: nextNum, title: "", desc: "", tech: [] });
    renderProjectsInputs();
}

function removeProject(index) {
    if (portfolioState.projects.length > index) {
        portfolioState.projects.splice(index, 1);
    }
    renderProjectsInputs();
    renderPortfolioDOM();
}

function updateProjectData(index, key, val) {
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
    container.innerHTML = "";
    
    const eduToRender = portfolioState.education.length > 0 ? portfolioState.education : [
        { year: "", title: "", college: "", desc: "", placeholderYear: "e.g. Degree", placeholderTitle: "e.g. Computer Science Degree", placeholderCollege: "e.g. State University", placeholderDesc: "e.g. Focused on web development." }
    ];

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
    portfolioState.education.push({ year: "", title: "", college: "", desc: "" });
    renderEduInputs();
}

function removeEdu(index) {
    if (portfolioState.education.length > index) {
        portfolioState.education.splice(index, 1);
    }
    renderEduInputs();
    renderPortfolioDOM();
}

function updateEduData(index, key, val) {
    if (!portfolioState.education[index]) {
        portfolioState.education[index] = { year: "", title: "", college: "", desc: "" };
    }
    portfolioState.education[index][key] = val;
    renderPortfolioDOM();
}


function updateLivePortfolio() {
    portfolioState.name = document.getElementById("input-name").value.trim();
    portfolioState.tagline = document.getElementById("input-tagline").value.trim();
    portfolioState.logo = document.getElementById("input-logo").value.trim();
    portfolioState.intro = document.getElementById("input-intro").value.trim();

    portfolioState.aboutP1 = document.getElementById("input-about-p1").value.trim();
    portfolioState.aboutP2 = document.getElementById("input-about-p2").value.trim();
    portfolioState.aboutP3 = document.getElementById("input-about-p3").value.trim();
    portfolioState.aboutP4 = document.getElementById("input-about-p4").value.trim();

    portfolioState.email = document.getElementById("input-email").value.trim();
    portfolioState.location = document.getElementById("input-location").value.trim();

    portfolioState.github = document.getElementById("input-github").value.trim();
    portfolioState.linkedin = document.getElementById("input-linkedin").value.trim();
    portfolioState.instagram = document.getElementById("input-instagram").value.trim();

    renderPortfolioDOM();
}


function renderPortfolioDOM() {
    const name = portfolioState.name || defaultPortfolioState.name;
    document.getElementById("page-title").textContent = (portfolioState.logo || "CIA") + " | Portfolio";
    document.getElementById("display-name").textContent = name;
    document.getElementById("display-footer-name").textContent = name;

    // LOGO RENDER - CIA.dev
    const logoBrand = portfolioState.logo || "CIA";
    document.getElementById("display-logo").innerHTML = `
        <span class="logo-icon"><i class="fa-solid fa-code"></i></span>
        <span class="logo-text">${logoBrand}<span class="logo-accent">.dev</span></span>
    `;

    document.getElementById("display-tagline").textContent = portfolioState.tagline || defaultPortfolioState.tagline;
    document.getElementById("display-intro").textContent = portfolioState.intro || defaultPortfolioState.intro;

    document.getElementById("display-about-heading").textContent = "I'm " + name;
    document.getElementById("display-about-p1").textContent = portfolioState.aboutP1 || defaultPortfolioState.aboutP1;
    document.getElementById("display-about-p2").textContent = portfolioState.aboutP2 || defaultPortfolioState.aboutP2;
    document.getElementById("display-about-p3").textContent = portfolioState.aboutP3 || defaultPortfolioState.aboutP3;
    document.getElementById("display-about-p4").textContent = portfolioState.aboutP4 || defaultPortfolioState.aboutP4;

    const skillsContainer = document.getElementById("display-skills-container");
    skillsContainer.innerHTML = "";
    const activeSkills = (portfolioState.skills && portfolioState.skills.length > 0) ? portfolioState.skills : defaultPortfolioState.skills;

    activeSkills.forEach(skill => {
        const card = document.createElement("div");
        card.className = "skill-card";
        card.innerHTML = `
            <div class="skill-icon">${skill.icon || (skill.title ? skill.title.substring(0, 4).toUpperCase() : 'SKILL')}</div>
            <h3>${skill.title || 'Skill'}</h3>
            <p>${skill.desc || 'Skill description.'}</p>
        `;
        skillsContainer.appendChild(card);
    });

    const projectsContainer = document.getElementById("display-projects-container");
    projectsContainer.innerHTML = "";
    const activeProjects = (portfolioState.projects && portfolioState.projects.length > 0) ? portfolioState.projects : defaultPortfolioState.projects;

    activeProjects.forEach((proj, idx) => {
        const num = (idx + 1).toString().padStart(2, '0');
        const card = document.createElement("div");
        card.className = "project-card";
        card.innerHTML = `
            <div class="project-number">${num}</div>
            <h3>${proj.title || 'Project Title'}</h3>
            <p>${proj.desc || 'Project description.'}</p>
            <div class="project-tech">
                ${(proj.tech && proj.tech.length > 0 ? proj.tech : ["Web"]).map(t => `<span>${t}</span>`).join('')}
            </div>
        `;
        projectsContainer.appendChild(card);
    });

    const eduContainer = document.getElementById("display-education-container");
    eduContainer.innerHTML = "";
    const activeEdu = (portfolioState.education && portfolioState.education.length > 0) ? portfolioState.education : defaultPortfolioState.education;

    activeEdu.forEach(edu => {
        const card = document.createElement("div");
        card.className = "education-card";
        card.innerHTML = `
            <div class="education-year">${edu.year || 'Degree'}</div>
            <div>
                <h3>${edu.title || 'Course Title'}</h3>
                <p class="college">${edu.college || 'Institution Name'}</p>
                <p>${edu.desc || 'Course overview.'}</p>
            </div>
        `;
        eduContainer.appendChild(card);
    });

    const emailEl = document.getElementById("display-email");
    const email = portfolioState.email || defaultPortfolioState.email;
    emailEl.innerHTML = `<a href="mailto:${email}">${email}</a>`;

    document.getElementById("display-location").textContent = portfolioState.location || defaultPortfolioState.location;

    document.getElementById("display-github").href = portfolioState.github || "#";
    document.getElementById("display-linkedin").href = portfolioState.linkedin || "#";
    document.getElementById("display-instagram").href = portfolioState.instagram || "#";
}


function saveAndCloseDrawer() {
    saveState();
    toggleBuilderDrawer();
}


function initCurrentYear() {
    const yearSpan = document.getElementById("current-year");
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}
