import { useState } from 'react'
import Layout from '../components/Layout.jsx'

// Funcionalidade nova da Fase 5: calculadora de custo e lucro do
// plantio. Usa as mesmas peças visuais do resto do site (campo,
// stat, item), definidas no CSS global.

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

  let classeResultado = 'item-neutro'
  let iconeResultado = 'fa-circle-info'
  let mensagemResultado = ''

  if (resultado) {
    if (resultado.lucro > 0) {
      classeResultado = 'item-bom'
      iconeResultado = 'fa-circle-check'
      mensagemResultado = 'Lucro estimado positivo — o plantio parece valer a pena nessas condições.'
    } else if (resultado.lucro === 0) {
      classeResultado = 'item-neutro'
      iconeResultado = 'fa-circle-info'
      mensagemResultado = 'Resultado no zero a zero: a receita cobre exatamente o custo.'
    } else {
      classeResultado = 'item-ruim'
      iconeResultado = 'fa-triangle-exclamation'
      mensagemResultado = 'Prejuízo estimado — vale revisar o custo por hectare ou o preço de venda.'
    }
  }

  return (
    <Layout>
      <header className="cabecalho">
        <div>
          <span className="cabecalho-sobre">Calculadora</span>
          <h1>Custo e lucro da plantação</h1>
          <p>Estime o custo, a receita e o lucro antes de plantar. O resultado aparece enquanto você digita.</p>
        </div>
      </header>

      <section className="card">
        <h2>
          <i className="fa-solid fa-seedling"></i> Dados do plantio
        </h2>
        <div className="grade-campos">
            <div className="campo-grupo">
              <label htmlFor="area">Área plantada (hectares)</label>
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
            </div>
            <div className="campo-grupo">
              <label htmlFor="custo">Custo por hectare (R$/ha)</label>
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
            </div>
            <div className="campo-grupo">
              <label htmlFor="produtividade">Produtividade esperada (sacas/ha)</label>
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
            </div>
            <div className="campo-grupo">
              <label htmlFor="preco">Preço de venda (R$ por saca)</label>
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
            </div>
        </div>
      </section>

      {resultado ? (
        <>
          <div className="grade-stats">
            <div className="stat">
              <span>Custo total</span>
              <strong>{formatarReal(resultado.custoTotal)}</strong>
              <em>investido na plantação</em>
            </div>
            <div className="stat">
              <span>Produção total</span>
              <strong>
                {resultado.producaoTotal.toLocaleString('pt-BR')} <small>sacas</small>
              </strong>
              <em>estimadas na safra</em>
            </div>
            <div className="stat">
              <span>Receita total</span>
              <strong>{formatarReal(resultado.receitaTotal)}</strong>
              <em>com a venda da safra</em>
            </div>
            <div className="stat">
              <span>Margem de lucro</span>
              <strong>{resultado.margem.toFixed(1)}%</strong>
              <em>sobre a receita</em>
            </div>
          </div>

          <div className={`item ${classeResultado}`}>
            <div className="icone-box">
              <i className={`fa-solid ${iconeResultado}`}></i>
            </div>
            <div>
              <strong>Lucro estimado: {formatarReal(resultado.lucro)}</strong>
              <p>{mensagemResultado}</p>
            </div>
          </div>
        </>
      ) : (
        <p className="aviso">
          <i className="fa-solid fa-calculator"></i> Preencha os quatro campos acima para ver o custo, a receita e o
          lucro estimados.
        </p>
      )}
    </Layout>
  )
}
