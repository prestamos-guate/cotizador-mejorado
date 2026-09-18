// FUNCIÓN PARA MOSTRAR / OCULTAR CONTRASEÑA EN EL FORMULARIO DE ACCESO
document.addEventListener('DOMContentLoaded', function() {
    const btnToggle = document.getElementById('btn-toggle-password');
    if (btnToggle) {
        btnToggle.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                btnToggle.textContent = 'OCULTAR';
                btnToggle.style.background = '#0284c7';
            } else {
                passwordInput.type = 'password';
                btnToggle.textContent = 'MOSTRAR';
                btnToggle.style.background = '#475569';
            }
        });
    }
});

const USUARIO_CORRECTO = "prestamos";
const CONTRASENA_CORRECTA = "cotizacion26";

const loginScreen = document.getElementById('login-screen');
const appScreen = document.getElementById('app-screen');
const summarySection = document.getElementById('summary-section');

// ACCIÓN: LOGEARSE (INICIAR SESIÓN)
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (user === USUARIO_CORRECTO && pass === CONTRASENA_CORRECTA) {
        loginScreen.style.display = 'none';
        appScreen.style.display = 'block';
        document.getElementById('login-form').reset();
        actualizarTabla();
    } else {
        alert("Usuario o contraseña incorrectos.");
    }
});

// ACCIÓN: CERRAR SESIÓN
document.getElementById('btn-logout').addEventListener('click', function() {
    if (confirm("¿Está seguro que desea cerrar la sesión actual?")) {
        appScreen.style.display = 'none';
        summarySection.classList.add('hidden');
        document.getElementById('loan-form').reset();
        loginScreen.style.display = 'block';
    }
});

// NUEVA FUNCIÓN: FORMATO DE COMAS EN TIEMPO REAL MIENTRAS EL ASESOR ESCRIBE
document.getElementById('amount').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, "");
    if (value) {
        e.target.value = parseInt(value).toLocaleString('en-US');
    } else {
        e.target.value = "";
    }
});

// CALCULAR E INYECTAR DATOS EN EL RESUMEN
document.getElementById('loan-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const dpi = document.getElementById('dpi').value.trim();
    const name = document.getElementById('client-name').value.trim();
    // MEJORA: Limpia las comas visuales de la caja antes de hacer la operación matemática
    const amount = parseFloat(document.getElementById('amount').value.replace(/,/g, ""));
    const months = parseInt(document.getElementById('months').value);
    const interestRate = parseFloat(document.getElementById('interest').value);

    // FÓRMULAS INTERÉS SIMPLE MENSUAL
    const monthlyInterest = amount * (interestRate / 100);
    const totalInterest = monthlyInterest * months;
    const totalReturn = amount + totalInterest;
    const monthlyPayment = totalReturn / months;

    // INYECTAR EN LAS TARJETAS RESUMEN
    document.getElementById('res-client-info').textContent = name.toUpperCase() + " (DPI: " + dpi + ")";
    document.getElementById('card-amount').textContent = "Q " + amount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    document.getElementById('card-monthly-interest').textContent = "Q " + monthlyInterest.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    document.getElementById('card-total-interest').textContent = "Q " + totalInterest.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    document.getElementById('card-total-return').textContent = "Q " + totalReturn.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    document.getElementById('card-monthly-payment').textContent = "Q " + monthlyPayment.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    // MOSTRAR CONTENEDOR DE RESULTADOS
    summarySection.classList.remove('hidden');

    // GUARDAR REGISTRO COMPLETO
    const cotizacion = { dpi, name, amount, interestRate, months, monthlyInterest, totalInterest, totalReturn, monthlyPayment };
    localStorage.setItem("prestamo_" + dpi, JSON.stringify(cotizacion));
    
    actualizarTabla();
});

// ACCIÓN: COPIAR MENSAJE COMERCIAL PARA WHATSAPP
document.getElementById('btn-whatsapp').addEventListener('click', function() {
    var nameInput = document.getElementById('client-name').value.trim().toUpperCase();
    // MEJORA: Limpia las comas de la caja para que no altere el mensaje comercial
    var amountInput = document.getElementById('amount').value.replace(/,/g, "");
    var monthsInput = document.getElementById('months').value;

    if (!nameInput || !amountInput || !monthsInput) {
        alert("Por favor, primero calcule o busque una cotización antes de copiar.");
        return;
    }

    var interesPorcentaje = parseFloat(document.getElementById('interest').value);
    var calculoInteresTotal = parseFloat(amountInput) * (interesPorcentaje / 100) * parseInt(monthsInput);
    var totalInteresMasCapital = parseFloat(amountInput) + calculoInteresTotal;
    var tasaMensualPorcentaje = document.getElementById('interest').value;

    var mensajeText = "¡Hola " + nameInput + "! Te saluda tu asesor financiero. Te comparto las condiciones aprobadas para tu solicitud de crédito en Quetzales:\n\n" +
                      "• Monto aprobado: Q " + parseFloat(amountInput).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + "\n" +
                      "• Tasa de interés mensual: " + tasaMensualPorcentaje + "%\n" +
                      "• Plazo aprobado: " + monthsInput + " meses\n" +
                      "• Total a devolver (Interés + Capital): Q " + totalInteresMasCapital.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + "\n\n" +
                      "Quedo a la espera de tus documentos para proceder con la firma y el desembolso de tus fondos. ¡Feliz día!";

    navigator.clipboard.writeText(mensajeText).then(function() {
        alert("💼 ¡Mensaje comercial copiado al portapapeles!\n\nYa puedes ir a WhatsApp con tu cliente y presionar Pegar (Ctrl + V).");
    }).catch(function(err) {
        alert("No se pudo copiar automáticamente, por favor intente de nuevo.");
    });
});

