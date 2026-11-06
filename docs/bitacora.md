# Bitácora · Gamarrita KFC

## Equipo
- Grupo N.°: (D)
- Tienda: Gamarrita KFC (ropa urbana)
- Repositorio: ([URL](https://github.com/79462930-dev/Gamarrita-KFC.git))
- Sitio publicado: (https://79462930-dev.github.io/Gamarrita-KFC/)

| Integrante | Usuario de GitHub |
|---|---|
| Maycol Lima Mamani | |
| Andre Nilton Avila Chavez | |
| Leydi Paz Figueroa | |
| Shandinie Alejo Calsina | |
| Sebastian Carlos Neira Huillca | |

## Tres decisiones de diseño
1. (qué decidimos, qué alternativas vimos y por qué elegimos esa)
2.Mejorar el color y diseño de la pagina; darle nuestra propia personalidad
3.seleecionar los productos a vender de nuestros gustos personales

## Tres decisiones de código
1. (por ejemplo: qué guardamos en localStorage y por qué)
2.Guardamos el carrito en localStorage bajo la clave gamarrita-carrito, como un arreglo de objetos con solo id y cantidad (por ejemplo { id: "p01", cantidad: 2 }). No guardamos el producto completo (nombre, precio, imagen). Cuando hay que mostrar el carrito, buscamos cada id en datos.js. Así, si cambia un precio o el stock, el carrito siempre muestra el dato actualizado y no uno viejo. Además, ocupa menos espacio.
3.Como localStorage solo guarda texto, usamos JSON.stringify para guardar y JSON.parse para leer. Elegimos localStorage y no sessionStorage porque queremos que el carrito siga ahí si el cliente cierra la pestaña y vuelve después. También guardamos el cupón aplicado con la clave gamarrita-cupon, para que no se pierda al recargar.

## Tres problemas reales
1. (qué pasaba, qué intentamos, qué funcionó y quién lo resolvió)
2. La página del carrito no abría bien y el carrito no funcionaba. Revisando los archivos vimos que el código de la clase Carrito estaba pegado en carrito.html y js/carrito.js estaba vacío, por lo que app.js no encontraba la clase. Lo resolvimos moviendo ese código a js/carrito.js y dejando carrito.html como una página HTML normal. Lo resolvió: (Rianha).
3.Al intentar abrir localhost:8080 salía “No se puede acceder a este sitio web”. Nos dimos cuenta de que no había ningún servidor corriendo. Lo resolvimos abriendo index.html desde el explorador de archivos / instalando la extensión Live Server en VS Code. Lo resolvió: (Maycol).

## Reparto y revisión cruzada
| Integrante | Qué construyó | Qué parte de otro revisó |


## Reutilización de los laboratorios
(qué tomamos de GL09 y GL10 y cómo lo adaptamos a Gamarrita KFC)
