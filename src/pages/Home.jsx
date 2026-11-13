import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'




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
      classe: 'item-bom',
      icone: 'fa-seedling',
      titulo: 'Ótimo para plantar Milho!',
      texto: `Temperatura (${Math.round(temp)}°C) e umidade (${umidade}%) estão ideais.`,
    }
  }
  if (temp >= 18 && temp <= 28 && umidade >= 50 && umidade <= 80 && chuvaValor <= 5) {
    return {
      classe: 'item-bom',
      icone: 'fa-seedling',
      titulo: 'Bom para plantar Feijão!',
      texto: `Umidade (${umidade}%) dentro do ideal para o feijão.`,
    }
  }
  if (chuvaValor > 5) {
    return {
      classe: 'item-atencao',
      icone: 'fa-cloud-rain',
      titulo: 'Aguarde a chuva passar',
      texto: 'Chuva intensa não é ideal para o plantio agora.',
    }
  }
  return {
    classe: 'item-ruim',
    icone: 'fa-triangle-exclamation',
    titulo: 'Condições desfavoráveis',
    texto: 'Temperatura ou umidade fora do ideal para plantio.',
  }
}

function calcularRecomendacaoColheita(temp, umidade, chuvaValor) {
  if (temp >= 25 && umidade < 60 && chuvaValor === 0) {
    return {
      classe: 'item-bom',
      icone: 'fa-wheat-awn',
      titulo: 'Ótimo momento para colher Feijão!',
      texto: 'Tempo seco e quente favorece a colheita.',
    }
  }
  if (chuvaValor > 0) {
    return {
      classe: 'item-atencao',
      icone: 'fa-cloud-rain',
      titulo: 'Evite colher com chuva',
      texto: 'A umidade pode danificar os grãos colhidos.',
    }
  }
  return {
    classe: 'item-neutro',
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

  // Cada coisa que antes era escrita direto num elemento do DOM
  // (textContent, innerHTML) agora é uma variável de estado.
  const [localizacao, setLocalizacao] = useState(null)
  const [erroLocalizacao, setErroLocalizacao] = useState(null)
  const [temperatura, setTemperatura] = useState(null)
  const [descricaoClima, setDescricaoClima] = useState('Carregando...')
  const [iconeClima, setIconeClima] = useState(null)
  const [chuva, setChuva] = useState(null)
  const [umidade, setUmidade] = useState(null)
  const [vento, setVento] = useState(null)
  const [previsaoSemanal, setPrevisaoSemanal] = useState([])
  const [alertas, setAlertas] = useState([])
  const [recPlantio, setRecPlantio] = useState(null)
  const [recColheita, setRecColheita] = useState(null)
  const [diasCondicao, setDiasCondicao] = useState({})
  const [erroClima, setErroClima] = useState(null)

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

        const url = `/api/clima?tipo=weather&lat=${lat}&lon=${lon}`

        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            if (data.cod !== 200) {
              setErroClima('Não foi possível carregar o clima agora. Tente novamente mais tarde.')
              return
            }

            const temp = data.main.temp
            const chuvaValor = data.rain ? data.rain['1h'] : 0
            const umidadeValor = data.main.humidity
            const ventoValor = Math.round(data.wind.speed * 3.6) // a API manda em m/s → km/h
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
          .catch(() => {
            setErroClima('Não foi possível carregar o clima agora. Tente novamente mais tarde.')
          })

        const urlForecast = `/api/clima?tipo=forecast&lat=${lat}&lon=${lon}`

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
          .catch(() => {
            setErroClima('Não foi possível carregar a previsão agora. Tente novamente mais tarde.')
          })
      },
      () => {
        setErroLocalizacao('Localização não permitida')
        setErroClima('Permita o acesso à localização para ver o clima da sua região.')
      },
    )
  }, [])

  const nomeMes = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  const mesFormatado = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1)
  const semanas = gerarSemanasCalendario(diasCondicao)

  const hojeTexto = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
  const hojeFormatado = hojeTexto.charAt(0).toUpperCase() + hojeTexto.slice(1)

  // Cor de cada tipo de alerta no novo visual
  const CLASSE_ALERTA = {
    chuva: 'icone-box azul',
    frio: 'icone-box azul',
    calor: 'icone-box atencao',
    seco: 'icone-box atencao',
    vento: 'icone-box atencao',
    tempestade: 'icone-box ruim',
    ok: 'icone-box',
  }

  return (
    <Layout>
      <header className="cabecalho">
        <div>
          <span className="cabecalho-sobre">{hojeFormatado}</span>
          <h1>Olá! Veja como está sua plantação hoje</h1>
        </div>
        <span className="chip">
          <i className="fa-solid fa-location-dot"></i> {localizacao ?? erroLocalizacao ?? 'Localizando...'}
        </span>
      </header>

      {erroClima && <p className="aviso aviso-erro">{erroClima}</p>}

      <div className="linha">
        <section className="card-escuro" style={{ flex: '2 1 560px' }} aria-label="Condições de clima">
          <div className="clima-topo">
            <div className="clima-agora">
              <span className="rotulo">Agora</span>
              <div className="clima-temp">
                <strong>{temperatura !== null ? `${temperatura}°` : '--°'}</strong>
                {iconeClima && <i className={`fa-solid ${iconeClima.icone}`}></i>}
              </div>
              <span className="clima-descricao">{descricaoClima}</span>
            </div>

            <div className="clima-metricas">
              <div className="metrica">
                <i className="fa-solid fa-cloud-rain"></i>
                <span>Chuva</span>
                <strong>{chuva !== null ? `${chuva} mm` : '--'}</strong>
              </div>
              <div className="metrica">
                <i className="fa-solid fa-droplet"></i>
                <span>Umidade</span>
                <strong>{umidade !== null ? `${umidade}%` : '--'}</strong>
              </div>
              <div className="metrica">
                <i className="fa-solid fa-wind"></i>
                <span>Vento</span>
                <strong>{vento !== null ? `${vento} km/h` : '--'}</strong>
              </div>
            </div>
          </div>

          {previsaoSemanal.length > 0 && (
            <div className="previsao">
              {previsaoSemanal.map((d) => (
                <div className="previsao-dia" key={d.key}>
                  <span>{d.nomeDia.replace('.', '')}</span>
                  <i className={`fa-solid ${d.icone.icone}`}></i>
                  <small>
                    {d.tempMax}° <em>{d.tempMin}°</em>
                  </small>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card" style={{ flex: '1 1 320px' }}>
          <h2>Recomendações para você</h2>
          <p className="texto-suave">Calculadas a partir do clima de agora na sua região.</p>

          {[
            { titulo: 'Plantio', rec: recPlantio },
            { titulo: 'Colheita', rec: recColheita },
          ].map(
            ({ titulo, rec }) =>
              rec && (
                <div className={`item ${rec.classe}`} key={titulo}>
                  <div className="icone-box">
                    <i className={`fa-solid ${rec.icone}`}></i>
                  </div>
                  <div>
                    <span className="rotulo">{titulo}</span>
                    <strong>{rec.titulo}</strong>
                    <p>{rec.texto}</p>
                  </div>
                </div>
              ),
          )}

          <Link to="/clima" className="botao" style={{ marginTop: 'auto' }}>
            Ver janela de pulverização
          </Link>
        </section>
      </div>

      <div className="linha">
        <section className="card" style={{ flex: '3 1 480px' }}>
          <div className="cabecalho" style={{ padding: 0, alignItems: 'center' }}>
            <h2>
              <i className="fa-solid fa-calendar-days"></i> Calendário agrícola
            </h2>
            <span className="chip chip-verde">{mesFormatado}</span>
          </div>

          <table className="calendario-tabela">
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

          <div className="legenda">
            <span>
              <i style={{ backgroundColor: 'var(--verde-escuro)' }}></i> Hoje
            </span>
            <span>
              <i style={{ backgroundColor: 'var(--limao)' }}></i> Bom para plantar
            </span>
            <span>
              <i style={{ backgroundColor: 'var(--ambar)' }}></i> Bom para colher
            </span>
          </div>
        </section>

        <section className="card" style={{ flex: '2 1 320px' }}>
          <h2>
            <i className="fa-solid fa-bell"></i> Alertas importantes
          </h2>

          {alertas.length === 0 && <p className="texto-suave">Os alertas aparecem assim que o clima carregar.</p>}

          {alertas.map((a, i) => (
            <div className="item" key={i}>
              <div className={CLASSE_ALERTA[a.tipo] || 'icone-box'}>
                <i className={`fa-solid ${a.icone}`}></i>
              </div>
              <div>
                <strong>{a.titulo}</strong>
                <p>{a.texto}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </Layout>
  )
}
