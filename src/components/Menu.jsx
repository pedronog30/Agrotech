import { NavLink } from 'react-router-dom'

// Menu de navegação reaproveitado em todas as páginas.
// Antes esse <nav><ul>...</ul></nav> estava copiado e colado em
// cada arquivo .html. Em React ele vira um componente único: muda
// em um lugar só, aparece atualizado em todas as páginas.
// NavLink já sabe qual link é da página atual e aplica a classe
// "ativo" sozinho (equivalente ao class="ativo" que antes era
// escrito manualmente em cada página).
function ativo({ isActive }) {
  return isActive ? 'ativo' : undefined
}

export default function Menu({ children }) {
  return (
    <nav className="menu">
      <ul>
        <li>
          <NavLink to="/" end className={ativo}>
            <i className="fa-solid fa-house"></i> Início
          </NavLink>
        </li>
        <li>
          <NavLink to="/clima" className={ativo}>
            <i className="fa-solid fa-cloud-sun"></i> Clima
          </NavLink>
        </li>
        <li>
          <NavLink to="/plantio" className={ativo}>
            <i className="fa-solid fa-seedling"></i> Plantio
          </NavLink>
        </li>
        <li>
          <NavLink to="/colheita" className={ativo}>
            <i className="fa-solid fa-wheat-awn"></i> Colheita
          </NavLink>
        </li>
        <li>
          <NavLink to="/calculadora" className={ativo}>
            <i className="fa-solid fa-calculator"></i> Calculadora
          </NavLink>
        </li>
        <li>
          <NavLink to="/contato" className={ativo}>
            <i className="fa-solid fa-envelope"></i> Contato
          </NavLink>
        </li>
        {children}
      </ul>
    </nav>
  )
}
