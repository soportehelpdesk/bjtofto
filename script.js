/* =========================================================
   1. BASE DE DADES DE LA GALERIA
   ========================================================= */
const galeriaData = {
    basquet: {
        titol: "Bàsquet",
        albums: {
            cantabria: {
                titol: "Amics Vs Cantabria",
                prefix: "fotos/basquet/cantabria/AmicsVsCantabria-",
                totalFotos: 15,
                extensio: ".jpg"
            },
            menorca: {
                titol: "Amics Vs Menorca",
                prefix: "fotos/basquet/menorca/AmicsVsMenorca-",
                totalFotos: 15,
                extensio: ".jpg"
            }
        }
    },
    curses: {
        titol: "Curses de Muntanya",
        albums: {
            penyagolosa: {
                titol: "MIM - CSP 2026",
                prefix: "fotos/curses/penyagolosa/MIM-CSP2026-",
                totalFotos: 15,
                extensio: ".jpg"
            }
        }
    },
    muixerangues: {
        titol: "Muixerangues",
        albums: {
            2025: {
                titol: "Trobada 2025",
                prefix: "fotos/muixerangues/2025/Magdalena2025Muixerangues-",
                totalFotos: 15,
                extensio: ".jpg"
            },
            2026: {
                titol: "Trobada 2026",
                prefix: "fotos/muixerangues/2026/Trobada2026-",
                totalFotos: 15,
                extensio: ".jpg"
            }
        }
    },
    futbol: {
        titol: "Futbol Sala",
        albums: {} // Buit temporalment
    }
};

// Estat global de l'aplicació
let categoriaActual = "";
let albumActual = "";
let indexFotoActual = 0;
let llistaFotosActuals = [];

/* =========================================================
   2. INICIALITZACIÓ NATIVA I EVENTS
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    // Inicialitzem el visor de fotografies automàticament
    crearLightbox();
});

/**
 * Funció de navegació nativa (Gestiona el canvi de pestanyes .page)
 */
function navigateTo(pageId) {
    // Amaguem totes les pàgines
    const pages = document.querySelectorAll(".page");
    pages.forEach(p => p.classList.remove("active"));

    // Mostrem la que toca exactament de les teues id d'HTML
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
        targetPage.classList.add("active");
    }

    // Si és mòbil, tanca el menú en navegar
    const menuWrapper = document.getElementById("navMenuWrapper");
    if (menuWrapper) menuWrapper.classList.remove("open");
}

function menuNavigate(pageId) {
    navigateTo(pageId);
}

function toggleMenu() {
    const menuWrapper = document.getElementById("navMenuWrapper");
    if (menuWrapper) menuWrapper.classList.toggle("open");
}

/* =========================================================
   3. GENERACIÓ DINÀMICA DE CONTINGUTS (ÀLBUMS I FOTOS)
   ========================================================= */

/**
 * Enllaçat amb el onclick="openCategory('id')" de les teues targetes
 */
function openCategory(categoriaId) {
    if (!galeriaData[categoriaId]) return;
    
    categoriaActual = categoriaId;
    const dadesCategoria = galeriaData[categoriaId];

    // Canviar el títol de la secció d'àlbums
    const titleElement = document.getElementById("albums-title");
    if (titleElement) titleElement.innerText = dadesCategoria.titol;

    // Contenidor del teu HTML on es carreguen els teus àlbums
    const container = document.getElementById("albums-container");
    if (!container) return;
    container.innerHTML = "";

    const keysAlbums = Object.keys(dadesCategoria.albums);
    if (keysAlbums.length === 0) {
        container.innerHTML = `<p style="color: #777; width: 100%; text-align: center; padding: 20px;">Pròximament s'afegiran àlbums.</p>`;
        // CRUCIAL: Fins i tot buida, hem de canviar a la vista d'àlbums!
        navigateTo("albums");
        return;
    }

    // Bucle per muntar les teues cards d'àlbums de fotos
    keysAlbums.forEach(albumKey => {
        const album = dadesCategoria.albums[albumKey];
        const rutaPortada = `${album.prefix}1${album.extensio}`; // Utilitza la foto 1 de portada

        const card = document.createElement("div");
        card.className = "album-card";
        card.style.cursor = "pointer";
        card.innerHTML = `
            <div class="album-cover-wrapper" style="aspect-ratio: 16/9; overflow: hidden; border-radius: 8px;">
                <img src="${rutaPortada}" class="album-cover" alt="${album.titol}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div class="album-info" style="padding: 10px 0;">
                <h3 style="margin: 5px 0 0 0; font-size: 1.2rem;">${album.titol}</h3>
                <small style="color: #88D6E6;">${album.totalFotos} imatges</small>
            </div>
        `;

        // Quan fan clic, executa openAlbum
        card.addEventListener("click", () => openAlbum(albumKey));
        container.appendChild(card);
    });

    // --- AQUÍ ESTAVA LA ERRO: CRIDAR A LA TEUA NAVEGACIÓ ---
    navigateTo("albums");
}

