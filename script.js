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

// Ouvre la fenêtre au clic
btnsReserver.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        openCalendly();
    });
});

// Ferme la fenêtre (croix)
btnCloseCalendly.addEventListener('click', closeCalendly);

// Ferme en cliquant à l'extérieur de la boîte blanche
modalCalendly.addEventListener('click', (e) => {
    if (e.target === modalCalendly) closeCalendly();
});

// ==========================================
// 3. LIGHTBOX (AGRANDISSEMENT GALERIE)
// ==========================================
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxVideo = document.getElementById('lightbox-video');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

let lightboxGroup = [];   // la liste d'éléments qu'on peut faire défiler
let lightboxIndex = 0;    // la position actuelle dans cette liste

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
// 6. SCROLL SPY (Détection de la section active)
// ==========================================
const sections = document.querySelectorAll('.page-section');
const navLinksSpy = document.querySelectorAll('.tab-btn');

// On surveille la ligne au milieu de l'écran : la section qui la croise est l'active.
// (Marche même pour une section très haute comme la Vitrine.)
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
// 7. ANIMATIONS AU DÉFILEMENT (REVEAL)
// ==========================================
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('visible');
        observer.unobserve(el); // l'animation ne se joue qu'une fois

        // Une fois l'animation terminée, on retire les classes pour
        // qu'elles n'interfèrent plus avec les effets :hover
        setTimeout(() => el.classList.remove('reveal', 'visible'), 1500);
    });
}, { root: null, rootMargin: '0px 0px -15% 0px', threshold: 0 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ==========================================
// 8. FORMULAIRE DE CONTACT (envoi sans quitter le site)
// ==========================================
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btnSubmit = contactForm.querySelector('button[type="submit"]');
    btnSubmit.disabled = true;
    formStatus.textContent = 'Envoi en cours…';

    try {
        const response = await fetch(contactForm.action, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) throw new Error('Erreur serveur');
        formStatus.textContent = 'Message envoyé ! Merci, je vous réponds vite.';
        contactForm.reset();
    } catch (err) {
        formStatus.textContent = "L'envoi a échoué. Réessayez ou écrivez-moi par email.";
    } finally {
        btnSubmit.disabled = false;
    }
});/* VARIABLES GLOBALES */
:root {
    --bg-color: #ffffff;
    --text-color: #000000;
    --subtext-color: #555555;
    --card-bg: #f8f8f8;
    --btn-bg: #000000;
    --btn-text: #ffffff;
    --border: #e0e0e0;
}

html {
    scroll-behavior: smooth; /* Glissement doux pour le menu */
    scroll-padding-top: 75px; /* Les titres ne se cachent plus sous la navbar */
}

* { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Montserrat', sans-serif; }

body { 
    background-color: var(--bg-color); 
    color: var(--text-color); 
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    min-height: 100dvh;
    overflow-x: hidden; 
}

/* Bloque le défilement du site en arrière-plan (pour la modale) */
body.no-scroll {
    overflow: hidden !important;
}

/* NAVBAR APPLE STYLE (Effet Verre Dépoli) */
.navbar {
    display: flex; justify-content: space-between; align-items: center;
    padding: 15px 30px; 
    border-bottom: none; 
    background-color: rgba(255, 255, 255, 0.75); 
    backdrop-filter: blur(12px); 
    -webkit-backdrop-filter: blur(12px); 
    position: sticky; 
    top: 0;
    z-index: 1000;
}

/* LOGO EN CERCLE */
.logo { 
    height: 45px; 
    width: 45px; 
    object-fit: contain; 
    background-color: #ffffff; 
    border-radius: 50%; 
    padding: 8px; 
    box-shadow: 0 4px 10px rgba(0,0,0,0.08); 
}

/* MENU CENTRÉ */
.nav-tabs { 
    display: flex; 
    gap: 40px; 
    position: absolute; 
    left: 50%; 
    transform: translateX(-50%); 
}

/* LIENS DU MENU ET ANIMATION DU TRAIT */
.tab-btn {
    background: none; border: none; color: #555555;
    font-weight: 700; font-size: 0.95rem;
    text-transform: uppercase; cursor: pointer; transition: color 0.3s;
    text-decoration: none; 
    position: relative; 
    padding-bottom: 5px;
}

.tab-btn:hover, .tab-btn.active { 
    color: #000000; 
}

.tab-btn::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #000000;
    transform: scaleX(0); 
    transform-origin: right;
    transition: transform 0.3s ease; 
}

