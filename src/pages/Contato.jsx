import { useState } from 'react'
import Layout from '../components/Layout.jsx'


function validarNome(valor) {
  const nome = valor.trim()
  const partes = nome.split(' ').filter((p) => p.length > 0)

  if (nome === '') return 'O nome não pode ser em branco.'
  if (partes.length < 2) return 'Informe nome e sobrenome.'
  if (partes[0].length < 2 || partes[partes.length - 1].length < 2) {
    return 'Nome e sobrenome devem ter ao menos 2 letras cada.'
  }
  return ''
}

function validarEmail(valor) {
  const email = valor.trim()
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (email === '') return 'O e-mail não pode ser em branco.'
  if (!regexEmail.test(email)) return 'Informe um e-mail válido (ex: nome@email.com).'
  return ''
}

function validarMensagem(valor) {
  const mensagem = valor.trim()

  if (mensagem === '') return 'A mensagem não pode ser em branco.'
  if (valor.length > 500) return 'A mensagem deve ter no máximo 500 caracteres.'
  return ''
}

export default function Contato() {
  // Antes: cada campo era lido na hora do clique com getElementById().value.
  // Agora: cada campo "vive" em uma variável de estado (useState) que é
  // atualizada a cada tecla digitada (onChange) — é o que se chama de
  // "input controlado".
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [erros, setErros] = useState({ nome: '', email: '', mensagem: '' })
  const [sucesso, setSucesso] = useState(false)

  function handleEnviar(e) {
    e.preventDefault()

    const erroNome = validarNome(nome)
    const erroEmail = validarEmail(email)
    const erroMensagem = validarMensagem(mensagem)

    setErros({ nome: erroNome, email: erroEmail, mensagem: erroMensagem })

    if (!erroNome && !erroEmail && !erroMensagem) {
      setSucesso(true)
      setNome('')
      setEmail('')
      setMensagem('')
    } else {
      setSucesso(false)
    }
  }

  return (
    <Layout>
      <header className="cabecalho">
        <div>
          <span className="cabecalho-sobre">Contato</span>
          <h1>Fale com a gente</h1>
          <p>Tem dúvidas ou sugestões? Envie sua mensagem e retornaremos em breve.</p>
        </div>
      </header>

      <div className="linha">
        <form className="card" style={{ flex: '3 1 480px', gap: 8 }} onSubmit={handleEnviar} noValidate>
          <div className="grade-campos">
            <div className="campo-grupo">
              <label htmlFor="nome">Nome completo</label>
              <input
                type="text"
                id="nome"
                className={`campo ${erros.nome ? 'campo-erro' : ''}`}
                placeholder="Ex: João Silva"
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value)
                  setErros((prev) => ({ ...prev, nome: '' }))
                }}
              />
              <span className="erro-msg">{erros.nome}</span>
            </div>

            <div className="campo-grupo">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                className={`campo ${erros.email ? 'campo-erro' : ''}`}
                placeholder="Ex: joao@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setErros((prev) => ({ ...prev, email: '' }))
                }}
              />
              <span className="erro-msg">{erros.email}</span>
            </div>
          </div>

          <div className="campo-grupo">
            <label htmlFor="mensagem">Mensagem</label>
            <textarea
              id="mensagem"
              className={`campo ${erros.mensagem ? 'campo-erro' : ''}`}
              rows="5"
              placeholder="Escreva sua mensagem aqui..."
              value={mensagem}
              onChange={(e) => {
                setMensagem(e.target.value)
                setErros((prev) => ({ ...prev, mensagem: '' }))
              }}
            />
            <div className="linha-info">
              <span className="erro-msg">{erros.mensagem}</span>
              <span style={{ fontSize: 13, color: mensagem.length > 500 ? 'var(--vermelho)' : 'var(--texto-suave)' }}>
                {mensagem.length}/500
              </span>
            </div>
          </div>

          <button type="submit" className="botao" style={{ alignSelf: 'flex-start', marginTop: 8 }}>
            <i className="fa-solid fa-paper-plane"></i> Enviar mensagem
          </button>

          {sucesso && (
            <p className="aviso aviso-sucesso" style={{ marginTop: 12 }}>
              <i className="fa-solid fa-circle-check"></i> Mensagem enviada com sucesso!
            </p>
          )}
        </form>

        <section className="card" style={{ flex: '2 1 280px' }}>
          <h2>Como podemos ajudar</h2>
          <div className="item">
            <div className="icone-box">
              <i className="fa-solid fa-seedling"></i>
            </div>
            <div>
              <strong>Dúvidas sobre plantio</strong>
              <p>Qual cultura escolher, época certa e cuidados com o solo.</p>
            </div>
          </div>
          <div className="item">
            <div className="icone-box azul">
              <i className="fa-solid fa-cloud-sun"></i>
            </div>
            <div>
              <strong>Dados de clima</strong>
              <p>Como interpretar as recomendações e a janela de pulverização.</p>
            </div>
          </div>
          <div className="item">
            <div className="icone-box atencao">
              <i className="fa-solid fa-lightbulb"></i>
            </div>
            <div>
              <strong>Sugestões</strong>
              <p>Ideias para deixar o AgroConsulta mais útil para você.</p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}
