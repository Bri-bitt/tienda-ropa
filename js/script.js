/* Lógica de la tienda: muestra productos y maneja el carrito */
const fmt = n => "$" + n.toLocaleString("es-MX") + " MXN";
let carrito = [];
try { carrito = JSON.parse(localStorage.getItem("carrito-sw")) || []; } catch (e) { carrito = []; }

/* ---------- Dibujar productos ---------- */
function dibujar(categoria) {
  const cont = document.getElementById("rejilla-" + categoria);
  cont.innerHTML = PRODUCTOS.filter(p => p.categoria === categoria).map(p => `
    <article class="tarjeta">
      <div class="foto"><img src="${p.imagen}" alt="${p.nombre}" loading="lazy"></div>
      <div class="info">
        <h3>${p.nombre}</h3>
        <p class="desc">${p.descripcion}</p>
        <p class="precio"><strong>${fmt(p.precio)}</strong> <s>${fmt(p.antes)}</s></p>
        <button class="btn" data-id="${p.id}">Agregar al carrito</button>
      </div>
    </article>`).join("");
}
dibujar("hombre");
dibujar("mujer");

/* ---------- Carrito ---------- */
const panel = document.getElementById("carrito");
const velo = document.getElementById("velo");
const abrir = () => { panel.classList.add("abierto"); velo.classList.add("visible"); };
const cerrar = () => { panel.classList.remove("abierto"); velo.classList.remove("visible"); };

function guardar() {
  try { localStorage.setItem("carrito-sw", JSON.stringify(carrito)); } catch (e) {}
  pintarCarrito();
}

function pintarCarrito() {
  const lista = document.getElementById("lista-carrito");
  let total = 0, cantidad = 0;
  if (carrito.length === 0) {
    lista.innerHTML = '<li class="vacio">Tu carrito está vacío. Agrega una prenda para empezar.</li>';
  } else {
    lista.innerHTML = carrito.map(item => {
      const p = PRODUCTOS.find(x => x.id === item.id);
      total += p.precio * item.cant; cantidad += item.cant;
      return `<li>
        <img src="${p.imagen}" alt="${p.nombre}">
        <div>
          <p class="n">${p.nombre}</p>
          <p>${fmt(p.precio)}</p>
          <div class="cant">
            <button data-menos="${p.id}" aria-label="Quitar uno">−</button>
            <span>${item.cant}</span>
            <button data-mas="${p.id}" aria-label="Agregar uno">+</button>
          </div>
        </div></li>`;
    }).join("");
  }
  document.getElementById("total").textContent = fmt(total);
  document.getElementById("contador").textContent = cantidad;
}

function agregar(id) {
  const existe = carrito.find(i => i.id === id);
  existe ? existe.cant++ : carrito.push({ id, cant: 1 });
  guardar(); abrir();
}

function cambiar(id, delta) {
  const item = carrito.find(i => i.id === id);
  if (!item) return;
  item.cant += delta;
  if (item.cant <= 0) carrito = carrito.filter(i => i.id !== id);
  guardar();
}

document.addEventListener("click", e => {
  const b = e.target.closest("button");
  if (!b) return;
  if (b.dataset.id) agregar(Number(b.dataset.id));
  if (b.dataset.mas) cambiar(Number(b.dataset.mas), 1);
  if (b.dataset.menos) cambiar(Number(b.dataset.menos), -1);
});
document.getElementById("abrirCarrito").onclick = abrir;
document.getElementById("cerrarCarrito").onclick = cerrar;
velo.onclick = cerrar;
document.addEventListener("keydown", e => { if (e.key === "Escape") cerrar(); });
document.getElementById("vaciar").onclick = () => { carrito = []; guardar(); };
document.getElementById("finalizar").onclick = () => {
  if (carrito.length === 0) return alert("Tu carrito está vacío.");
  alert("Gracias por tu interés. El pago en línea aún no está conectado; ahora mismo esta tienda es una vitrina de demostración.");
};

pintarCarrito();
