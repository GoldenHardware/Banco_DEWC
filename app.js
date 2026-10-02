const alumno = "José García Valdemora";

// ========================================
// NIVEL 01: Variables y formatearDinero()
// ========================================
const titular = "José García";
let saldoInicial = 1500;
const simboloMoneda = "€";

function formatearDinero(cantidad) {
    const dosDecimales = cantidad.toFixed(2);
    const conComa = dosDecimales.replace(".", ",");
    return `${conComa} ${simboloMoneda}`;
}

// ========================================
// NIVEL 02: Array de movimientos
// ========================================
let movimientos = [
    { id: 1, concepto: "Nómina septiembre", importe: 1800, categoria: "Nómina", fecha: "2026-09-01" },
    { id: 2, concepto: "Compra supermercado", importe: -85.5, categoria: "Comida", fecha: "2026-09-02" },
    { id: 3, concepto: "Cine y palomitas", importe: -28, categoria: "Ocio", fecha: "2026-09-03" },
    { id: 4, concepto: "Bus mensual", importe: -45, categoria: "Transporte", fecha: "2026-09-05" },
    { id: 5, concepto: "Restaurante con amigos", importe: -62.3, categoria: "Comida", fecha: "2026-09-08" },
    { id: 6, concepto: "Curso online de inglés", importe: -120, categoria: "Educación", fecha: "2026-09-10" },
    { id: 7, concepto: "Venta de bicicleta", importe: 250, categoria: "Otros", fecha: "2026-09-12" },
    { id: 8, concepto: "Farmacia", importe: -34.9, categoria: "Salud", fecha: "2026-09-15" }
];

// ========================================
// NIVEL 03: Cálculos con funciones y bucles
// ========================================
function totalIngresos() {
    let total = 0;
    for (let i = 0; i < movimientos.length; i++) {
        if (movimientos[i].importe > 0) {
            total += movimientos[i].importe;
        }
    }
    return total;
}

function totalGastos() {
    let total = 0;
    for (let i = 0; i < movimientos.length; i++) {
        if (movimientos[i].importe < 0) {
            total += movimientos[i].importe;
        }
    }
    return total;
}

function saldoActual() {
    return saldoInicial + totalIngresos() + totalGastos();
}

console.log("=== MONEYTRACK - Nivel 3 ===");
console.log("Titular:", titular);
console.log("Saldo inicial:", formatearDinero(saldoInicial));
console.log("Total ingresos:", formatearDinero(totalIngresos()));
console.log("Total gastos:", formatearDinero(totalGastos()));
console.log("Saldo actual:", formatearDinero(saldoActual()));

// ========================================
// NIVEL 04: Tabla HTML + filtro por categoría
// ========================================
function pintarTabla(listaMovimientos) {
    const cuerpoTabla = document.getElementById("cuerpo-tabla");
    if (!cuerpoTabla) return;
    cuerpoTabla.innerHTML = "";

    if (listaMovimientos.length === 0) {
        const fila = document.createElement("tr");
        fila.innerHTML = `<td colspan="5" class="vacio">No hay movimientos para mostrar</td>`;
        cuerpoTabla.appendChild(fila);
        return;
    }

    for (let i = 0; i < listaMovimientos.length; i++) {
        const movimiento = listaMovimientos[i];
        const fila = document.createElement("tr");

        const claseImporte = movimiento.importe >= 0 ? "ingreso" : "gasto";

        fila.innerHTML = `
            <td>${movimiento.fecha}</td>
            <td>${movimiento.concepto}</td>
            <td>${movimiento.categoria}</td>
            <td class="${claseImporte}">${formatearDinero(movimiento.importe)}</td>
            <td style="text-align:right;"><button class="boton-borrar" data-id="${movimiento.id}" title="Eliminar movimiento">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"/>
                    <path d="M10 11v6M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
                </svg>
            </button></td>
        `;

        cuerpoTabla.appendChild(fila);
    }

    const botonesBorrar = document.querySelectorAll(".boton-borrar");
    botonesBorrar.forEach((boton) => {
        boton.addEventListener("click", (e) => {
            const el = e.currentTarget;
            const id = parseInt(el.getAttribute("data-id"));
            borrarMovimiento(id);
        });
    });
}

