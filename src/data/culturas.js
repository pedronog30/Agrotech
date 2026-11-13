// Banco de dados de culturas usado no quiz da página de Plantio.
// Antes vivia solto dentro de js/plantio.js.
// Cada cultura tem uma lista de "dicas" (usada na página de Plantio)
// e um bloco "colheita" (usado na página de Colheita). São valores
// de referência gerais: variam com a região e a variedade plantada.

const culturas = {
  'quente-seco-verao': {
    nome: 'Milho',
    icone: 'fa-seedling',
    dica: 'Solo bem drenado, plantio direto no verão',
    dicas: [
      { icone: 'fa-seedling', titulo: 'Plantio', texto: 'Linhas de 70 a 90 cm, com cerca de 5 plantas por metro. Corrija a acidez do solo com calcário antes de plantar.' },
      { icone: 'fa-droplet', titulo: 'Água', texto: 'A fase mais sensível à falta de água é o pendoamento e o enchimento dos grãos. Evite deixar faltar água nesse período.' },
      { icone: 'fa-calendar-check', titulo: 'Ciclo', texto: 'Colheita do grão seco entre 110 e 140 dias após o plantio, dependendo da variedade.' },
      { icone: 'fa-bug', titulo: 'Atenção', texto: 'A lagarta-do-cartucho é a principal praga. Vistorie as folhas novas toda semana.' },
    ],
    colheita: {
      sinais: 'Palha seca, espigas voltadas para baixo e grãos duros, com uma camada escura na base do grão.',
      momento: 'Com secador, colha com o grão entre 18% e 24% de umidade. Sem secador, deixe secar no campo até perto de 14%.',
      armazenar: 'Armazene com no máximo 13% de umidade, em local seco e ventilado.',
      evite: 'Deixar o milho muito tempo no campo depois do ponto aumenta o ataque de carunchos e o tombamento das plantas.',
    },
  },
  'quente-umido-verao': {
    nome: 'Arroz',
    icone: 'fa-wheat-awn',
    dica: 'Ideal em terrenos alagados ou irrigados',
    dicas: [
      { icone: 'fa-seedling', titulo: 'Plantio', texto: 'Pode ser semeado direto ou por transplante de mudas. O terreno precisa estar bem nivelado para segurar a água.' },
      { icone: 'fa-droplet', titulo: 'Água', texto: 'No arroz irrigado, mantenha uma lâmina de água de 5 a 10 cm sobre o solo durante boa parte do ciclo.' },
      { icone: 'fa-calendar-check', titulo: 'Ciclo', texto: 'Colheita entre 100 e 140 dias, quando a maior parte dos grãos da panícula estiver amarelada.' },
      { icone: 'fa-bug', titulo: 'Atenção', texto: 'Controle as plantas daninhas no início e fique atento à brusone, doença que mancha as folhas.' },
    ],
    colheita: {
      sinais: 'Cerca de dois terços dos grãos da panícula com a casca amarelada.',
      momento: 'Colha com os grãos entre 18% e 23% de umidade para reduzir a quebra no beneficiamento.',
      armazenar: 'Seque até cerca de 13% de umidade antes de armazenar.',
      evite: 'Colher o arroz seco demais aumenta a quantidade de grãos quebrados.',
    },
  },
  'quente-seco-primavera': {
    nome: 'Feijão',
    icone: 'fa-seedling',
    dica: 'Precisa de pouca água, solo arenoso',
    dicas: [
      { icone: 'fa-seedling', titulo: 'Plantio', texto: 'Linhas de 45 a 50 cm, com 10 a 15 sementes por metro. Não tolera solo encharcado.' },
      { icone: 'fa-droplet', titulo: 'Água', texto: 'A floração é a fase mais crítica: falta de água nesse período derruba a produção.' },
      { icone: 'fa-calendar-check', titulo: 'Ciclo', texto: 'Ciclo curto, de 70 a 100 dias. Colha quando as vagens estiverem secas.' },
      { icone: 'fa-bug', titulo: 'Atenção', texto: 'A mosca-branca transmite o mosaico-dourado. Elimine plantas doentes e controle a praga cedo.' },
    ],
    colheita: {
      sinais: 'Vagens secas, cor de palha, e grãos soltos chacoalhando dentro delas.',
      momento: 'Arranque as plantas cedo, ainda com orvalho, para as vagens não abrirem e derrubarem grãos.',
      armazenar: 'Seque bem, até cerca de 13% de umidade, e guarde em recipiente fechado para evitar caruncho.',
      evite: 'Deixar o feijão arrancado tomando chuva: os grãos mancham e perdem valor de venda.',
    },
  },
  'quente-umido-primavera': {
    nome: 'Soja',
    icone: 'fa-leaf',
    dica: 'Bastante sol e chuva regular',
    dicas: [
      { icone: 'fa-seedling', titulo: 'Plantio', texto: 'Inocule as sementes com bactérias fixadoras de nitrogênio antes de plantar. Linhas de 45 a 50 cm.' },
      { icone: 'fa-droplet', titulo: 'Água', texto: 'Precisa de mais água na floração e no enchimento dos grãos.' },
      { icone: 'fa-calendar-check', titulo: 'Ciclo', texto: 'Colheita entre 100 e 140 dias, quando as vagens mudam de cor e as folhas caem.' },
      { icone: 'fa-bug', titulo: 'Atenção', texto: 'A ferrugem-asiática é a doença mais grave da soja. Monitore manchas nas folhas de baixo.' },
    ],
    colheita: {
      sinais: 'Vagens com a cor de madura e a maior parte das folhas já caída.',
      momento: 'Colha com os grãos entre 13% e 15% de umidade.',
      armazenar: 'Armazene com no máximo 13% de umidade.',
      evite: 'Atrasar a colheita faz as vagens abrirem sozinhas e derrubarem grãos no chão.',
    },
  },
  'moderado-umido-primavera': {
    nome: 'Tomate',
    icone: 'fa-apple-whole',
    dica: 'Sol direto e regas frequentes',
    dicas: [
      { icone: 'fa-seedling', titulo: 'Plantio', texto: 'Transplante as mudas com 4 a 6 folhas e use estacas ou fitas (tutoramento) para sustentar a planta.' },
      { icone: 'fa-droplet', titulo: 'Água', texto: 'Regue com frequência e de forma regular, de preferência no pé, sem molhar as folhas.' },
      { icone: 'fa-calendar-check', titulo: 'Ciclo', texto: 'A colheita começa cerca de 70 a 100 dias após o transplante e dura algumas semanas.' },
      { icone: 'fa-bug', titulo: 'Atenção', texto: 'A requeima aparece com umidade alta. Folhas molhadas por muito tempo favorecem a doença.' },
    ],
    colheita: {
      sinais: 'Frutos mudando de verde para rosado ou vermelho.',
      momento: 'Colha nas horas mais frescas do dia. Para transporte longo, colha quando começar a avermelhar.',
      armazenar: 'Guarde em caixas rasas, à sombra e em local fresco.',
      evite: 'Empilhar muitos tomates: os de baixo amassam e estragam.',
    },
  },
  'moderado-seco-outono': {
    nome: 'Mandioca',
    icone: 'fa-carrot',
    dica: 'Resistente, cresce em quase todo tipo de solo',
    dicas: [
      { icone: 'fa-seedling', titulo: 'Plantio', texto: 'Plante pedaços do caule (manivas) de 15 a 20 cm, com espaço de cerca de 1 m entre linhas.' },
      { icone: 'fa-droplet', titulo: 'Água', texto: 'Tolera bem a seca depois de enraizada. O maior risco é o encharcamento, que apodrece as raízes.' },
      { icone: 'fa-calendar-check', titulo: 'Ciclo', texto: 'Ciclo longo: de 8 a 12 meses para mandioca de mesa, podendo passar de um ano.' },
      { icone: 'fa-bug', titulo: 'Atenção', texto: 'Escolha manivas de plantas sadias. Material doente espalha pragas e doenças na área nova.' },
    ],
    colheita: {
      sinais: 'Folhas amarelando e caindo. Para mesa, geralmente entre 8 e 12 meses após o plantio.',
      momento: 'Arranque em tempo seco, puxando pelo caule com cuidado para não quebrar as raízes.',
      armazenar: 'A raiz estraga em 2 a 3 dias depois de arrancada: venda ou processe logo.',
      evite: 'Machucar as raízes no arranquio acelera o apodrecimento.',
    },
  },
  'moderado-umido-outono': {
    nome: 'Alface',
    icone: 'fa-leaf',
    dica: 'Sombra parcial e regas diárias',
    dicas: [
      { icone: 'fa-seedling', titulo: 'Plantio', texto: 'Transplante as mudas com cerca de 4 folhas, com espaço de 25 a 30 cm entre plantas.' },
      { icone: 'fa-droplet', titulo: 'Água', texto: 'Raiz curta: prefira regas leves e frequentes, mantendo o solo sempre úmido.' },
      { icone: 'fa-calendar-check', titulo: 'Ciclo', texto: 'Colheita rápida, entre 40 e 60 dias após o transplante.' },
      { icone: 'fa-temperature-high', titulo: 'Atenção', texto: 'Com muito calor a alface "pendoa": cria um talo, as folhas ficam amargas e a colheita se perde.' },
    ],
    colheita: {
      sinais: 'Cabeça formada e folhas no tamanho de venda, antes de a planta criar talo.',
      momento: 'Colha de manhã cedo, com a planta bem hidratada.',
      armazenar: 'Mantenha à sombra e, se possível, resfriada. Dura poucos dias.',
      evite: 'Atrasar a colheita no calor: a alface pendoa e fica amarga.',
    },
  },
  'frio-seco-inverno': {
    nome: 'Trigo',
    icone: 'fa-wheat-awn',
    dica: 'Suporta geada, solo bem preparado',
    dicas: [
      { icone: 'fa-seedling', titulo: 'Plantio', texto: 'Semeadura em linhas próximas, de 17 a 20 cm, em solo bem preparado e com acidez corrigida.' },
      { icone: 'fa-droplet', titulo: 'Água', texto: 'É cultura de clima mais frio e seco. Chuva em excesso perto da colheita prejudica os grãos.' },
      { icone: 'fa-calendar-check', titulo: 'Ciclo', texto: 'Colheita entre 110 e 140 dias, com as espigas secas e os grãos duros.' },
      { icone: 'fa-bug', titulo: 'Atenção', texto: 'Doenças fúngicas, como ferrugem e brusone, aumentam com umidade. Monitore as folhas.' },
    ],
    colheita: {
      sinais: 'Espigas e palha douradas, com grãos duros que não marcam com a unha.',
      momento: 'Colha com os grãos entre 13% e 15% de umidade.',
      armazenar: 'Armazene seco, com no máximo 13% de umidade.',
      evite: 'Chuva sobre o trigo maduro faz os grãos germinarem ainda na espiga.',
    },
  },
  'frio-umido-inverno': {
    nome: 'Cenoura',
    icone: 'fa-carrot',
    dica: 'Solo macio e profundo',
    dicas: [
      { icone: 'fa-seedling', titulo: 'Plantio', texto: 'Semeie direto no canteiro (ela não aceita transplante). Afine depois, deixando 5 a 8 cm entre plantas.' },
      { icone: 'fa-droplet', titulo: 'Água', texto: 'Mantenha o solo úmido de forma constante. Seca seguida de rega forte faz a raiz rachar.' },
      { icone: 'fa-calendar-check', titulo: 'Ciclo', texto: 'Colheita entre 90 e 120 dias após a semeadura.' },
      { icone: 'fa-triangle-exclamation', titulo: 'Atenção', texto: 'Solo duro, com pedras ou torrões, deixa a raiz torta ou bifurcada. Afofe bem a terra.' },
    ],
    colheita: {
      sinais: 'Raízes com grossura de venda e folhas mais velhas amarelando.',
      momento: 'Afofe o solo antes de arrancar para a raiz não quebrar.',
      armazenar: 'Corte as folhas e guarde em local fresco e úmido.',
      evite: 'Deixar as raízes arrancadas no sol: murcham em poucas horas.',
    },
  },
  'frio-umido-outono': {
    nome: 'Batata',
    icone: 'fa-bowl-food',
    dica: 'Solo solto, evite encharcamento',
    dicas: [
      { icone: 'fa-seedling', titulo: 'Plantio', texto: 'Plante batata-semente inteira, com cerca de 30 cm entre plantas e 70 a 80 cm entre linhas.' },
      { icone: 'fa-droplet', titulo: 'Água', texto: 'Regue de forma regular, mas sem encharcar: água parada apodrece os tubérculos.' },
      { icone: 'fa-calendar-check', titulo: 'Ciclo', texto: 'Colheita entre 90 e 120 dias, quando a parte de cima da planta seca.' },
      { icone: 'fa-triangle-exclamation', titulo: 'Atenção', texto: 'Chegue terra ao pé da planta (amontoa). Batata exposta ao sol fica verde e imprópria para consumo.' },
    ],
    colheita: {
      sinais: 'A parte de cima da planta (rama) seca e morre.',
      momento: 'Espere de 10 a 15 dias depois de a rama secar, para a casca firmar, e colha com o solo seco.',
      armazenar: 'Guarde no escuro, em local fresco e ventilado.',
      evite: 'Deixar a batata exposta à luz: ela fica verde e imprópria para consumo.',
    },
  },
}

export default culturas
