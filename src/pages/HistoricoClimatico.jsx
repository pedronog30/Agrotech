import { useMemo, useState } from "react";
import Layout from "../components/Layout.jsx";



const dadosHistorico = [
  {
    data: "05/10/2026",
    tempMin: 18,
    tempMax: 27,
    chuva: 4,
    umidade: 72,
    condicao: "Parcialmente nublado",
  },
  {
    data: "04/10/2026",
    tempMin: 17,
    tempMax: 25,
    chuva: 8,
    umidade: 78,
    condicao: "Chuvoso",
  },
  {
    data: "03/10/2026",
    tempMin: 16,
    tempMax: 24,
    chuva: 12,
    umidade: 81,
    condicao: "Chuvoso",
  },
  {
    data: "02/10/2026",
    tempMin: 18,
    tempMax: 29,
    chuva: 0,
    umidade: 63,
    condicao: "Ensolarado",
  },
  {
    data: "01/10/2026",
    tempMin: 19,
    tempMax: 30,
    chuva: 0,
    umidade: 59,
    condicao: "Ensolarado",
  },
  {
    data: "30/09/2026",
    tempMin: 17,
    tempMax: 26,
    chuva: 3,
    umidade: 69,
    condicao: "Parcialmente nublado",
  },
  {
    data: "29/09/2026",
    tempMin: 15,
    tempMax: 23,
    chuva: 10,
    umidade: 84,
    condicao: "Chuvoso",
  },
  {
    data: "28/09/2026",
    tempMin: 16,
    tempMax: 25,
    chuva: 6,
    umidade: 76,
    condicao: "Nublado",
  },
  {
    data: "27/09/2026",
    tempMin: 18,
    tempMax: 28,
    chuva: 1,
    umidade: 67,
    condicao: "Parcialmente nublado",
  },
  {
    data: "26/09/2026",
    tempMin: 19,
    tempMax: 31,
    chuva: 0,
    umidade: 56,
    condicao: "Ensolarado",
  },
  {
    data: "25/09/2026",
    tempMin: 18,
    tempMax: 29,
    chuva: 0,
    umidade: 60,
    condicao: "Ensolarado",
  },
  {
    data: "24/09/2026",
    tempMin: 17,
    tempMax: 27,
    chuva: 2,
    umidade: 68,
    condicao: "Nublado",
  },
  {
    data: "23/09/2026",
    tempMin: 16,
    tempMax: 24,
    chuva: 9,
    umidade: 79,
    condicao: "Chuvoso",
  },
  {
    data: "22/09/2026",
    tempMin: 15,
    tempMax: 22,
    chuva: 14,
    umidade: 86,
    condicao: "Chuvoso",
  },
  {
    data: "21/09/2026",
    tempMin: 17,
    tempMax: 26,
    chuva: 5,
    umidade: 73,
    condicao: "Parcialmente nublado",
  },
];

function HistoricoClimatico() {
    const [periodo, setPeriodo] = useState(7);

  const dadosFiltrados = useMemo(() => {
    return dadosHistorico.slice(0, periodo);
  }, [periodo]);

  const mediaTemperatura = useMemo(() => {
    const total = dadosFiltrados.reduce(
      (soma, item) => soma + item.tempMax,
      0
    );

    return (total / dadosFiltrados.length).toFixed(1);
  }, [dadosFiltrados]);

  const totalChuva = useMemo(() => {
    return dadosFiltrados.reduce(
      (soma, item) => soma + item.chuva,
      0
    );
  }, [dadosFiltrados]);

  const mediaUmidade = useMemo(() => {
    const total = dadosFiltrados.reduce(
      (soma, item) => soma + item.umidade,
      0
    );

    return Math.round(total / dadosFiltrados.length);
  }, [dadosFiltrados]);

  const maiorTemperatura = Math.max(
    ...dadosFiltrados.map((item) => item.tempMax)
  );

  return (
    <Layout>
      <header className="cabecalho">
        <div>
          <span className="cabecalho-sobre">Histórico climático</span>
          <h1>Como o clima se comportou</h1>
          <p>
            Consulte os dados climáticos registrados nos últimos dias para
            acompanhar as condições da sua região.
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          <span className="chip chip-verde">
            <i className="fa-solid fa-flask"></i> Dados simulados
          </span>
          <label htmlFor="periodo" className="texto-suave">
            Período
          </label>
          <select
            id="periodo"
            className="select"
            value={periodo}
            onChange={(event) => setPeriodo(Number(event.target.value))}
          >
            <option value={7}>Últimos 7 dias</option>
            <option value={15}>Últimos 15 dias</option>
          </select>
        </div>
      </header>

      <div className="grade-stats">
        <div className="stat">
          <span>
            <i className="fa-solid fa-temperature-half"></i> Média da temperatura máxima
          </span>
          <strong>{mediaTemperatura}°C</strong>
        </div>
        <div className="stat">
          <span>
            <i className="fa-solid fa-cloud-showers-heavy"></i> Chuva acumulada
          </span>
          <strong>
            {totalChuva} <small>mm</small>
          </strong>
        </div>
        <div className="stat">
          <span>
            <i className="fa-solid fa-droplet"></i> Umidade média
          </span>
          <strong>{mediaUmidade}%</strong>
        </div>
      </div>

      <section className="card">
        <div className="linha-info">
          <div>
            <h2>Temperatura máxima</h2>
            <p className="texto-suave">Comparação das temperaturas máximas do período.</p>
          </div>
          <span className="chip chip-verde">Máxima: {maiorTemperatura}°C</span>
        </div>

        <div className="grafico">
          {dadosFiltrados
            .slice()
            .reverse()
            .map((item) => (
              <div className="grafico-item" key={item.data}>
                <div className="grafico-valor">{item.tempMax}°</div>
                <div
                  className="grafico-barra"
                  style={{ height: `${(item.tempMax / 35) * 100}%` }}
                  title={`${item.data}: ${item.tempMax}°C`}
                ></div>
                <span>{item.data.slice(0, 5)}</span>
              </div>
            ))}
        </div>
      </section>

      <section className="card">
        <div>
          <h2>Detalhes do histórico</h2>
          <p className="texto-suave">Confira os dados climáticos de cada dia.</p>
        </div>

        <div className="tabela-scroll">
          <table className="tabela">
            <thead>
              <tr>
                <th>Data</th>
                <th>Condição</th>
                <th>Mínima</th>
                <th>Máxima</th>
                <th>Chuva</th>
                <th>Umidade</th>
              </tr>
            </thead>
            <tbody>
              {dadosFiltrados.map((item) => (
                <tr key={item.data}>
                  <td>{item.data}</td>
                  <td>
                    <span className="selo" style={{ backgroundColor: "var(--superficie-suave)", color: "var(--texto)" }}>
                      {item.condicao}
                    </span>
                  </td>
                  <td>{item.tempMin}°C</td>
                  <td>{item.tempMax}°C</td>
                  <td>{item.chuva} mm</td>
                  <td>{item.umidade}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
}

export default HistoricoClimatico;