function aplicarFiltroCategoria() {
    const select = document.getElementById("filtro-categoria");
    if (!select) return;
    const filtro = select.value;
    let listaFiltrada = movimientos;

    if (filtro !== "todas") {
        listaFiltrada = movimientos.filter((movimiento) => {
            return movimiento.categoria === filtro;
        });
    }

    pintarTabla(listaFiltrada);
}

// ========================================
// NIVEL 05: Estadísticas con reduce()
// ========================================
function totalGastosReduce() {
    const total = movimientos.reduce((acumulador, movimiento) => {
        if (movimiento.importe < 0) {
            return acumulador + movimiento.importe;
        }
        return acumulador;
    }, 0);
    return total;
}

function gastosPorCategoria() {
    const gastos = movimientos.filter((m) => m.importe < 0);

    const porCategoria = gastos.reduce((acumulador, movimiento) => {
        const categoria = movimiento.categoria;
        if (!acumulador[categoria]) {
            acumulador[categoria] = 0;
        }
        acumulador[categoria] += movimiento.importe;
        return acumulador;
    }, {});

    return porCategoria;
}

function categoriaConMasGasto(objetoGastos) {
    let maxCategoria = null;
    let maxValor = 0;

    const categorias = Object.keys(objetoGastos);

    for (let i = 0; i < categorias.length; i++) {
        const categoria = categorias[i];
        const valor = Math.abs(objetoGastos[categoria]);
        if (valor > maxValor) {
            maxValor = valor;
            maxCategoria = categoria;
        }
    }

    return { categoria: maxCategoria, importe: maxValor };
}

