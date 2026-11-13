import Menu from './Menu.jsx'

// Estrutura comum a todas as páginas: menu lateral + área de conteúdo.
// Antes cada página repetia o logo e o menu (com classes diferentes:
// .container, .sidebar, .menu-container). Agora é um componente só.
export default function Layout({ children }) {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icone">
            <i className="fa-solid fa-leaf"></i>
          </div>
          <div>
            <strong>AgroConsulta</strong>
            <span>informações que cultivam resultado</span>
          </div>
        </div>

        <Menu />

        <div className="pitch">
          <span className="pitch-titulo">Pitch video</span>
          <a href="https://youtu.be/bkePyXbytpI?feature=shared" target="_blank" rel="noopener noreferrer">
            <i className="fa-solid fa-circle-play"></i> Versão 1
          </a>
          <a href="https://youtu.be/koGNC3qTVJM" target="_blank" rel="noopener noreferrer">
            <i className="fa-solid fa-circle-play"></i> Versão 2
          </a>
          <a href="https://youtu.be/eJOefE6VJRA" target="_blank" rel="noopener noreferrer">
            <i className="fa-solid fa-circle-play"></i> Versão 3 · React
          </a>
        </div>
      </aside>

      <main className="conteudo">{children}</main>
    </div>
  )
}
