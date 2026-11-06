// calculos.js — funciones de subtotal, IGV incluido, envío y cupón
const IGV = 0.18;                 // 18 % ya incluido en los precios
const ENVIO_BASE = 12;            // costo de envío en soles
const ENVIO_GRATIS_DESDE = 250;   // regla propia: envío gratis desde S/ 250
 
// Cupones disponibles: porcentaje o monto fijo (con compra mínima opcional)
const CUPONES = {
  GAMARRA10: { tipo: 'porcentaje', valor: 10, minimo: 0 },
  KFC20: { tipo: 'monto', valor: 20, minimo: 150 }
};
 
// Redondea a céntimos para evitar 0.1 + 0.2 = 0.30000000000000004
function redondear(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}
 
function subtotalLinea(precio, cantidad) {
  return redondear(precio * cantidad);
}
 
// lineas = [{ producto, cantidad }]
function calcularSubtotal(lineas) {
  return redondear(lineas.reduce((acc, l) => acc + subtotalLinea(l.producto.precio, l.cantidad), 0));
}
 
// Devuelve { valido, descuento, mensaje } según el código y el subtotal
function aplicarCupon(codigo, subtotal) {
  if (!codigo) return { valido: false, descuento: 0, mensaje: '' };
  const cupon = CUPONES[codigo];
  if (!cupon) return { valido: false, descuento: 0, mensaje: 'El cupón no existe.' };
  if (subtotal < cupon.minimo) {
    return { valido: false, descuento: 0, mensaje: `Este cupón pide una compra mínima de S/ ${cupon.minimo.toFixed(2)}.` };
  }
  const bruto = cupon.tipo === 'porcentaje' ? subtotal * cupon.valor / 100 : cupon.valor;
  const descuento = redondear(Math.min(bruto, subtotal));
  return { valido: true, descuento, mensaje: `Cupón ${codigo} aplicado.` };
}
 
// Envío gratis desde S/ 250 (después del descuento); carrito vacío no paga envío
function calcularEnvio(montoConDescuento) {
  if (montoConDescuento <= 0) return 0;
  return montoConDescuento >= ENVIO_GRATIS_DESDE ? 0 : ENVIO_BASE;
}
 
// El precio ya incluye IGV: base = total / 1.18 e igv = total - base
function desglosarIGV(total) {
  const base = redondear(total / (1 + IGV));
  return { base, igv: redondear(total - base) };
}
 
// Junta todo en un solo objeto para pintar el resumen
function calcularResumen(lineas, codigoCupon) {
  const subtotal = calcularSubtotal(lineas);
  const cupon = aplicarCupon(codigoCupon, subtotal);
  const montoConDescuento = redondear(subtotal - cupon.descuento);
  const envio = calcularEnvio(montoConDescuento);
  const total = redondear(montoConDescuento + envio);
  const { base, igv } = desglosarIGV(total);
  return { subtotal, descuento: cupon.descuento, envio, total, base, igv, cupon };
}
 