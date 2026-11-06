
// app.js — pintar el sitio y escuchar eventos (funciona en las 4 páginas)
const carrito = new Carrito();
 
// Elementos que existen solo en algunas páginas (si no están, valen null)
const $contador = document.querySelector('#contador');
const $catalogo = document.querySelector('#catalogo');
const $destacados = document.querySelector('#destacados');
const $buscador = document.querySelector('#buscador');
const $filtro = document.querySelector('#filtro-categoria');
const $vacio = document.querySelector('#sin-resultados');
const $detalle = document.querySelector('#detalle');
const $lineas = document.querySelector('#lineas-carrito');
const $resumen = document.querySelector('#resumen');
const $formCupon = document.querySelector('#form-cupon');
const $msgCupon = document.querySelector('#msg-cupon');
const $aviso = document.querySelector('#aviso');
 
const soles = n => `S/ ${n.toFixed(2)}`;
let cuponActual = localStorage.getItem('gamarrita-cupon') ?? '';
 
// Imagen de reemplazo si algún archivo de img/ no carga
const PLACEHOLDER = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><rect width='100%25' height='100%25' fill='%23E6DFCF'/><text x='50%25' y='50%25' text-anchor='middle' fill='%236B6558' font-family='sans-serif' font-size='18'>Gamarrita KFC</text></svg>";
 
/* ---------- Mensajes y contador ---------- */
 
let temporizador;
function avisar(texto) {
  $aviso.textContent = texto;
  $aviso.classList.add('visible');
  clearTimeout(temporizador);
  temporizador = setTimeout(() => $aviso.classList.remove('visible'), 2200); // temporizador
}
 
function pintarContador() {
  $contador.textContent = carrito.contar();
}
 
/* ---------- Catálogo ---------- */
 
function plantillaProducto(p) {
  const agotado = p.stock === 0;
  return `
    <article class="tarjeta">
      <img src="${p.imagen}" alt="${p.nombre}" width="300" height="300" loading="lazy">
      <div class="tarjeta-cuerpo">
        <span class="etiqueta">${p.categoria}</span>
        <h3>${p.nombre}</h3>
        <p class="precio">${soles(p.precio)}</p>
        <div class="acciones">
          <button type="button" class="btn-secundario" data-detalle="${p.id}">Ver detalle</button>
          <button type="button" class="btn" data-agregar="${p.id}" ${agotado ? 'disabled' : ''}>${agotado ? 'Agotado' : 'Agregar'}</button>
        </div>
      </div>
    </article>`;
}
 
function pintarProductos(contenedor, lista) {
  contenedor.innerHTML = lista.map(plantillaProducto).join('');
}
 
// Llena el <select> con las categorías que existen en datos.js
function pintarCategorias() {
  const categorias = [...new Set(productos.map(p => p.categoria))];
  $filtro.innerHTML = '<option value="todas">Todas las categorías</option>' +
    categorias.map(c => `<option value="${c}">${c}</option>`).join('');
}
 
// Aplica búsqueda por texto + filtro por categoría
function filtrarCatalogo() {
  const q = $buscador.value.trim().toLowerCase();
  const cat = $filtro.value;
  const lista = productos.filter(p =>
    (cat === 'todas' || p.categoria === cat) && p.nombre.toLowerCase().includes(q));
  pintarProductos($catalogo, lista);
  $vacio.hidden = lista.length > 0;
}
 
function abrirDetalle(id) {
  const p = productos.find(x => x.id === id);
  if (!p) return;
  $detalle.querySelector('#detalle-contenido').innerHTML = `
    <img src="${p.imagen}" alt="${p.nombre}" width="300" height="300">
    <div>
      <span class="etiqueta">${p.categoria}</span>
      <h2>${p.nombre}</h2>
      <p>${p.descripcion}</p>
      <p class="precio">${soles(p.precio)}</p>
      <p class="stock">Stock disponible: ${p.stock}</p>
      <button type="button" class="btn" data-agregar="${p.id}">Agregar al carrito</button>
    </div>`;
  $detalle.showModal();
}
 
