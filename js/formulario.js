// formulario.js — validar con JavaScript y avisar junto a cada campo
const $form = document.querySelector('#form-contacto'); // <form novalidate>
const $exito = document.querySelector('#exito-contacto');
const CAMPOS = ['nombre', 'correo', 'celular', 'mensaje'];
 
// Cada regla devuelve un texto de error o '' si el campo está bien
const reglas = {
  nombre: v => v.trim().length < 3 ? 'Escribe al menos 3 letras.' : '',
  correo: v => !/^\S+@\S+\.\S+$/.test(v) ? 'El correo no tiene un formato válido.' : '',
  celular: v => !/^9\d{8}$/.test(v) ? 'Debe tener 9 dígitos y empezar con 9.' : '',
  mensaje: v => v.trim().length < 10 ? 'Cuéntanos un poco más (mínimo 10 caracteres).' : ''
};
 
function validar(datos) {
  const errores = {};
  CAMPOS.forEach(campo => {
    const error = reglas[campo](datos[campo] ?? '');
    if (error) errores[campo] = error;
  });
  return errores;
}
 
// Muestra u oculta el error de un solo campo y actualiza aria-invalid
function marcarCampo(campo, mensaje) {
  document.querySelector(`#error-${campo}`).textContent = mensaje;
  $form.elements[campo].setAttribute('aria-invalid', Boolean(mensaje));
}
 
if ($form) {
  $form.addEventListener('submit', e => {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData($form));
    const errores = validar(datos);
    CAMPOS.forEach(campo => marcarCampo(campo, errores[campo] ?? ''));
 
    if (Object.keys(errores).length === 0) {
      $form.reset();
      $exito.hidden = false;
    } else {
      $exito.hidden = true;
      $form.elements[Object.keys(errores)[0]].focus(); // lleva el cursor al primer error
    }
  });
 
  // Al salir de un campo se valida solo ese campo (focusout sí burbujea)
  $form.addEventListener('focusout', e => {
    const campo = e.target.name;
    if (CAMPOS.includes(campo)) marcarCampo(campo, reglas[campo](e.target.value));
  });
}