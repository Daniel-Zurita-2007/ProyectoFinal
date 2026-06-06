/**
 * PROYECTO FINAL PROGRAMACIÓN WEB I - CONTROLADOR DE EVENTOS SEGURO
 * Esta estructura previene errores cruzados del DOM adjuntando los listeners 
 * únicamente si los elementos existen en la vista HTML actual.
 */

document.addEventListener("DOMContentLoaded", function () {

    // === MANEJO SEGURO DE EVENTOS POR ELEMENTO ID ===
    
    // Escenario A
    const btnA = document.getElementById('btn-calcular-a');
    if (btnA) { btnA.addEventListener('click', calcularCarburantes); }

    // Escenario B
    const btnB = document.getElementById('btn-calcular-b');
    if (btnB) { btnB.addEventListener('click', calcularAlimentos); }

    // Escenario C
    const btnC = document.getElementById('btn-calcular-c');
    if (btnC) { btnC.addEventListener('click', calcularTransporte); }

    // Escenario D
    const btnD = document.getElementById('btn-calcular-d');
    if (btnD) { btnD.addEventListener('click', calcularCompras); }

    // Escenario E
    const btnE = document.getElementById('btn-calcular-e');
    if (btnE) { btnE.addEventListener('click', calcularEscasez); }

    // Casos de Estudio (apart.html)
    const c1 = document.getElementById('btn-caso-1'); if (c1) { c1.addEventListener('click', correrCaso1); }
    const c2 = document.getElementById('btn-caso-2'); if (c2) { c2.addEventListener('click', correrCaso2); }
    const c3 = document.getElementById('btn-caso-3'); if (c3) { c3.addEventListener('click', correrCaso3); }
    const c4 = document.getElementById('btn-caso-4'); if (c4) { c4.addEventListener('click', correrCaso4); }
    const c5 = document.getElementById('btn-caso-5'); if (c5) { c5.addEventListener('click', correrCaso5); }

});

// Auxiliar para inyectar temas en las respuestas
function cambiarTemaResultado(idElemento, tema) {
    const el = document.getElementById(idElemento);
    if (el) { el.className = "result-box " + tema; }
}

// === LÓGICA DE ESCENARIO A: CARBURANTES ===
function calcularCarburantes() {
    const resInicial = parseFloat(document.getElementById('reserva-inicial').value);
    const consumo = parseFloat(document.getElementById('consumo-diario').value);
    const reabast = parseFloat(document.getElementById('reabastecimiento').value);
    const limiteCritico = parseFloat(document.getElementById('nivel-critico').value);
    const cajaRes = document.getElementById('resultado-carburantes');

    if (isNaN(resInicial) || isNaN(consumo) || isNaN(reabast) || isNaN(limiteCritico)) {
        alert("Campos vacíos o no válidos. Ingrese valores numéricos.");
        return;
    }

    let reserva = resInicial;
    let dias = 0;
    let diaCriticoEncontrado = -1;

    while (reserva > 0 && dias < 120) {
        reserva = reserva + reabast - consumo;
        dias++;
        if (reserva <= limiteCritico && diaCriticoEncontrado === -1) {
            diaCriticoEncontrado = dias;
        }
    }

    if (diaCriticoEncontrado !== -1) {
        cambiarTemaResultado('resultado-carburantes', 'dynamic-critical');
        cajaRes.innerHTML = `<strong>⚠️ ALERTA DE RESERVA BAJA:</strong><br>La reserva cae bajo el nivel crítico en el <strong>Día ${diaCriticoEncontrado}</strong>.<br>El inventario se agotará por completo a los <strong>${dias} días</strong> continuos.`;
    } else {
        cambiarTemaResultado('resultado-carburantes', 'dynamic-normal');
        cajaRes.innerHTML = `<strong>✅ NIVEL CONTROLADO:</strong><br>Las reservas se mantendrán óptimas y estables sin riesgo crítico durante el ciclo simulado.`;
    }
}

