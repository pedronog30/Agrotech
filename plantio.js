// Guarda as escolhas do usuário
const escolhas = {
    clima: null,
    umidade: null,
    estacao: null
};

// Banco de dados de culturas
const culturas = {
    'quente-seco-verao': { 
        nome: 'Milho', 
        icone: 'fa-seedling', 
        dica: 'Solo bem drenado, plantio direto no verão' 
    },
    'quente-umido-verao': { 
        nome: 'Arroz', 
        icone: 'fa-wheat-awn', 
        dica: 'Ideal em terrenos alagados ou irrigados' 
    },
    'quente-seco-primavera': { 
        nome: 'Feijão', 
        icone: 'fa-seedling', 
        dica: 'Precisa de pouca água, solo arenoso' 
    },
    'quente-umido-primavera': { 
        nome: 'Soja', 
        icone: 'fa-leaf', 
        dica: 'Bastante sol e chuva regular' 
    },
    'moderado-umido-primavera': { 
        nome: 'Tomate', 
        icone: 'fa-apple-whole', 
        dica: 'Sol direto e regas frequentes' 
    },
    'moderado-seco-outono': { 
        nome: 'Mandioca', 
        icone: 'fa-carrot', 
        dica: 'Resistente, cresce em quase todo tipo de solo' 
    },
    'moderado-umido-outono': { 
        nome: 'Alface', 
        icone: 'fa-leaf', 
        dica: 'Sombra parcial e regas diárias' 
    },
    'frio-seco-inverno': { 
        nome: 'Trigo', 
        icone: 'fa-wheat-awn', 
        dica: 'Suporta geada, solo bem preparado' 
    },
    'frio-umido-inverno': { 
        nome: 'Cenoura', 
        icone: 'fa-carrot', 
        dica: 'Solo macio e profundo' 
    },
    'frio-umido-outono': { 
        nome: 'Batata', 
        icone: 'fa-bowl-food', 
        dica: 'Solo solto, evite encharcamento' 
    }
};

// Função que é chamada quando clica num botão
function selecionar(categoria, valor, botao) {
    // Salva a escolha
    escolhas[categoria] = valor;
    
    // Tira o "selecionado" dos outros botões da mesma categoria
    const botoes = botao.parentElement.querySelectorAll('button');
    botoes.forEach(b => b.classList.remove('selecionado'));
    
    // Marca esse botão como selecionado
    botao.classList.add('selecionado');
    
    // Mostra o resultado
    mostrarResultado();
}

function mostrarResultado() {
    const divResultado = document.getElementById('resultado');
    
    // Se ainda não escolheu tudo, mostra mensagem padrão
    if (!escolhas.clima || !escolhas.umidade || !escolhas.estacao) {
        divResultado.innerHTML = '<p>🌱 Selecione clima, umidade e estação para ver a melhor opção</p>';
        return;
    }
    
    // Monta a "chave" pra procurar no banco de dados
    const chave = `${escolhas.clima}-${escolhas.umidade}-${escolhas.estacao}`;
    const cultura = culturas[chave];
    
    if (cultura) {
        // Achou uma cultura, mostra ela
        divResultado.innerHTML = `
            <i class="fa-solid ${cultura.icone}"></i>
            <h3>${cultura.nome}</h3>
            <p>${cultura.dica}</p>
        `;
    } else {
        // Combinação não cadastrada
        divResultado.innerHTML = `
            <i class="fa-solid fa-magnifying-glass"></i>
            <h3>Combinação incomum</h3>
            <p>Tente ajustar o clima ou a umidade para ver outras opções</p>
        `;
    }
}