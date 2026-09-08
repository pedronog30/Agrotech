import { useEffect, useState } from 'react'
import Menu from '../components/Menu.jsx'
import usePageStyle from '../hooks/usePageStyle.js'

const apiKey = '056ff87db5107a65501e9bc92c30dda2'


function getClimaIconeInfo(descricao) {
  const d = descricao.toLowerCase()

  if (d.includes('céu limpo') || d.includes('ceu limpo')) return { icone: 'fa-sun', cor: '#f5a623' }
  if (d.includes('poucas nuvens')) return { icone: 'fa-cloud-sun', cor: '#f5a623' }
  if (d.includes('nuvens dispersas') || d.includes('nublado')) return { icone: 'fa-cloud', cor: '#999' }
  if (d.includes('chuva') || d.includes('garoa')) return { icone: 'fa-cloud-rain', cor: '#5b9bd5' }
  if (d.includes('trovoada') || d.includes('tempestade')) return { icone: 'fa-cloud-bolt', cor: '#7b68ee' }
  if (d.includes('neve')) return { icone: 'fa-snowflake', cor: '#add8e6' }
  if (d.includes('neblina') || d.includes('névoa') || d.includes('bruma')) return { icone: 'fa-smog', cor: '#ccc' }

  return { icone: 'fa-cloud-sun', cor: '#f5a623' }
}

function calcularRecomendacaoPlantio(temp, umidade, chuvaValor) {
  if (temp >= 18 && temp <= 30 && umidade >= 50 && chuvaValor <= 5) {
    return {
      classe: 'rec-favoravel',
      icone: 'fa-seedling',
      titulo: 'Ótimo para plantar Milho!',
      texto: `Temperatura (${Math.round(temp)}°C) e umidade (${umidade}%) estão ideais.`,
    }
  }
  if (temp >= 18 && temp <= 28 && umidade >= 50 && umidade <= 80 && chuvaValor <= 5) {
    return {
      classe: 'rec-favoravel',
      icone: 'fa-seedling',
      titulo: 'Bom para plantar Feijão!',
      texto: `Umidade (${umidade}%) dentro do ideal para o feijão.`,
    }
  }
  if (chuvaValor > 5) {
    return {
      classe: 'rec-atencao',
      icone: 'fa-cloud-rain',
      titulo: 'Aguarde a chuva passar',
      texto: 'Chuva intensa não é ideal para o plantio agora.',
    }
  }
  return {
    classe: 'rec-desfavoravel',
    icone: 'fa-triangle-exclamation',
    titulo: 'Condições desfavoráveis',
    texto: 'Temperatura ou umidade fora do ideal para plantio.',
  }
}

function calcularRecomendacaoColheita(temp, umidade, chuvaValor) {
  if (temp >= 25 && umidade < 60 && chuvaValor === 0) {
    return {
      classe: 'rec-favoravel',
      icone: 'fa-wheat-awn',
      titulo: 'Ótimo momento para colher Feijão!',
      texto: 'Tempo seco e quente favorece a colheita.',
    }
  }
  if (chuvaValor > 0) {
    return {
      classe: 'rec-atencao',
      icone: 'fa-cloud-rain',
      titulo: 'Evite colher com chuva',
      texto: 'A umidade pode danificar os grãos colhidos.',
    }
  }
  return {
    classe: 'rec-neutro',
    icone: 'fa-clock',
    titulo: 'Aguarde o momento certo',
    texto: 'Condições ainda não ideais para a colheita.',
  }
}

