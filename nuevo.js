// ==================== CONFIGURACIÓN INICIAL ====================
// Optimización de rendimiento
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isLowPerf = isMobile && window.innerWidth < 768;

// ==================== NAVEGACIÓN ENTRE SECCIONES ====================
function ir(id) {
    const secciones = document.querySelectorAll('.seccion');
    const seccionActiva = document.getElementById(id);
    
    // Remover clase activa de todas las secciones
    secciones.forEach(s => {
        s.classList.remove('activa');
    });
    
    // Activar sección seleccionada
    seccionActiva.classList.add('activa');
    
    // Scroll suave al inicio
    window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
    });
    
    // Animación de entrada con GSAP (solo si no es dispositivo de bajo rendimiento)
    if (!isLowPerf) {
        setTimeout(() => {
            // Animación de cartas
            const cartas = seccionActiva.querySelectorAll('.carta');
            gsap.from(cartas, {
                y: 40,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out',
                clearProps: 'all' // Limpiar propiedades al finalizar
            });
            
            // Animación del jardín
            const jardin = seccionActiva.querySelector('.jardin-contenedor');
            if (jardin) {
                gsap.from(jardin.querySelectorAll('.categoria-frases'), {
                    y: 30,
                    scale: 0.95,
                    duration: 0.7,
                    stagger: 0.2,
                    ease: 'back.out(1.4)',
                    clearProps: 'all'
                });
            }
            
            // Animación del juego
            const juego = seccionActiva.querySelector('.juego-contenedor');
            if (juego) {
                gsap.from('#panelJuego', {
                    scale: 0.9,
                    rotationY: 15,
                    duration: 0.8,
                    ease: 'back.out(1.2)',
                    clearProps: 'all'
                });
            }
            
            // Animación de promesas
            const promesas = seccionActiva.querySelectorAll('.promesa');
            if (promesas.length > 0) {
                gsap.from(promesas, {
                    x: -30,
                    duration: 0.5,
                    stagger: 0.05,
                    ease: 'power2.out',
                    clearProps: 'all'
                });
            }
        }, 50);
    }
    
    // Efecto de pulso en el botón de navegación activo
    const botones = document.querySelectorAll('.nav-btn');
    botones.forEach(btn => {
        if (!isLowPerf) {
            gsap.to(btn, {
                scale: 1,
                duration: 0.2,
                ease: 'power1.out'
            });
        }
    });
    
    // Resaltar botón activo
    const botonActivo = event?.target?.closest('.nav-btn');
    if (botonActivo && !isLowPerf) {
        gsap.to(botonActivo, {
            scale: 1.1,
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });
    }
}

// ==================== MODO DÍA/NOCHE MEJORADO ====================
function modo() {
    const body = document.body;
    const icono = document.getElementById('iconoModo');
    const esModoNoche = body.classList.toggle('noche');
    
    // Cambiar icono con animación
    if (!isLowPerf) {
        gsap.to(icono, {
            scale: 0,
            rotation: 180,
            duration: 0.3,
            ease: 'back.in',
            onComplete: () => {
                icono.textContent = esModoNoche ? '☀️' : '🌙';
                gsap.to(icono, {
                    scale: 1,
                    rotation: 0,
                    duration: 0.3,
                    ease: 'back.out'
                });
            }
        });
    } else {
        icono.textContent = esModoNoche ? '☀️' : '🌙';
    }
    
    // Crear o eliminar estrellas
    if (esModoNoche) {
        crearEstrellas();
        if (!isLowPerf) {
            // Efecto de transición suave
            gsap.to(body, {
                background: 'linear-gradient(180deg, #0e0712 0%, #1a0e1f 100%)',
                duration: 0.6,
                ease: 'power2.inOut'
            });
        }
    } else {
        eliminarEstrellas();
        if (!isLowPerf) {
            gsap.to(body, {
                background: 'linear-gradient(180deg, #fff5fa 0%, #ffe6f2 100%)',
                duration: 0.6,
                ease: 'power2.inOut'
            });
        }
    }
    
    // Guardar preferencia en localStorage
    localStorage.setItem('modoNoche', esModoNoche ? 'true' : 'false');
}

// ==================== CREAR ESTRELLAS PARA MODO NOCHE ====================
function crearEstrellas() {
    const particulas = document.getElementById('particulas');
    if (!particulas) return;
    
    particulas.innerHTML = '';
    const numEstrellas = isMobile ? 30 : 50;
    
    for (let i = 0; i < numEstrellas; i++) {
        const estrella = document.createElement('div');
        estrella.className = 'estrella';
        estrella.style.left = Math.random() * 100 + '%';
        estrella.style.top = Math.random() * 100 + '%';
        estrella.style.animationDelay = Math.random() * 3 + 's';
        estrella.style.animationDuration = (2 + Math.random() * 2) + 's';
        particulas.appendChild(estrella);
        
        // Animación de aparición con GSAP
        if (!isLowPerf) {
            gsap.from(estrella, {
                opacity: 0,
                scale: 0,
                duration: 0.6,
                delay: i * 0.02,
                ease: 'power2.out'
            });
        }
    }
}

