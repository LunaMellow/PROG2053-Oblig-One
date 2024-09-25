/*
    Live.js
 */

const nightSvg  = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="white" d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"/></svg>`
const daySvg    = `<svg style="width: 1.25em;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="white" d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z"/></svg>`

const baseUrl         = "https://api.open-meteo.com/v1/forecast?current_weather=true"
const tokyoUrl        = "&latitude=35.6895&longitude=139.6917"
const singaporeUrl    = "&latitude=1.352083&longitude=103.819839"
const osloUrl         = "&latitude=59.913868&longitude=10.752245"
const copenhagenUrl   = "&latitude=55.676098&longitude=12.568337"
const capeTownUrl     = "&latitude=-33.924870&longitude=18.424055"

async function loadData(locationUrl) {
    let finalUrl = baseUrl + locationUrl;
    const response = await fetch(finalUrl);
    return await response.json();
}

function wmoToString(code) {
    switch (code) {
        case 0:
            return "Clear sky";
        case 1:
            return "Mainly clear";
        case 2:
            return "Partly cloudy";
        case 3:
            return "Overcast";
        case 45:
        case 48:
            return "Fog";
        case 51:
            return "Light drizzle";
        case 53:
            return "Moderate drizzle";
        case 55:
            return "Dense drizzle";
        case 61:
            return "Slight rain";
        case 63:
            return "Moderate rain";
        case 65:
            return "Heavy rain";
        case 71:
            return "Slight snow";
        case 73:
            return "Moderate snow";
        case 75:
            return "Heavy snow";
        case 80:
            return "Rain showers";
        case 81:
            return "Moderate rain showers";
        case 82:
            return "Violent rain showers";
        case 95:
            return "Thunderstorm";
        case 96:
        case 99:
            return "Thunderstorm with hail";
        default:
            return "Unknown weather code";
    }
}

function isoToString(isoString) {
    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
}



function generateCardData(card, name, data) {
    return `
    <div class="display-flex flex-column weatherbox">
            <div class="display-flex card-header">
                <h1 class="m-0">
                    ${name}
                </h1>
                ${data.current_weather.is_day ? daySvg : nightSvg}
            </div>
            <div class="card-body">
                <div class="display-flex align-center top-info">
                    <h3>${wmoToString(data.current_weather.weathercode)}</h3>
                </div>
                <div class="display-flex infobox-wrapper">
                    <div class="infobox">
                        <p>${data.current_weather.temperature} ${data.current_weather_units.temperature}</p>
                    </div>
                    <div class="display-flex infobox">
                        <p>${data.current_weather.windspeed} ${data.current_weather_units.windspeed}</p>
                        <svg style="transform: rotate(${data.current_weather.winddirection}deg)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path fill="white" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM385 215c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-71-71L280 392c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-214.1-71 71c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9L239 103c9.4-9.4 24.6-9.4 33.9 0L385 215z"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
`
}

function initWeatherBoxes(tokyoBox, singaporeBox, osloBox, copenhagenBox, capeTownBox) {
    // Load and update Tokyo weather data
    loadData(tokyoUrl).then(data => {
        tokyoBox.innerHTML = generateCardData(tokyoBox, "Tokyo", data);
        setInterval(() => {
            loadData(tokyoUrl).then(newData => {
                tokyoBox.innerHTML = generateCardData(tokyoBox, "Tokyo", newData);
                console.log("Updated Tokyo with", newData);
            });
        }, data.current_weather.interval * 1000);
    });

    // Load and update Singapore weather data
    loadData(singaporeUrl).then(data => {
        singaporeBox.innerHTML = generateCardData(singaporeBox, "Singapore", data);
        setInterval(() => {
            loadData(singaporeUrl).then(newData => {
                singaporeBox.innerHTML = generateCardData(singaporeBox, "Singapore", newData);
                console.log("Updated Singapore with", newData);
            });
        }, data.current_weather.interval * 1000);
    });

    // Load and update Oslo weather data
    loadData(osloUrl).then(data => {
        osloBox.innerHTML = generateCardData(osloBox, "Oslo", data);
        setInterval(() => {
            loadData(osloUrl).then(newData => {
                osloBox.innerHTML = generateCardData(osloBox, "Oslo", newData);
                console.log("Updated Oslo with", newData);
            });
        }, data.current_weather.interval * 1000);
    });

    // Load and update Copenhagen weather data
    loadData(copenhagenUrl).then(data => {
        copenhagenBox.innerHTML = generateCardData(copenhagenBox, "Copenhagen", data);
        setInterval(() => {
            loadData(copenhagenUrl).then(newData => {
                copenhagenBox.innerHTML = generateCardData(copenhagenBox, "Copenhagen", newData);
                console.log("Updated Copenhagen with", newData);
            });
        }, data.current_weather.interval * 1000);
    });

    // Load and update Cape Town weather data
    loadData(capeTownUrl).then(data => {
        capeTownBox.innerHTML = generateCardData(capeTownBox, "Cape Town", data);
        setInterval(() => {
            loadData(capeTownUrl).then(newData => {
                capeTownBox.innerHTML = generateCardData(capeTownBox, "Cape Town", newData);
                console.log("Updated Cape Town with", newData);
            });
        }, data.current_weather.interval * 1000);
    });
}

document.addEventListener("DOMContentLoaded", () => {

    const tokyoBox = document.getElementById("tokyoBox");
    const singaporeBox = document.getElementById("singaporeBox");
    const osloBox = document.getElementById("osloBox");
    const copenhagenBox = document.getElementById("copenhagenBox");
    const capeTownBox = document.getElementById("capeTownBox");

    initWeatherBoxes(tokyoBox, singaporeBox, osloBox, copenhagenBox, capeTownBox);

})