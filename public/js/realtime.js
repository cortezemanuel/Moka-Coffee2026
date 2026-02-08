const socket = io();

const list = document.getElementById("productList");
const form = document.getElementById("productForm");

socket.on("products", (products) => {
  list.innerHTML = "";
  products.forEach((p) => {
    list.innerHTML += `
      <li>
        ${p.title} - $${p.price}
        <button onclick="deleteProduct('${p.id}')">Eliminar</button>
      </li>
    `;
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const product = {
    title: form.title.value,
    price: Number(form.price.value),
  };

  socket.emit("addProduct", product);
  form.reset();
});

function deleteProduct(id) {
  socket.emit("deleteProduct", id);
}
