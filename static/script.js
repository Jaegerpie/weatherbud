const COUNTRY_NAMES = {
    IN: "India",
    US: "United States",
    GB: "United Kingdom",
    CA: "Canada",
    AU: "Australia",
    DE: "Germany",
    FR: "France",
    JP: "Japan",
    BR: "Brazil",
    MX: "Mexico",
};

document.getElementById("city").addEventListener("keydown", (e) => {
    if (e.key === "Enter") getWeather();
});

const BACKDROP_CONDITIONS = new Set([
    "default",
    "clear",
    "clouds",
    "rain",
    "thunder",
    "snow",
    "fog",
    "dust",
]);

function normalizeBackdropCondition(mainRaw) {
    const m = (mainRaw || "").toLowerCase();
    const map = {
        thunderstorm: "thunder",
        drizzle: "rain",
        rain: "rain",
        snow: "snow",
        mist: "fog",
        fog: "fog",
        haze: "fog",
        smoke: "fog",
        dust: "dust",
        sand: "dust",
        ash: "dust",
        squall: "thunder",
        tornado: "thunder",
        clear: "clear",
        clouds: "clouds",
    };
    const key = map[m];
    return key && BACKDROP_CONDITIONS.has(key) ? key : "clouds";
}

function applyWeatherBackdrop(mainWeather, iconCode) {
    const condition = normalizeBackdropCondition(mainWeather);
    const icon = iconCode || "01d";
    const time = icon.endsWith("n") ? "night" : "day";
    document.querySelectorAll(".page-bg, .page-overlay").forEach((el) => {
        el.dataset.condition = condition;
        el.dataset.time = time;
    });
}

function resetWeatherBackdrop() {
    document.querySelectorAll(".page-bg, .page-overlay").forEach((el) => {
        el.dataset.condition = "default";
        el.dataset.time = "day";
    });
}

function countryLabel(code) {
    if (!code) return "";
    return COUNTRY_NAMES[code] || code;
}

function msToKmh(ms) {
    return Math.round(ms * 3.6);
}

function buildTips(mainWeather, description, tempC, feelsLike, windMs) {
    const main = (mainWeather || "").toLowerCase();
    const desc = (description || "").toLowerCase();

    const rainy =
        ["rain", "drizzle", "thunderstorm"].includes(main) ||
        /rain|drizzle|shower|pour/.test(desc);
    const snowy =
        main === "snow" || /snow|sleet|blizzard|flurr/.test(desc);
    const stormy = main === "thunderstorm" || /thunder|lightning/.test(desc);
    const foggy =
        ["mist", "fog", "haze", "smoke", "dust", "sand", "ash"].includes(
            main
        ) || /fog|mist|smog|haze/.test(desc);
    const clearSky = main === "clear";
    const cloudy = main === "clouds";

    const feels =
        typeof feelsLike === "number"
            ? feelsLike
            : typeof tempC === "number"
              ? tempC
              : 20;
    const temp =
        typeof tempC === "number" ? tempC : feels;

    const wind =
        typeof windMs === "number" && !Number.isNaN(windMs) ? windMs : 0;
    const windy = wind >= 8;
    const veryWindy = wind >= 14;

    const tips = [];
    const add = (t) => tips.push(t);

    if (snowy) {
        add({
            emoji: "🧥",
            title: "Warm insulated coat",
            sub: "Cold air bites quickly",
        });
        add({
            emoji: "🧤",
            title: "Gloves & scarf",
            sub: "Protect hands and neck",
        });
        add({
            emoji: "🥾",
            title: "Boots with grip",
            sub: "Snow and ice underfoot",
        });
    } else if (stormy) {
        add({
            emoji: "⚡",
            title: "Seek sturdy shelter",
            sub: "Thunder can roll in fast",
        });
        add({
            emoji: "☂️",
            title: "Umbrella or rain shell",
            sub: "Sudden heavy rain likely",
        });
    } else if (rainy) {
        add({
            emoji: "☂️",
            title: "Umbrella",
            sub: "Don't forget it!",
        });
        add({
            emoji: "👟",
            title: "Waterproof shoes",
            sub: "Keep socks dry",
        });
    } else if (foggy) {
        add({
            emoji: "👁️",
            title: "Mind visibility",
            sub: "Take it slow outside",
        });
        add({
            emoji: "🦺",
            title: "Bright or reflective gear",
            sub: "Easier for others to see you",
        });
    } else if (clearSky) {
        add({
            emoji: "🕶️",
            title: "Sunglasses",
            sub: "Clear skies mean glare",
        });
        if (feels >= 22) {
            add({
                emoji: "🧴",
                title: "Sunscreen",
                sub: "UV adds up even when cool",
            });
        }
    } else if (cloudy) {
        add({
            emoji: "🌥️",
            title: "Easy layering day",
            sub: "Cloud cover can shift fast",
        });
    }

    if (!snowy && feels < 12) {
        add({
            emoji: "🧣",
            title: "Hat & warm layers",
            sub: "Wind steals heat fast",
        });
    } else if (!snowy && feels >= 12 && feels < 18) {
        add({
            emoji: "🧥",
            title: "Light jacket",
            sub: "Better to carry one",
        });
    } else if (!snowy && feels >= 28) {
        add({
            emoji: "🧢",
            title: "Breathable light clothes",
            sub: "Heat builds under thick layers",
        });
    } else if (!snowy && !rainy && feels >= 18 && feels < 28) {
        add({
            emoji: "👕",
            title: "Comfortable basics",
            sub: "Easy to adjust if it shifts",
        });
    }

    if (veryWindy) {
        add({
            emoji: "💨",
            title: "Secure hood / hat",
            sub: "Gusty wind outside",
        });
    } else if (windy && !snowy) {
        add({
            emoji: "🧥",
            title: "Windbreaker layer",
            sub: "Cuts through the breeze",
        });
    }

    if ((rainy || snowy || feels < 16) && !stormy) {
        add({
            emoji: "☕",
            title: "Warm drink",
            sub: "Nice after cold or damp air",
        });
    } else if (feels >= 24 && !rainy) {
        add({
            emoji: "💧",
            title: "Extra water",
            sub: "Hydrate before you feel thirsty",
        });
    } else {
        add({
            emoji: "💧",
            title: "Water bottle",
            sub: "Sip steadily through the day",
        });
    }

    const seen = new Set();
    let unique = tips.filter((t) => {
        if (seen.has(t.title)) return false;
        seen.add(t.title);
        return true;
    });

    const padPool = [];
    if (!unique.some((t) => t.title.includes("Umbrella")) && rainy && !snowy) {
        padPool.push({
            emoji: "🧥",
            title: "Packable shell",
            sub: "Backup if rain strengthens",
        });
    }
    if (snowy) {
        padPool.push({
            emoji: "🔥",
            title: "Hand warmers",
            sub: "Optional pockets helper",
        });
    }
    if (clearSky && feels < 20 && !unique.some((t) => t.title === "Sunscreen")) {
        padPool.push({
            emoji: "🧴",
            title: "Moisturizer / SPF light",
            sub: "Cool sun still dries skin",
        });
    }
    padPool.push(
        { emoji: "🎒", title: "Small bag", sub: "Stash layers you peel off" },
        {
            emoji: "🧦",
            title: "Extra socks",
            sub: "Handy if feet get damp",
        },
        {
            emoji: "😌",
            title: "Check again later",
            sub: "Weather can swing hours apart",
        }
    );

    let i = 0;
    while (unique.length < 4 && i < padPool.length) {
        const p = padPool[i++];
        if (!seen.has(p.title)) {
            seen.add(p.title);
            unique.push(p);
        }
    }

    return unique.slice(0, 4);
}