// Un solo oyente por contenedor (delegación de eventos)
function manejarClickProducto(e) {
  const btnAgregar = e.target.closest('[data-agregar]');
  if (btnAgregar) {
    const ok = carrito.agregar(btnAgregar.dataset.agregar);
    pintarContador();
    avisar(ok ? 'Producto agregado al carrito' : 'Ya tienes todo el stock disponible');
    return;
  }
  const btnDetalle = e.target.closest('[data-detalle]');
  if (btnDetalle) abrirDetalle(btnDetalle.dataset.detalle);
}
 
/* ---------- Carrito ---------- */
 
function pintarCarrito() {
  const lineas = carrito.items
    .map(i => ({ producto: productos.find(p => p.id === i.id), cantidad: i.cantidad }))
    .filter(l => l.producto);
 
  if (lineas.length === 0) {
    $lineas.innerHTML = '<p class="vacio">Tu carrito está vacío. <a href="catalogo.html">Elige algo del catálogo</a>.</p>';
    $resumen.hidden = true;
    return;
  }
 
  $lineas.innerHTML = lineas.map(({ producto: p, cantidad }) => `
    <article class="linea">
      <img src="${p.imagen}" alt="${p.nombre}" width="300" height="300">
      <div class="linea-info">
        <h3>${p.nombre}</h3>
        <p>${soles(p.precio)} c/u</p>
        <p class="stock">Stock: ${p.stock}</p>
      </div>
      <div class="cantidad">
        <button type="button" class="btn-secundario" data-menos="${p.id}" aria-label="Quitar una unidad de ${p.nombre}">−</button>
        <input type="number" min="1" max="${p.stock}" value="${cantidad}" data-cantidad="${p.id}" aria-label="Cantidad de ${p.nombre}">
        <button type="button" class="btn-secundario" data-mas="${p.id}" aria-label="Agregar una unidad de ${p.nombre}">+</button>
      </div>
      <p class="linea-total">${soles(subtotalLinea(p.precio, cantidad))}</p>
      <button type="button" class="btn-quitar" data-quitar="${p.id}">Quitar</button>
    </article>`).join('');
 
  const r = calcularResumen(lineas, cuponActual);
  $resumen.hidden = false;
  $resumen.querySelector('#resumen-detalle').innerHTML = `
    <dt>Subtotal</dt><dd>${soles(r.subtotal)}</dd>
    <dt>Descuento${r.cupon.valido ? ' (' + cuponActual + ')' : ''}</dt><dd>− ${soles(r.descuento)}</dd>
    <dt>Envío ${r.envio === 0 ? '(gratis)' : ''}</dt><dd>${soles(r.envio)}</dd>
    <dt class="menor">Base imponible</dt><dd class="menor">${soles(r.base)}</dd>
    <dt class="menor">IGV (18 % incluido)</dt><dd class="menor">${soles(r.igv)}</dd>
    <dt class="total">Total a pagar</dt><dd class="total">${soles(r.total)}</dd>`;
  $msgCupon.textContent = r.cupon.mensaje;
  $msgCupon.classList.toggle('error-texto', cuponActual !== '' && !r.cupon.valido);
}
 
function manejarClickCarrito(e) {
  const mas = e.target.closest('[data-mas]');
  const menos = e.target.closest('[data-menos]');
  const quitar = e.target.closest('[data-quitar]');
  const finalizar = e.target.closest('[data-finalizar]');
 
  if (mas) {
    if (!carrito.agregar(mas.dataset.mas)) avisar('No hay más stock de este producto');
  } else if (menos) {
    const id = menos.dataset.menos;
    const item = carrito.items.find(i => i.id === id);
    if (item) carrito.cambiarCantidad(id, item.cantidad - 1);
  } else if (quitar) {
    carrito.quitar(quitar.dataset.quitar);
  } else if (finalizar) {
    finalizarCompra();
    return;
  } else {
    return;
  }
  pintarContador();
  pintarCarrito();
}
 
