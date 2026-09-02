import { useState } from 'react'
import Menu from '../components/Menu.jsx'
import usePageStyle from '../hooks/usePageStyle.js'


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
  usePageStyle('/css/style.css')

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
        <section className="clima">
          <h3>
            <i className="fa-solid fa-envelope"></i> Fale Conosco
          </h3>
          <p>Tem dúvidas ou sugestões? Envie sua mensagem e retornaremos em breve.</p>

          <label htmlFor="nome" className="label-campo">
            Nome Completo
          </label>
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

          <label htmlFor="email" className="label-campo">
            E-mail
          </label>
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

          <label htmlFor="mensagem" className="label-campo">
            Mensagem
          </label>
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
          <span className="erro-msg">{erros.mensagem}</span>
          <span
            id="contador"
            style={{
              fontSize: 12,
              color: mensagem.length > 500 ? '#c62828' : '#999',
              display: 'block',
              marginBottom: 15,
            }}
          >
            {mensagem.length}/500 caracteres
          </span>

          <button className="btn-enviar" onClick={handleEnviar}>
            <i className="fa-solid fa-paper-plane"></i> Enviar mensagem
          </button>

          {sucesso && (
            <p id="mensagem-sucesso" style={{ display: 'block' }}>
              <i className="fa-solid fa-circle-check"></i> Mensagem enviada com sucesso!
            </p>
          )}
        </section>
      </main>
    </>
  )
}
