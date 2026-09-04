// MODE SOMBRE
const btnTheme = document.getElementById('btn-theme');
const iconTheme = btnTheme.querySelector('i');
const body = document.body;
const siteLogo = document.getElementById('site-logo'); 
const siteFavicon = document.getElementById('site-favicon');

btnTheme.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        iconTheme.classList.replace('fa-moon', 'fa-sun');
        siteLogo.src = 'images/logo_noir.PNG'; 
        siteFavicon.href = 'images/logo_noir.PNG'; 
    } else {
        iconTheme.classList.replace('fa-sun', 'fa-moon');
        siteLogo.src = 'images/logo.png'; 
        siteFavicon.href = 'images/logo.png'; 
    }
});

// MENU BURGER MOBILE
const btnBurger = document.getElementById('btn-burger');
const navTabs = document.getElementById('nav-tabs');
const burgerIcon = btnBurger.querySelector('i');

if(btnBurger && navTabs) {
    btnBurger.addEventListener('click', () => {
        navTabs.classList.toggle('open');
        if (navTabs.classList.contains('open')) {
            burgerIcon.classList.replace('fa-bars', 'fa-xmark'); 
        } else {
            burgerIcon.classList.replace('fa-xmark', 'fa-bars'); 
        }
    });
}

// NAVIGATION PAR ONGLETS
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');

        // Fermer le menu burger après le clic sur mobile
        if (window.innerWidth <= 900 && navTabs.classList.contains('open')) {
            navTabs.classList.remove('open');
            burgerIcon.classList.replace('fa-xmark', 'fa-bars');
        }
    });
});

// CARROUSEL PHOTOS (Flèches responsives)
const carousels = document.querySelectorAll('.carousel-container');

carousels.forEach(container => {
    const scrollArea = container.querySelector('.vitrine-scroll');
    const prevBtn = container.querySelector('.prev-btn');
    const nextBtn = container.querySelector('.next-btn');

    if(prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            // Calcule la largeur de la photo en direct pour s'adapter à tous les écrans
            const photoWidth = container.querySelector('.photo-box').offsetWidth + 20;
            scrollArea.scrollBy({ left: -photoWidth, behavior: 'smooth' });
        });
        
        nextBtn.addEventListener('click', () => {
            const photoWidth = container.querySelector('.photo-box').offsetWidth + 20;
            scrollArea.scrollBy({ left: photoWidth, behavior: 'smooth' });
        });
    }
});

// FENÊTRE CALENDLY
const modal = document.getElementById('calendly-modal');
const btnOpen = document.getElementById('btn-open-modal');
const btnClose = document.getElementById('btn-close-modal');

if(btnOpen && modal) {
    btnOpen.addEventListener('click', () => {
        modal.classList.remove('hidden');
    });

    btnClose.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
}
// SYSTÈME DE LIGHTBOX (Agrandissement des photos ET vidéos)
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxVideo = document.getElementById('lightbox-video');
const btnLightboxClose = document.getElementById('lightbox-close');
const btnLightboxPrev = document.getElementById('lightbox-prev');
const btnLightboxNext = document.getElementById('lightbox-next');

let currentImages = [];
let currentIndex = 0;

// 1. Gérer les clics sur les PHOTOS
const galleries = document.querySelectorAll('.vitrine-scroll');
galleries.forEach(gallery => {
    const photos = Array.from(gallery.querySelectorAll('img.photo-box'));
    photos.forEach((photo, index) => {
        photo.addEventListener('click', () => {
            currentImages = photos.map(p => p.src);
            currentIndex = index;
            
            // Cache la vidéo, affiche la photo et les flèches
            lightboxVideo.style.display = 'none'; 
            lightboxVideo.pause(); 
            lightboxImg.src = currentImages[currentIndex];
            lightboxImg.style.display = 'block'; 
            
            btnLightboxPrev.style.display = 'block';
            btnLightboxNext.style.display = 'block';
            
            lightboxModal.classList.remove('hidden');
        });
    });
});

// 2. Gérer les clics sur les RÉELS (Vidéos)
const reels = document.querySelectorAll('.reel-video');
reels.forEach(reel => {
    reel.addEventListener('click', () => {
        // Cache la photo et les flèches, affiche la vidéo
        lightboxImg.style.display = 'none'; 
        btnLightboxPrev.style.display = 'none';
        btnLightboxNext.style.display = 'none';
        
        lightboxVideo.src = reel.src;
        lightboxVideo.style.display = 'block'; 
        
        lightboxModal.classList.remove('hidden');
        lightboxVideo.play(); // Lance le vrai Réel avec le son
    });
});

// Navigation Flèches (Photos uniquement)
if(btnLightboxPrev && btnLightboxNext) {
    btnLightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : currentImages.length - 1;
        lightboxImg.src = currentImages[currentIndex];
    });

    btnLightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex < currentImages.length - 1) ? currentIndex + 1 : 0;
        lightboxImg.src = currentImages[currentIndex];
    });
}

// Fermeture de la pop-up (Coupe le son de la vidéo)
const closeLightbox = () => {
    lightboxModal.classList.add('hidden');
    lightboxVideo.pause(); 
    lightboxVideo.src = ""; 
};

if (btnLightboxClose && lightboxModal) {
    btnLightboxClose.addEventListener('click', closeLightbox);
    lightboxModal.addEventListener('click', (e) => {
        if(e.target === lightboxModal) { closeLightbox(); }
    });
}