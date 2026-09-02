import Menu from '../components/Menu.jsx'
import usePageStyle from '../hooks/usePageStyle.js'


export default function Colheita() {
  usePageStyle('/css/style.css')

  return (
    <>
      <div className="container container-colheita">
        <div className="card-logo">
          <i className="fa-solid fa-leaf"></i>
          <h1>AgroConsulta</h1>
          <p>informações que cultivam resultado</p>
        </div>
        <Menu />
      </div>

      <main>
        <header className="header-colheita">
          <div>
            <h2>
              <i className="fa-solid fa-wheat-awn"></i> Colheita
            </h2>
            <p>
              Acompanhe o desempenho da sua produção
              <br /> em tempo real.
            </p>
          </div>

          <div className="header-status-box">
            <div className="status-coluna">
              <p className="status-title">STATUS DA COLHEITA</p>
              <span className="status-badge">Operação ativa</span>
              <p>Safra em andamento</p>
              <p className="ultima-atualizacao">
                <i className="fa-regular fa-clock"></i> Última atualização: 14:32
              </p>
            </div>

            <div className="status-coluna progresso-coluna">
              <p className="status-title">PROGRESSO GERAL</p>
              <h2 className="progresso-geral">68%</h2>
              <p>da colheita concluída</p>
              <div className="barra">
                <div className="barra-fill"></div>
              </div>
            </div>
          </div>
        </header>

        <section className="stats-section">
          <h2>
            <i className="fa-solid fa-chart-simple"></i> ESTATÍSTICAS RÁPIDAS
          </h2>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fa-solid fa-wheat-awn"></i>
              </div>
              <div>
                <p>
                  Áreas liberadas
                  <br />
                  para colheita
                </p>
                <h3>
                  42 <span>ha</span>
                </h3>
                <small>prontas para colher</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <i className="fa-solid fa-tractor"></i>
              </div>
              <div>
                <p>Máquinas ativas</p>
                <h3>3</h3>
                <small>em operação</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <i className="fa-solid fa-seedling"></i>
              </div>
              <div>
                <p>Safra pronta</p>
                <h3>68%</h3>
                <small>da área total</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <i className="fa-solid fa-basket-shopping"></i>
              </div>
              <div>
                <p>Produção estimada</p>
                <h3>
                  120 <span>t</span>
                </h3>
                <small>até o momento</small>
              </div>
            </div>
          </div>
        </section>

        <section className="painel-inferior">
          <div className="card produtividade-card">
            <h3>
              <i className="fa-solid fa-arrow-trend-up"></i> PRODUTIVIDADE MÉDIA
            </h3>

            <div className="produtividade-info">
              <div className="circulo">
                <i className="fa-solid fa-wheat-awn"></i>
              </div>
              <div className="produtividade-texto">
                <h2>
                  8,2 <span>t/ha</span>
                </h2>
                <p>toneladas por hectare</p>
              </div>
            </div>

            <p className="produtividade-extra">
              <i className="fa-solid fa-arrow-up"></i> +12% em relação à safra anterior
            </p>
          </div>

          <div className="card maquinario-card">
            <h3>
              <i className="fa-solid fa-tractor"></i> MAQUINÁRIO
            </h3>

            <img src="/img/Trator.png" alt="Trator" />

            <div className="maquinario-header">
              <h4>Colheitadeira principal</h4>
              <span className="status-badge">Ativa</span>
            </div>

            <div className="combustivel-box">
              <div className="combustivel-info">
                <p>
                  <i className="fa-solid fa-gas-pump"></i> Combustível
                </p>
                <span>72%</span>
              </div>
              <div className="barra">
                <div className="barra-fill"></div>
              </div>
            </div>

            <div className="manutencao">
              <p>
                <i className="fa-solid fa-wrench"></i> Última manutenção
              </p>
              <span>3 dias atrás</span>
            </div>
          </div>

          <div className="card observacoes-card">
            <h3>
              <i className="fa-solid fa-clipboard-list"></i> OBSERVAÇÕES DA SAFRA
            </h3>
            <ul>
              <li>
                <i className="fa-solid fa-circle-check"></i>
                <span>Condições climáticas favoráveis nos últimos dias.</span>
              </li>
              <li>
                <i className="fa-solid fa-circle-check"></i>
                <span>A produtividade está acima da média esperada.</span>
              </li>
              <li>
                <i className="fa-solid fa-circle-check"></i>
                <span>Recomenda-se manter o ritmo de colheita nas áreas liberadas.</span>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </>
  )
}
