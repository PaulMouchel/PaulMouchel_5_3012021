const url = new URL(window.location.href)
const orderId = url.searchParams.get("orderId");

document.getElementById("orderId").innerText = orderId