// === LÓGICA DE ESCENARIO B: PRECIOS ALIMENTOS ===
function calcularAlimentos() {
    const nombre = document.getElementById('alimento-nombre').value.trim();
    const pAnt = parseFloat(document.getElementById('precio-anterior').value);
    const pAct = parseFloat(document.getElementById('precio-actual').value);
    const cant = parseFloat(document.getElementById('cantidad-semana').value);
    const sem = parseFloat(document.getElementById('semanas-total').value);
    const cajaRes = document.getElementById('resultado-alimentos');

    if (!nombre || isNaN(pAnt) || isNaN(pAct) || isNaN(cant) || isNaN(sem)) {
        alert("Todos los campos de datos son requeridos.");
        return;
    }

    const inc = pAct - pAnt;
    const porc = (inc / pAnt) * 100;
    const totalExtra = inc * cant * sem;

    if (porc > 20) {
        cambiarTemaResultado('resultado-alimentos', 'dynamic-critical');
    } else if (porc > 0) {
        cambiarTemaResultado('resultado-alimentos', 'dynamic-warning');
    } else {
        cambiarTemaResultado('resultado-alimentos', 'dynamic-normal');
    }

    cajaRes.innerHTML = `<strong>📊 Impacto en Canasta Alimentaria (${nombre}):</strong><br>• Subida unitaria: +${inc.toFixed(2)} Bs (${porc.toFixed(1)}%)<br>• Sobrecosto acumulado proyectado: <strong>${totalExtra.toFixed(2)} Bs</strong> extra gastados por el hogar.`;
}

// === LÓGICA DE ESCENARIO C: COSTOS TRANSPORTE ===
function calcularTransporte() {
    const dNorm = parseFloat(document.getElementById('distancia-normal').value);
    const dDesv = parseFloat(document.getElementById('distancia-desvio').value);
    const cKm = parseFloat(document.getElementById('costo-km').value);
    const viajes = parseFloat(document.getElementById('viajes-semana').value);
    const cajaRes = document.getElementById('resultado-transporte');

    if (isNaN(dNorm) || isNaN(dDesv) || isNaN(cKm) || isNaN(viajes)) {
        alert("Por favor rellene el formulario de movilidad vial.");
        return;
    }

    const extraSemanal = (dDesv - dNorm) * cKm * viajes;

    if (extraSemanal > 50) {
        cambiarTemaResultado('resultado-transporte', 'dynamic-critical');
    } else {
        cambiarTemaResultado('resultado-transporte', 'dynamic-warning');
    }

    cajaRes.innerHTML = `<strong>🛣️ Pérdida por Desvío Logístico:</strong><br>• Sobrecosto operativo semanal: <strong>+${extraSemanal.toFixed(2)} Bs</strong> respecto a la ruta ordinaria.<br>• Impacto mensual estimado: ${(extraSemanal * 4.3).toFixed(2)} Bs.`;
}

// === LÓGICA DE ESCENARIO D: COMPRAS FAMILIARES ===
function calcularCompras() {
    const pres = parseFloat(document.getElementById('presupuesto').value);
    const total = parseFloat(document.getElementById('total-compra').value);
    const cajaRes = document.getElementById('resultado-compras');

    if (isNaN(pres) || isNaN(total)) {
        alert("Ingrese los montos de control fiscal.");
        return;
    }

    const bal = pres - total;

    if (bal >= 0) {
        cambiarTemaResultado('resultado-compras', 'dynamic-normal');
        cajaRes.innerHTML = `<strong>💰 FLUJO DE CAJA VIABLE:</strong><br>Fondos suficientes para la compra de la canasta. Superávit: <strong>${bal.toFixed(2)} Bs</strong>.`;
    } else {
        cambiarTemaResultado('resultado-compras', 'dynamic-critical');
        cajaRes.innerHTML = `<strong>🚨 CRISIS DE LIQUIDEZ (DÉFICIT):</strong><br>El capital disponible no cubre los costos de los productos. <strong>Faltan: ${Math.abs(bal).toFixed(2)} Bs</strong>.`;
    }
}

