// ==========================================
// 1. MENU BURGER (MOBILE)
// ==========================================
const btnBurger = document.getElementById('btn-burger');
const navTabs = document.getElementById('nav-tabs');
const menuLinks = document.querySelectorAll('.tab-btn');

// Ouvre/Ferme le menu quand on clique sur l'icône burger
btnBurger.addEventListener('click', () => {
    navTabs.classList.toggle('open');
});

// Referme le menu automatiquement quand on clique sur un lien 
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        navTabs.classList.remove('open');
    });
});

// ==========================================
// 2. POP-UP CALENDLY (RÉSERVATION)
// ==========================================
const modalCalendly = document.getElementById('calendly-modal');
const btnCloseCalendly = document.getElementById('btn-close-modal');
const btnsReserver = document.querySelectorAll('.btn-reserver');

// Ouvrir Calendly et bloquer le défilement
btnsReserver.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        modalCalendly.classList.remove('hidden');
        document.body.classList.add('no-scroll'); 
    });
});

// Fermer avec la croix
btnCloseCalendly.addEventListener('click', () => {
    modalCalendly.classList.add('hidden');
    document.body.classList.remove('no-scroll'); 
});

// Fermer en cliquant à l'extérieur de la boîte blanche
modalCalendly.addEventListener('click', (e) => {
    if (e.target === modalCalendly) {
        modalCalendly.classList.add('hidden');
        document.body.classList.remove('no-scroll');
    }
});

// ==========================================
// 3. LIGHTBOX (AGRANDISSEMENT GALERIE)
// ==========================================
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxVideo = document.getElementById('lightbox-video');
const lightboxClose = document.getElementById('lightbox-close');

// Agrandir les photos
document.querySelectorAll('.photo-box').forEach(photo => {
    photo.addEventListener('click', () => {
        lightboxImg.src = photo.src;
        lightboxImg.style.display = 'block';
        lightboxVideo.style.display = 'none';
        lightboxModal.classList.remove('hidden');
    });
});

// Agrandir les vidéos (Réels)
document.querySelectorAll('.reel-video').forEach(video => {
    video.addEventListener('click', () => {
        lightboxVideo.src = video.src;
        lightboxVideo.style.display = 'block';
        lightboxImg.style.display = 'none';
        lightboxModal.classList.remove('hidden');
        lightboxVideo.play();
    });
});

// Fermer la Lightbox
lightboxClose.addEventListener('click', () => {
    lightboxModal.classList.add('hidden');
    lightboxVideo.pause(); 
});

// ==========================================
// 4. SCROLL SPY (Détection de la section active)
// ==========================================
const sections = document.querySelectorAll('.page-section');
const navLinksSpy = document.querySelectorAll('.tab-btn');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5 // Se déclenche quand 50% de la section est à l'écran
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Efface le trait de tous les liens
            navLinksSpy.forEach(link => link.classList.remove('active'));
            
            // Ajoute le trait au lien correspondant à la section affichée
            const activeId = entry.target.getAttribute('id');
            const activeLink = document.querySelector(`.tab-btn[href="#${activeId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}, observerOptions);

// Demande à l'observateur de surveiller toutes nos sections
sections.forEach(section => observer.observe(section));

// ==========================================
// 5. ANIMATIONS AU DÉFILEMENT (REVEAL)
// ==========================================
const reveals = document.querySelectorAll('.reveal');

// Réglages : l'animation se déclenche un peu avant que l'élément n'apparaisse complètement
const revealOptions = {
    root: null,
    rootMargin: '0px 0px -15% 0px',
    threshold: 0
};

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // On arrête d'observer une fois affiché (l'animation ne se joue qu'une fois)
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

reveals.forEach(reveal => {
    revealObserver.observe(reveal);
});
