function toggleMenu() {
    document.querySelector(".navbar").classList.toggle("show");
}
function togglePassword(id) {
    const input = document.getElementById(id);
    input.type = input.type === "password" ? "text" : "password";
}