// NUEVO CLIENTE (LIMPIAR PANTALLA)
document.getElementById('btn-new').addEventListener('click', function() {
    document.getElementById('loan-form').reset();
    summarySection.classList.add('hidden');
});

// BUSCAR POR DPI
document.getElementById('btn-search').addEventListener('click', function() {
    const dpi = document.getElementById('dpi').value.trim();
    const registro = localStorage.getItem("prestamo_" + dpi);

       if (registro) {
        const datos = JSON.parse(registro);
        document.getElementById('dpi').value = datos.dpi;
        document.getElementById('client-name').value = datos.name;
        // MEJORA: Al buscar, formatea el número recuperado con sus comas visuales
        document.getElementById('amount').value = parseInt(datos.amount).toLocaleString('en-US');
        document.getElementById('months').value = datos.months;
        document.getElementById('interest').value = datos.interestRate;

        // INCREMENTO: Forzamos a que aparezca el resumen y el botón de WhatsApp al buscar
        document.getElementById('res-client-info').textContent = datos.name.toUpperCase() + " (DPI: " + datos.dpi + ")";
        document.getElementById('card-amount').textContent = "Q " + datos.amount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        document.getElementById('card-monthly-interest').textContent = "Q " + datos.monthlyInterest.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        document.getElementById('card-total-interest').textContent = "Q " + datos.totalInterest.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        document.getElementById('card-total-return').textContent = "Q " + datos.totalReturn.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        document.getElementById('card-monthly-payment').textContent = "Q " + datos.monthlyPayment.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        
        summarySection.classList.remove('hidden');

        alert("Cliente cargado y resumen desplegado con éxito.");
    } else {

        alert("No se encontraron registros con ese número de DPI.");
    }
});

// ELIMINAR REGISTRO
document.getElementById('btn-delete').addEventListener('click', function() {
    const dpi = document.getElementById('dpi').value.trim();
    if (localStorage.getItem("prestamo_" + dpi)) {
        if (confirm("¿Está seguro que desea eliminar de forma permanente esta cotización?")) {
            localStorage.removeItem("prestamo_" + dpi);
            document.getElementById('loan-form').reset();
            summarySection.classList.add('hidden');
            actualizarTabla();
        }
    } else {
        alert("DPI no encontrado en los registros.");
    }
});

// RENDERIZAR TABLA DE ASESORES ORDENADA ALFABÉTICAMENTE
function actualizarTabla() {
    const tbody = document.getElementById('records-body');
    tbody.innerHTML = "";
    
    // Crear un arreglo temporal para meter todos los clientes primero
    let listaClientes = [];

    // Recolectar datos de la memoria
    for (let i = 0; i < localStorage.length; i++) {
        const clave = localStorage.key(i);
        if (clave.startsWith('prestamo_')) {
            const d = JSON.parse(localStorage.getItem(clave));
            listaClientes.push(d);
        }
    }

    // ORDENAR ALFABÉTICAMENTE POR NOMBRE (De la A a la Z)
    listaClientes.sort(function(a, b) {
        return a.name.toUpperCase().localeCompare(b.name.toUpperCase());
    });

    // Dibujar la tabla ya ordenada en la pantalla
    listaClientes.forEach(function(d) {
        const fila = document.createElement('tr');
        fila.innerHTML = "<td>" + d.dpi + "</td>" +
                         "<td><strong>" + d.name.toUpperCase() + "</strong></td>" +
                         "<td>Q " + parseFloat(d.amount).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + "</td>" +
                         "<td>" + d.interestRate + "%</td>" +
                         "<td>" + d.months + " meses</td>" +
                         "<td>Q " + parseFloat(d.monthlyInterest).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + "</td>" +
                         "<td>Q " + parseFloat(d.totalInterest).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + "</td>" +
                         "<td>Q " + parseFloat(d.totalReturn).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + "</td>" +
                         "<td>Q " + parseFloat(d.monthlyPayment).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + "</td>";
        tbody.appendChild(fila);
    });
}

// ACCIÓN: DOBLE CLIC EN LA TABLA PARA RECALCULAR
document.getElementById('records-table').addEventListener('dblclick', function(e) {
    const celda = e.target;
    if (celda.tagName === 'TD' || celda.tagName === 'STRONG') {
        const fila = celda.closest('tr');
        const dpiSeleccionado = fila.cells[0].textContent; 
        
        const registro = localStorage.getItem("prestamo_" + dpiSeleccionado);
        
        if (registro) {
            const datos = JSON.parse(registro);
            
            document.getElementById('dpi').value = datos.dpi;
            document.getElementById('client-name').value = datos.name;
            document.getElementById('amount').value = parseInt(datos.amount).toLocaleString('en-US');
            document.getElementById('months').value = datos.months;
            document.getElementById('interest').value = datos.interestRate;
            
            document.getElementById('res-client-info').textContent = datos.name.toUpperCase() + " (DPI: " + datos.dpi + ")";
            document.getElementById('card-amount').textContent = "Q " + datos.amount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
            document.getElementById('card-monthly-interest').textContent = "Q " + datos.monthlyInterest.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
            document.getElementById('card-total-interest').textContent = "Q " + datos.totalInterest.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
            document.getElementById('card-total-return').textContent = "Q " + datos.totalReturn.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
            document.getElementById('card-monthly-payment').textContent = "Q " + datos.monthlyPayment.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

            summarySection.classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
});