.tab-btn:hover::after, .tab-btn.active::after {
    transform: scaleX(1); 
    transform-origin: left;
}

.burger-menu { display: none; }

/* ZONE CENTRALE */
.app-container {
    flex-grow: 1; 
    display: flex; 
    flex-direction: column; 
    width: 100%;
}

/* SECTIONS ZÉBRÉES */
.page-section {
    width: 100%;
    padding: 100px 20px; 
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.section-blanc {
    --bg-color: #ffffff;
    --text-color: #000000;
    --subtext-color: #555555;
    --card-bg: #f8f8f8;
    --btn-bg: #000000;
    --btn-text: #ffffff;
    --border: #e0e0e0;
    background-color: var(--bg-color);
    color: var(--text-color);
}

.section-noire {
    --bg-color: #0a0a0a;
    --text-color: #ffffff;
    --subtext-color: #a0a0a0;
    --card-bg: #151515;
    --btn-bg: #ffffff;
    --btn-text: #000000;
    --border: #222222;
    background-color: var(--bg-color);
    color: var(--text-color);
}

/* ACCUEIL HERO : Prend tout l'écran */
#accueil {
    min-height: calc(100vh - 75px); /* Hauteur de l'écran moins la barre de navigation */
    min-height: calc(100svh - 75px); /* Version adaptée aux barres d'adresse mobiles */
    justify-content: center; /* Centre le titre et le bouton verticalement */
    border-bottom: 1px solid var(--border); /* Ligne de séparation élégante avec la section concept */
    padding-top: 0;
    padding-bottom: 0;
}

h1 { font-size: 4rem; font-weight: 900; letter-spacing: 4px; margin-top: 0; margin-bottom: 15px; }
h2 { font-size: 1.1rem; color: var(--subtext-color); margin-bottom: 15px; font-weight: 500; }
.section-titre { font-size: 1.6rem; font-weight: 900; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; color: var(--text-color); }

/* LE TEXTE DU CONCEPT */
.concept-text {
    color: var(--subtext-color);
    max-width: 800px;
    margin: 20px auto 0 auto;
    font-size: 1.15rem;
    line-height: 1.8;
}

/* BOUTON PRINCIPAL */
.btn-principal {
    background-color: var(--btn-bg); color: var(--btn-text);
    padding: 18px 45px; font-size: 1.1rem; font-weight: 900;
    border: none; 
    border-radius: 6px; 
    cursor: pointer;
    text-transform: uppercase; transition: transform 0.2s;
    margin-bottom: 50px;
}

/* TARIFS - DESIGN PREMIUM TYPOGRAPHIQUE */
.tarifs-premium-container {
    display: flex; align-items: center; justify-content: space-between; gap: 80px; max-width: 1000px; width: 100%; margin: 0 auto; text-align: left;
}
.premium-price-side {
    flex: 1; padding-right: 40px; border-right: 1px solid var(--border);
}
.premium-label { text-transform: uppercase; letter-spacing: 4px; font-size: 0.85rem; color: var(--subtext-color); font-weight: 700; }
.premium-chiffre { font-size: 9rem; font-weight: 900; line-height: 1; margin: 15px 0 25px 0; color: var(--text-color); letter-spacing: -4px; }
.premium-desc { color: var(--subtext-color); font-size: 1.05rem; line-height: 1.6; margin-bottom: 40px; max-width: 350px; }
.premium-paiement { display: flex; flex-wrap: wrap; gap: 15px; align-items: center; color: var(--text-color); font-size: 0.85rem; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; }
.premium-paiement .dot { color: var(--border); }

.premium-services-side { flex: 1; width: 100%; }
.premium-list { list-style: none; padding: 0; margin: 0; }
.premium-list li {
    display: flex; justify-content: space-between; align-items: center;
    padding: 22px 0; border-bottom: 1px solid var(--border);
    color: var(--text-color); font-size: 1.25rem; font-weight: 600; transition: padding-left 0.3s ease, border-color 0.3s ease;
}
.premium-list li:hover { padding-left: 10px; border-bottom-color: var(--text-color); }
.premium-list li span { font-size: 0.75rem; color: var(--subtext-color); text-transform: uppercase; letter-spacing: 2px; font-weight: 700; }

