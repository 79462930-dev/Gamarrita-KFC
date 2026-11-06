// carrito.js — clase Carrito: guarda el estado y sabe persistirse en localStorage
class Carrito {
  constructor(clave = 'gamarrita-carrito') {
    this.clave = clave;
    // Leemos lo guardado; si no hay nada, empezamos con un array vacío
    this.items = JSON.parse(localStorage.getItem(clave)) ?? []; // [{ id, cantidad }]
  }
 
  // Busca el stock real de un producto en datos.js
  stockDe(id) {
    const producto = productos.find(p => p.id === id);
    return producto ? producto.stock : 0;
  }
 
  // Agrega 1 unidad sin superar el stock. Devuelve true si pudo agregar
  agregar(id) {
    const item = this.items.find(i => i.id === id);
    const actual = item ? item.cantidad : 0;
    if (actual >= this.stockDe(id)) return false;
    if (item) item.cantidad++;
    else this.items.push({ id, cantidad: 1 });
    this.guardar();
    return true;
  }
 
  // Quita la línea completa del producto
  quitar(id) {
    this.items = this.items.filter(i => i.id !== id);
    this.guardar();
  }
 
  // Cambia la cantidad (mínimo 1, máximo el stock). Devuelve la cantidad aplicada
  cambiarCantidad(id, n) {
    const item = this.items.find(i => i.id === id);
    if (!item) return 0;
    const cantidad = Math.min(Math.max(1, Math.floor(Number(n)) || 1), this.stockDe(id));
    item.cantidad = cantidad;
    this.guardar();
    return cantidad;
  }
 
  // Total de unidades (lo que muestra el contador del header)
  contar() {
    return this.items.reduce((acc, i) => acc + i.cantidad, 0);
  }
 
  vaciar() {
    this.items = [];
    this.guardar();
  }
 
  // localStorage solo guarda texto, por eso JSON.stringify
  guardar() {
    localStorage.setItem(this.clave, JSON.stringify(this.items));
  }
}
 