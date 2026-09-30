window.siteReady = true; // indique au HTML que le script a bien démarré

// ==========================================
// 0. ANIMATIONS AU DÉFILEMENT (REVEAL)
// En premier : même si une autre partie du script plante, le site reste visible
// ==========================================
if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            el.classList.add('visible');
            observer.unobserve(el); // l'animation ne se joue qu'une fois

            // Une fois l'animation finie, on retire les classes pour ne pas gêner les effets :hover
            setTimeout(() => el.classList.remove('reveal', 'visible'), 1500);
        });
    }, { root: null, rootMargin: '0px 0px -15% 0px', threshold: 0 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

// ==========================================
// 1. MENU BURGER (MOBILE)
// ==========================================
const btnBurger = document.getElementById('btn-burger');
const burgerIcon = btnBurger.querySelector('i');
const navTabs = document.getElementById('nav-tabs');
const menuLinks = document.querySelectorAll('.tab-btn');

// Ouvre/ferme le menu et met à jour l'icône + l'accessibilité
function setMenu(open) {
    navTabs.classList.toggle('open', open);
    burgerIcon.classList.toggle('fa-bars', !open);
    burgerIcon.classList.toggle('fa-xmark', open);
    btnBurger.setAttribute('aria-expanded', open);
    btnBurger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
}

btnBurger.addEventListener('click', () => {
    setMenu(!navTabs.classList.contains('open'));
});

// Referme le menu quand on clique sur un lien
menuLinks.forEach(link => link.addEventListener('click', () => setMenu(false)));

// Referme le menu quand on clique en dehors
document.addEventListener('click', (e) => {
    if (!navTabs.contains(e.target) && !btnBurger.contains(e.target)) setMenu(false);
});

// Referme le menu si on passe en mode PC (rotation, redimensionnement)
window.matchMedia('(min-width: 901px)').addEventListener('change', (e) => {
    if (e.matches) setMenu(false);
});

// ==========================================
// 2. POP-UP CALENDLY (RÉSERVATION)
// ==========================================
const modalCalendly = document.getElementById('calendly-modal');
const btnCloseCalendly = document.getElementById('btn-close-modal');
const btnsReserver = document.querySelectorAll('.btn-reserver');

function openCalendly() {
    modalCalendly.classList.remove('hidden');
    document.body.classList.add('no-scroll');
}

function closeCalendly() {
    modalCalendly.classList.add('hidden');
    document.body.classList.remove('no-scroll');
}

btnsReserver.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        openCalendly();
    });
});

if (btnCloseCalendly) btnCloseCalendly.addEventListener('click', closeCalendly);

// Fermer en cliquant à l'extérieur de la boîte blanche
if (modalCalendly) {
    modalCalendly.addEventListener('click', (e) => {
        if (e.target === modalCalendly) closeCalendly();
    });
}

// ==========================================
// 3. LIGHTBOX (AGRANDISSEMENT GALERIE)
// ==========================================
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxVideo = document.getElementById('lightbox-video');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

let lightboxGroup = [];   // liste des éléments qu'on peut faire défiler
let lightboxIndex = 0;    // position actuelle dans cette liste

function stopLightboxVideo() {
    lightboxVideo.pause();
    lightboxVideo.removeAttribute('src');
    lightboxVideo.load(); // arrête vraiment le téléchargement
}

function showLightboxItem(index) {
    // Le modulo permet de boucler : après la dernière photo, on revient à la première
    lightboxIndex = (index + lightboxGroup.length) % lightboxGroup.length;
    const item = lightboxGroup[lightboxIndex];

    if (item.tagName === 'VIDEO') {
        lightboxImg.style.display = 'none';
        lightboxVideo.src = item.currentSrc || item.src;
        lightboxVideo.style.display = 'block';
        lightboxVideo.play().catch(() => {});
    } else {
        stopLightboxVideo();
        lightboxVideo.style.display = 'none';
        lightboxImg.src = item.src;
        lightboxImg.alt = item.alt;
        lightboxImg.style.display = 'block';
    }

    // Pas de flèches s'il n'y a qu'un seul élément (les réels)
    const single = lightboxGroup.length < 2;
    lightboxPrev.style.display = single ? 'none' : '';
    lightboxNext.style.display = single ? 'none' : '';
}

