import { useEffect, useState } from 'react'
import Layout from '../components/Layout.jsx'

// Ícone do Font Awesome a partir do "main" que a OpenWeather devolve
// (Clear, Clouds, Rain...). Mais simples que comparar a descrição em texto.
const ICONES = {
  Clear: 'fa-sun',
  Clouds: 'fa-cloud',
  Rain: 'fa-cloud-rain',
  Drizzle: 'fa-cloud-rain',
  Thunderstorm: 'fa-cloud-bolt',
  Snow: 'fa-snowflake',
}

function iconeDoClima(main) {
  return ICONES[main] || 'fa-smog'
}

// Converte o horário da API (segundos desde 1970) para "06:14"
function formatarHora(segundos) {
  return new Date(segundos * 1000).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Recebe UM bloco da previsão (3 horas) e diz se é bom pulverizar.
// Cada critério que falhar vira um "problema"; o status depende de quantos.
function classificarPulverizacao(bloco) {
  const temp = bloco.main.temp
  const umidade = bloco.main.humidity
  const vento = bloco.wind.speed * 3.6 // a API manda em m/s → km/h
  const temChuva = bloco.pop > 0.3 || (bloco.rain && bloco.rain['3h'] > 0)

  const problemas = []

  if (temp >= 30) problemas.push(`calor (${Math.round(temp)}°C)`)
  if (umidade < 55) problemas.push(`ar seco (${umidade}%)`)
  if (vento > 10) problemas.push(`vento forte (${Math.round(vento)} km/h)`)
  if (vento < 3) problemas.push('sem vento (risco de inversão térmica)')
  if (temChuva) problemas.push(`chuva (${Math.round(bloco.pop * 100)}%)`)

  let status = 'evite'
  if (problemas.length === 0) status = 'bom'
  else if (problemas.length === 1) status = 'atencao'

  return { status, problemas }
}

const TEXTO_STATUS = {
  bom: 'Bom para pulverizar',
  atencao: 'Atenção',
  evite: 'Evite',
}

export default function Clima() {
  const [atual, setAtual] = useState(null) // resposta de "weather"
  const [blocos, setBlocos] = useState([]) // próximas 24h de "forecast"
  const [erro, setErro] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setErro('Seu navegador não permite obter a localização.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lon } = position.coords

        try {
          // As duas chamadas saem ao mesmo tempo; o await espera as duas.
          const [respAtual, respPrevisao] = await Promise.all([
            fetch(`/api/clima?tipo=weather&lat=${lat}&lon=${lon}`),
            fetch(`/api/clima?tipo=forecast&lat=${lat}&lon=${lon}`),
          ])

          if (!respAtual.ok || !respPrevisao.ok) {
            throw new Error('resposta inválida da API')
          }

          const dadosAtual = await respAtual.json()
          const dadosPrevisao = await respPrevisao.json()

          setAtual(dadosAtual)
          // 8 blocos de 3 horas = próximas 24 horas
          setBlocos(dadosPrevisao.list.slice(0, 8))
        } catch {
          setErro('Não foi possível carregar o clima agora. Tente novamente mais tarde.')
        }
      },
      () => setErro('Permita o acesso à localização para ver o clima da sua região.'),
    )
  }, [])

  return (
    <Layout>
      <header className="cabecalho">
        <div>
          <span className="cabecalho-sobre">Clima</span>
          <h1>Clima para produzir melhor</h1>
          <p>Veja as condições de agora e o melhor horário para pulverizar nas próximas 24 horas.</p>
        </div>
        <span className="chip">
          <i className="fa-solid fa-location-dot"></i> {atual ? atual.name : erro ? 'Localização indisponível' : 'Localizando...'}
        </span>
      </header>

      {erro && <p className="aviso aviso-erro">{erro}</p>}

      {!erro && !atual && <p className="aviso">Carregando dados do clima...</p>}

      {atual && (
        <>
          <section className="card-escuro" aria-label="Condições atuais">
            <div className="clima-topo">
              <div className="clima-agora">
                <span className="rotulo">Agora</span>
                <div className="clima-temp">
                  <strong>{Math.round(atual.main.temp)}°</strong>
                  <i className={`fa-solid ${iconeDoClima(atual.weather[0].main)}`}></i>
                </div>
                <span className="clima-descricao">{atual.weather[0].description}</span>
                <span className="clima-sub">Sensação térmica de {Math.round(atual.main.feels_like)}°</span>
              </div>

              <div className="clima-metricas" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                <div className="metrica">
                  <i className="fa-solid fa-droplet"></i>
                  <span>Umidade</span>
                  <strong>{atual.main.humidity}%</strong>
                </div>
                <div className="metrica">
                  <i className="fa-solid fa-wind"></i>
                  <span>Vento</span>
                  <strong>{Math.round(atual.wind.speed * 3.6)} km/h</strong>
                </div>
                <div className="metrica">
                  <i className="fa-solid fa-sun"></i>
                  <span>Nascer do sol</span>
                  <strong>{formatarHora(atual.sys.sunrise)}</strong>
                </div>
                <div className="metrica">
                  <i className="fa-solid fa-moon"></i>
                  <span>Pôr do sol</span>
                  <strong>{formatarHora(atual.sys.sunset)}</strong>
                </div>
              </div>
            </div>
          </section>

          <section className="card">
            <h2>
              <i className="fa-solid fa-spray-can"></i> Janela de pulverização
            </h2>
            <p className="texto-suave">
              Ideal: temperatura abaixo de 30°C, umidade acima de 55%, vento entre 3 e 10 km/h e sem chuva
              prevista.
            </p>

            <div className="legenda">
              <span>
                <span className="ponto ponto-bom"></span> Bom para pulverizar
              </span>
              <span>
                <span className="ponto ponto-atencao"></span> Atenção (1 critério fora)
              </span>
              <span>
                <span className="ponto ponto-evite"></span> Evite (2 ou mais fora)
              </span>
            </div>

            <div className="grade-horas">
              {blocos.map((bloco) => {
                const { status, problemas } = classificarPulverizacao(bloco)

                return (
                  <div className={`hora pulv-${status}`} key={bloco.dt}>
                    <h3>{formatarHora(bloco.dt)}</h3>
                    <i className={`fa-solid ${iconeDoClima(bloco.weather[0].main)}`}></i>
                    <span className="hora-temp">{Math.round(bloco.main.temp)}°</span>
                    <span className="hora-extra">
                      Chuva {Math.round(bloco.pop * 100)}% · Vento {Math.round(bloco.wind.speed * 3.6)} km/h
                    </span>
                    <span className="hora-status">
                      <span className={`ponto ponto-${status}`}></span>
                      {TEXTO_STATUS[status]}
                    </span>
                    {problemas.length > 0 && <span className="hora-motivo">{problemas.join(', ')}</span>}
                  </div>
                )
              })}
            </div>
          </section>

          <div className="grade-stats">
            <div className="stat">
              <span>Mínima / máxima agora</span>
              <strong>
                {Math.round(atual.main.temp_min)}° / {Math.round(atual.main.temp_max)}°
              </strong>
            </div>
            <div className="stat">
              <span>Pressão</span>
              <strong>
                {atual.main.pressure} <small>hPa</small>
              </strong>
            </div>
            <div className="stat">
              <span>Visibilidade</span>
              <strong>
                {(atual.visibility / 1000).toFixed(0)} <small>km</small>
              </strong>
            </div>
          </div>
        </>
      )}
    </Layout>
  )
}
