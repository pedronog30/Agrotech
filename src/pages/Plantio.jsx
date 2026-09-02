import { useState } from 'react'
import Menu from '../components/Menu.jsx'
import usePageStyle from '../hooks/usePageStyle.js'
import culturas from '../data/culturas.js'

export default function Plantio() {
  usePageStyle('/css/plantio.css')

  
  const [escolhas, setEscolhas] = useState({ clima: null, umidade: null, estacao: null })

  function selecionar(categoria, valor) {
    setEscolhas((prev) => ({ ...prev, [categoria]: valor }))
  }

  function classeBotao(categoria, valor) {
    return escolhas[categoria] === valor ? 'selecionado' : ''
  }

  let resultado
  if (!escolhas.clima || !escolhas.umidade || !escolhas.estacao) {
    resultado = <p>🌱 Selecione clima, umidade e estação para ver a melhor opção</p>
  } else {
    const chave = `${escolhas.clima}-${escolhas.umidade}-${escolhas.estacao}`
    const cultura = culturas[chave]

    resultado = cultura ? (
      <>
        <i className={`fa-solid ${cultura.icone}`}></i>
        <h3>{cultura.nome}</h3>
        <p>{cultura.dica}</p>
      </>
    ) : (
      <>
        <i className="fa-solid fa-magnifying-glass"></i>
        <h3>Combinação incomum</h3>
        <p>Tente ajustar o clima ou a umidade para ver outras opções</p>
      </>
    )
  }

  return (
    <>
      <aside className="sidebar">
        <div className="card-logo">
          <i className="fa-solid fa-leaf"></i>
          <h1>AgroConsulta</h1>
          <p>informações que cultivam resultado</p>
        </div>
        <Menu />
      </aside>

      <main>
        <header className="barra_topo">
          <h2>PLANTAÇÃO</h2>
          <p>Aqui te ajudaremos a criar uma plantação sustentável.</p>
        </header>

        <section className="quiz">
          <h2>Vamos descobrir a melhor opção para sua plantação</h2>

          <div className="opcoes-quiz">
            <div className="categoria">
              <h3>
                <i className="fa-solid fa-temperature-half"></i> Clima
              </h3>
              <button className={classeBotao('clima', 'quente')} onClick={() => selecionar('clima', 'quente')}>
                Quente
              </button>
              <button className={classeBotao('clima', 'moderado')} onClick={() => selecionar('clima', 'moderado')}>
                Moderado
              </button>
              <button className={classeBotao('clima', 'frio')} onClick={() => selecionar('clima', 'frio')}>
                Frio
              </button>
            </div>

            <div className="categoria">
              <h3>
                <i className="fa-solid fa-droplet"></i> Umidade
              </h3>
              <button className={classeBotao('umidade', 'seco')} onClick={() => selecionar('umidade', 'seco')}>
                Seco
              </button>
              <button className={classeBotao('umidade', 'umido')} onClick={() => selecionar('umidade', 'umido')}>
                Úmido
              </button>
            </div>

            <div className="categoria">
              <h3>
                <i className="fa-solid fa-calendar"></i> Estação
              </h3>
              <button className={classeBotao('estacao', 'verao')} onClick={() => selecionar('estacao', 'verao')}>
                Verão
              </button>
              <button className={classeBotao('estacao', 'outono')} onClick={() => selecionar('estacao', 'outono')}>
                Outono
              </button>
              <button className={classeBotao('estacao', 'inverno')} onClick={() => selecionar('estacao', 'inverno')}>
                Inverno
              </button>
              <button
                className={classeBotao('estacao', 'primavera')}
                onClick={() => selecionar('estacao', 'primavera')}
              >
                Primavera
              </button>
            </div>
          </div>
        </section>

        <section className="resultado" id="resultado">
          {resultado}
        </section>
      </main>
    </>
  )
}
