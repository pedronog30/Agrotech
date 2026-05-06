const apiKey = "056ff87db5107a65501e9bc92c30dda2";

function getClimaIcone(descricao) {
    descricao = descricao.toLowerCase();

    if (descricao.includes("céu limpo") || descricao.includes("ceu limpo")) {
        return '<i class="fa-solid fa-sun" style="color: #f5a623; font-size: 64px;"></i>';
    }
    if (descricao.includes("poucas nuvens")) {
        return '<i class="fa-solid fa-cloud-sun" style="color: #f5a623; font-size: 64px;"></i>';
    }
    if (descricao.includes("nuvens dispersas") || descricao.includes("nublado")) {
        return '<i class="fa-solid fa-cloud" style="color: #999; font-size: 64px;"></i>';
    }
    if (descricao.includes("chuva") || descricao.includes("garoa")) {
        return '<i class="fa-solid fa-cloud-rain" style="color: #5b9bd5; font-size: 64px;"></i>';
    }
    if (descricao.includes("trovoada") || descricao.includes("tempestade")) {
        return '<i class="fa-solid fa-cloud-bolt" style="color: #7b68ee; font-size: 64px;"></i>';
    }
    if (descricao.includes("neve")) {
        return '<i class="fa-solid fa-snowflake" style="color: #add8e6; font-size: 64px;"></i>';
    }
    if (descricao.includes("neblina") || descricao.includes("névoa") || descricao.includes("bruma")) {
        return '<i class="fa-solid fa-smog" style="color: #ccc; font-size: 64px;"></i>';
    }

    return '<i class="fa-solid fa-cloud-sun" style="color: #f5a623; font-size: 64px;"></i>';
}

navigator.geolocation.getCurrentPosition(function(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod !== 200) {
                console.log("Erro na API: " + data.message);
                return;
            }
            document.getElementById("Temperatura").textContent = Math.round(data.main.temp) + "°C";
            document.getElementById("Descricao-clima").textContent = data.weather[0].description;
            document.getElementById("clima-icone").innerHTML = getClimaIcone(data.weather[0].description);
            document.getElementById("Chuva").textContent = (data.rain ? data.rain["1h"] : 0) + "%";
            document.getElementById("Umidade").textContent = data.main.humidity + "%";
            document.getElementById("Vento").textContent = data.wind.speed + " km/h";
            document.getElementById("localizacao").innerHTML = '<i class="fa-solid fa-location-dot"></i> ' + data.name;

            let alertasDiv = document.getElementById("alertas-conteudo");
            alertasDiv.innerHTML = "";
            let temp = data.main.temp;
            let chuvaValor = data.rain ? data.rain["1h"] : 0;
            let umidade = data.main.humidity;
            let vento = data.wind.speed;
            let descricao = data.weather[0].description.toLowerCase();

            if (chuvaValor > 5) {
                alertasDiv.innerHTML += '<div class="alerta-item alerta-chuva"><i class="fa-solid fa-cloud-showers-heavy"></i><div><strong>Previsão de chuva forte</strong><p>Há previsão de chuvas intensas. Proteja suas culturas!</p></div></div>';
            }

            if (temp > 35) {
                alertasDiv.innerHTML += '<div class="alerta-item alerta-calor"><i class="fa-solid fa-temperature-high"></i><div><strong>Atenção com a temperatura</strong><p>Temperaturas elevadas podem afetar o desenvolvimento das culturas.</p></div></div>';
            }

            if (temp < 10) {
                alertasDiv.innerHTML += '<div class="alerta-item alerta-frio"><i class="fa-solid fa-snowflake"></i><div><strong>Risco de geada</strong><p>Temperaturas baixas podem danificar as plantações.</p></div></div>';
            }

            if (umidade < 30) {
                alertasDiv.innerHTML += '<div class="alerta-item alerta-seco"><i class="fa-solid fa-sun-plant-wilt"></i><div><strong>Umidade muito baixa</strong><p>Considere irrigar as plantações. Risco de seca.</p></div></div>';
            }

            if (vento > 40) {
                alertasDiv.innerHTML += '<div class="alerta-item alerta-vento"><i class="fa-solid fa-wind"></i><div><strong>Ventos fortes</strong><p>Ventos intensos podem danificar as culturas. Proteja as plantas!</p></div></div>';
            }

            if (descricao.includes("trovoada") || descricao.includes("tempestade")) {
                alertasDiv.innerHTML += '<div class="alerta-item alerta-tempestade"><i class="fa-solid fa-cloud-bolt"></i><div><strong>Alerta de tempestade</strong><p>Tempestade prevista. Evite trabalho no campo!</p></div></div>';
            }

            if (alertasDiv.innerHTML === "") {
                alertasDiv.innerHTML = '<div class="alerta-item alerta-ok"><i class="fa-solid fa-circle-check"></i><div><strong>Tudo certo!</strong><p>Condições climáticas favoráveis para suas culturas.</p></div></div>';
            }
        })
        .catch(error => {
            console.log("Erro ao buscar clima: " + error);
        });

    // Previsão semanal
    let urlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`;

    fetch(urlForecast)
        .then(response => response.json())
        .then(forecast => {
            let previsaoDiv = document.getElementById("previsao-semanal");
            previsaoDiv.innerHTML = "";

            let diasDados = {};
            let hoje = new Date().getDate();

            forecast.list.forEach(item => {
                let data = new Date(item.dt * 1000);
                let dia = data.getDate();

                if (dia !== hoje) {
                    if (!diasDados[dia]) {
                        diasDados[dia] = {
                            data: data,
                            tempMin: item.main.temp_min,
                            tempMax: item.main.temp_max,
                            descricao: item.weather[0].description
                        };
                    } else {
                        if (item.main.temp_min < diasDados[dia].tempMin) {
                            diasDados[dia].tempMin = item.main.temp_min;
                        }
                        if (item.main.temp_max > diasDados[dia].tempMax) {
                            diasDados[dia].tempMax = item.main.temp_max;
                        }
                    }
                }
            });

            let contador = 0;
            for (let dia in diasDados) {
                if (contador >= 5) break;
                let d = diasDados[dia];
                let nomeDia = d.data.toLocaleDateString('pt-BR', { weekday: 'short' });

                previsaoDiv.innerHTML += `
                    <div class="previsao-dia">
                        <span class="dia-nome">${nomeDia}</span>
                        <span class="previsao-icone">${getClimaIcone(d.descricao)}</span>
                        <span class="dia-temp">${Math.round(d.tempMax)}° / ${Math.round(d.tempMin)}°</span>
                    </div>
                `;
                contador++;
            }
        })
        .catch(error => {
            console.log("Erro ao buscar previsão: " + error);
        });
});