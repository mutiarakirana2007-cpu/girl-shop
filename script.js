const products = [
    {
        id: 1,
        name: "Canvas Tote Bag",
        category: "bags",
        categoryName: "Bags",
        price: 89000,
        image: "assets/tote-bag.jpg",
        emoji: "👜",
        tag: "Bestseller"
    },
    {
        id: 2,
        name: "Quilted Cosmetic Pouch",
        category: "accessories",
        categoryName: "Accessories",
        price: 129000,
        image: "assets/cosmetic-pouch.jpg",
        emoji: "🎀",
        tag: "New"
    },
    {
        id: 3,
        name: "Secret Crush Candle",
        category: "home",
        categoryName: "Home & Living",
        price: 149000,
        image: "assets/candle.jpg",
        emoji: "🕯️",
        tag: "Popular"
    },
    {
        id: 4,
        name: "Cute Plush Keychain",
        category: "accessories",
        categoryName: "Accessories",
        price: 99000,
        image: "assets/plush-keychain.jpg",
        emoji: "🧸",
        tag: "Cute pick"
    },
    {
        id: 5,
        name: "Ribbon Cap",
        category: "accessories",
        categoryName: "Accessories",
        price: 119000,
        image: "assets/ribbon-cap.jpg",
        emoji: "🧢",
        tag: "Bestseller"
    },
    {
        id: 6,
        name: "Mini Shoulder Bag",
        category: "bags",
        categoryName: "Bags",
        price: 199000,
        image: "assets/shoulder-bag.jpg",
        emoji: "👝",
        tag: "New"
    },
    {
        id: 7,
        name: "Gingham Hair Bow",
        category: "accessories",
        categoryName: "Hair Accessories",
        price: 49000,
        image: "assets/hair-bow.jpg",
        emoji: "🎀",
        tag: "Popular"
    },
    {
        id: 8,
        name: "Strawberry Cup Set",
        category: "home",
        categoryName: "Home & Living",
        price: 129000,
        image: "assets/strawberry-cup.jpg",
        emoji: "☕",
        tag: "Sweet pick"
    }
];


function formatRupiah(harga) {
    return "Rp " + harga.toLocaleString("id-ID");
}

// Mengambil data keranjang dari localStorage.
function getCart() {
    const dataCart = localStorage.getItem("girlShopCart");

    if (dataCart === null) {
        return [];
    }

    return JSON.parse(dataCart);
}

function saveCart(cart) {
    localStorage.setItem("girlShopCart", JSON.stringify(cart));
}

function countCart() {
    const cart = getCart();
    let jumlah = 0;

    for (let i = 0; i < cart.length; i++) {
        jumlah = jumlah + cart[i].quantity;
    }

    return jumlah;
}

function updateCartCount() {
    const cartCount = document.getElementById("cart-count");

    if (cartCount !== null) {
        cartCount.textContent = countCart();
    }
}

function showMessage(pesan) {
    const toast = document.getElementById("toast");

    if (toast !== null) {
        toast.textContent = pesan;
        toast.classList.add("show");

        setTimeout(function () {
            toast.classList.remove("show");
        }, 2200);
    } else {
        alert(pesan);
    }
}

function addToCart(idProduk) {
    const cart = getCart();
    let produkAda = false;
    let namaProduk = "";

    for (let i = 0; i < products.length; i++) {
        if (products[i].id === idProduk) {
            namaProduk = products[i].name;
            break;
        }
    }

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === idProduk) {
            cart[i].quantity = cart[i].quantity + 1;
            produkAda = true;
            break;
        }
    }

    if (produkAda === false) {
        cart.push({
            id: idProduk,
            quantity: 1
        });
    }

    saveCart(cart);
    updateCartCount();
    showMessage(namaProduk + " berhasil ditambahkan ke bag ♡");
}

function showProducts(kategori) {
    const productGrid = document.getElementById("product-grid");

    // Berhenti jika halaman tidak memiliki katalog produk.
    if (productGrid === null) {
        return;
    }

    let isiProduk = "";

    for (let i = 0; i < products.length; i++) {
        const produk = products[i];

        if (kategori !== "all" && produk.category !== kategori) {
            continue;
        }

        isiProduk += `
            <article class="product-card">
                <div class="product-visual ${produk.category}">
                    <span class="tag">${produk.tag}</span>

                    <img
                        class="product-photo"
                        src="${produk.image}"
                        alt="${produk.name}"
                        onerror="this.style.display='none'; this.nextElementSibling.style.display='grid'"
                    >

                    <div class="shape product-fallback" style="display:none">
                        ${produk.emoji}
                    </div>

                    <button
                        class="add-button"
                        data-add="${produk.id}"
                        aria-label="Tambah ${produk.name} ke keranjang"
                    >+</button>
                </div>

                <div class="product-meta">
                    <span>${produk.name}</span>
                    <span>${formatRupiah(produk.price)}</span>
                </div>

                <p class="product-category">${produk.categoryName}</p>
            </article>
        `;
    }

    productGrid.innerHTML = isiProduk;

    const tombolTambah = productGrid.querySelectorAll("[data-add]");

    for (let i = 0; i < tombolTambah.length; i++) {
        tombolTambah[i].addEventListener("click", function () {
            const idProduk = Number(this.getAttribute("data-add"));
            addToCart(idProduk);
        });
    }
}

