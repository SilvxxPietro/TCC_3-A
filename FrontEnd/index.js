function Entrar () {
    window.location.href = "login.html";
}

// Aguarda o HTML carregar completamente antes de aplicar os eventos
document.addEventListener("DOMContentLoaded", () => {
    
    // 2. Lógica da Barra de Busca
    const inputBusca = document.querySelector(".search-container input");
    
    inputBusca.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            const termoBusca = inputBusca.value.trim();
            if (termoBusca !== "") {
                console.log(`Buscando por: ${termoBusca}`);
                // Adicione aqui a função para filtrar os cards de jogos
            }
        }
    });

    // 3. Captura de Filtros (Plataforma, Gênero e Ordenação)
    const filtrosSelect = document.querySelectorAll(".filter-select");
    
    filtrosSelect.forEach((select) => {
        select.addEventListener("change", (event) => {
            const opcaoSelecionada = event.target.value;
            console.log(`Filtro alterado para: ${opcaoSelecionada}`);
            // Adicione aqui a lógica para recarregar a lista de jogos filtrada
        });
    });

    // 4. Botão de Histórico / Recentes (Botão de Ampulheta ⏳)
    const btnHistorico = document.querySelector(".filter-btn.icon-btn");
    
    if (btnHistorico) {
        btnHistorico.addEventListener("click", () => {
            console.log("Botão de ordem cronológica/histórico clicado.");
            // Adicione aqui a lógica para ordenar por jogos mais recentes
        });
    }
});
