import Menu from '../components/Menu.jsx'
import usePageStyle from '../hooks/usePageStyle.js'


export default function Clima() {
  usePageStyle('/css/clima.css')

  return (
    <>
      <div className="sidebar">
        <div className="logo-area">
          <i className="fa-solid fa-leaf"></i>
          <h1>AgroConsulta</h1>
          <p>informações que cultivam resultado</p>
        </div>
        <Menu />
      </div>

      <div className="content">
        <div className="banner">
          <div className="banner-overlay">
            <div className="banner-text">
              <h1>Clima para produzir melhor 🌦️</h1>
              <p>Acompanhe as condições climáticas e tome decisões mais assertivas.</p>
            </div>
            <div className="location-badge">
              <i className="fa-solid fa-location-dot"></i>
              <span>Sua Localização, Cidade</span>
            </div>
          </div>
        </div>

        <div className="top-grid">
          <div className="weather-main">
            <h2 className="section-title">Condições atuais</h2>

            <div className="weather-header">
              <div className="weather-left">
                <div className="weather-icon">
                  <i className="fa-solid fa-cloud-sun"></i>
                </div>
                <div className="temperature-info">
                  <h1>19°C</h1>
                  <p>Parcialmente nublado</p>
                  <span>Sensação térmica 18°C</span>
                </div>
              </div>

              <div className="weather-right">
                <div className="info-card">
                  <i className="fa-solid fa-droplet"></i>
                  <div>
                    <h3>Umidade</h3>
                    <p>78%</p>
                  </div>
                </div>
                <div className="info-card">
                  <i className="fa-solid fa-wind"></i>
                  <div>
                    <h3>Vento</h3>
                    <p>3.6 km/h</p>
                  </div>
                </div>
                <div className="info-card">
                  <i className="fa-solid fa-gauge"></i>
                  <div>
                    <h3>Pressão</h3>
                    <p>1018 hPa</p>
                  </div>
                </div>
                <div className="info-card">
                  <i className="fa-solid fa-eye"></i>
                  <div>
                    <h3>Visibilidade</h3>
                    <p>10 km</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="alerts">
            <h2 className="section-title">Alertas Climáticos</h2>
            <div className="alert-card">
              <h3>🌧️ Chuva intensa</h3>
              <p>Possibilidade de chuva forte nas próximas 24 horas.</p>
            </div>
            <div className="alert-card">
              <h3>💨 Ventos moderados</h3>
              <p>Rajadas de até 18 km/h previstas para o período da tarde.</p>
            </div>
            <div className="alert-card">
              <h3>☀️ Baixa umidade</h3>
              <p>Umidade abaixo de 35% prevista para amanhã.</p>
            </div>
          </div>
        </div>

        <div className="forecast-section">
          <h2 className="section-title">Previsão por hora</h2>

          <div className="forecast-grid">
            {[
              { hora: '00h', icone: 'fa-cloud', temp: '17°C', chuva: '10%' },
              { hora: '03h', icone: 'fa-moon', temp: '16°C', chuva: '10%' },
              { hora: '06h', icone: 'fa-cloud-rain', temp: '18°C', chuva: '20%' },
              { hora: '09h', icone: 'fa-cloud-sun-rain', temp: '20°C', chuva: '20%' },
              { hora: '12h', icone: 'fa-sun', temp: '21°C', chuva: '10%' },
              { hora: '15h', icone: 'fa-cloud-sun', temp: '22°C', chuva: '20%' },
            ].map((item) => (
              <div className="forecast-card" key={item.hora}>
                <h4>{item.hora}</h4>
                <i className={`fa-solid ${item.icone}`}></i>
                <p>{item.temp}</p>
                <div className="forecast-extra">
                  <span>
                    <i className="fa-solid fa-cloud-rain"></i> {item.chuva}
                  </span>
                  <small>0 mm</small>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mini-grid">
          <div className="mini-card">
            <div className="mini-icon">
              <i className="fa-solid fa-sun"></i>
            </div>
            <div className="mini-info">
              <span>Índice UV</span>
              <h3>Moderado</h3>
              <p>Nível 5</p>
            </div>
          </div>

          <div className="mini-card">
            <div className="mini-icon">
              <i className="fa-solid fa-wind"></i>
            </div>
            <div className="mini-info">
              <span>Qualidade do ar</span>
              <h3>Boa</h3>
              <p>Sem riscos</p>
            </div>
          </div>

          <div className="mini-card">
            <div className="mini-icon">
              <i className="fa-solid fa-sun-plant-wilt"></i>
            </div>
            <div className="mini-info">
              <span>Nascer do sol</span>
              <h3>06:14</h3>
              <p>Pôr do sol 17:42</p>
            </div>
          </div>

          <div className="mini-card">
            <div className="mini-icon">
              <i className="fa-solid fa-temperature-half"></i>
            </div>
            <div className="mini-info">
              <span>Sensação</span>
              <h3>21°C</h3>
              <p>Clima agradável</p>
            </div>
          </div>
        </div>

        <div className="bottom-grid">
          <div className="temperature-section card">
            <h2 className="section-title">Temperatura ao longo do dia</h2>
            <div className="chart-area">
              <div className="chart-line"></div>
              <div className="temp-point" style={{ left: '5%', bottom: '40%' }}>
                <span>15°</span>
              </div>
              <div className="temp-point" style={{ left: '25%', bottom: '35%' }}>
                <span>14°</span>
              </div>
              <div className="temp-point" style={{ left: '45%', bottom: '50%' }}>
                <span>19°</span>
              </div>
              <div className="temp-point" style={{ left: '65%', bottom: '65%' }}>
                <span>22°</span>
              </div>
              <div className="temp-point" style={{ left: '85%', bottom: '45%' }}>
                <span>16°</span>
              </div>
              <div className="chart-hours">
                <span>00h</span>
                <span>03h</span>
                <span>06h</span>
                <span>09h</span>
                <span>12h</span>
              </div>
            </div>
          </div>

          <div className="map-section card">
            <div className="map-top">
              <div>
                <h2 className="section-title">Radar climático</h2>
                <p className="map-subtitle">Monitoramento visual das condições climáticas</p>
              </div>
              <div className="map-status">
                <span></span>
                Atualizado agora
              </div>
            </div>
            <div className="map-container">
              <div className="map-controls">
                <button>+</button>
                <button>-</button>
              </div>
              <div className="map-legend">
                <div className="legend-item">
                  <span className="legend green"></span>
                  Fraco
                </div>
                <div className="legend-item">
                  <span className="legend yellow"></span>
                  Moderado
                </div>
                <div className="legend-item">
                  <span className="legend red"></span>
                  Forte
                </div>
              </div>
              <div className="city city-1">São Paulo</div>
              <div className="city city-2">Campinas</div>
              <div className="city city-3">Guarulhos</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