// === LÓGICA DE ESCENARIO E: RUMOR Y ESCASEZ ===
function calcularEscasez() {
    const dNorm = parseFloat(document.getElementById('demanda-normal').value);
    const pRumor = parseFloat(document.getElementById('porcentaje-rumor').value);
    const stock = parseFloat(document.getElementById('stock-disponible').value);
    const cajaRes = document.getElementById('resultado-escasez');

    if (isNaN(dNorm) || isNaN(pRumor) || isNaN(stock)) {
        alert("Introduzca datos de mercado válidos.");
        return;
    }

    const nDemanda = dNorm * (1 + (pRumor / 100));

    if (nDemanda > stock) {
        cambiarTemaResultado('resultado-escasez', 'dynamic-critical');
        cajaRes.innerHTML = `<strong>📉 DÉFICIT POR COMPRA DE PÁNICO:</strong><br>La demanda inducida por especulación de (<strong>${nDemanda.toFixed(0)} un.</strong>) quiebra las bodegas. Faltan ${Math.abs(stock - nDemanda).toFixed(0)} unidades para equilibrar el mercado.`;
    } else {
        cambiarTemaResultado('resultado-escasez', 'dynamic-normal');
        cajaRes.innerHTML = `<strong>📦 STOCK ADAPTATIVO RESISTENTE:</strong><br>Las existencias físicas toleran la ola especulativa. Margen remanente seguro en almacén: ${(stock - nDemanda).toFixed(0)} unidades.`;
    }
}

// === CONTROLADORES DE CASOS DE ESTUDIO (apart.html) ===
function correrCaso1() {
    const t = document.getElementById('res-caso1'); if (!t) return;
    let res = 10000; let dias = 0;
    while (res > 2000 && dias < 100) { res = res + 300 - 1200; dias++; }
    t.style.display = "block"; t.style.backgroundColor = "#fee2e2"; t.style.color = "#991b1b";
    t.innerHTML = `<strong>Resultado:</strong> Nivel crítico alcanzado en el <strong>Día ${dias}</strong>. Reserva final: ${res} L.`;
}

function correrCaso2() {
    const t = document.getElementById('res-caso2'); if (!t) return;
    let ant = (8 * 10) + (7 * 8) + (12 * 4);
    let act = (11 * 10) + (10 * 8) + (18 * 4);
    t.style.display = "block"; t.style.backgroundColor = "#fef3c7"; t.style.color = "#92400e";
    t.innerHTML = `<strong>Resultado:</strong> Gasto Antiguo: ${ant} Bs | Gasto Actual: ${act} Bs.<br><strong>Sobrecosto Inflacionario Neto: +${act - ant} Bs.</strong>`;
}

function correrCaso3() {
    const t = document.getElementById('res-caso3'); if (!t) return;
    let extra = (16 - 10) * 2 * 5;
    t.style.display = "block"; t.style.backgroundColor = "#dcfce7"; t.style.color = "#166534";
    t.innerHTML = `<strong>Resultado:</strong> El sobrecosto operativo calculado es de <strong>${extra} Bs semanales</strong>.`;
}

function correrCaso4() {
    const t = document.getElementById('res-caso4'); if (!t) return;
    t.style.display = "block"; t.style.backgroundColor = "#fee2e2"; t.style.color = "#991b1b";
    t.innerHTML = `<strong>Resultado:</strong> Insolvencia detectada. El balance arroja un déficit de capital de <strong>80 Bs</strong>.`;
}

function correrCaso5() {
    const t = document.getElementById('res-caso5'); if (!t) return;
    let nDem = 100 * (1 + (40 / 100));
    t.style.display = "block"; t.style.backgroundColor = "#fee2e2"; t.style.color = "#991b1b";
    t.innerHTML = `<strong>Resultado:</strong> Nueva Demanda: ${nDem} unidades.<br><strong>Estado: Quiebre de Almacén</strong> (Faltan ${nDem - 120} un.).`;
}