function renderTips(tips) {
    const grid = document.getElementById("tips-grid");
    grid.innerHTML = tips
        .map(
            (t) => `
      <div class="tip-cell">
        <div class="tip-emoji" aria-hidden="true">${t.emoji}</div>
        <p class="tip-title">${t.title}</p>
        <p class="tip-sub">${t.sub}</p>
      </div>`
        )
        .join("");
}

function showError(msg) {
    const el = document.getElementById("error-msg");
    el.textContent = msg;
    el.classList.remove("hidden");
}

function clearError() {
    const el = document.getElementById("error-msg");
    el.textContent = "";
    el.classList.add("hidden");
}

function apiOk(data) {
    return data && (data.cod === 200 || data.cod === "200");
}

function getWeather() {
    const raw = document.getElementById("city").value.trim();
    clearError();

    if (!raw) {
        showError("Please enter a city name.");
        return;
    }

    const city = encodeURIComponent(raw);
    const panel = document.getElementById("weather-panel");

    fetch(`/get-weather?city=${city}`)
        .then((res) => res.json())
        .then((data) => {
            if (!apiOk(data)) {
                resetWeatherBackdrop();
                panel.classList.add("hidden");
                const msg =
                    data.message ||
                    "City not found. Try another spelling.";
                showError(
                    typeof msg === "string"
                        ? msg.replace(/^\w/, (c) => c.toUpperCase())
                        : "Could not load weather."
                );
                return;
            }

            const w = data.weather && data.weather[0];
            const m = data.main;
            const sys = data.sys || {};
            const wind = data.wind || {};

            document.getElementById("city-name").textContent = data.name || "—";

            const region = countryLabel(sys.country);
            document.getElementById("region-country").textContent =
                region || "—";

            const iconCode = w && w.icon ? w.icon : "01d";
            const iconImg = document.getElementById("weather-icon");
            iconImg.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
            iconImg.alt = (w && w.description) || "Weather";

            document.getElementById("condition-label").textContent =
                (w && w.main) || "—";

            const temp = m && typeof m.temp === "number" ? Math.round(m.temp) : "—";
            const feels =
                m && typeof m.feels_like === "number"
                    ? Math.round(m.feels_like)
                    : null;

            document.getElementById("temp-main").textContent =
                typeof temp === "number" ? `${temp} °C` : `${temp}`;

            document.getElementById("feels-like").textContent =
                feels != null ? `Feels like ${feels}°C` : "Feels like —";

            document.getElementById("stat-humidity").textContent =
                m && typeof m.humidity === "number"
                    ? `${Math.round(m.humidity)}%`
                    : "—";

            const windMs = typeof wind.speed === "number" ? wind.speed : null;
            document.getElementById("stat-wind").textContent =
                windMs != null ? `${msToKmh(windMs)} km/h` : "—";

            document.getElementById("stat-pressure").textContent =
                m && typeof m.pressure === "number"
                    ? `${Math.round(m.pressure)} hPa`
                    : "—";

            let visText = "—";
            if (typeof data.visibility === "number") {
                visText = `${Math.round(data.visibility / 1000)} km`;
            }
            document.getElementById("stat-visibility").textContent = visText;

            const tips = buildTips(
                w && w.main,
                w && w.description,
                typeof m.temp === "number" ? m.temp : null,
                typeof m.feels_like === "number" ? m.feels_like : null,
                typeof wind.speed === "number" ? wind.speed : null
            );
            renderTips(tips);

            applyWeatherBackdrop(w && w.main, iconCode);

            panel.classList.remove("hidden");
        })
        .catch(() => {
            resetWeatherBackdrop();
            panel.classList.add("hidden");
            showError("Network error. Check your connection and try again.");
        });
}
