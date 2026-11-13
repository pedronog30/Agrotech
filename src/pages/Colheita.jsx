import { useEffect, useState } from 'react'
import Layout from '../components/Layout.jsx'
import culturas from '../data/culturas.js'

// Junta os blocos de 3 em 3 horas da previsão em DIAS e classifica
// cada dia para colheita. Só contam os horários de trabalho (6h às 18h):
// chuva de madrugada atrapalha bem menos que chuva à tarde.
function montarDiasDeColheita(lista) {
  const dias = {}

  lista.forEach((bloco) => {
    const data = new Date(bloco.dt * 1000)
    const chave = data.toDateString() // agrupa por dia
    const hora = data.getHours()

    if (!dias[chave]) {
      dias[chave] = { data, temps: [], umidades: [], chanceChuva: 0, chuvaMm: 0, blocosDia: 0 }
    }
    const dia = dias[chave]
    dia.temps.push(bloco.main.temp)

    if (hora >= 6 && hora <= 18) {
      dia.blocosDia++
      dia.umidades.push(bloco.main.humidity)
      dia.chanceChuva = Math.max(dia.chanceChuva, bloco.pop)
      dia.chuvaMm += bloco.rain ? bloco.rain['3h'] : 0
    }
  })

  return Object.values(dias)
    .filter((dia) => dia.blocosDia > 0) // hoje à noite já não tem horário de trabalho
    .slice(0, 5)
    .map((dia) => {
      const umidadeMedia = Math.round(dia.umidades.reduce((a, b) => a + b, 0) / dia.umidades.length)
      const temChuva = dia.chanceChuva > 0.4 || dia.chuvaMm > 1

      const problemas = []
      if (temChuva) problemas.push(`chuva (${Math.round(dia.chanceChuva * 100)}%)`)
      if (umidadeMedia > 80) problemas.push(`umidade alta (${umidadeMedia}%)`)

      let status = 'bom'
      if (temChuva) status = 'evite'
      else if (problemas.length > 0) status = 'atencao'

      const nome = dia.data.toLocaleDateString('pt-BR', { weekday: 'long' }) // ex: "sexta-feira"

      return {
        chave: dia.data.toDateString(),
        nome: nome.charAt(0).toUpperCase() + nome.slice(1), // "Sexta-feira"
        nomeCurto: nome.charAt(0).toUpperCase() + nome.split('-')[0].slice(1), // "Sexta"
        dataCurta: dia.data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        max: Math.round(Math.max(...dia.temps)),
        min: Math.round(Math.min(...dia.temps)),
        chanceChuva: Math.round(dia.chanceChuva * 100),
        umidadeMedia,
        status,
        problemas,
      }
    })
}

// O melhor dia é o primeiro "bom" com menos chance de chuva
function escolherMelhorDia(dias) {
  const bons = dias.filter((d) => d.status === 'bom')
  if (bons.length === 0) return null
  return bons.reduce((melhor, d) => (d.chanceChuva < melhor.chanceChuva ? d : melhor))
}

const TEXTO_STATUS = {
  bom: 'Bom para colher',
  atencao: 'Atenção',
  evite: 'Evite colher',
}

const ICONE_STATUS = {
  bom: 'fa-sun',
  atencao: 'fa-cloud-sun',
  evite: 'fa-cloud-rain',
}

