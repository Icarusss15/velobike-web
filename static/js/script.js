
const products = [
    {
        id: 1,
        name: "Polygon Xtrada 5",
        category: "sepeda lipat",
        price: 4500000,
        stock: 12,
        image: "images/lipat.jpg"
    },
    {
        id: 2,
        name: "Pixie",
        category: "Road Bike",
        price: 7500000,
        stock: 8,
        image: "images/pixie.jpg"
    },
    {
        id: 3,
        name: "BMX Miami 3",
        category: "City Bike",
        price: 2300000,
        stock: 15,
        image: "images/bmx1.jpg"
    },
    {
        id: 4,
        name: "Trek Marlin 5",
        category: "Mountain Bike",
        price: 6200000,
        stock: 5,
        image: "images/guns.jpg"
    },
    {
        id: 5,
        name: "Sepeda Kalcer",
        category: "yang kalcer kalcer aja",
        price: 950000000000,
        stock: 67,
        image: "images/kalcer1.jpg"
    },
    {
        id: 6,
        name: "berbagai sparepart lainnya",
        category: "part sepeda",
        price: 25000-1000000,
        stock: 467,
        image: "images/sperpat.jpg"
    }
];

let cart = [];

function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(number);
}

// MENAMPILKAN KATALOG
function displayProducts(category = "Semua") {
    const productList = document.getElementById("product-list");

    const filtered = category === "Semua"
        ? products
        : products.filter(item => item.category === category);

    productList.innerHTML = "";

    filtered.forEach(product => {
        productList.innerHTML += `
            <div class="product-card">
                <img
                    src="${"/static/" + product.image}"
                    alt="${product.name}"
                    onerror="this.src='https://placehold.co/600x400/222c23/a3c66b?text=Foto+Sepeda'"
                >

                <div class="product-info">
                    <p class="product-category">${product.category}</p>
                    <h3>${product.name}</h3>

                    <p class="product-price">
                        ${formatRupiah(product.price)}
                    </p>

                    <p class="product-stock">
                        Stok tersedia: ${product.stock} unit
                    </p>

                    <button
                        class="buy-button"
                        onclick="addToCart(${product.id})"
                        ${product.stock === 0 ? "disabled" : ""}
                    >
                        ${product.stock === 0 ? "Stok Habis" : "Tambah ke Keranjang"}
                    </button>
                </div>
            </div>
        `;
    });
}

// FILTER PRODUK
function filterProducts(category) {
    displayProducts(category);
}

// TAMBAH KE KERANJANG
function addToCart(id) {
    const product = products.find(item => item.id === id);
    const cartItem = cart.find(item => item.id === id);

    if (!product || product.stock <= 0) {
        alert("Stok produk habis!");
        return;
    }

    if (cartItem) {
        if (cartItem.quantity >= product.stock) {
            alert("Jumlah melebihi stok!");
            return;
        }
        cartItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    updateCart();
    alert("Produk berhasil ditambahkan!");
}

// UPDATE KERANJANG
function updateCart() {
    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");

    cartItems.innerHTML = "";

    let total = 0;
    let count = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        count += item.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong>
                    <p>${item.quantity} x ${formatRupiah(item.price)}</p>
                </div>
                <button onclick="removeFromCart(${item.id})">
                    Hapus
                </button>
            </div>
        `;
    });

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Keranjang masih kosong.</p>";
    }

    cartCount.textContent = count;
    cartTotal.textContent = formatRupiah(total);
}

// HAPUS PRODUK
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

// BUKA TUTUP KERANJANG
function toggleCart() {
    const panel = document.getElementById("cart-panel");

    panel.style.display =
        panel.style.display === "block" ? "none" : "block";
}

// CHECKOUT
function checkout() {
    if (cart.length === 0) {
        alert("Keranjang masih kosong!");
        return;
    }

    for (const item of cart) {
        const product = products.find(p => p.id === item.id);

        if (!product || product.stock < item.quantity) {
            alert("Stok " + item.name + " tidak mencukupi!");
            return;
        }
    }

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    alert("Pesanan berhasil dibuat!\nTotal: " + formatRupiah(total));

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        product.stock -= item.quantity;
    });

    cart = [];
    displayProducts();
    updateCart();
    toggleCart();
}

// JALANKAN
displayProducts();
updateCart();