/**
 * Carrega les 15 fotos de manera seqüencial a la seua graella
 */
function openAlbum(albumId) {
    albumActual = albumId;
    const album = galeriaData[categoriaActual].albums[albumId];

    // Canviar el títol de la galeria de fotos
    const titleElement = document.getElementById("gallery-title");
    if (titleElement) titleElement.innerText = album.titol;

    // Contenidor final de fotos del teu HTML
    const container = document.getElementById("gallery-images-container");
    if (!container) return;
    container.innerHTML = "";

    // Buidem la llista del visor gran per a renovar-la
    llistaFotosActuals = [];

    // Generació en bucle automàtic de les fotos 1 a la 15
    for (let i = 1; i <= album.totalFotos; i++) {
        const rutaFoto = `${album.prefix}${i}${album.extensio}`;
        llistaFotosActuals.push(rutaFoto);

        const gridItem = document.createElement("div");
        gridItem.className = "gallery-item";
        gridItem.style.position = "relative";
        gridItem.style.cursor = "pointer";
        gridItem.innerHTML = `
            <img src="${rutaFoto}" alt="${album.titol} - ${i}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;" loading="lazy">
        `;

        // Obrir el visor en gran en prémer
        const currentIdx = i - 1;
        gridItem.addEventListener("click", () => obrirLightbox(currentIdx));
        container.appendChild(gridItem);
    }

    // Canviem visualment a la pestanya final de la teua galeria
    navigateTo("galeria");
}

/* =========================================================
   4. SISTEMA COMPLET DE VISOR MULTIMÈDIA (LIGHTBOX)
   ========================================================= */
function crearLightbox() {
    if (document.getElementById("lightbox-premium")) return;

    const lb = document.createElement("div");
    lb.id = "lightbox-premium";
    lb.style.cssText = `
        position: fixed; inset: 0; background: rgba(0,0,0,0.95);
        display: none; align-items: center; justify-content: center; z-index: 9999;
    `;
    lb.innerHTML = `
        <span id="lb-close" style="position: absolute; top: 20px; right: 30px; color: white; font-size: 40px; cursor: pointer; user-select: none;">&times;</span>
        <button id="lb-prev" style="position: absolute; left: 20px; background: none; border: none; color: white; font-size: 40px; cursor: pointer; user-select: none;">&#10094;</button>
        <div style="max-width: 85%; max-height: 85%; display: flex; align-items: center; justify-content: center;">
            <img id="lb-img" src="" alt="Ampliada" style="max-width: 100%; max-height: 90vh; object-fit: contain; border-radius: 4px;">
        </div>
        <button id="lb-next" style="position: absolute; right: 20px; background: none; border: none; color: white; font-size: 40px; cursor: pointer; user-select: none;">&#10095;</button>
    `;

    document.body.appendChild(lb);

    document.getElementById("lb-close").addEventListener("click", tancarLightbox);
    lb.addEventListener("click", (e) => {
        if (e.target === lb) tancarLightbox();
    });

    document.getElementById("lb-prev").addEventListener("click", () => canviarFotoLightbox(-1));
    document.getElementById("lb-next").addEventListener("click", () => canviarFotoLightbox(1));

    document.addEventListener("keydown", (e) => {
        if (lb.style.display !== "flex") return;
        if (e.key === "Escape") tancarLightbox();
        if (e.key === "ArrowRight") canviarFotoLightbox(1);
        if (e.key === "ArrowLeft") canviarFotoLightbox(-1);
    });
}

function obrirLightbox(index) {
    indexFotoActual = index;
    const lb = document.getElementById("lightbox-premium");
    const lbImg = document.getElementById("lb-img");

    if (lb && lbImg && llistaFotosActuals[indexFotoActual]) {
        lbImg.src = llistaFotosActuals[indexFotoActual];
        lb.style.display = "flex";
        document.body.style.overflow = "hidden";
    }
}

function tancarLightbox() {
    const lb = document.getElementById("lightbox-premium");
    if (lb) {
        lb.style.display = "none";
        document.body.style.overflow = "";
    }
}

function canviarFotoLightbox(direccio) {
    indexFotoActual += direccio;
    if (indexFotoActual >= llistaFotosActuals.length) indexFotoActual = 0;
    if (indexFotoActual < 0) indexFotoActual = llistaFotosActuals.length - 1;

    const lbImg = document.getElementById("lb-img");
    if (lbImg) lbImg.src = llistaFotosActuals[indexFotoActual];
}