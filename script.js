/* ============================================================
   SCRIPT.JS — Código Completo
============================================================ */

/* ============================================================
   1) TEMA ESCURO/CLARO
============================================================ */
function initTheme() {
    const toggle = document.getElementById("themeToggle");
    if (!toggle) return;

    const saved = localStorage.getItem("theme");
    const currentTheme = saved || "dark";

    document.documentElement.setAttribute("data-theme", currentTheme);
    toggle.textContent = currentTheme === "light" ? "☀️" : "🌙";

    toggle.addEventListener("click", () => {
        const isLight = document.documentElement.getAttribute("data-theme") === "light";
        const newTheme = isLight ? "dark" : "light";

        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        toggle.textContent = newTheme === "light" ? "☀️" : "🌙";
    });
}

/* ============================================================
   2) SCROLL REVEAL
============================================================ */
function initScrollReveal() {
    const els = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    els.forEach(el => observer.observe(el));
}

/* ============================================================
   3) CARROSSEL AUTOMÁTICO
============================================================ */
function initCarousel() {
    const track = document.querySelector(".carousel-track");
    const container = document.querySelector(".carousel");
    const prev = document.querySelector(".carousel-btn.prev");
    const next = document.querySelector(".carousel-btn.next");

    if (!track || !container) return;

    const slides = [...track.children];
    let index = 0;
    let autoPlay;

    function update() {
        const slide = slides[index];
        if (!slide) return;

        container.scrollTo({
            left: slide.offsetLeft,
            behavior: "smooth"
        });
    }

    function startAutoPlay() {
        autoPlay = setInterval(() => {
            index = (index + 1) % slides.length;
            update();
        }, 4500);
    }

    function resetAutoPlay() {
        clearInterval(autoPlay);
        startAutoPlay();
    }

    next?.addEventListener("click", () => {
        index = (index + 1) % slides.length;
        update();
        resetAutoPlay();
    });

    prev?.addEventListener("click", () => {
        index = (index - 1 + slides.length) % slides.length;
        update();
        resetAutoPlay();
    });

    window.addEventListener("resize", update);

    setTimeout(update, 100);
    startAutoPlay();
}

/* ============================================================
   4) HEADER RESPONSIVO
============================================================ */
function initSmartHeader() {
    const header = document.querySelector(".header");
    if (!header) return;

    const resize = () => {
        header.classList.toggle("is-stack", window.innerWidth < 650);
    };

    window.addEventListener("resize", resize);
    resize();
}

/* ============================================================
   5) FORMULÁRIOS
============================================================ */
async function sendFormData(data, type, status, form) {
    const id =
        type === "review" ? "scriptIdReview" :
        type === "register" ? "scriptIdRegister" :
        "scriptId";

    const url = document.getElementById(id)?.value;
    if (!url) return;

    status.textContent = "Enviando...";

    await fetch(url, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ formType: type, ...data })
    });

    status.textContent = "✅ Enviado com sucesso!";
    form.reset();
}

function initQuoteForm() {
    contactForm?.addEventListener("submit", e => {
        e.preventDefault();
        sendFormData({
            cName: cName.value,
            cPhone: cPhone.value,
            cMsg: cMsg.value
        }, "quote", quoteFormStatus, contactForm);
    });
}

function initReviewForm() {
    addReviewForm?.addEventListener("submit", e => {
        e.preventDefault();
        sendFormData({
            rName: rName.value,
            rEmailReview: rEmailReview.value,
            rRating: addReviewForm.rating.value,
            rComment: rComment.value
        }, "review", reviewFormStatus, addReviewForm);
    });
}

function initRegisterForm() {
    registerForm?.addEventListener("submit", e => {
        e.preventDefault();
        sendFormData({
            rFName: rFName.value,
            rLName: rLName.value,
            rDOB: rDOB.value,
            rPhone: rPhone.value,
            rEmail: rEmail.value
        }, "register", registerFormStatus, registerForm);
    });
}

/* ============================================================
   6) MODAL DE CADASTRO
============================================================ */
function initModal() {
    const modal = document.getElementById("registerModal");
    const openBtn = document.getElementById("openRegisterModal");
    const closeBtn = modal?.querySelector(".modal-close-btn");

    if (!modal || !openBtn || !closeBtn) return;

    const open = () => {
        modal.classList.add("is-open");
        document.body.style.overflow = "hidden";
    };

    const close = () => {
        modal.classList.remove("is-open");
        document.body.style.overflow = "";
    };

    openBtn.addEventListener("click", open);
    closeBtn.addEventListener("click", close);

    modal.addEventListener("click", e => {
        if (e.target === modal) close();
    });

    document.addEventListener("keydown", e => {
        if (e.key === "Escape" && modal.classList.contains("is-open")) close();
    });
}

/* ============================================================
   7) MODAL IMAGEM FULLSCREEN (CARROSSEL)
============================================================ */
function initImageModal() {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("imageModalImg");
    const closeBtn = document.querySelector(".image-modal-close");
    const images = document.querySelectorAll(".carousel-track img");

    if (!modal || !modalImg || !closeBtn) return;

    images.forEach(img => {
        img.addEventListener("click", () => {
            modalImg.src = img.src;
            modal.classList.add("open");
            document.body.style.overflow = "hidden";
        });
    });

    function close() {
        modal.classList.remove("open");
        modalImg.src = "";
        document.body.style.overflow = "";
    }

    closeBtn.addEventListener("click", close);

    modal.addEventListener("click", e => {
        if (e.target === modal) close();
    });

    document.addEventListener("keydown", e => {
        if (e.key === "Escape" && modal.classList.contains("open")) close();
    });
}

/* ============================================================
   EXECUÇÃO GERAL
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initScrollReveal();
    initCarousel();
    initSmartHeader();
    initQuoteForm();
    initReviewForm();
    initRegisterForm();
    initModal();
    initImageModal();
});