function eliminarEstrellas() {
    const particulas = document.getElementById('particulas');
    if (!particulas) return;
    
    if (!isLowPerf) {
        const estrellas = particulas.querySelectorAll('.estrella');
        gsap.to(estrellas, {
            opacity: 0,
            scale: 0,
            duration: 0.4,
            stagger: 0.01,
            onComplete: () => {
                particulas.innerHTML = '';
            }
        });
    } else {
        particulas.innerHTML = '';
    }
}

// ==================== CONTADOR DE TIEMPO JUNTOS ====================
const inicio = new Date('2026-01-14T20:23:00-05:00');
let contadorInterval;

function actualizarContador() {
    const ahora = new Date();
    let diferencia = Math.floor((ahora - inicio) / 1000);

    const dias = Math.floor(diferencia / 86400);
    diferencia %= 86400;
    const horas = Math.floor(diferencia / 3600);
    diferencia %= 3600;
    const minutos = Math.floor(diferencia / 60);
    const segundos = diferencia % 60;

    const contador = document.getElementById('contador');
    if (!contador) return;

    const nuevoHTML = `
        <div class="tiempo-item">
            <span class="numero">${dias}</span>
            <span class="unidad">días</span>
        </div>
        <div class="separador">:</div>
        <div class="tiempo-item">
            <span class="numero">${horas}</span>
            <span class="unidad">horas</span>
        </div>
        <div class="separador">:</div>
        <div class="tiempo-item">
            <span class="numero">${minutos}</span>
            <span class="unidad">min</span>
        </div>
        <div class="separador">:</div>
        <div class="tiempo-item">
            <span class="numero">${segundos}</span>
            <span class="unidad">seg</span>
        </div>
    `;
    
    // Solo actualizar si el contenido cambió (optimización)
    if (contador.innerHTML !== nuevoHTML) {
        contador.innerHTML = nuevoHTML;
        
        // Animación sutil en los números que cambian
        if (!isLowPerf && segundos % 10 === 0) {
            const numeros = contador.querySelectorAll('.numero');
            gsap.from(numeros, {
                scale: 1.15,
                duration: 0.3,
                ease: 'back.out'
            });
        }
    }
}

// Iniciar contador
contadorInterval = setInterval(actualizarContador, 1000);
actualizarContador(); // Llamar inmediatamente

// ==================== ACTIVAR MÚSICA ====================
function activarAudio() {
    const audio = document.getElementById('musica');
    if (!audio) {
        console.warn('No se encontró el elemento de audio');
        return;
    }
    
    audio.volume = 0.4;
    
    // Intentar reproducir
    audio.play().then(() => {
        // Feedback visual con animación
        if (!isLowPerf) {
            gsap.timeline()
                .to('.boton-musica', {
                    scale: 0.92,
                    duration: 0.1,
                    ease: 'power2.in'
                })
                .to('.boton-musica', {
                    scale: 1.05,
                    duration: 0.2,
                    ease: 'elastic.out(1, 0.3)'
                })
                .to('.boton-musica', {
                    scale: 1,
                    duration: 0.15
                });
            
            // Pulso continuo mientras se reproduce
            gsap.to('.icono-boton', {
                scale: 1.2,
                duration: 0.5,
                yoyo: true,
                repeat: 5,
                ease: 'power1.inOut'
            });
        }
    }).catch(error => {
        console.log('No se pudo reproducir automáticamente:', error);
    });
}

// ==================== VARIABLES DEL JUEGO ====================
let nivelAmor = 0;
let ultimoClick = 0;
const COOLDOWN_MS = 100; // Evitar clicks demasiado rápidos

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

