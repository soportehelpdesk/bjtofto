// Variable global per a saber l'idioma actual
let currentLang = 'ca';

// Base de dades de fotos de mostra per a cada categoria
// Pots afegir ací tantes imatges com vulgues per a cada secció
const fotosBaseDeDades = {
    curses: [
        { src: 'imatges/curses.jpg', alt: 'Cursa 1' },
        { src: 'imatges/curses.jpg', alt: 'Cursa 2' },
        { src: 'imatges/curses.jpg', alt: 'Cursa 3' }
    ],
    muixerangues: [
        { src: 'imatges/muixerangues.jpg', alt: 'Muixeranga 1' },
        { src: 'imatges/muixerangues.jpg', alt: 'Muixeranga 2' }
    ],
    futbol: [
        { src: 'imatges/futbol.jpg', alt: 'Futbol 1' }
    ],
    basquet: [
        { src: 'imatges/basquet.jpg', alt: 'Basquet 1' }
    ]
};

// Títols de les galeries segons l'idioma
const galleryTitles = {
    curses: { ca: 'Curses de Muntanya', es: 'Carreras de Montaña' },
    muixerangues: { ca: 'Trobades de Muixerangues', es: 'Encuentros de Muixerangues' },
    futbol: { ca: 'Futbol Sala', es: 'Fútbol Sala' },
    basquet: { ca: 'Partits de Bàsquet', es: 'Partidos de Baloncesto' }
};

// Funció per a navegar entre pàgines (amaga unes i mostra una altra)
function navigateTo(pageId) {
    // Amaguem totes les pàgines
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    // Mostrem la que toca
    const targetPage = document.getElementById(`page-${pageId}`);
    if(targetPage) targetPage.classList.add('active');
    
    // Pugem dalt de tot de la pàgina automàticament
    window.scrollTo(0, 0);
}

// Funció que s'activa al fer clic en una categoria de la portada
function openGallery(category) {
    const titleElem = document.getElementById('gallery-title');
    const container = document.getElementById('gallery-images-container');
    
    // 1. Canviar el títol segons l'idioma actual
    titleElem.textContent = galleryTitles[category][currentLang];
    // Guardem la categoria en el títol per si canvien d'idioma a mitja galeria
    titleElem.setAttribute('data-current-cat', category); 

    // 2. Netejar i carregar les fotos d'eixa categoria
    container.innerHTML = '';
    const fotos = fotosBaseDeDades[category] || [];
    
    fotos.forEach(foto => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `<img src="${foto.src}" alt="${foto.alt}">`;
        container.appendChild(item);
    });

    // 3. Anar a la pàgina de la galeria
    navigateTo('galeria');
}

// Funció per a canviar d'idioma
function setLanguage(lang) {
    currentLang = lang;
    const elements = document.querySelectorAll('[data-lang-ca]');
    
    elements.forEach(elem => {
        if (lang === 'ca') {
            elem.textContent = elem.getAttribute('data-lang-ca');
        } else if (lang === 'es') {
            elem.textContent = elem.getAttribute('data-lang-es');
        }
    });

    // Si estem veient una galeria, actualitzem el títol de la galeria també
    const titleElem = document.getElementById('gallery-title');
    const currentCat = titleElem.getAttribute('data-current-cat');
    if (currentCat) {
        titleElem.textContent = galleryTitles[currentCat][lang];
    }

    // Actualitza botons actius de l'idioma
    document.querySelectorAll('.btn-lang').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}