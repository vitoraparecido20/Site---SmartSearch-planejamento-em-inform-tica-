// contato.js
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("form-contato");
    const mensagemSucesso = document.getElementById("mensagem-sucesso");

    form.addEventListener("submit", function(e) {
        e.preventDefault(); // evita recarregar a página

        // Exibe a mensagem de sucesso
        mensagemSucesso.style.display = "block";

        // Limpa os campos do formulário
        form.reset();

        // Esconde a mensagem depois de 5 segundos
        setTimeout(() => {
            mensagemSucesso.style.display = "none";
        }, 5000);
    });
});