function showCart() {
    const cartItems = document.getElementById("cart-items");

    if (cartItems === null) {
        return;
    }

    const cart = getCart();
    let isiCart = "";
    let subtotal = 0;

    if (cart.length === 0) {
        isiCart = `
            <div class="empty-cart">
                <div class="empty-icon">♡</div>
                <h2>Your bag is waiting.</h2>
                <p>Belum ada produk di bag kamu. Yuk, temukan favoritmu.</p>
                <a class="button button-dark" href="index.html#produk">
                    Explore products ↗
                </a>
            </div>
        `;
    } else {
        for (let i = 0; i < cart.length; i++) {
            let produk = null;

            // Cari informasi produk dari daftar produk.
            for (let j = 0; j < products.length; j++) {
                if (products[j].id === cart[i].id) {
                    produk = products[j];
                    break;
                }
            }

            if (produk !== null) {
                const totalProduk = produk.price * cart[i].quantity;
                subtotal = subtotal + totalProduk;

                isiCart += `
                    <article class="cart-row">
                        <div class="cart-thumb ${produk.category}">
                            <img
                                src="${produk.image}"
                                alt="${produk.name}"
                                onerror="this.style.display='none'; this.nextElementSibling.style.display='block'"
                            >
                            <span style="display:none">${produk.emoji}</span>
                        </div>

                        <div>
                            <div class="cart-product-name">${produk.name}</div>
                            <div class="cart-product-category">${produk.categoryName}</div>

                            <div class="quantity-control">
                                <button data-minus="${produk.id}">−</button>
                                <span>${cart[i].quantity}</span>
                                <button data-plus="${produk.id}">+</button>
                            </div>

                            <button class="remove-button" data-remove="${produk.id}">
                                Remove
                            </button>
                        </div>

                        <div class="cart-price">${formatRupiah(totalProduk)}</div>
                    </article>
                `;
            }
        }
    }

    cartItems.innerHTML = isiCart;

    const tombolKurang = cartItems.querySelectorAll("[data-minus]");
    const tombolTambah = cartItems.querySelectorAll("[data-plus]");
    const tombolHapus = cartItems.querySelectorAll("[data-remove]");

    for (let i = 0; i < tombolKurang.length; i++) {
        tombolKurang[i].addEventListener("click", function () {
            ubahJumlah(Number(this.getAttribute("data-minus")), -1);
        });
    }

    for (let i = 0; i < tombolTambah.length; i++) {
        tombolTambah[i].addEventListener("click", function () {
            ubahJumlah(Number(this.getAttribute("data-plus")), 1);
        });
    }

    for (let i = 0; i < tombolHapus.length; i++) {
        tombolHapus[i].addEventListener("click", function () {
            hapusProduk(Number(this.getAttribute("data-remove")));
        });
    }

    const subtotalText = document.getElementById("subtotal");
    const totalText = document.getElementById("total");
    const shippingText = document.getElementById("shipping");

    if (subtotalText !== null) {
        subtotalText.textContent = formatRupiah(subtotal);
    }

    if (totalText !== null) {
        totalText.textContent = formatRupiah(subtotal);
    }

    if (shippingText !== null) {
        if (subtotal === 0) {
            shippingText.textContent = "—";
        } else if (subtotal >= 300000) {
            shippingText.textContent = "Gratis";
        } else {
            shippingText.textContent = "Dihitung saat checkout";
        }
    }

    updateCartCount();
}

function ubahJumlah(idProduk, perubahan) {
    const cart = getCart();

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === idProduk) {
            cart[i].quantity = cart[i].quantity + perubahan;
        if (cart[i].quantity <= 0) {
                cart.splice(i, 1); }

            break;
        }
    }

    saveCart(cart);
    showCart();
}

function hapusProduk(idProduk) {
    const cart = getCart();
    const cartBaru = [];

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id !== idProduk) {
            cartBaru.push(cart[i]);
        }
    }

    saveCart(cartBaru);
    showCart();
    showMessage("Produk berhasil dihapus dari bag.");
}

function aktifkanFilter() {
    const tombolFilter = document.querySelectorAll("[data-filter]");

    for (let i = 0; i < tombolFilter.length; i++) {
        tombolFilter[i].addEventListener("click", function () {
            // Hilangkan class active dari semua tombol filter.
            for (let j = 0; j < tombolFilter.length; j++) {
                tombolFilter[j].classList.remove("active");
            }

            // Beri class active pada tombol yang dipilih.
            this.classList.add("active");

            const kategori = this.getAttribute("data-filter");
            showProducts(kategori);
        });
    }
}


function aktifkanCheckout() {
    const tombolCheckout = document.getElementById("checkout-btn");

    if (tombolCheckout !== null) {
        tombolCheckout.addEventListener("click", function () {
            const cart = getCart();

            if (cart.length === 0) {
                showMessage("Bag kamu masih kosong.");
            } else {
                window.location.href = "payment.html";
            }
        });
    }
}


document.addEventListener("DOMContentLoaded", function () {
    updateCartCount();
    showProducts("all");
    showCart();
    aktifkanFilter();
    aktifkanCheckout();
});
