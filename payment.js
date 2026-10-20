
const bankNumbers = {
    BCA: "98888 1234 5678",
    BNI: "98889 1234 5678",
    BRI: "98887 1234 5678",
    Mandiri: "98886 1234 5678"
};

const productPrices = {
    1: 89000,
    2: 129000,
    3: 149000,
    4: 99000,
    5: 119000,
    6: 199000,
    7: 49000,
    8: 129000
};

function formatRupiah(amount) {
    return "Rp " + amount.toLocaleString("id-ID");
}

function getCart() {
    try {
        return JSON.parse(localStorage.getItem("girlShopCart")) || [];
    } catch {
        return [];
    }
}

const cart = getCart();

const subtotal = cart.reduce((sum, item) => {
    return sum +
        (productPrices[item.id] || 0) * (item.quantity || 1);
}, 0);

const shipping = subtotal === 0 || subtotal >= 300000 ? 0 : 15000;
const total = subtotal + shipping;

document.getElementById("payment-subtotal").textContent =
    formatRupiah(subtotal);

document.getElementById("payment-shipping").textContent =
    shipping === 0 ? "Gratis" : formatRupiah(shipping);

document.getElementById("payment-total").textContent =
    formatRupiah(total);

const bankInputs = document.querySelectorAll('input[name="bank"]');
const vaNumber = document.getElementById("va-number");

bankInputs.forEach(input => {
    input.addEventListener("change", () => {
        vaNumber.textContent = bankNumbers[input.value];
        document.getElementById("payment-status").textContent = "";
    });
});

document.getElementById("copy-va").addEventListener("click", async () => {
    const number = vaNumber.textContent.replace(/\s/g, "");

    try {
        await navigator.clipboard.writeText(number);
        document.getElementById("copy-va").textContent = "Copied!";
    } catch {
        window.prompt("Salin nomor VA ini:", number);
    }
});

document.getElementById("paid-btn").addEventListener("click", () => {
    document.getElementById("payment-status").textContent =
        "Pesanan tercatat dalam simulasi. Pembayaran belum terverifikasi.";
});