/* VITRINE */
.vitrine-row { display: flex; gap: clamp(20px, 4vw, 60px); align-items: flex-start; margin-bottom: 40px; text-align: left; max-width: 1000px; width: 100%; }
.vitrine-reel { flex: 0 0 clamp(200px, 20vw, 300px); }
.reel-box { width: 100%; height: auto; aspect-ratio: 9 / 16; border-radius: 6px; background-color: #111; border: 4px solid var(--border); position: relative; overflow: hidden; display: flex; justify-content: center; align-items: center; box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
.reel-video { width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0; z-index: 2; cursor: pointer; }

.vitrine-photos { flex: 1; min-width: 0; }
.vitrine-photos h4 { margin-bottom: 25px; font-size: 1.5rem; font-weight: 900; text-transform: uppercase; margin-top: 0; color: var(--text-color); }

.carousel-container { position: relative; display: flex; align-items: center; }
.carousel-btn { background-color: var(--btn-bg); color: var(--btn-text); border: none; width: 45px; height: 45px; border-radius: 50%; cursor: pointer; font-size: 1.2rem; display: flex; justify-content: center; align-items: center; position: absolute; z-index: 10; transition: transform 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
.prev-btn { left: -15px; }
.next-btn { right: -15px; }

.vitrine-scroll::-webkit-scrollbar { display: none; }
.vitrine-scroll { display: flex; gap: 20px; overflow-x: auto; padding-bottom: 10px; scroll-snap-type: x mandatory; -ms-overflow-style: none; scrollbar-width: none; }
.photo-box { height: clamp(250px, 35vh, 360px); width: auto; aspect-ratio: 3 / 4; flex: 0 0 auto; border-radius: 6px; object-fit: cover; scroll-snap-align: center; border: 1px solid var(--border); cursor: pointer; transition: transform 0.2s; }

.vitrine-divider { border: none; border-top: 1px solid var(--border); margin: clamp(30px, 6vw, 60px) 0; width: 100%; max-width: 1000px;}

/* CONTACT */
.contact-card { background-color: var(--card-bg); border: 1px solid var(--border); border-radius: 6px; padding: 40px; max-width: 700px; width: 100%; margin: 0 auto; }
.form-contact { display: flex; flex-direction: column; gap: 15px; }
.form-row { display: flex; gap: 15px; }
.form-row input { flex: 1; }
.form-contact input, .form-contact textarea { width: 100%; padding: 14px; border-radius: 4px; border: 1px solid var(--border); background-color: var(--bg-color); color: var(--text-color); font-family: 'Montserrat', sans-serif; font-size: 1rem; outline: none; transition: border-color 0.3s; }
.form-contact input:focus, .form-contact textarea:focus { border-color: var(--text-color); }
.form-contact textarea { min-height: 120px; resize: none; }

/* FOOTER PRO */
.site-footer {
    background-color: #0a0a0a;
    color: #ffffff;
    width: 100%;
    padding: 60px 40px 20px 40px;
    box-sizing: border-box;
}
.footer-container { display: flex; justify-content: space-between; flex-wrap: wrap; max-width: 1100px; margin: 0 auto; gap: 40px; }
.footer-col { flex: 1; min-width: 250px; text-align: left; }
.footer-col h4 { font-size: 1.1rem; font-weight: 800; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1.5px; color: #ffffff; }
.footer-col p { color: #a0a0a0; line-height: 1.6; font-size: 0.95rem; }
.footer-col ul { list-style: none; padding: 0; }
.footer-col ul li { margin-bottom: 12px; }
.footer-col ul li a { color: #a0a0a0; text-decoration: none; transition: 0.3s; font-size: 0.95rem; }
.footer-col ul li a:hover { color: #ffffff; padding-left: 5px; }
.site-footer .reseaux-sociaux { margin: 0; text-align: left; }
.site-footer .reseaux-sociaux a { color: #ffffff; margin-right: 20px; font-size: 1.8rem; display: inline-block; text-decoration: none; transition: transform 0.3s, color 0.3s; }
.site-footer .reseaux-sociaux a:hover { color: #a0a0a0; transform: scale(1.1); }
.footer-bottom { text-align: center; padding-top: 30px; margin-top: 40px; border-top: 1px solid #222222; color: #a0a0a0; font-size: 0.85rem; }

/* MODALS */
.modal-overlay { position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.8); backdrop-filter: blur(5px); display: flex; justify-content: center; align-items: center; z-index: 2000; }
.modal-overlay.hidden { display: none; }
.modal-container { 
    background-color: #ffffff; 
    width: 95%; 
    max-width: 1000px; 
    height: min(800px, 92vh);
    height: min(800px, 92dvh);
    border-radius: 8px; 
    position: relative; 
    overflow: hidden;
}
.calendly-inline-widget { width: 100%; height: 100%; min-width: 320px; }

.close-btn { 
    position: absolute; 
    top: 15px; 
    right: 20px; 
    font-size: 1.5rem; 
    background-color: #f8f8f8; 
    border: 1px solid var(--border);
    cursor: pointer; 
    color: #333; 
    z-index: 2001; 
    width: 45px;
    height: 45px;
    border-radius: 50%; 
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    transition: all 0.2s;
}
.close-btn:hover { 
    background-color: #000; 
    color: #fff;
    transform: scale(1.1); 
}

#lightbox-modal { flex-direction: row; }
#lightbox-img, #lightbox-video { max-width: 85vw; max-height: 85vh; border-radius: 6px; object-fit: contain; box-shadow: 0 10px 40px rgba(0,0,0,0.6); outline: none; }
.lightbox-btn { background: none; border: none; color: white; font-size: 3rem; cursor: pointer; position: absolute; top: 50%; transform: translateY(-50%); padding: 20px; transition: 0.3s; z-index: 3001; }
.lightbox-btn:hover { color: #aaaaaa; }
.lightbox-btn.left { left: 3%; }
.lightbox-btn.right { right: 3%; }


/* ========================================== */
/* MOBILE (Adaptation pour téléphones)        */
/* ========================================== */
@media (max-width: 900px) {
    /* 1. Navbar et Burger */
    .navbar { padding: 15px 20px; }
    .burger-menu { display: block; background: none; border: none; font-size: 1.6rem; color: #000; cursor: pointer; margin-left: auto; margin-right: 10px; }
    
    /* 2. Menu déroulant ultra-moderne (Centré et resserré) */
    .nav-tabs { 
        display: none; 
        flex-direction: column; 
        position: absolute; 
        top: 100%; 
        left: 0; 
        width: 100%; 
        transform: none;
        background-color: rgba(255, 255, 255, 0.98); 
        padding: 10px 0 20px 0; 
        box-shadow: 0 15px 30px rgba(0,0,0,0.15); /* Ombre plus douce */
        border-radius: 0 0 20px 20px; /* Bords arrondis très esthétiques */
        z-index: 1000; 
        border-bottom: none;
        gap: 5px; 
    }
    .nav-tabs.open { display: flex; }
    
    .tab-btn {
        padding: 12px 20px; 
        width: 100%;
        text-align: center; 
        font-size: 1.05rem; 
        border-bottom: none; 
    }
    .tab-btn::after { display: none; }

    /* 3. Textes globaux (Titres et paragraphes réduits) */
    h1 { 
        font-size: clamp(1.8rem, 8vw, 3.2rem); 
        letter-spacing: 2px; 
        margin-top: 15px; 
        margin-bottom: 15px; 
    }
    h2 { font-size: 0.9rem; line-height: 1.5; } /* Réduit (était à 1rem) */
    .section-titre { font-size: 1.3rem; margin-bottom: 10px; } /* Titres de section plus discrets */
    .concept-text { font-size: 0.95rem; line-height: 1.6; } /* Paragraphe plus fin */
    
    .page-section { padding: 50px 20px; }

    #accueil { 
        min-height: auto; 
        padding-top: 15vh; /* Gère l'espace exact au-dessus du logo/titre */
        padding-bottom: 10vh; /* Gère l'espace sous le bouton noir */
        justify-content: flex-start; 
    }

    /* 4. Boutons */
    .btn-principal {
        width: 100%;
        max-width: 320px; 
        padding: 15px 20px;
        font-size: 0.9rem; /* Réduit (était à 1rem) */
    }
    
    /* 5. Tarifs Premium Mobile (Textes et Chiffre plus petits) */
    .tarifs-premium-container { flex-direction: column; gap: 35px; text-align: left; }
    .premium-price-side { padding-right: 0; border-right: none; display: flex; flex-direction: column; align-items: flex-start; border-bottom: 1px solid var(--border); padding-bottom: 25px; }
    
    .premium-label { font-size: 0.75rem; }
    .premium-chiffre { font-size: 5rem; margin: 5px 0 10px 0; } /* Encore réduit (était à 6rem) */
    .premium-desc { font-size: 0.9rem; margin-bottom: 25px; }
    .premium-paiement { font-size: 0.75rem; }
    
    .premium-list li { font-size: 0.95rem; padding: 15px 0; } /* Textes des coupes plus petits */
    .premium-list li span { font-size: 0.65rem; }
    
    /* 6. Vitrine */
    .vitrine-row { flex-direction: column; gap: 30px; align-items: center; width: 100%; }
    .vitrine-reel { flex: auto; width: 100%; max-width: 280px; margin: 0 auto; } 
    .vitrine-photos { width: 100vw; margin: 0 -20px; text-align: center; } /* Déborde légèrement pour inciter au swipe */
    .vitrine-photos h4 { font-size: 1.2rem; margin-bottom: 15px; } 
    
    .vitrine-scroll { 
        display: flex; 
        gap: 15px; 
        overflow-x: auto; 
        padding: 0 20px 20px 20px; 
        scroll-snap-type: x mandatory; 
        -webkit-overflow-scrolling: touch; /* Fluidité native iOS */
    }
    .photo-box { 
        width: 75%; /* Laisse dépasser la photo suivante de 25% pour faire comprendre qu'on peut swiper */
        max-width: 260px; 
        height: auto; 
        aspect-ratio: 3 / 4; 
        flex: 0 0 auto; 
        border-radius: 8px; 
        scroll-snap-align: center; 
    }
    .carousel-btn { display: none; }
    
    /* 7. Contact & Footer */
    .form-row { flex-direction: column; gap: 12px; }
    .contact-card { padding: 25px 15px; }
    .form-contact input, .form-contact textarea { font-size: 1rem; padding: 12px; } /* 16px : évite le zoom auto sur iPhone */
    
    .footer-col h4 { font-size: 1rem; }
    .footer-col p, .footer-col ul li a { font-size: 0.85rem; }
    .site-footer { padding: 40px 20px 20px 20px; }
    .footer-col { min-width: 0; flex-basis: 100%; }
    
    /* 8. Fenêtre Calendly */
    .modal-container { border-radius: 12px; }

    /* 9. Lightbox adaptée au tactile */
    #lightbox-img, #lightbox-video { max-width: 94vw; }
    .lightbox-btn { font-size: 1.8rem; padding: 12px; text-shadow: 0 2px 8px rgba(0,0,0,0.8); }
    .lightbox-btn.left { left: 0; }
    .lightbox-btn.right { right: 0; }
}


/* ========================================== */
/* AJOUTS : ANIMATIONS, HOVER, ACCESSIBILITÉ  */
/* ========================================== */

/* ANIMATIONS AU DÉFILEMENT (la classe .js est ajoutée dans le <head>) */
.js .reveal {
    opacity: 0;
    transition: opacity 0.8s ease, transform 0.8s ease;
}
.js .reveal.reveal-up    { transform: translateY(40px); }
.js .reveal.reveal-left  { transform: translateX(-60px); }
.js .reveal.reveal-right { transform: translateX(60px); }
@media (max-width: 900px) {
    /* Sur mobile, tout arrive du bas (évite les débordements sur le côté) */
    .js .reveal.reveal-left, .js .reveal.reveal-right { transform: translateY(40px); }
}
.js .reveal.delay-1 { transition-delay: 0.15s; }
.js .reveal.delay-2 { transition-delay: 0.3s; }
.js .reveal.visible { opacity: 1; transform: none; } /* toujours en dernier */

/* HOVER uniquement sur appareils avec souris */
@media (hover: hover) {
    .btn-principal:hover { transform: scale(1.05); }
    .carousel-btn:hover { transform: scale(1.1); }
    .photo-box:hover { transform: scale(1.03); }
}

/* ACCESSIBILITÉ */
a:focus-visible, button:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }

@media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    .js .reveal, .js .reveal.reveal-up, .js .reveal.reveal-left, .js .reveal.reveal-right {
        opacity: 1; transform: none; transition: none;
    }
}

/* MESSAGE D'ÉTAT DU FORMULAIRE */
#form-status { min-height: 1.2em; font-size: 0.9rem; color: var(--subtext-color); text-align: center; }
