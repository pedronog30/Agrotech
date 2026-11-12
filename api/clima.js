export default async function handler(req, res) {
  const { tipo, lat, lon } = req.query;

  if (tipo !== "weather" && tipo !== "forecast") {
    return res.status(400).json({ message: "tipo inválido" });
  }

  const url = `https://api.openweathermap.org/data/2.5/${tipo}?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_KEY}&units=metric&lang=pt_br`;

  const resposta = await fetch(url);
  const dados = await resposta.json();
  res.status(resposta.status).json(dados);
}