function pintarEstadisticas() {
    const contenedor = document.getElementById("gastos-por-categoria");
    const maxGasto = document.getElementById("categoria-max-gasto");
    if (!contenedor || !maxGasto) return;
    contenedor.innerHTML = "";

    const gastos = gastosPorCategoria();
    const categorias = Object.keys(gastos);

    if (categorias.length === 0) {
        contenedor.innerHTML = `<p class="vacio">No hay gastos registrados</p>`;
        maxGasto.textContent = "";
        return;
    }

    const valoresAbs = categorias.map((c) => Math.abs(gastos[c]));
    const maxAbs = Math.max(...valoresAbs);

    for (let i = 0; i < categorias.length; i++) {
        const categoria = categorias[i];
        const importe = gastos[categoria];
        const importeAbs = Math.abs(importe);
        const porcentaje = (importeAbs / maxAbs) * 100;

        const div = document.createElement("div");
        div.className = "categoria-gasto";
        div.innerHTML = `
            <div style="flex:1; min-width:0;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <span class="categoria-nombre">${categoria}</span>
                    <span class="categoria-importe">${formatearDinero(importe)}</span>
                </div>
                <div style="height:4px; background:rgba(255,255,255,0.05); border-radius:999px; overflow:hidden;">
                    <div style="width:${porcentaje}%; height:100%; background:linear-gradient(90deg, #ef4444, #f87171); border-radius:999px;"></div>
                </div>
            </div>
        `;
        contenedor.appendChild(div);
    }

    const top = categoriaConMasGasto(gastos);
    if (top.categoria) {
        maxGasto.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:center; gap:8px;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                Categoría con más gasto: <strong>${top.categoria}</strong> · ${formatearDinero(-top.importe)}
            </div>
        `;
    }
}

function pintarResumen() {
    const saldoActualEl = document.getElementById("saldo-actual");
    const ingresosEl = document.getElementById("total-ingresos");
    const gastosEl = document.getElementById("total-gastos");
    const saldoInicialMeta = document.getElementById("saldo-inicial-meta");
    const alumnoBadge = document.getElementById("alumno-badge");

    if (saldoActualEl) saldoActualEl.textContent = formatearDinero(saldoActual());
    if (ingresosEl) ingresosEl.textContent = formatearDinero(totalIngresos());
    if (gastosEl) gastosEl.textContent = formatearDinero(totalGastos());
    if (saldoInicialMeta) saldoInicialMeta.textContent = formatearDinero(saldoInicial);
    if (alumnoBadge) alumnoBadge.textContent = alumno;
}

// ========================================
// NIVEL 06: Añadir y borrar movimientos
// ========================================
function generarNuevoId() {
    if (movimientos.length === 0) {
        return 1;
    }
    const ids = movimientos.map((m) => m.id);
    const maxId = Math.max(...ids);
    return maxId + 1;
}

function anadirMovimiento(concepto, importe, categoria) {
    const hoy = new Date();
    const fechaStr = hoy.toISOString().split("T")[0];

    const nuevoMovimiento = {
        id: generarNuevoId(),
        concepto: concepto,
        importe: parseFloat(importe),
        categoria: categoria,
        fecha: fechaStr
    };

    movimientos.push(nuevoMovimiento);
}

function borrarMovimiento(id) {
    movimientos = movimientos.filter((movimiento) => {
        return movimiento.id !== id;
    });
    refrescar();
}

function refrescar() {
    pintarResumen();
    aplicarFiltroCategoria();
    pintarEstadisticas();
    actualizarGrafica();
}

// ========================================
// Sistema de partículas dinámicas (Canvas)
// ========================================
function iniciarParticulas() {
    const canvas = document.getElementById("particles-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let ancho = 0;
    let alto = 0;
    let animacionId = null;

    function ajustarTamanio() {
        const dpr = window.devicePixelRatio || 1;
        ancho = window.innerWidth;
        alto = window.innerHeight;
        canvas.width = ancho * dpr;
        canvas.height = alto * dpr;
        canvas.style.width = ancho + "px";
        canvas.style.height = alto + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const particulas = [];
    const CANTIDAD_BASE = 85;
    const DISTANCIA_CONEXION = 140;
    const RANGO_VELOCIDAD = 0.25;

    function calcularCantidad() {
        const area = ancho * alto;
        const proporcion = area / (1920 * 1080);
        return Math.max(40, Math.floor(CANTIDAD_BASE * proporcion));
    }

    function crearParticulas() {
        particulas.length = 0;
        const n = calcularCantidad();
        for (let i = 0; i < n; i++) {
            particulas.push({
                x: Math.random() * ancho,
                y: Math.random() * alto,
                vx: (Math.random() - 0.5) * RANGO_VELOCIDAD * 2,
                vy: (Math.random() - 0.5) * RANGO_VELOCIDAD * 2,
                r: Math.random() * 1.4 + 0.4,
                a: Math.random() * 0.5 + 0.2
            });
        }
    }

    let mouseX = -9999;
    let mouseY = -9999;

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    window.addEventListener("mouseleave", () => {
        mouseX = -9999;
        mouseY = -9999;
    });

    function actualizar() {
        for (let i = 0; i < particulas.length; i++) {
            const p = particulas[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > ancho) p.vx *= -1;
            if (p.y < 0 || p.y > alto) p.vy *= -1;

            const dx = mouseX - p.x;
            const dy = mouseY - p.y;
            const distMouse = Math.sqrt(dx * dx + dy * dy);
            if (distMouse < 150) {
                const fuerza = (150 - distMouse) / 150;
                p.vx += (dx / distMouse) * fuerza * 0.02;
                p.vy += (dy / distMouse) * fuerza * 0.02;
            }

            const velocidad = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (velocidad > RANGO_VELOCIDAD * 3) {
                p.vx = (p.vx / velocidad) * RANGO_VELOCIDAD * 3;
                p.vy = (p.vy / velocidad) * RANGO_VELOCIDAD * 3;
            }
        }
    }

    function dibujar() {
        ctx.clearRect(0, 0, ancho, alto);

        for (let i = 0; i < particulas.length; i++) {
            const p = particulas[i];
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.a})`;
            ctx.fill();
        }

        for (let i = 0; i < particulas.length; i++) {
            for (let j = i + 1; j < particulas.length; j++) {
                const p1 = particulas[i];
                const p2 = particulas[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < DISTANCIA_CONEXION) {
                    const alpha = (1 - dist / DISTANCIA_CONEXION) * 0.12;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }
    }

    function loop() {
        actualizar();
        dibujar();
        animacionId = requestAnimationFrame(loop);
    }

    function reiniciar() {
        ajustarTamanio();
        crearParticulas();
    }

    window.addEventListener("resize", () => {
        reiniciar();
    });

    reiniciar();
    loop();
}

// ========================================
// Eventos
// ========================================
let chartMov = null;

const CATEGORIAS_ORDEN = [
    "Nómina", "Comida", "Ocio", "Transporte", "Salud", "Educación", "Otros"
];

function calcularDatosGrafica() {
    if (movimientos.length === 0) {
        const hoy = new Date();
        const ayer = new Date(hoy);
        ayer.setDate(ayer.getDate() - 1);
        const antes = new Date(hoy);
        antes.setDate(antes.getDate() - 2);
        const iso = (d) => d.toISOString().split("T")[0];
        return {
            labels: [iso(antes), iso(ayer), iso(hoy)],
            ingresos: [saldoInicial, saldoInicial, saldoInicial],
            gastos: [0, 0, 0],
            saldo: [saldoInicial, saldoInicial, saldoInicial]
        };
    }

    const agrupados = {};

    for (let i = 0; i < movimientos.length; i++) {
        const m = movimientos[i];
        if (!agrupados[m.fecha]) {
            agrupados[m.fecha] = { ingresos: 0, gastos: 0 };
        }
        if (m.importe >= 0) {
            agrupados[m.fecha].ingresos += m.importe;
        } else {
            agrupados[m.fecha].gastos += Math.abs(m.importe);
        }
    }

    const fechasOrdenadas = Object.keys(agrupados).sort();

    let accIngresos = 0;
    let accGastos = 0;
    const labels = [];
    const ingresos = [];
    const gastos = [];
    const saldo = [];

    for (let i = 0; i < fechasOrdenadas.length; i++) {
        const fecha = fechasOrdenadas[i];
        const datos = agrupados[fecha];
        accIngresos += datos.ingresos;
        accGastos += datos.gastos;
        labels.push(fecha);
        ingresos.push(accIngresos);
        gastos.push(accGastos);
        saldo.push(saldoInicial + accIngresos - accGastos);
    }

    return { labels, ingresos, gastos, saldo };
}

function crearGradiente(ctx, area, colorHex, alfaIni, alfaFin) {
    const gradiente = ctx.createLinearGradient(0, area.top, 0, area.bottom);
    const hex = colorHex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    gradiente.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alfaIni})`);
    gradiente.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${alfaFin})`);
    return gradiente;
}