// Cambio manual de cantidad en el input numérico
function manejarCambioCantidad(e) {
  const campo = e.target.closest('[data-cantidad]');
  if (!campo) return;
  const aplicada = carrito.cambiarCantidad(campo.dataset.cantidad, campo.value);
  if (String(aplicada) !== campo.value) avisar(`Cantidad ajustada a ${aplicada} (stock disponible)`);
  pintarContador();
  pintarCarrito();
}
 
function aplicarCuponForm(e) {
  e.preventDefault();
  cuponActual = $formCupon.elements.cupon.value.trim().toUpperCase();
  localStorage.setItem('gamarrita-cupon', cuponActual);
  pintarCarrito();
}
 
// El checkout termina en un resumen del pedido (sin pasarela de pago)
function finalizarCompra() {
  const lineas = carrito.items.map(i => ({ producto: productos.find(p => p.id === i.id), cantidad: i.cantidad }));
  const r = calcularResumen(lineas, cuponActual);
  carrito.vaciar();
  cuponActual = '';
  localStorage.removeItem('gamarrita-cupon');
  pintarContador();
  $resumen.hidden = true;
  $lineas.innerHTML = `<p class="vacio exito">¡Gracias por tu compra! Registramos tu pedido por ${soles(r.total)}. <a href="catalogo.html">Seguir comprando</a></p>`;
}
 
/* ---------- Eventos ---------- */
 
// click (delegado) en catálogo, destacados y detalle
[$catalogo, $destacados, $detalle].forEach(c => c && c.addEventListener('click', manejarClickProducto));
 
if ($detalle) {
  // cerrar con el botón o haciendo click fuera de la ventana
  $detalle.addEventListener('click', e => {
    if (e.target === $detalle || e.target.closest('[data-cerrar]')) $detalle.close();
  });
}
 
if ($buscador) $buscador.addEventListener('input', filtrarCatalogo);          // input
if ($filtro) $filtro.addEventListener('change', filtrarCatalogo);             // change
 
if ($lineas) {
  $lineas.addEventListener('click', manejarClickCarrito);                     // click (delegado)
  $lineas.addEventListener('change', manejarCambioCantidad);                  // change
  $resumen.addEventListener('click', manejarClickCarrito);
}
if ($formCupon) $formCupon.addEventListener('submit', aplicarCuponForm);      // submit
 
// keydown: la tecla "/" lleva el cursor al buscador
document.addEventListener('keydown', e => {
  if (e.key === '/' && $buscador && document.activeElement !== $buscador) {
    e.preventDefault();
    $buscador.focus();
  }
});
 
// scroll: sombra en el header al bajar
window.addEventListener('scroll', () => {
  document.querySelector('.cabecera').classList.toggle('con-sombra', window.scrollY > 10);
});
 
// Si otra pestaña cambia el carrito, este contador se actualiza
window.addEventListener('storage', e => {
  if (e.key === carrito.clave) {
    carrito.items = JSON.parse(e.newValue) ?? [];
    pintarContador();
    if ($lineas) pintarCarrito();
  }
});
 
// error (en fase de captura porque no burbujea): imagen rota → imagen de reemplazo
document.addEventListener('error', e => {
  if (e.target.tagName === 'IMG' && !e.target.dataset.reemplazada) {
    e.target.dataset.reemplazada = 'si';
    e.target.src = PLACEHOLDER;
  }
}, true);
 
// DOMContentLoaded: pintar lo que corresponda a cada página
document.addEventListener('DOMContentLoaded', () => {
  pintarContador();
  if ($destacados) pintarProductos($destacados, productos.slice(0, 4));
  if ($catalogo) { pintarCategorias(); filtrarCatalogo(); }
  if ($lineas) pintarCarrito();
});
 