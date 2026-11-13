import { useState } from 'react'
import Layout from '../components/Layout.jsx'
import culturas from '../data/culturas.js'

export default function Plantio() {
  const [escolhas, setEscolhas] = useState({ clima: null, umidade: null, estacao: null })

  function selecionar(categoria, valor) {
    setEscolhas((prev) => ({ ...prev, [categoria]: valor }))
  }

  function classeBotao(categoria, valor) {
    return escolhas[categoria] === valor ? 'opcao selecionado' : 'opcao'
  }

  let resultado
  let cultura = null // fica fora do if para as dicas lá embaixo usarem
  if (!escolhas.clima || !escolhas.umidade || !escolhas.estacao) {
    resultado = (
      <>
        <div className="icone-box neutro">
          <i className="fa-solid fa-seedling"></i>
        </div>
        <h2>Sua recomendação aparece aqui</h2>
        <p className="texto-suave">Selecione clima, umidade e estação para ver a melhor cultura.</p>
      </>
    )
  } else {
    const chave = `${escolhas.clima}-${escolhas.umidade}-${escolhas.estacao}`
    cultura = culturas[chave]

    resultado = cultura ? (
      <>
        <div className="icone-box">
          <i className={`fa-solid ${cultura.icone}`}></i>
        </div>
        <span className="rotulo" style={{ color: 'var(--verde)' }}>Melhor opção para você</span>
        <h2>{cultura.nome}</h2>
        <p className="texto-suave">{cultura.dica}</p>
      </>
    ) : (
      <>
        <div className="icone-box atencao">
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>
        <h2>Combinação incomum</h2>
        <p className="texto-suave">Tente ajustar o clima ou a umidade para ver outras opções.</p>
      </>
    )
  }

  return (
    <Layout>
      <header className="cabecalho">
        <div>
          <span className="cabecalho-sobre">Plantio</span>
          <h1>Descubra a melhor cultura para plantar</h1>
          <p>Responda três perguntas sobre a sua região e veja qual cultura combina com ela.</p>
        </div>
      </header>

      <div className="linha">
        <section className="card" style={{ flex: '3 1 480px', gap: 24 }}>
          <div className="quiz-grupo">
            <h3>
              <i className="fa-solid fa-temperature-half"></i> Clima
            </h3>
            <div className="opcoes">
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
          </div>

          <div className="quiz-grupo">
            <h3>
              <i className="fa-solid fa-droplet"></i> Umidade
            </h3>
            <div className="opcoes">
              <button className={classeBotao('umidade', 'seco')} onClick={() => selecionar('umidade', 'seco')}>
                Seco
              </button>
              <button className={classeBotao('umidade', 'umido')} onClick={() => selecionar('umidade', 'umido')}>
                Úmido
              </button>
            </div>
          </div>

          <div className="quiz-grupo">
            <h3>
              <i className="fa-solid fa-calendar"></i> Estação
            </h3>
            <div className="opcoes">
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

        <section className="card resultado-cultura" style={{ flex: '2 1 320px' }} aria-live="polite">
          {resultado}
        </section>
      </div>

      {cultura && (
        <section className="card">
          <h2>
            <i className={`fa-solid ${cultura.icone}`}></i> Dicas para cultivar {cultura.nome.toLowerCase()}
          </h2>

          <div className="grade-dicas">
            {cultura.dicas.map((d) => (
              <div className="item" key={d.titulo}>
                <div className={d.titulo === 'Atenção' ? 'icone-box atencao' : 'icone-box'}>
                  <i className={`fa-solid ${d.icone}`}></i>
                </div>
                <div>
                  <strong>{d.titulo}</strong>
                  <p>{d.texto}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="texto-suave">
            <i className="fa-solid fa-circle-info"></i> Valores de referência: podem variar com a região e a variedade.
            Na dúvida, consulte um técnico agrícola.
          </p>
        </section>
      )}
    </Layout>
  )
}
