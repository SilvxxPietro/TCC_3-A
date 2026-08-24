function Entrar() {
    window.location.href = "login.html";
}

// Aguarda o HTML carregar completamente antes de aplicar os eventos
document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. LÓGICA DE VERIFICAÇÃO DE LOGIN / PERFIL
    // ==========================================
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    
    const navBtnEntrar = document.getElementById('navBtnEntrar');
    const navPerfil = document.getElementById('navPerfil');
    const navNomeUsuario = document.getElementById('navNomeUsuario');
    const navEmailUsuario = document.getElementById('navEmailUsuario');
    const navBtnSair = document.getElementById('navBtnSair');
    const dropdown = document.querySelector('.profile-dropdown');

    // Se encontrar a sessão do usuário salva no navegador
    if (usuarioLogado) {
        const dadosUser = JSON.parse(usuarioLogado);
        
        // Insere os dados reais obtidos no login
        if (navNomeUsuario) navNomeUsuario.textContent = dadosUser.nome;
        if (navEmailUsuario) navEmailUsuario.textContent = dadosUser.email;
        
        // Esconde o botão de entrar e exibe o perfil do usuário
        if (navBtnEntrar) navBtnEntrar.style.display = 'none';
        if (navPerfil) navPerfil.style.display = 'flex';

        // Abre e fecha o menu flutuante apenas ao clicar no perfil/avatar
        navPerfil.addEventListener('click', (event) => {
            event.stopPropagation(); // Impede o clique de fechar o menu na mesma hora
            if (dropdown) dropdown.classList.toggle('show');
        });

        // Fecha o menu flutuante caso o usuário clique em qualquer outra parte da tela
        document.addEventListener('click', () => {
            if (dropdown) dropdown.classList.remove('show');
        });

    } else {
        // Se não houver login, garante que o botão Entrar apareça
        if (navBtnEntrar) navBtnEntrar.style.display = 'block';
        if (navPerfil) navPerfil.style.display = 'none';
    }

    // Ação do botão Sair da Conta (Logout)
    if (navBtnSair) {
        navBtnSair.addEventListener('click', function(event) {
            event.stopPropagation(); // Evita conflitos com o clique do container principal
            localStorage.removeItem('usuarioLogado'); // Deleta os dados do navegador
            window.location.reload(); // Recarrega a página principal para aplicar as mudanças
        });
    }

    // ==========================================
    // 2. Lógica da Barra de Busca
    // ==========================================
    const inputBusca = document.querySelector(".search-container input");
    
    if (inputBusca) {
        inputBusca.addEventListener("keyup", (event) => {
            if (event.key === "Enter") {
                const termoBusca = inputBusca.value.trim();
                if (termoBusca !== "") {
                    console.log(`Buscando por: ${termoBusca}`);
                    // Adicione aqui a função para filtrar os cards de jogos
                }
            }
        });
    }

    // ==========================================
    // 3. Captura de Filtros (Plataforma, Gênero e Ordenação)
    // ==========================================
    const filtrosSelect = document.querySelectorAll(".filter-select");
    
    filtrosSelect.forEach((select) => {
        select.addEventListener("change", (event) => {
            const opcaoSelecionada = event.target.value;
            console.log(`Filtro alterado para: ${opcaoSelecionada}`);
            // Adicione aqui a lógica para recarregar a lista de jogos filtrada
        });
    });

    // ==========================================
    // 4. Botão de Histórico / Recentes (Botão de Ampulheta ⏳)
    // ==========================================
    const btnHistorico = document.querySelector(".filter-btn.icon-btn");
    
    if (btnHistorico) {
        btnHistorico.addEventListener("click", () => {
            console.log("Botão de ordem cronológica/histórico clicado.");
            // Adicione aqui a lógica para ordenar por jogos mais recentes
        });
    }
});
