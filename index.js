// ===============================
// NAVEGACIÓN ENTRE SECCIONES
// ===============================

function ir(id) {
    document.querySelectorAll('.seccion').forEach(s => {
        s.classList.remove('activa');
    });

    const seccion = document.getElementById(id);
    seccion.classList.add('activa');

    window.scrollTo({ top: 0, behavior: 'smooth' });

    gsap.from(`#${id} .carta, #${id} .jardin-contenedor, #${id} .juego-contenedor`, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out'
    });
}


// ===============================
// MODO DÍA / NOCHE
// ===============================

function modo() {
    document.body.classList.toggle('noche');
    const icono = document.getElementById('iconoModo');

    if (document.body.classList.contains('noche')) {
        icono.textContent = '☀️';
        crearEstrellas();
    } else {
        icono.textContent = '🌙';
        eliminarEstrellas();
    }
}

function crearEstrellas() {
    const particulas = document.getElementById('particulas');
    particulas.innerHTML = '';

    for (let i = 0; i < 50; i++) {
        const estrella = document.createElement('div');
        estrella.className = 'estrella';
        estrella.style.left = Math.random() * 100 + '%';
        estrella.style.top = Math.random() * 100 + '%';
        estrella.style.animationDelay = Math.random() * 3 + 's';
        particulas.appendChild(estrella);
    }
}

function eliminarEstrellas() {
    document.getElementById('particulas').innerHTML = '';
}


// ===============================
// CONTADOR OPTIMIZADO (SIN RECREAR DOM)
// ===============================

const inicio = new Date('2026-01-14T20:23:00-05:00');

function actualizarContador() {
    const ahora = new Date();
    let diferencia = Math.floor((ahora - inicio) / 1000);

    const dias = Math.floor(diferencia / 86400);
    diferencia %= 86400;
    const horas = Math.floor(diferencia / 3600);
    diferencia %= 3600;
    const minutos = Math.floor(diferencia / 60);
    const segundos = diferencia % 60;

    actualizarNumero('dias', dias);
    actualizarNumero('horas', horas);
    actualizarNumero('minutos', minutos);
    actualizarNumero('segundos', segundos);
}

function actualizarNumero(id, valor) {
    const elemento = document.getElementById(id);

    if (!elemento) return;

    if (elemento.textContent != valor) {
        elemento.textContent = valor;

        gsap.fromTo(
            elemento,
            { scale: 1.2 },
            { scale: 1, duration: 0.3, ease: 'power2.out' }
        );
    }
}

setInterval(actualizarContador, 1000);
actualizarContador();


// ===============================
// MÚSICA
// ===============================

function activarAudio() {
    const audio = document.getElementById('musica');
    if (!audio) return;

    audio.volume = 0.4;
    audio.play();

    gsap.to('.boton-musica', {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1
    });
}


// ===============================
// MINIJUEGO
// ===============================

let nivelAmor = 0;

const mensajesPorNivel = {
    10: 'Mi niña amada, si mis palabras fueran flores, tu nombre sería el jardín entero',
    20: 'Princesa, ojalá mis manos pudieran viajar por la pantalla y acomodarte el cabello',
    30: 'Te adoro de una forma tranquila, como lluvia que no apura, pero moja el alma',
    40: 'Cielito, contigo aprendí que el amor no grita, sonríe bajito y bonito',
    50: 'Eres mi pensamiento favorito antes de dormir y el primero al despertar',
    60: 'Mi niña, si el destino tiene voz, suena parecida a la tuya',
    70: 'Te abrazo con palabras porque aún no puedo hacerlo con mis brazos',
    80: 'Mi amor, cuidarte es mi manera más bonita de quererte',
    90: 'Eres mi lugar seguro aunque estemos en países distintos',
    100: 'Mi niña amada, hay cosas que no se escriben… se susurran',
    110: 'Mi niño quiere perderse donde tú te encuentras',
    120: 'Princesa, tu risa tiene permiso de desordenarme',
    130: 'Si me miras así otra vez, no respondo por mis latidos',
    140: 'Cielito, tienes un talento especial para provocarme sonrisas peligrosas',
    150: 'Me encanta cuando te pones tierna… y un poquito traviesa',
    160: 'Mi amor, contigo aprendí que el deseo también puede ser respetuoso',
    170: 'Hay pensamientos contigo que no se confiesan… se imaginan',
    180: 'Si estuvieras aquí te explicaría con calma lo que te haría sentir',
    190: 'Hay lugares de ti que todavía no conozco… y ya los extraño',
    200: 'Si seguimos así, voy a necesitar un manual para sobrevivirte',
    210: 'Mi amor llegaste al punto que no podré controlarme; aun así asumiré la responsabilidad'
};

