document.addEventListener("DOMContentLoaded", function () {
    fetch("./JSON/detalle.json")

        .then(response => {
            if (!response.ok) {
                // Maneja el error si el archivo JSON no se encuentra (revisa la ruta: ./JSON/detalle.json)
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Servicios cargados correctamente:", data);
            // LLAMA a la función que crea el HTML y luego inicializa las galerías
            mostrarServicios(data.servicios);
        })
        .catch(error => console.error("Error al cargar los servicios:", error));
});


function mostrarServicios(servicios) {
    let contenedor = document.getElementById("contenido");

    if (!contenedor) {
        console.error("Error: No se encontró el contenedor de servicios.");
        return;
    }
    servicios.forEach(servicios => {
        /*let card = document.createElement("div");
        card.className = "row g-0 bg-body-secondary position-relative shadow-sm mb-3 card-boostrap";
        card.innerHTML = `
            <div class="col-md-4 mb-md-0 p-md-3">
                <img src="${servicios.imagenes}"  style="width:100%; height:300px; object-fit:cover; border-radius:8px;"  alt="${servicios.descripcion}"> 
            </div>
            <div class="col-md-8 p-4 ps-md-0 text-center align-content-center">
                <h5 class="mt-0">${servicios.titulo}</h5>
                <p>${servicios.descripcion}</p>
                <a href="#" class="stretched-link">Go somewhere</a>
            </div>
        `;*/
        let card = document.createElement("article");
        card.className = "col-12 col-md-6 col-lg-4"; 
        card.innerHTML = `
            <div class="card card-servicio h-100 d-flex flex-column justify-content-between">
                <img src="${servicios.imagenes}" class="card-img-top" alt="${servicios.descripcion}">
                <div class="card-body text-center d-flex flex-column justify-content-between">
                    <h5 class="card-title">${servicios.descripcion}</h5>
                    
                    <div class="mt-auto">
                        <button class="btn btn-primary ver-producto" onclick="location.href='servicioLinea.html'" data-id="${servicios.id}">Ver Servicio</button>
                    </div>
                </div>
            </div>
        `;
        contenedor.appendChild(card);
    });
    /*servicios.forEach(servicio => {
        // 1. Crear el HTML de las miniaturas dinámicamente
        let thumbnailsHTML = '';
        // Asegúrate de que 'servicio.imagenes' exista y sea un array en tu JSON
        if (servicio.imagenes && servicio.imagenes.length > 0) {
            servicio.imagenes.forEach((img, index) => {
                thumbnailsHTML += `
                    <div class="thumb ${index === 0 ? 'active' : ''}" data-index="${index}">
                        <img src="${img.src}" data-full-src="${img.src}" data-title="${servicio.titulo} - ${img.alt}" alt="Miniatura ${index + 1}">
                    </div>
                `;
            });
        }

        // 2. Crear la tarjeta completa, inyectando la galería
        let card = document.createElement("article");
        card.className = "col-12 col-md-6 col-lg-4";

        // Usamos el primer elemento del array de imágenes para la vista principal inicial
        const firstImageSrc = servicio.imagenes[0] ? servicio.imagenes[0].src : '';
        const totalImgs = servicio.imagenes.length;*/

    /*card.innerHTML = `
        <div class="card h-100 shadow-sm gallery-card" data-service-id="${servicio.id}">
            
            <div class="gallery-container">
                <button class="nav-control prev-btn"><i class="bi bi-chevron-left"></i></button>

                <div class="main-image-viewer">
                    <img src="${firstImageSrc}" alt="${servicio.titulo}" class="card-img-top" id="main-photo-${servicio.id}">
                    <div class="image-caption">
                        <h5 id="gallery-title-${servicio.id}">${servicio.titulo}</h5>
                        <p id="gallery-paging-${servicio.id}">1 / ${totalImgs}</p>
                    </div>
                </div>
                
                <button class="nav-control next-btn"><i class="bi bi-chevron-right"></i></button>

                <div class="thumbnails-row" id="thumbnails-row-${servicio.id}">
                    ${thumbnailsHTML}
                </div>
            </div>

            <div class="card-body">
                <h5 class="card-title">${servicio.titulo}</h5>
                <p class="card-text">${servicio.descripcion}</p>
                <a href="servicio-detalle.html?id=${servicio.id}" class="btn btn-primary w-100 mt-2">Ver Detalles y Reservar</a>
            </div>
        </div>
    `;*/
    /*card.innerHTML += `
    <div class="d-flex position-relative">
        <img src="${firstImageSrc}" class="flex-shrink-0 me-3" alt="...">
        <div>
            <h5 class="mt-0">${servicio.titulo}</h5>
            <p>${servicio.descripcion}.</p>
            <a href="#" class="stretched-link">Go somewhere</a>
        </div>
    </div>
    `;
    contenedor.appendChild(card);
});*/

    // 3. Inicializar la lógica de las galerías DESPUÉS de que todas las tarjetas están en el DOM
    //initializeAllGalleries(servicios);

}

// =======================================================
// LÓGICA DE JAVASCRIPT PARA HACER FUNCIONAR LAS GALERÍAS
// =======================================================

function initializeAllGalleries(servicios) {
    servicios.forEach(servicio => {
        const galleryCard = document.querySelector(`.gallery-card[data-service-id="${servicio.id}"]`);
        if (!galleryCard) return;

        const mainPhoto = galleryCard.querySelector(`#main-photo-${servicio.id}`);
        const prevBtn = galleryCard.querySelector('.prev-btn');
        const nextBtn = galleryCard.querySelector('.next-btn');
        const thumbnails = galleryCard.querySelectorAll('.thumb');
        const galleryTitle = galleryCard.querySelector(`#gallery-title-${servicio.id}`);
        const galleryPaging = galleryCard.querySelector(`#gallery-paging-${servicio.id}`);

        let currentIndex = 0;
        const totalImages = servicio.imagenes.length;

        // Si no hay imágenes, no inicializa los eventos
        if (totalImages === 0) return;

        function updateGallery(newIndex) {
            if (newIndex >= totalImages) {
                newIndex = 0;
            } else if (newIndex < 0) {
                newIndex = totalImages - 1;
            }

            currentIndex = newIndex;
            const currentData = servicio.imagenes[currentIndex];

            // Actualiza la imagen principal y el texto
            mainPhoto.src = currentData.src;
            mainPhoto.alt = currentData.alt;

            galleryTitle.textContent = servicio.titulo;
            galleryPaging.textContent = `${currentIndex + 1} / ${totalImages}`;

            // Actualiza la clase 'active' de las miniaturas
            thumbnails.forEach((thumb, index) => {
                thumb.classList.toggle('active', index === currentIndex);
            });
        }

        // Listeners para Flechas
        // Solo añade listeners si existen los botones
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                updateGallery(currentIndex - 1);
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                updateGallery(currentIndex + 1);
            });
        }

        // Listeners para Miniaturas
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                const indexClicked = parseInt(thumb.getAttribute('data-index'));
                updateGallery(indexClicked);
            });
        });

        // Asegurarse de inicializar
        updateGallery(0);
    });
}