export default function Colheita() {
  const [dias, setDias] = useState([])
  const [erro, setErro] = useState(null)
  const [culturaEscolhida, setCulturaEscolhida] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setErro('Seu navegador não permite obter a localização.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lon } = position.coords
        try {
          const resposta = await fetch(`/api/clima?tipo=forecast&lat=${lat}&lon=${lon}`)
          if (!resposta.ok) throw new Error('resposta inválida da API')
          const previsao = await resposta.json()
          setDias(montarDiasDeColheita(previsao.list))
        } catch {
          setErro('Não foi possível carregar a previsão agora. Tente novamente mais tarde.')
        }
      },
      () => setErro('Permita o acesso à localização para ver a janela de colheita da sua região.'),
    )
  }, [])

  const melhorDia = escolherMelhorDia(dias)
  const cultura = culturaEscolhida ? culturas[culturaEscolhida] : null

  return (
    <Layout>
      <header className="cabecalho">
        <div>
          <span className="cabecalho-sobre">Colheita</span>
          <h1>Colha no momento certo</h1>
          <p>Veja os melhores dias para colher nos próximos dias e como saber se a sua plantação está pronta.</p>
        </div>
      </header>

      {erro && <p className="aviso aviso-erro">{erro}</p>}
      {!erro && dias.length === 0 && <p className="aviso">Carregando a previsão...</p>}

      {dias.length > 0 && (
        <section className="card">
          <h2>
            <i className="fa-solid fa-calendar-check"></i> Janela de colheita
          </h2>
          <p className="texto-suave">
            Colher com chuva ou com muita umidade deixa o grão molhado, e ele mofa no armazenamento. Consideramos o
            horário de trabalho, das 6h às 18h.
          </p>

          {melhorDia ? (
            <div className="item item-bom">
              <div className="icone-box">
                <i className="fa-solid fa-star"></i>
              </div>
              <div>
                <span className="rotulo" style={{ color: 'var(--verde)' }}>
                  Melhor dia
                </span>
                <strong>
                  {melhorDia.nome}, {melhorDia.dataCurta}
                </strong>
                <p>
                  Sem chuva prevista e umidade média de {melhorDia.umidadeMedia}%.
                </p>
              </div>
            </div>
          ) : (
            <div className="item item-atencao">
              <div className="icone-box">
                <i className="fa-solid fa-triangle-exclamation"></i>
              </div>
              <div>
                <strong>Nenhum dia ideal na previsão</strong>
                <p>Se precisar colher, escolha o dia marcado como "Atenção" e seque bem o grão depois.</p>
              </div>
            </div>
          )}

          <div className="grade-dias">
            {dias.map((dia) => (
              <div
                className={`hora pulv-${dia.status} ${melhorDia && dia.chave === melhorDia.chave ? 'dia-melhor' : ''}`}
                key={dia.chave}
              >
                <h3>{dia.nomeCurto}</h3>
                <span className="hora-extra">{dia.dataCurta}</span>
                <i className={`fa-solid ${ICONE_STATUS[dia.status]}`}></i>
                <span className="hora-temp">
                  {dia.max}° <small style={{ fontSize: 15, fontWeight: 600, color: 'var(--texto-suave)' }}>{dia.min}°</small>
                </span>
                <span className="hora-extra">
                  Chuva {dia.chanceChuva}% · Umidade {dia.umidadeMedia}%
                </span>
                <span className="hora-status">
                  <span className={`ponto ponto-${dia.status}`}></span>
                  {TEXTO_STATUS[dia.status]}
                </span>
                {dia.problemas.length > 0 && <span className="hora-motivo">{dia.problemas.join(', ')}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="card">
        <h2>
          <i className="fa-solid fa-wheat-awn"></i> Ponto de colheita por cultura
        </h2>
        <p className="texto-suave">Escolha o que você plantou para ver como saber se está pronto e como guardar.</p>

        <div className="opcoes">
          {Object.entries(culturas).map(([chave, c]) => (
            <button
              key={chave}
              className={culturaEscolhida === chave ? 'opcao selecionado' : 'opcao'}
              onClick={() => setCulturaEscolhida(chave)}
            >
              {c.nome}
            </button>
          ))}
        </div>

        {cultura && (
          <div className="grade-dicas" aria-live="polite">
            <div className="item">
              <div className="icone-box">
                <i className="fa-solid fa-eye"></i>
              </div>
              <div>
                <strong>Está pronto quando</strong>
                <p>{cultura.colheita.sinais}</p>
              </div>
            </div>
            <div className="item">
              <div className="icone-box azul">
                <i className="fa-solid fa-clock"></i>
              </div>
              <div>
                <strong>Como colher</strong>
                <p>{cultura.colheita.momento}</p>
              </div>
            </div>
            <div className="item">
              <div className="icone-box neutro">
                <i className="fa-solid fa-warehouse"></i>
              </div>
              <div>
                <strong>Depois da colheita</strong>
                <p>{cultura.colheita.armazenar}</p>
              </div>
            </div>
            <div className="item">
              <div className="icone-box atencao">
                <i className="fa-solid fa-triangle-exclamation"></i>
              </div>
              <div>
                <strong>Evite</strong>
                <p>{cultura.colheita.evite}</p>
              </div>
            </div>
          </div>
        )}

        {cultura && (
          <p className="texto-suave">
            <i className="fa-solid fa-circle-info"></i> Valores de referência: podem variar com a região e a variedade.
          </p>
        )}
      </section>
    </Layout>
  )
}