function crearGrafica() {
    const canvas = document.getElementById("chart-movimientos");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    Chart.defaults.color = "#868691";
    Chart.defaults.borderColor = "rgba(255,255,255,0.06)";
    Chart.defaults.font.family = "'Inter', -apple-system, system-ui, sans-serif";
    Chart.defaults.font.size = 11;

    const { labels, ingresos, gastos, saldo } = calcularDatosGrafica();

    chartMov = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Ingresos acumulados",
                    data: ingresos,
                    borderColor: "#22c55e",
                    backgroundColor: function (context) {
                        const chart = context.chart;
                        const { ctx: c, chartArea } = chart;
                        if (!chartArea) return "rgba(34, 197, 94, 0.15)";
                        return crearGradiente(c, chartArea, "#22c55e", 0.32, 0.01);
                    },
                    borderWidth: 2.5,
                    fill: true,
                    tension: 0.35,
                    pointRadius: 3,
                    pointHoverRadius: 6,
                    pointBackgroundColor: "#22c55e",
                    pointBorderColor: "#000000",
                    pointBorderWidth: 1.5,
                    pointHoverBorderWidth: 2
                },
                {
                    label: "Gastos acumulados",
                    data: gastos,
                    borderColor: "#ef4444",
                    backgroundColor: function (context) {
                        const chart = context.chart;
                        const { ctx: c, chartArea } = chart;
                        if (!chartArea) return "rgba(239, 68, 68, 0.15)";
                        return crearGradiente(c, chartArea, "#ef4444", 0.32, 0.01);
                    },
                    borderWidth: 2.5,
                    fill: true,
                    tension: 0.35,
                    pointRadius: 3,
                    pointHoverRadius: 6,
                    pointBackgroundColor: "#ef4444",
                    pointBorderColor: "#000000",
                    pointBorderWidth: 1.5,
                    pointHoverBorderWidth: 2
                },
                {
                    label: "Saldo",
                    data: saldo,
                    borderColor: "#ffffff",
                    backgroundColor: "transparent",
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.35,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    pointBackgroundColor: "#ffffff",
                    pointBorderColor: "#000000",
                    pointBorderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 850,
                easing: "easeOutQuart"
            },
            transitions: {
                active: { animation: { duration: 400 } }
            },
            interaction: {
                mode: "index",
                intersect: false
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: "#17171a",
                    titleColor: "#f5f5f7",
                    bodyColor: "#c9c9d1",
                    borderColor: "rgba(255,255,255,0.08)",
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    boxPadding: 6,
                    titleFont: { weight: "700" },
                    callbacks: {
                        title: function (items) {
                            return "Fecha: " + items[0].label;
                        },
                        label: function (ctx) {
                            const valor = ctx.parsed.y;
                            const numStr = valor.toFixed(2).replace(".", ",");
                            return ` ${ctx.dataset.label}: ${numStr} €`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: true,
                        color: "rgba(255,255,255,0.03)"
                    },
                    ticks: {
                        color: "#868691",
                        font: { weight: "600" },
                        maxRotation: 0,
                        autoSkip: true,
                        maxTicksLimit: 8
                    }
                },
                y: {
                    grid: {
                        color: "rgba(255,255,255,0.05)",
                        drawBorder: false
                    },
                    ticks: {
                        color: "#55555e",
                        callback: function (v) {
                            return v + " €";
                        }
                    }
                }
            }
        }
    });
}