// ==================== FUNCIÓN REGAR MEJORADA ====================
function regar() {
    // Prevenir clicks muy rápidos
    const ahora = Date.now();
    if (ahora - ultimoClick < COOLDOWN_MS) return;
    ultimoClick = ahora;
    
    nivelAmor += 10;

    // Actualizar barra de progreso
    const porcentaje = Math.min((nivelAmor / 210) * 100, 100);
    const barraFill = document.getElementById('barraFill');
    
    if (!isLowPerf) {
        gsap.to(barraFill, {
            width: porcentaje + '%',
            duration: 0.6,
            ease: 'power2.out'
        });
    } else {
        barraFill.style.width = porcentaje + '%';
    }

    // Obtener elementos del panel
    const panel = document.getElementById('panelJuego');
    const nivel = document.getElementById('nivel');
    const indicador = document.getElementById('indicadorFase');

    // Cambiar colores y clases según nivel
    actualizarFaseJuego(nivelAmor, panel);
    actualizarIndicadorFase(nivelAmor, indicador);

    // Mostrar mensaje
    const mensaje = mensajesPorNivel[nivelAmor] || mensajesPorNivel[210];
    nivel.textContent = mensaje;

    // Animaciones del botón regar
    if (!isLowPerf) {
        gsap.timeline()
            .to('.boton-regar', {
                scale: 0.88,
                duration: 0.1,
                ease: 'power2.in'
            })
            .to('.boton-regar', {
                scale: 1.08,
                duration: 0.25,
                ease: 'elastic.out(1, 0.4)'
            })
            .to('.boton-regar', {
                scale: 1,
                duration: 0.2
            });

        // Animación del mensaje
        gsap.from('#nivel', {
            scale: 0.9,
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: 'back.out(1.4)'
        });
    }

    // Efecto de partículas al regar
    crearParticulas();

    // Vibración si está en nivel alto
    if (nivelAmor >= 200) {
        panel.classList.add('vibrando');
        setTimeout(() => panel.classList.remove('vibrando'), 500);
        
        // Haptic feedback en móviles
        if (navigator.vibrate && isMobile) {
            navigator.vibrate([50, 30, 50]);
        }
    }
    
    // Celebración especial al llegar al máximo
    if (nivelAmor === 210) {
        celebrarMaximoNivel();
    }
}

// ==================== ACTUALIZAR FASE DEL JUEGO ====================
function actualizarFaseJuego(nivel, panel) {
    if (nivel <= 100) {
        const intensidad = 0.3 + (nivel / 100) * 0.7;
        panel.style.background = `linear-gradient(135deg, 
            rgba(255, 209, 232, ${intensidad}), 
            rgba(255, 182, 217, ${intensidad}))`;
        panel.classList.remove('fase-coqueta', 'fase-atrevida');
        panel.classList.add('fase-tierna');
    } else if (nivel <= 200) {
        const intensidad = 0.5 + ((nivel - 100) / 100) * 0.5;
        panel.style.background = `linear-gradient(135deg, 
            rgba(255, 138, 196, ${intensidad}), 
            rgba(255, 95, 174, ${intensidad}))`;
        panel.classList.remove('fase-tierna', 'fase-atrevida');
        panel.classList.add('fase-coqueta');
    } else {
        panel.style.background = `linear-gradient(135deg, 
            rgba(255, 0, 122, 0.9), 
            rgba(255, 47, 148, 0.9))`;
        panel.classList.remove('fase-tierna', 'fase-coqueta');
        panel.classList.add('fase-atrevida');
    }
}

// ==================== ACTUALIZAR INDICADOR DE FASE ====================
function actualizarIndicadorFase(nivel, indicador) {
    let emoji, texto;
    
    if (nivel <= 50) {
        emoji = '🌱';
        texto = 'Germinando';
    } else if (nivel <= 100) {
        emoji = '🌸';
        texto = 'Floreciendo';
    } else if (nivel <= 150) {
        emoji = '💕';
        texto = 'Enamorándose';
    } else if (nivel <= 200) {
        emoji = '💋';
        texto = 'Apasionándose';
    } else {
        emoji = '🔥';
        texto = 'Incontrolable';
    }
    
    indicador.innerHTML = `<span class="emoji-fase">${emoji}</span><span class="texto-fase">${texto}</span>`;
    
    // Animación del cambio
    if (!isLowPerf) {
        gsap.from(indicador, {
            scale: 1.2,
            duration: 0.4,
            ease: 'back.out(1.7)'
        });
    }
}

// ==================== CREAR PARTÍCULAS DE AMOR ====================
function crearParticulas() {
    const panel = document.getElementById('panelJuego');
    const numParticulas = isMobile ? 5 : 8;
    const emojis = ['💕', '💖', '💗', '💓', '💝', '✨', '🌸'];
    
    for (let i = 0; i < numParticulas; i++) {
        const particula = document.createElement('div');
        particula.className = 'particula-amor';
        particula.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        particula.style.left = (Math.random() * 80 + 10) + '%';
        particula.style.top = '50%';
        panel.appendChild(particula);

        if (!isLowPerf) {
            gsap.to(particula, {
                y: -100 - Math.random() * 50,
                x: (Math.random() - 0.5) * 120,
                opacity: 0,
                rotation: Math.random() * 360,
                scale: 0.5 + Math.random() * 0.5,
                duration: 1.2 + Math.random() * 0.5,
                ease: 'power2.out',
                onComplete: () => particula.remove()
            });
        } else {
            setTimeout(() => particula.remove(), 1200);
        }
    }
}

