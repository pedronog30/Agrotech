import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Clima from './pages/Clima.jsx'
import Plantio from './pages/Plantio.jsx'
import Colheita from './pages/Colheita.jsx'
import Calculadora from './pages/Calculadora.jsx'
import Contato from './pages/Contato.jsx'
import HistoricoClimatico from './pages/HistoricoClimatico.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/clima" element={<Clima />} />
      <Route path="/plantio" element={<Plantio />} />
      <Route path="/colheita" element={<Colheita />} />
      <Route path="/calculadora" element={<Calculadora />} />
      <Route path="/contato" element={<Contato />} />
      <Route path="/historico-climatico" element={<HistoricoClimatico />} />   
    </Routes>
  )
}