function regar() {

    nivelAmor += 10;

    const panel = document.getElementById('panelJuego');
    const nivel = document.getElementById('nivel');
    const indicador = document.getElementById('indicadorFase');
    const barra = document.getElementById('barraFill');

    // Barra progreso
    const porcentaje = Math.min((nivelAmor / 200) * 100, 100);
    if (barra) barra.style.width = porcentaje + '%';

    // Cambiar fondo dinámico (manteniendo tu estilo)
    if (nivelAmor <= 100) {
        panel.style.background = `linear-gradient(135deg,
            rgba(255, 209, 232, ${0.3 + (nivelAmor / 100) * 0.7}),
            rgba(255, 182, 217, ${0.3 + (nivelAmor / 100) * 0.7}))`;
    } 
    else if (nivelAmor <= 200) {
        panel.style.background = `linear-gradient(135deg,
            rgba(255, 138, 196, ${0.5 + ((nivelAmor - 100) / 100) * 0.5}),
            rgba(255, 95, 174, ${0.5 + ((nivelAmor - 100) / 100) * 0.5}))`;
    } 
    else {
        panel.style.background = `linear-gradient(135deg,
            rgba(255, 0, 122, 0.9),
            rgba(255, 47, 148, 0.9))`;
    }

    // Ajustar contraste automáticamente
    ajustarContrasteTexto(nivelAmor);

    // Indicador
    if (nivelAmor <= 50) {
        indicador.innerHTML = '🌱 Germinando';
    } else if (nivelAmor <= 100) {
        indicador.innerHTML = '🌸 Floreciendo';
    } else if (nivelAmor <= 150) {
        indicador.innerHTML = '💕 Enamorándose';
    } else if (nivelAmor <= 200) {
        indicador.innerHTML = '💋 Apasionándose';
    } else {
        indicador.innerHTML = '🔥 Incontrolable';
    }

    // Mensaje
    const mensaje = mensajesPorNivel[nivelAmor] || mensajesPorNivel[210];
    nivel.textContent = mensaje;

    gsap.from('#nivel', {
        scale: 1.05,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out'
    });

    crearParticulas(panel);
}


// ===============================
// AJUSTE AUTOMÁTICO DE CONTRASTE
// ===============================

function ajustarContrasteTexto(nivel) {

    const mensaje = document.getElementById('nivel');
    const indicador = document.getElementById('indicadorFase');

    if (!mensaje || !indicador) return;

    mensaje.style.transition = 'all 0.4s ease';
    indicador.style.transition = 'all 0.4s ease';

    if (nivel <= 100) {
        mensaje.style.color = '#5a0033';
        indicador.style.color = '#7a0044';
        mensaje.style.textShadow = '0 2px 6px rgba(255,255,255,0.6)';
    } 
    else if (nivel <= 200) {
        mensaje.style.color = '#4a0028';
        indicador.style.color = '#4a0028';
        mensaje.style.textShadow = '0 2px 6px rgba(255,255,255,0.4)';
    } 
    else {
        mensaje.style.color = '#ffffff';
        indicador.style.color = '#ffffff';
        mensaje.style.textShadow = '0 0 10px rgba(255,255,255,0.8)';
    }

    mensaje.style.opacity = '1';
    mensaje.style.filter = 'none';
}


// ===============================
// PARTÍCULAS
// ===============================

function crearParticulas(panel) {

    for (let i = 0; i < 6; i++) {

        const particula = document.createElement('div');
        particula.className = 'particula-amor';
        particula.textContent = ['💕','💖','💗','💓','💝'][Math.floor(Math.random()*5)];
        particula.style.left = Math.random() * 100 + '%';
        particula.style.top = '50%';

        panel.appendChild(particula);

        gsap.to(particula, {
            y: -80,
            opacity: 0,
            duration: 1.2,
            ease: 'power2.out',
            onComplete: () => particula.remove()
        });
    }
}


// ===============================
// ANIMACIÓN INICIAL
// ===============================

window.addEventListener('load', () => {

    gsap.from('.titulo-principal', {
        opacity: 0,
        y: -50,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.from('.contador-container', {
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        delay: 0.3,
        ease: 'back.out'
    });

    gsap.from('.carta-inicio', {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.6,
        ease: 'power3.out'
    });
});