function openLightbox(group, index) {
    lightboxGroup = group;
    showLightboxItem(index);
    lightboxModal.classList.remove('hidden');
    document.body.classList.add('no-scroll');
}

function closeLightbox() {
    lightboxModal.classList.add('hidden');
    stopLightboxVideo();
    document.body.classList.remove('no-scroll');
}

// Photos : chaque carrousel forme son propre groupe
document.querySelectorAll('.vitrine-scroll').forEach(scroller => {
    const photos = Array.from(scroller.querySelectorAll('.photo-box'));
    photos.forEach((photo, i) => {
        photo.addEventListener('click', () => openLightbox(photos, i));
    });
});

// Vidéos (Réels)
document.querySelectorAll('.reel-video').forEach(video => {
    video.addEventListener('click', () => openLightbox([video], 0));
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => showLightboxItem(lightboxIndex - 1));
lightboxNext.addEventListener('click', () => showLightboxItem(lightboxIndex + 1));

// Clic sur le fond noir = fermer
lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightbox();
});

// Swipe gauche/droite sur téléphone
let touchStartX = 0;
lightboxModal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
}, { passive: true });
lightboxModal.addEventListener('touchend', (e) => {
    if (lightboxGroup.length < 2) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) showLightboxItem(lightboxIndex + (dx < 0 ? 1 : -1));
}, { passive: true });

// Clavier : Échap pour fermer, flèches pour naviguer
document.addEventListener('keydown', (e) => {
    const lightboxOpen = !lightboxModal.classList.contains('hidden');

    if (e.key === 'Escape') {
        if (lightboxOpen) closeLightbox();
        else if (!modalCalendly.classList.contains('hidden')) closeCalendly();
        setMenu(false);
    }
    if (lightboxOpen && lightboxGroup.length > 1) {
        if (e.key === 'ArrowLeft') showLightboxItem(lightboxIndex - 1);
        if (e.key === 'ArrowRight') showLightboxItem(lightboxIndex + 1);
    }
});

// ==========================================
// 4. FLÈCHES DES CARROUSELS (PC)
// ==========================================
document.querySelectorAll('.carousel-container').forEach(container => {
    const scroller = container.querySelector('.vitrine-scroll');
    const prev = container.querySelector('.prev-btn');
    const next = container.querySelector('.next-btn');
    const step = () => scroller.clientWidth * 0.8;

    prev.addEventListener('click', () => scroller.scrollBy({ left: -step(), behavior: 'smooth' }));
    next.addEventListener('click', () => scroller.scrollBy({ left: step(), behavior: 'smooth' }));
});

// ==========================================
// 5. VIDÉOS : LECTURE SEULEMENT QUAND VISIBLES
// ==========================================
const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.play().catch(() => {});
        else entry.target.pause();
    });
}, { threshold: 0.4 });

document.querySelectorAll('.reel-video').forEach(video => videoObserver.observe(video));

// ==========================================
// 6. SCROLL SPY (section active dans le menu)
// ==========================================
const sections = document.querySelectorAll('.page-section');
const navLinksSpy = document.querySelectorAll('.tab-btn');

// On surveille la ligne au milieu de l'écran : la section qui la croise est l'active
const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinksSpy.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.tab-btn[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
    });
}, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });

sections.forEach(section => spyObserver.observe(section));

// ==========================================
// 7. FORMULAIRE DE CONTACT
// ==========================================
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

function setStatus(message, type = '') {
    formStatus.textContent = message;
    formStatus.className = type; // 'success', 'error' ou vide
}

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btnSubmit = contactForm.querySelector('button[type="submit"]');
        btnSubmit.disabled = true;
        setStatus('Envoi en cours…');

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            });
            if (!response.ok) throw new Error('Erreur serveur');
            setStatus('Message envoyé ! Merci, je vous réponds vite.', 'success');
            contactForm.reset();
            if (document.activeElement) document.activeElement.blur(); // ferme le clavier
        } catch (err) {
            setStatus("L'envoi a échoué. Réessayez ou écrivez-moi par email.", 'error');
        } finally {
            btnSubmit.disabled = false;
            formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}
