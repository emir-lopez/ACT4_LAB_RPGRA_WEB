// Aumentamos el límite y quitamos el parámetro language para recibir las traducciones completas
const WGER_BASE_URL = "https://wger.de/api/v2/exerciseinfo/?limit=60";

const WGER_CATEGORY_IDS = Object.freeze({
    brazos: 8,
    piernas: 9,
    core: 10,
    pecho: 11,
    espalda: 12,
    hombros: 13
});

async function fetchExercisesByCategory(categoryId) {
    const url = `${WGER_BASE_URL}&category=${categoryId}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
    }

    const data = await response.json();
    if (!data || !Array.isArray(data.results)) {
        throw new Error("Formato de datos no reconocido.");
    }

    return data.results;
}