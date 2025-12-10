// Inicializar EmailJS con tu ID
/*emailjs.init("-vuk6LGR8Z9R-qWsI");

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registroForm");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Calcular edad
        const fechaNacimiento = new Date(document.getElementById("fechaNacimiento").value);
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
        const mes = hoy.getMonth() - fechaNacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
            edad--;
        }

        // Obtener grados seleccionados
        const grados = Array.from(document.getElementById("grado").selectedOptions)
            .map(opt => opt.value)
            .join(", ");

        const templateParams = {
            nombre: document.getElementById("nombre").value,
            email: document.getElementById("email").value,
            fechaNacimiento: document.getElementById("fechaNacimiento").value,
            edad: edad,
            rangoIngreso: document.getElementById("rangoIngreso").value,
            genero: document.getElementById("genero").value,
            grado: grados
        };

        emailjs.send("service_fwz6ptc", "template_ev1zm34", templateParams)
            .then(function (response) {
                Swal.fire("¡Mensaje enviado!", "Te hemos contactado al correo ingresado.", "success");
                form.reset();
            }, function (error) {
                Swal.fire("Error", "Hubo un problema al enviar el mensaje. Intenta de nuevo.", "error");
                console.error("EmailJS error:", error);
            });
    });
});*/
// Inicializar EmailJS
emailjs.init("-vuk6LGR8Z9R-qWsI"); // Reemplaza con tu PUBLIC KEY

const app = Vue.createApp({
    data() {
        return {
            form: {
                nombre: "",
                email: "",
                fechaNacimiento: "",
                edad: "",
                rangoIngreso: "",
                genero: "",
                grado: []
            }
        };
    },

    methods: {
        calcularEdad() {
            if (!this.form.fechaNacimiento) return;

            const hoy = new Date();
            const nacimiento = new Date(this.form.fechaNacimiento);

            let edad = hoy.getFullYear() - nacimiento.getFullYear();
            const mes = hoy.getMonth() - nacimiento.getMonth();

            if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
                edad--;
            }

            this.form.edad = edad;
        },

        enviarFormulario() {
            const templateParams = {
                nombre: this.form.nombre,
                email: this.form.email,
                fechaNacimiento: this.form.fechaNacimiento,
                edad: this.form.edad,
                rangoIngreso: this.form.rangoIngreso,
                genero: this.form.genero,
                grado: this.form.grado.join(", ")
            };

            emailjs.send("service_fwz6ptc", "template_ev1zm34", templateParams)
                .then(() => {
                    Swal.fire("¡Mensaje enviado!", "Te hemos contactado al correo ingresado.", "success");
                    this.resetForm();
                })
                .catch(error => {
                    Swal.fire("Error", "Hubo un problema al enviar el mensaje.", "error");
                    console.error("EmailJS error:", error);
                });
        },

        resetForm() {
            this.form = {
                nombre: "",
                email: "",
                fechaNacimiento: "",
                edad: "",
                rangoIngreso: "",
                genero: "",
                grado: []
            };
        }
    }
});

app.mount("#app");

const tienda = [10.059301, -84.798258];
/*function getLocation() {
navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

function onSuccess(position) {
    const latitud = position.coords.latitude;
    const longitud = position.coords.longitude;
    document.getElementById("ubicacion").textContent =
        `Tu ubicación actual es: Latitud: ${latitud}, Longitud: ${longitud}`;
}

function onError(error) {
    document.getElementById("ubicacion").textContent = `Error al obtener la ubicación: ${error.message}`;
}*/

// Botón para obtener ubicación
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(onSuccess, onError);
        } else {
            Swal.fire("Error", "La geolocalización no es soportada por este navegador.", "error");
        }
    }

    // Si obtiene la ubicación correctamente
    function onSuccess(position) {
        const latitud = position.coords.latitude;
        const longitud = position.coords.longitude;

        // Agregar marcador del usuario
        const userMarker = L.marker([latitud, longitud], { icon: L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        })}).addTo(map);

        userMarker.bindPopup("<b>Tu ubicación actual</b>").openPopup();

        //Centrar mapa en la ubicación del usuario
        map.setView([latitud, longitud], 14);

        //Mostrar texto de coordenadas
        document.getElementById("ubicacion").textContent =
            `Tu ubicación actual: Latitud ${latitud.toFixed(5)}, Longitud ${longitud.toFixed(5)}`;

        //Agregar ruta al mapa usando Leaflet Routing Machine
        L.Routing.control({
            waypoints: [
                L.latLng(latitud, longitud),
                L.latLng(tienda[0], tienda[1])
            ],
            lineOptions: {
                styles: [{ color: 'blue', opacity: 0.7, weight: 5 }]
            },
            createMarker: function() { return null; } // Evita duplicar marcadores
        }).addTo(map);
    }

    // Si hay error al obtener ubicación
    function onError(error) {
        Swal.fire("Error", `No se pudo obtener la ubicación: ${error.message}`, "error");
    }