// ==================== CELEBRACIÓN MÁXIMO NIVEL ====================
function celebrarMaximoNivel() {
    if (!isLowPerf) {
        // Explosión de corazones
        for (let i = 0; i < 20; i++) {
            setTimeout(() => crearParticulas(), i * 100);
        }
        
        // Animación especial del panel
        gsap.timeline()
            .to('#panelJuego', {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            })
            .to('#panelJuego', {
                scale: 1,
                duration: 0.5,
                ease: 'elastic.out(1, 0.4)'
            });
    }
    
    // Haptic feedback intenso
    if (navigator.vibrate && isMobile) {
        navigator.vibrate([100, 50, 100, 50, 200]);
    }
}

// ==================== ANIMACIONES DE ENTRADA INICIAL ====================
window.addEventListener('load', () => {
    // Restaurar preferencia de modo noche
    if (localStorage.getItem('modoNoche') === 'true') {
        document.body.classList.add('noche');
        document.getElementById('iconoModo').textContent = '☀️';
        crearEstrellas();
    }
    
    if (!isLowPerf) {
        // Animación del título principal
        gsap.from('.titulo-principal', {
            y: -60,
            duration: 1,
            ease: 'power3.out',
            clearProps: 'all'
        });

        // Animación de las flores decorativas
        gsap.from('.flor-animada', {
            scale: 0,
            rotation: -180,
            duration: 0.8,
            delay: 0.3,
            ease: 'back.out(1.7)',
            clearProps: 'all'
        });

        // Animación del contador
        gsap.from('.contador-container', {
            scale: 0.85,
            y: 30,
            duration: 0.8,
            delay: 0.4,
            ease: 'back.out(1.4)',
            clearProps: 'all'
        });

        // Animación de la carta inicial
        gsap.from('.carta-inicio', {
            y: 40,
            duration: 1,
            delay: 0.7,
            ease: 'power3.out',
            clearProps: 'all'
        });

        // Animación del botón de música
        gsap.from('.boton-musica', {
            scale: 0.8,
            duration: 0.6,
            delay: 1.3,
            ease: 'back.out(1.7)',
            clearProps: 'all'
        });
    }
    
    // Precargar GSAP para mejor rendimiento
    if (typeof gsap !== 'undefined') {
        gsap.config({
            force3D: true,
            nullTargetWarn: false
        });
    }
});

// ==================== OPTIMIZACIONES DE RENDIMIENTO ====================

// Throttle para eventos de scroll (si se necesita en el futuro)
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy loading de imágenes (si se agregan en el futuro)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    // Se puede usar en el futuro: document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// ==================== GESTIÓN DE MEMORIA ====================

// Limpiar interval al salir
window.addEventListener('beforeunload', () => {
    if (contadorInterval) {
        clearInterval(contadorInterval);
    }
});

// ==================== DETECCIÓN DE ORIENTACIÓN MÓVIL ====================
let orientacionAnterior = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';

window.addEventListener('resize', throttle(() => {
    const orientacionActual = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    
    if (orientacionActual !== orientacionAnterior && isMobile) {
        orientacionAnterior = orientacionActual;
        
        // Reajustar elementos si es necesario
        actualizarContador();
        
        // Pequeña animación de reajuste
        if (!isLowPerf) {
            const seccionActiva = document.querySelector('.seccion.activa');
            if (seccionActiva) {
                gsap.from(seccionActiva, {
                    opacity: 0.8,
                    duration: 0.3,
                    ease: 'power1.out'
                });
            }
        }
    }
}, 250));

// ==================== SCROLL SUAVE PARA NAVEGACIÓN ====================
document.addEventListener('DOMContentLoaded', () => {
    // Mejorar scroll suave en navegación
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!isLowPerf) {
                // Pequeña animación de feedback
                gsap.to(btn, {
                    scale: 0.9,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1
                });
            }
        });
    });
});

// ==================== GESTIÓN DE ERRORES ====================
window.addEventListener('error', (e) => {
    console.error('Error detectado:', e.error);
    // Aquí podrías agregar tracking de errores si lo necesitas
});

// ==================== EXPORTAR FUNCIONES GLOBALES ====================
window.irSeccion = ir;
window.cambiarModo = modo;
window.reproducirMusica = activarAudio;
window.regarAmor = regar;

console.log('💕 Sistema cargado correctamente para Anahí 🌸');
console.log('Modo:', isMobile ? 'Móvil' : 'Escritorio');
console.log('Rendimiento:', isLowPerf ? 'Optimizado' : 'Completo');