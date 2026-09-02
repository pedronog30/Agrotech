import { useEffect } from 'react'

// Carrega (e remove ao sair da página) o CSS específico daquela página.
// Isso reproduz o comportamento do site original, onde cada .html
// carregava seu próprio arquivo .css — só que agora dentro de uma
// única aplicação React, sem precisar recarregar a página inteira.
export default function usePageStyle(href) {
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [href])
}