function actualizarGrafica() {
    if (!chartMov) return;
    const { labels, ingresos, gastos, saldo } = calcularDatosGrafica();
    chartMov.data.labels = labels;
    chartMov.data.datasets[0].data = ingresos;
    chartMov.data.datasets[1].data = gastos;
    chartMov.data.datasets[2].data = saldo;
    chartMov.update();
}

document.addEventListener("DOMContentLoaded", () => {
    iniciarParticulas();
    crearGrafica();
    refrescar();
});

const formMovimiento = document.getElementById("form-movimiento");
if (formMovimiento) {
    formMovimiento.addEventListener("submit", (e) => {
        e.preventDefault();

        const conceptoInput = document.getElementById("concepto");
        const importeInput = document.getElementById("importe");
        const categoriaInput = document.getElementById("categoria");

        const concepto = conceptoInput.value.trim();
        const importeStr = importeInput.value.trim();
        const categoria = categoriaInput.value;

        if (concepto === "" || importeStr === "" || categoria === "") {
            alert("Por favor, rellena todos los campos");
            return;
        }

        const importe = parseFloat(importeStr);
        if (isNaN(importe)) {
            alert("El importe debe ser un número válido");
            return;
        }

        if (importe === 0) {
            alert("El importe no puede ser cero");
            return;
        }

        anadirMovimiento(concepto, importe, categoria);

        conceptoInput.value = "";
        importeInput.value = "";
        categoriaInput.value = "";

        refrescar();
    });
}

const filtroCategoria = document.getElementById("filtro-categoria");
if (filtroCategoria) {
    filtroCategoria.addEventListener("change", aplicarFiltroCategoria);
}
