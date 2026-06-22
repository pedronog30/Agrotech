function enviarFormulario() {
    let valido = true;

    // Limpa erros anteriores
    document.querySelectorAll(".erro-msg").forEach(e => e.textContent = "");
    document.querySelectorAll(".campo").forEach(e => e.classList.remove("campo-erro"));

    // --- NOME ---
    let nome = document.getElementById("nome").value.trim();
    let partes = nome.split(" ").filter(p => p.length > 0);

    if (nome === "") {
        mostrarErro("erro-nome", "nome", "O nome não pode ser em branco.");
        valido = false;
    } else if (partes.length < 2) {
        mostrarErro("erro-nome", "nome", "Informe nome e sobrenome.");
        valido = false;
    } else if (partes[0].length < 2 || partes[partes.length - 1].length < 2) {
        mostrarErro("erro-nome", "nome", "Nome e sobrenome devem ter ao menos 2 letras cada.");
        valido = false;
    }

    // --- EMAIL ---
    let email = document.getElementById("email").value.trim();
    let regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
        mostrarErro("erro-email", "email", "O e-mail não pode ser em branco.");
        valido = false;
    } else if (!regexEmail.test(email)) {
        mostrarErro("erro-email", "email", "Informe um e-mail válido (ex: nome@email.com).");
        valido = false;
    }

    // --- MENSAGEM ---
    let mensagem = document.getElementById("mensagem").value.trim();

    if (mensagem === "") {
        mostrarErro("erro-mensagem", "mensagem", "A mensagem não pode ser em branco.");
        valido = false;
    } else if (mensagem.length > 500) {
        mostrarErro("erro-mensagem", "mensagem", "A mensagem deve ter no máximo 500 caracteres.");
        valido = false;
    }

    // --- ENVIO ---
    if (valido) {
        document.getElementById("mensagem-sucesso").style.display = "block";
        document.getElementById("nome").value = "";
        document.getElementById("email").value = "";
        document.getElementById("mensagem").value = "";
        document.getElementById("contador").textContent = "0/500 caracteres";
    }
}

function mostrarErro(idErro, idCampo, texto) {
    document.getElementById(idErro).textContent = texto;
    document.getElementById(idCampo).classList.add("campo-erro");
}

// Contador de caracteres da mensagem
document.addEventListener("DOMContentLoaded", function () {
    let textarea = document.getElementById("mensagem");
    let contador = document.getElementById("contador");

    textarea.addEventListener("input", function () {
        let total = textarea.value.length;
        contador.textContent = total + "/500 caracteres";
        contador.style.color = total > 500 ? "#c62828" : "#999";
    });

    // Remove erro ao digitar
    document.getElementById("nome").addEventListener("input", function () {
        document.getElementById("erro-nome").textContent = "";
        this.classList.remove("campo-erro");
    });

    document.getElementById("email").addEventListener("input", function () {
        document.getElementById("erro-email").textContent = "";
        this.classList.remove("campo-erro");
    });

    textarea.addEventListener("input", function () {
        document.getElementById("erro-mensagem").textContent = "";
        this.classList.remove("campo-erro");
    });
});