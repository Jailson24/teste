/* ============================================================
   SCRIPT.JS — GitHub Pages SAFE
============================================================ */

/* =======================
   1) TEMA
======================= */
function initTheme() {
    const toggle = document.getElementById("themeToggle");
    if (!toggle) return;

    const theme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", theme);
    toggle.textContent = theme === "light" ? "☀️" : "🌙";

    toggle.onclick = () => {
        const newTheme = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        toggle.textContent = newTheme === "light" ? "☀️" : "🌙";
    };
}

/* =======================
   2) SCROLL REVEAL
======================= */
function initScrollReveal() {
    const els = document.querySelectorAll(".reveal");

    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add("visible");
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });

    els.forEach(el => obs.observe(el));
}

/* =======================
   3) CARROSSEL
======================= */
function initCarousel() {
    const track = document.querySelector(".carousel-track");
    const container = document.querySelector(".carousel");
    const prev = document.querySelector(".carousel-btn.prev");
    const next = document.querySelector(".carousel-btn.next");

    if (!track || !container) return;

    const slides = [...track.children];
    let index = 0;
    let auto;

    function update() {
        container.scrollTo({
            left: slides[index].offsetLeft,
            behavior: "smooth"
        });
    }

    function start() {
        auto = setInterval(() => {
            index = (index + 1) % slides.length;
            update();
        }, 4500);
    }

    function reset() {
        clearInterval(auto);
        start();
    }

    next?.addEventListener("click", () => {
        index = (index + 1) % slides.length;
        update();
        reset();
    });

    prev?.addEventListener("click", () => {
        index = (index - 1 + slides.length) % slides.length;
        update();
        reset();
    });

    window.addEventListener("resize", update);
    setTimeout(update, 100);
    start();
}

/* =======================
   4) HEADER
======================= */
function initSmartHeader() {
    const header = document.querySelector(".header");
    if (!header) return;

    const resize = () => header.classList.toggle("is-stack", window.innerWidth < 650);
    window.addEventListener("resize", resize);
    resize();
}

/* =======================
   5) FORMULÁRIOS (SAFE)
======================= */
async function sendFormData(data, scriptId, status, form) {
    const url = document.getElementById(scriptId)?.value;
    if (!url) return;

    status.textContent = "Enviando...";

    await fetch(url, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data)
    });

    status.textContent = "✅ Enviado com sucesso!";
    form.reset();
}

function initForms() {
    const contactForm = document.getElementById("contactForm");
    const reviewForm = document.getElementById("addReviewForm");
    const registerForm = document.getElementById("registerForm");

    contactForm?.addEventListener("submit", e => {
        e.preventDefault();
        sendFormData({
            cName: cName.value,
            cPhone: cPhone.value,
            cMsg: cMsg.value
        }, "scriptId", quoteFormStatus, contactForm);
    });

    reviewForm?.addEventListener("submit", e => {
        e.preventDefault();
        sendFormData({
            rName: rName.value,
            rEmailReview: rEmailReview.value,
            rRating: reviewForm.rating.value,
            rComment: rComment.value
        }, "scriptIdReview", reviewFormStatus, reviewForm);
    });

    registerForm?.addEventListener("submit", e => {
        e.preventDefault();
        sendFormData({
            rFName: rFName.value,
            rLName: rLName.value,
            rDOB: rDOB.value,
            rPhone: rPhone.value,
            rEmail: rEmail.value
        }, "scriptIdRegister", registerFormStatus, registerForm);
    });
}

/* =======================
   6) MODAL CADASTRO
======================= */
function initRegisterModal() {
    const modal = document.getElementById("registerModal");
    const open = document.getElementById("openRegisterModal");
    const close = modal?.querySelector(".modal-close-btn");

    if (!modal || !open || !close) return;

    open.onclick = () => {
        modal.classList.add("is-open");
        document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
        modal.classList.remove("is-open");
        document.body.style.overflow = "";
    };

    close.onclick = closeModal;
    modal.onclick = e => e.target === modal && closeModal();
    document.onkeydown = e => e.key === "Escape" && closeModal();
}

/* =======================
   7) MODAL IMAGEM FULLSCREEN (FUNCIONA!)
======================= */
function initImageModal() {
    const modal = document.getElementById("imageModal");
    const imgModal = document.getElementById("imageModalImg");
    const close = document.querySelector(".image-modal-close");
    const images = document.querySelectorAll(".carousel-track img");

    if (!modal || !imgModal || !close) return;

    images.forEach(img => {
        img.onclick = () => {
            imgModal.src = img.src;
            modal.classList.add("open");
            document.body.style.overflow = "hidden";
        };
    });

    const closeModal = () => {
        modal.classList.remove("open");
        imgModal.src = "";
        document.body.style.overflow = "";
    };

    close.onclick = closeModal;
    modal.onclick = e => e.target === modal && closeModal();
    document.addEventListener("keydown", e => e.key === "Escape" && closeModal());
}

/* =======================
   INIT GERAL
======================= */
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initScrollReveal();
    initCarousel();
    initSmartHeader();
    initForms();
    initRegisterModal();
    initImageModal();
});