// Monta as semanas do calendário do mês atual, marcando o dia de
// hoje e os dias bons para plantar/colher (a partir da previsão).
function gerarSemanasCalendario(diasCondicao) {
  const agora = new Date()
  const mes = agora.getMonth()
  const ano = agora.getFullYear()
  const primeiroDia = new Date(ano, mes, 1).getDay()
  const totalDias = new Date(ano, mes + 1, 0).getDate()
  const hoje = agora.getDate()

  const celulas = []
  for (let i = 0; i < primeiroDia; i++) {
    celulas.push({ key: `vazio-${i}`, dia: null, tipo: 'vazio' })
  }
  for (let dia = 1; dia <= totalDias; dia++) {
    let tipo = 'normal'
    if (dia === hoje) tipo = 'hoje'
    else if (diasCondicao[dia] === 'plantar') tipo = 'dia-plantar'
    else if (diasCondicao[dia] === 'colher') tipo = 'dia-colher'
    celulas.push({ key: `dia-${dia}`, dia, tipo })
  }

  const semanas = []
  for (let i = 0; i < celulas.length; i += 7) {
    semanas.push(celulas.slice(i, i + 7))
  }
  return semanas
}

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export default function Home() {
  usePageStyle('/css/style.css')

  // Cada coisa que antes era escrita direto num elemento do DOM
  // (textContent, innerHTML) agora é uma variável de estado.
  const [localizacao, setLocalizacao] = useState(null)
  const [erroLocalizacao, setErroLocalizacao] = useState(null)
  const [temperatura, setTemperatura] = useState(null)
  const [descricaoClima, setDescricaoClima] = useState('...Carregando')
  const [iconeClima, setIconeClima] = useState(null)
  const [chuva, setChuva] = useState(null)
  const [umidade, setUmidade] = useState(null)
  const [vento, setVento] = useState(null)
  const [previsaoSemanal, setPrevisaoSemanal] = useState([])
  const [alertas, setAlertas] = useState([])
  const [recPlantio, setRecPlantio] = useState(null)
  const [recColheita, setRecColheita] = useState(null)
  const [diasCondicao, setDiasCondicao] = useState({})

  // useEffect com [] no final = "roda só uma vez, quando a página
  // é montada" — é o equivalente do código que antes ficava solto
  // no script.js e rodava assim que o arquivo carregava.
  useEffect(() => {
    if (!navigator.geolocation) {
      setErroLocalizacao('Geolocalização não suportada')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude

        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`

        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            if (data.cod !== 200) {
              console.log('Erro na API: ' + data.message)
              return
            }

            const temp = data.main.temp
            const chuvaValor = data.rain ? data.rain['1h'] : 0
            const umidadeValor = data.main.humidity
            const ventoValor = data.wind.speed
            const descricao = data.weather[0].description

            setTemperatura(Math.round(temp))
            setDescricaoClima(descricao)
            setIconeClima(getClimaIconeInfo(descricao))
            setChuva(chuvaValor)
            setUmidade(umidadeValor)
            setVento(ventoValor)
            setLocalizacao(data.name)

            const descricaoLower = descricao.toLowerCase()
            const novosAlertas = []

            if (chuvaValor > 5) {
              novosAlertas.push({
                tipo: 'chuva',
                icone: 'fa-cloud-showers-heavy',
                titulo: 'Previsão de chuva forte',
                texto: 'Há previsão de chuvas intensas. Proteja suas culturas!',
              })
            }
            if (temp > 35) {
              novosAlertas.push({
                tipo: 'calor',
                icone: 'fa-temperature-high',
                titulo: 'Atenção com a temperatura',
                texto: 'Temperaturas elevadas podem afetar o desenvolvimento das culturas.',
              })
            }
            if (temp < 10) {
              novosAlertas.push({
                tipo: 'frio',
                icone: 'fa-snowflake',
                titulo: 'Risco de geada',
                texto: 'Temperaturas baixas podem danificar as plantações.',
              })
            }
            if (umidadeValor < 30) {
              novosAlertas.push({
                tipo: 'seco',
                icone: 'fa-sun-plant-wilt',
                titulo: 'Umidade muito baixa',
                texto: 'Considere irrigar as plantações. Risco de seca.',
              })
            }
            if (ventoValor > 40) {
              novosAlertas.push({
                tipo: 'vento',
                icone: 'fa-wind',
                titulo: 'Ventos fortes',
                texto: 'Ventos intensos podem danificar as culturas. Proteja as plantas!',
              })
            }
            if (descricaoLower.includes('trovoada') || descricaoLower.includes('tempestade')) {
              novosAlertas.push({
                tipo: 'tempestade',
                icone: 'fa-cloud-bolt',
                titulo: 'Alerta de tempestade',
                texto: 'Tempestade prevista. Evite trabalho no campo!',
              })
            }
            if (novosAlertas.length === 0) {
              novosAlertas.push({
                tipo: 'ok',
                icone: 'fa-circle-check',
                titulo: 'Tudo certo!',
                texto: 'Condições climáticas favoráveis para suas culturas.',
              })
            }
            setAlertas(novosAlertas)

            setRecPlantio(calcularRecomendacaoPlantio(temp, umidadeValor, chuvaValor))
            setRecColheita(calcularRecomendacaoColheita(temp, umidadeValor, chuvaValor))
          })
          .catch((error) => {
            console.log('Erro ao buscar clima: ' + error)
          })

        const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`

        fetch(urlForecast)
          .then((response) => response.json())
          .then((forecast) => {
            const diasDados = {}
            const novoDiasCondicao = {}
            const hoje = new Date().getDate()

            forecast.list.forEach((item) => {
              const data = new Date(item.dt * 1000)
              const dia = data.getDate()
              const tempDia = item.main.temp
              const umidadeDia = item.main.humidity
              const chuvaDia = item.rain ? item.rain['3h'] : 0

              if (dia !== hoje) {
                if (!diasDados[dia]) {
                  diasDados[dia] = {
                    data,
                    tempMin: item.main.temp_min,
                    tempMax: item.main.temp_max,
                    descricao: item.weather[0].description,
                  }
                } else {
                  if (item.main.temp_min < diasDados[dia].tempMin) diasDados[dia].tempMin = item.main.temp_min
                  if (item.main.temp_max > diasDados[dia].tempMax) diasDados[dia].tempMax = item.main.temp_max
                }
              }

              if (!novoDiasCondicao[dia]) {
                if (tempDia >= 18 && tempDia <= 30 && umidadeDia >= 50 && chuvaDia <= 5) {
                  novoDiasCondicao[dia] = 'plantar'
                } else if (tempDia >= 25 && umidadeDia < 60 && chuvaDia === 0) {
                  novoDiasCondicao[dia] = 'colher'
                }
              }
            })

            const dias = Object.keys(diasDados)
              .slice(0, 5)
              .map((dia) => {
                const d = diasDados[dia]
                return {
                  key: dia,
                  nomeDia: d.data.toLocaleDateString('pt-BR', { weekday: 'short' }),
                  icone: getClimaIconeInfo(d.descricao),
                  tempMax: Math.round(d.tempMax),
                  tempMin: Math.round(d.tempMin),
                }
              })

            setPrevisaoSemanal(dias)
            setDiasCondicao(novoDiasCondicao)
          })
          .catch((error) => {
            console.log('Erro ao buscar previsão: ' + error)
          })
      },
      (error) => {
        console.log('Erro de geolocalização: ' + error.message)
        setErroLocalizacao('Não foi possível obter sua localização.')
      },
    )
  }, [])

  const nomeMes = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  const mesFormatado = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1)
  const semanas = gerarSemanasCalendario(diasCondicao)

  return (
    <>
      <div className="container">
        <div className="card-logo">
          <i className="fa-solid fa-leaf"></i>
          <h1>AgroConsulta</h1>
          <p>informações que cultivam resultado</p>
        </div>
        <Menu>
          <li>
            <a href="https://youtu.be/bkePyXbytpI?feature=shared" target="_blank" rel="noopener noreferrer">
              <i className="fa-solid fa-circle-play"></i> Pitch Video V1
            </a>
          </li>
          <li>
            <a href="https://youtu.be/koGNC3qTVJM" target="_blank" rel="noopener noreferrer">
              <i className="fa-solid fa-circle-play"></i> Pitch Video V2
            </a>
          </li>

          <li>
            <a href="https://youtu.be/eJOefE6VJRA" target="_blank" rel="noopener noreferrer">
              <i className="fa-solid fa-circle-play"></i> Pitch Video V3 REACT
            </a>
          </li>


        </Menu>
      </div>

      <main>
        <header>
          <div>
            <h2>Olá! 👋</h2>
            <p>Veja as recomendações para sua plantação hoje.</p>
          </div>
          <span id="localizacao">
            <i className="fa-solid fa-location-dot"></i> {localizacao ?? erroLocalizacao ?? 'Localizando...'}
          </span>
        </header>

        <section className="clima">
          <h3>
            <i className="fa-solid fa-cloud-sun"></i> Condições de clima
          </h3>
          <div className="clima-conteudo">
            <div className="clima-esquerda">
              <span id="clima-icone">
                {iconeClima && (
                  <i className={`fa-solid ${iconeClima.icone}`} style={{ color: iconeClima.cor, fontSize: 64 }}></i>
                )}
              </span>
              <span id="Temperatura">{temperatura !== null ? `${temperatura}°C` : '-- C'}</span>
              <span id="Descricao-clima">{descricaoClima}</span>
            </div>
            <div className="clima-direita">
              <p>
                <i className="fa-solid fa-droplet"></i> Chuva{' '}
                <span id="Chuva">{chuva !== null ? `${chuva}%` : '-- %'}</span>
              </p>
              <p>
                <i className="fa-solid fa-water"></i> Umidade{' '}
                <span id="Umidade">{umidade !== null ? `${umidade}%` : '-- %'}</span>
              </p>
              <p>
                <i className="fa-solid fa-wind"></i> Vento{' '}
                <span id="Vento">{vento !== null ? `${vento} km/h` : '-- km/h'}</span>
              </p>
            </div>
          </div>
          <div className="previsao-semanal" id="previsao-semanal">
            {previsaoSemanal.map((d) => (
              <div className="previsao-dia" key={d.key}>
                <span className="dia-nome">{d.nomeDia}</span>
                <span className="previsao-icone">
                  <i className={`fa-solid ${d.icone.icone}`} style={{ color: d.icone.cor, fontSize: 64 }}></i>
                </span>
                <span className="dia-temp">
                  {d.tempMax}° / {d.tempMin}°
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="recomendacoes">
          <h3>
            <i className="fa-solid fa-cloud-sun"></i>Recomendações para você
          </h3>
          <div className="quando-plantar">
            {recPlantio && (
              <div className={`rec-card ${recPlantio.classe}`}>
                <i className={`fa-solid ${recPlantio.icone}`}></i>
                <div>
                  <strong>{recPlantio.titulo}</strong>
                  <p>{recPlantio.texto}</p>
                </div>
              </div>
            )}
          </div>
          <div className="quando-colher">
            {recColheita && (
              <div className={`rec-card ${recColheita.classe}`}>
                <i className={`fa-solid ${recColheita.icone}`}></i>
                <div>
                  <strong>{recColheita.titulo}</strong>
                  <p>{recColheita.texto}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="cards-bottom">
          <section className="calendario">
            <h3>
              <i className="fa-solid fa-calendar-days"></i> Calendário Agrícola
            </h3>
            <span id="mes">{mesFormatado}</span>
            <div id="calendario-conteudo">
              <table>
                <thead>
                  <tr>
                    {DIAS_SEMANA.map((d) => (
                      <th key={d}>{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {semanas.map((semana, i) => (
                    <tr key={i}>
                      {semana.map((cel) => (
                        <td key={cel.key} className={cel.tipo === 'vazio' || cel.tipo === 'normal' ? '' : cel.tipo}>
                          {cel.dia ?? ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="legenda-calendario">
              <span className="legenda-item">
                <span className="legenda-cor" style={{ backgroundColor: '#1565c0' }}></span> Hoje
              </span>
              <span className="legenda-item">
                <span className="legenda-cor" style={{ backgroundColor: '#2e7d32' }}></span> Bom para plantar
              </span>
              <span className="legenda-item">
                <span className="legenda-cor" style={{ backgroundColor: '#f9a825' }}></span> Bom para colher
              </span>
            </div>
          </section>

          <section className="alertas">
            <h3>
              <i className="fa-solid fa-bell"></i> Alertas importantes
            </h3>
            <div id="alertas-conteudo">
              {alertas.map((a, i) => (
                <div className={`alerta-item alerta-${a.tipo}`} key={i}>
                  <i className={`fa-solid ${a.icone}`}></i>
                  <div>
                    <strong>{a.titulo}</strong>
                    <p>{a.texto}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
