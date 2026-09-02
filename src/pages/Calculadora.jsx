import { useState } from 'react'
import Menu from '../components/Menu.jsx'
import usePageStyle from '../hooks/usePageStyle.js'

// Funcionalidade nova da Fase 5: calculadora de custo e lucro do
// plantio. Reaproveita as mesmas classes CSS que o resto do site já
// usa (campo/label-campo/erro-msg do formulário de Contato,
// stats-grid/stat-card da Colheita e rec-card das recomendações da
// Home) — nenhum CSS novo foi necessário.

// Aceita tanto "12.5" quanto "12,5" (jeito comum de digitar decimal no Brasil).
function paraNumero(valor) {
  if (valor.trim() === '') return null
  const numero = parseFloat(valor.replace(',', '.'))
  return Number.isNaN(numero) ? null : numero
}

function validar(valor) {
  if (valor.trim() === '') return ''
  const numero = paraNumero(valor)
  if (numero === null) return 'Digite um número válido.'
  if (numero < 0) return 'O valor não pode ser negativo.'
  return ''
}

function formatarReal(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function Calculadora() {
  usePageStyle('/css/style.css')

  // Um useState por campo, igual ao formulário de Contato.
  const [area, setArea] = useState('')
  const [custoHectare, setCustoHectare] = useState('')
  const [produtividade, setProdutividade] = useState('')
  const [precoVenda, setPrecoVenda] = useState('')

  // Diferença do Contato: aqui a validação e o cálculo rodam a cada
  // renderização (ou seja, a cada tecla digitada), sem precisar de
  // um botão "calcular" — o resultado aparece assim que os 4 campos
  // estiverem preenchidos e válidos.
  const erroArea = validar(area)
  const erroCusto = validar(custoHectare)
  const erroProdutividade = validar(produtividade)
  const erroPreco = validar(precoVenda)

  const todosPreenchidos = [area, custoHectare, produtividade, precoVenda].every((v) => v.trim() !== '')
  const semErros = !erroArea && !erroCusto && !erroProdutividade && !erroPreco

  let resultado = null
  if (todosPreenchidos && semErros) {
    const areaNum = paraNumero(area)
    const custoNum = paraNumero(custoHectare)
    const produtividadeNum = paraNumero(produtividade)
    const precoNum = paraNumero(precoVenda)

    const custoTotal = areaNum * custoNum
    const producaoTotal = areaNum * produtividadeNum
    const receitaTotal = producaoTotal * precoNum
    const lucro = receitaTotal - custoTotal
    const margem = receitaTotal > 0 ? (lucro / receitaTotal) * 100 : 0

    resultado = { custoTotal, producaoTotal, receitaTotal, lucro, margem }
  }

  let classeResultado = 'rec-neutro'
  let iconeResultado = 'fa-circle-info'
  let mensagemResultado = ''

  if (resultado) {
    if (resultado.lucro > 0) {
      classeResultado = 'rec-favoravel'
      iconeResultado = 'fa-circle-check'
      mensagemResultado = 'Lucro estimado positivo — o plantio parece valer a pena nessas condições.'
    } else if (resultado.lucro === 0) {
      classeResultado = 'rec-neutro'
      iconeResultado = 'fa-circle-info'
      mensagemResultado = 'Resultado no zero a zero: a receita cobre exatamente o custo.'
    } else {
      classeResultado = 'rec-desfavoravel'
      iconeResultado = 'fa-triangle-exclamation'
      mensagemResultado = 'Prejuízo estimado — vale revisar o custo por hectare ou o preço de venda.'
    }
  }

  return (
    <>
      <div className="container">
        <div className="card-logo">
          <i className="fa-solid fa-leaf"></i>
          <h1>AgroConsulta</h1>
          <p>informações que cultivam resultado</p>
        </div>
        <Menu />
      </div>

      <main>
        <header>
          <div>
            <h2>
              <i className="fa-solid fa-calculator"></i> Calculadora de custo e lucro
            </h2>
            <p>Estime o custo, a receita e o lucro da sua plantação antes de plantar.</p>
          </div>
        </header>

        <section className="clima">
          <h3>
            <i className="fa-solid fa-seedling"></i> Dados do plantio
          </h3>
          <p>Preencha os campos abaixo para calcular a estimativa.</p>

          <label htmlFor="area" className="label-campo">
            Área plantada (hectares)
          </label>
          <input
            type="text"
            inputMode="decimal"
            id="area"
            className={`campo ${erroArea ? 'campo-erro' : ''}`}
            placeholder="Ex: 10"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
          <span className="erro-msg">{erroArea}</span>

          <label htmlFor="custo" className="label-campo">
            Custo por hectare (R$/ha)
          </label>
          <input
            type="text"
            inputMode="decimal"
            id="custo"
            className={`campo ${erroCusto ? 'campo-erro' : ''}`}
            placeholder="Ex: 3500"
            value={custoHectare}
            onChange={(e) => setCustoHectare(e.target.value)}
          />
          <span className="erro-msg">{erroCusto}</span>

          <label htmlFor="produtividade" className="label-campo">
            Produtividade esperada (sacas/ha)
          </label>
          <input
            type="text"
            inputMode="decimal"
            id="produtividade"
            className={`campo ${erroProdutividade ? 'campo-erro' : ''}`}
            placeholder="Ex: 60"
            value={produtividade}
            onChange={(e) => setProdutividade(e.target.value)}
          />
          <span className="erro-msg">{erroProdutividade}</span>

          <label htmlFor="preco" className="label-campo">
            Preço de venda (R$ por saca)
          </label>
          <input
            type="text"
            inputMode="decimal"
            id="preco"
            className={`campo ${erroPreco ? 'campo-erro' : ''}`}
            placeholder="Ex: 120"
            value={precoVenda}
            onChange={(e) => setPrecoVenda(e.target.value)}
          />
          <span className="erro-msg">{erroPreco}</span>
        </section>

        {resultado ? (
          <>
            <section className="stats-section">
              <h2>
                <i className="fa-solid fa-chart-simple"></i> RESULTADO ESTIMADO
              </h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fa-solid fa-money-bill-wave"></i>
                  </div>
                  <div>
                    <p>Custo total</p>
                    <h3>{formatarReal(resultado.custoTotal)}</h3>
                    <small>investido na lavoura</small>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fa-solid fa-wheat-awn"></i>
                  </div>
                  <div>
                    <p>Produção total</p>
                    <h3>
                      {resultado.producaoTotal.toLocaleString('pt-BR')} <span>sacas</span>
                    </h3>
                    <small>estimadas na safra</small>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fa-solid fa-sack-dollar"></i>
                  </div>
                  <div>
                    <p>Receita total</p>
                    <h3>{formatarReal(resultado.receitaTotal)}</h3>
                    <small>com a venda da safra</small>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fa-solid fa-percent"></i>
                  </div>
                  <div>
                    <p>Margem de lucro</p>
                    <h3>{resultado.margem.toFixed(1)}%</h3>
                    <small>sobre a receita</small>
                  </div>
                </div>
              </div>
            </section>

            <section className="recomendacoes">
              <h3>
                <i className="fa-solid fa-circle-dollar-to-slot"></i> Resultado
              </h3>
              <div className={`rec-card ${classeResultado}`}>
                <i className={`fa-solid ${iconeResultado}`}></i>
                <div>
                  <strong>Lucro estimado: {formatarReal(resultado.lucro)}</strong>
                  <p>{mensagemResultado}</p>
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="recomendacoes">
            <p>🧮 Preencha os quatro campos acima para ver o custo, a receita e o lucro estimados.</p>
          </section>
        )}
      </main>
    </>
  )
}
