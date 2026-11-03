(function () {
    "use strict";

    const DEFAULT_GROUP = "pecho";

    const elements = {
        filters: document.getElementById("filters"),
        grid: document.getElementById("grid"),
        loader: document.getElementById("loader"),
        empty: document.getElementById("empty-message"),
        error: document.getElementById("error-message"),

        // Elementos del Modal
        modal: document.getElementById("exercise-modal"),
        modalImage: document.getElementById("modal-image"),
        modalTitle: document.getElementById("modal-title"),
        modalDesc: document.getElementById("modal-description"),
        closeModalBtn: document.getElementById("close-modal")
    };

    // Configuración de eventos del Modal
    elements.closeModalBtn.addEventListener("click", () => {
        elements.modal.close();
    });

    // Cerrar el modal al hacer clic en el fondo oscuro exterior
    elements.modal.addEventListener("click", (e) => {
        const dialogDimensions = elements.modal.getBoundingClientRect();
        if (
            e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom
        ) {
            elements.modal.close();
        }
    });

    function showState(state, errorMessage = "") {
        elements.loader.classList.toggle("hidden", state !== "loading");
        elements.empty.classList.toggle("hidden", state !== "empty");
        elements.error.classList.toggle("hidden", state !== "error");
        elements.grid.classList.toggle("hidden", state !== "success");

        if (state === "error") elements.error.textContent = errorMessage;
        if (state !== "success") elements.grid.innerHTML = "";
    }

    function getBestTranslation(exercise) {
        let name = exercise.name;
        let description = exercise.description;

        if (exercise.translations && exercise.translations.length > 0) {
            const spanish = exercise.translations.find(t => t.language === 4 && t.name);
            const english = exercise.translations.find(t => t.language === 2 && t.name);

            const best = spanish || english;
            if (best) {
                if (!name || best.language === 4) name = best.name;
                if (!description || best.language === 4) description = best.description;
            }
        }

        return {
            name: name && name.trim() !== "" ? name : null,
            description: description || "<p>Sin instrucciones detalladas.</p>"
        };
    }

    function buildCard(exercise, translation) {
        const card = document.createElement("article");
        card.className = "card";
        const imageUrl = exercise.images[0].image;

        card.innerHTML = `
            <div class="card-media">
                <img src="${imageUrl}" alt="Técnica de ${translation.name}" class="card-image" loading="lazy">
            </div>
            <div class="card-body">
                <h3 class="card-title">${translation.name}</h3>
                <div class="card-description">${translation.description}</div>
            </div>
        `;

        // Lógica de apertura del modal al hacer clic en la tarjeta
        card.addEventListener("click", () => {
            elements.modalImage.src = imageUrl;
            elements.modalImage.alt = `Técnica de ${translation.name}`;
            elements.modalTitle.textContent = translation.name;
            elements.modalDesc.innerHTML = translation.description;
            elements.modal.showModal();
        });

        return card;
    }

    async function loadGroup(groupName) {
        const buttons = elements.filters.querySelectorAll(".filter-btn");
        buttons.forEach(btn => btn.classList.toggle("active", btn.dataset.group === groupName));

        showState("loading");

        try {
            const categoryId = WGER_CATEGORY_IDS[groupName];
            const rawExercises = await fetchExercisesByCategory(categoryId);
            const processedExercises = [];

            rawExercises.forEach(ex => {
                const hasImage = ex.images && ex.images.length > 0 && ex.images[0].image;
                if (!hasImage) return;

                const translation = getBestTranslation(ex);
                if (translation.name) {
                    processedExercises.push({ original: ex, translation: translation });
                }
            });

            if (processedExercises.length === 0) {
                showState("empty");
                return;
            }

            const fragment = document.createDocumentFragment();
            processedExercises.forEach(item => {
                fragment.appendChild(buildCard(item.original, item.translation));
            });

            elements.grid.innerHTML = "";
            elements.grid.appendChild(fragment);
            showState("success");

        } catch (error) {
            showState("error", `Fallo de conexión: ${error.message}`);
        }
    }

    elements.filters.addEventListener("click", (e) => {
        if (e.target.classList.contains("filter-btn")) {
            const group = e.target.dataset.group;
            if (!e.target.classList.contains("active")) {
                loadGroup(group);
            }
        }
    });

    loadGroup(DEFAULT_GROUP);
})();