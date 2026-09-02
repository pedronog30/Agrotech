// Banco de dados de culturas usado no quiz da página de Plantio.
// Antes vivia solto dentro de js/plantio.js; 

const culturas = {
  'quente-seco-verao': {
    nome: 'Milho',
    icone: 'fa-seedling',
    dica: 'Solo bem drenado, plantio direto no verão',
  },
  'quente-umido-verao': {
    nome: 'Arroz',
    icone: 'fa-wheat-awn',
    dica: 'Ideal em terrenos alagados ou irrigados',
  },
  'quente-seco-primavera': {
    nome: 'Feijão',
    icone: 'fa-seedling',
    dica: 'Precisa de pouca água, solo arenoso',
  },
  'quente-umido-primavera': {
    nome: 'Soja',
    icone: 'fa-leaf',
    dica: 'Bastante sol e chuva regular',
  },
  'moderado-umido-primavera': {
    nome: 'Tomate',
    icone: 'fa-apple-whole',
    dica: 'Sol direto e regas frequentes',
  },
  'moderado-seco-outono': {
    nome: 'Mandioca',
    icone: 'fa-carrot',
    dica: 'Resistente, cresce em quase todo tipo de solo',
  },
  'moderado-umido-outono': {
    nome: 'Alface',
    icone: 'fa-leaf',
    dica: 'Sombra parcial e regas diárias',
  },
  'frio-seco-inverno': {
    nome: 'Trigo',
    icone: 'fa-wheat-awn',
    dica: 'Suporta geada, solo bem preparado',
  },
  'frio-umido-inverno': {
    nome: 'Cenoura',
    icone: 'fa-carrot',
    dica: 'Solo macio e profundo',
  },
  'frio-umido-outono': {
    nome: 'Batata',
    icone: 'fa-bowl-food',
    dica: 'Solo solto, evite encharcamento',
  },
}

export default culturas