// Función para decodificar el VIN
async function decodificarVin(vin) {
    // Asegúrate de que el VIN sea válido (17 caracteres)
    if (!vin || vin.length !== 17) {
        console.error("VIN inválido. Debe tener 17 caracteres.");
        return;
    }

    const apiUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`;

    try {
        // 1. Realizar la solicitud (Request)
        const response = await fetch(apiUrl);

        // Verificar si la respuesta fue exitosa (código 200)
        if (!response.ok) {
            throw new Error(`Error en la solicitud HTTP: ${response.status}`);
        }

        // 2. Obtener los datos en formato JSON
        const data = await response.json();

        // Los datos relevantes están dentro del array 'Results'
        const resultados = data.Results;

        // 3. Procesar y mostrar la información
        mostrarInformacionVehiculo(resultados);

    } catch (error) {
        // Manejo de errores
        console.error("Hubo un problema al decodificar el VIN:", error);
        alert("No se pudo obtener la información del vehículo. Intente de nuevo.");
    }
}

// Función para extraer y mostrar información clave
function mostrarInformacionVehiculo(resultados) {
    const info = resultados[0]; // La API devuelve un solo objeto dentro del arreglo
    const infoContainer = document.getElementById('resultado-vin');

    const make = info.Manufacturer || 'No disponible';
    const model = info.Model || 'No disponible';
    const year = info.ModelYear || 'No disponible';
    const vehicleType = info.VehicleType || 'No disponible';

    /*infoContainer.innerHTML = `
        <div class="fade-in-up infoVin">
            <h3>✅ Vehículo Decodificado</h3>
            <ul>
                <li><strong>Marca:</strong> ${make}</li>
                <li><strong>Modelo:</strong> ${model}</li>
                <li><strong>Año:</strong> ${year}</li>
                <li><strong>Tipo de Vehículo:</strong> ${vehicleType}</li>
            </ul>
            <p>Información útil para confirmar las especificaciones del servicio.</p>
        </div>
    `;*/
    infoContainer.innerHTML = `
    <div class="card shadow-sm mt-4 border-0" style="border-radius: 12px;">
        <div class="card-header bg-primary text-white text-center" style="border-radius: 12px 12px 0 0;">
            <h4 class="mb-0">Información del Vehículo</h4>
        </div>

        <div class="card-body">
            <div class="row text-center mb-3">
                <div class="col-6 col-md-3">
                    <h6 class="text-secondary">Marca</h6>
                    <p class="fw-bold">${make}</p>
                </div>

                <div class="col-6 col-md-3">
                    <h6 class="text-secondary">Modelo</h6>
                    <p class="fw-bold">${model}</p>
                </div>

                <div class="col-6 col-md-3">
                    <h6 class="text-secondary">Año</h6>
                    <p class="fw-bold">${year}</p>
                </div>

                <div class="col-6 col-md-3">
                    <h6 class="text-secondary">Tipo</h6>
                    <p class="fw-bold">${vehicleType}</p>
                </div>
            </div>

            <p class="text-center text-muted">Información obtenida por el código VIN proporcionado.</p>
        </div>
    </div>
`;

}


document.addEventListener("Click", () => {
    const btn = document.getElementById("btn-decodificar");
    const input = document.getElementById("input-vin");

    if (btn) {
        btn.addEventListener("click", () => {
            const vin = input.value.trim();

            if (vin.length !== 17) {
                alert("El VIN debe tener exactamente 17 caracteres.");
                return;
            }

            decodificarVin(vin);
        });
    }
});


function iniciarBarraCarga() {
    const barContainer = document.getElementById("barra-carga");
    const bar = document.querySelector(".loader-progress");
    const text = document.getElementById("loader-text");

    barContainer.style.display = "block";
    bar.style.width = "0%";
    text.textContent = "0%";

    let progreso = 0;

    return new Promise(resolve => {
        const intervalo = setInterval(() => {
            progreso += 1; // velocidad
            bar.style.width = progreso + "%";
            text.textContent = progreso + "%";

            if (progreso >= 100) {
                clearInterval(intervalo);
                setTimeout(() => resolve(), 300);
            }
        }, 60);
    });
}

function ocultarBarraCarga() {
    document.getElementById("barra-carga").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btn-decodificar");
    const input = document.getElementById("input-vin");

    btn.addEventListener("click", async () => {
        const vin = input.value.trim();

        if (vin.length !== 17) {
            alert("El VIN debe tener exactamente 17 caracteres.");
            return;
        }

        // Mostrar barra de carga
        startProgress();
        await iniciarBarraCarga();

        // Llamar API
        await decodificarVin(vin);

        // Ocultar barra
        ocultarBarraCarga();
    });
});

function startProgress() {
    let i = 0;
    let bar = document.querySelector(".loader-progress");

    let interval = setInterval(() => {
        if (i <= 100) {
            bar.style.width = i + "%";
            i++;
        } else {
            clearInterval(interval);
        }
    }, 30);
}


// Ejemplo de cómo llamarlo (simulando la entrada de un usuario)
// decodificarVin('3VW9X7A58HM000100'); // Reemplaza con un VIN de prueba

document.addEventListener('DOMContentLoaded', function () {
    const audioToggle = document.getElementById('audio-toggle');
    const audio = document.getElementById('background-audio');

    // Estado inicial
    let isPlaying = false;

    // Control de reproducción
    audioToggle.addEventListener('click', function () {
        if (isPlaying) {
            audio.pause();
            audioToggle.classList.remove('playing');
            audioToggle.innerHTML = '<i class="bi bi-music-note-beamed"></i>';
            audioToggle.title = 'Reproducir música de fondo';
        } else {
            audio.play().then(() => {
                audioToggle.classList.add('playing');
                audioToggle.innerHTML = '<i class="bi bi-pause-circle"></i>';
                audioToggle.title = 'Pausar música de fondo';
            }).catch(error => {
                console.log('Error al reproducir:', error);
            });
        }
        isPlaying = !isPlaying;
    });

    // Controlar volumen (opcional, ajusta según prefieras)
    audio.volume = 0.3; // 30% del volumen

    // Eventos del audio
    audio.addEventListener('ended', function () {
        // Por si acaso, aunque tiene loop
        audio.currentTime = 0;
        audio.play();
    });
});