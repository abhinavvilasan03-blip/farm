// Open and close the small-screen navigation menu.
const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");

menuButton?.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("show");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    menuButton.textContent = isOpen ? "×" : "☰";
});

navLinks?.addEventListener("click", function (event) {
    if (event.target.closest("a")) {
        navLinks.classList.remove("show");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open menu");
        menuButton.textContent = "☰";
    }
});

// Rotate through practical, general farming tips.
const tipButton = document.getElementById("tipButton");
const extraTip = document.getElementById("extraTip");
const farmingTips = [
    "Walk the same parts of the field each week and note changes in leaves, soil moisture, and pests.",
    "Check a local forecast before irrigation or spraying, and avoid applying products in unsuitable wind or rain.",
    "A soil test can help guide nutrient decisions; follow its results and local agricultural advice.",
    "Clean tools between affected plants or plots to reduce the chance of spreading pests and disease.",
    "Record planting dates, rainfall, and field observations so you can compare what worked next season."
];
let lastTipIndex = 0;
tipButton?.addEventListener("click", function () {
    if (!extraTip) return;
    let nextIndex = Math.floor(Math.random() * farmingTips.length);
    if (farmingTips.length > 1 && nextIndex === lastTipIndex) nextIndex = (nextIndex + 1) % farmingTips.length;
    lastTipIndex = nextIndex;
    extraTip.textContent = farmingTips[nextIndex];
});

// Filter crop cards by category and search terms.
const cropSearch = document.getElementById("cropSearch");
const cropCards = [...document.querySelectorAll(".crop-card")];
const cropEmpty = document.getElementById("cropEmpty");
let activeCropCategory = "all";
function updateCropResults() {
    const query = cropSearch?.value.trim().toLowerCase() || "";
    let visibleCount = 0;
    cropCards.forEach((card) => {
        const categoryMatches = activeCropCategory === "all" || card.dataset.cropCategory === activeCropCategory;
        const textMatches = `${card.dataset.cropSearch || ""} ${card.textContent}`.toLowerCase().includes(query);
        card.hidden = !(categoryMatches && textMatches);
        if (!card.hidden) visibleCount += 1;
    });
    if (cropEmpty) cropEmpty.hidden = visibleCount > 0;
}
cropSearch?.addEventListener("input", updateCropResults);
document.querySelectorAll("[data-crop-filter]").forEach((button) => {
    button.addEventListener("click", function () {
        activeCropCategory = button.dataset.cropFilter;
        document.querySelectorAll("[data-crop-filter]").forEach((filter) => {
            const selected = filter === button;
            filter.classList.toggle("active", selected);
            filter.setAttribute("aria-pressed", String(selected));
        });
        updateCropResults();
    });
});

// Show a short overview when a crop is selected.
const cropSelect = document.getElementById("cropSelect");
const cropInfo = document.getElementById("cropInfo");
const cropOverviews = {
    rice: "Rice: check local planting windows, water availability, soil drainage, and guidance for the variety grown in your area.",
    wheat: "Wheat: variety choice and sowing time depend on local temperatures; monitor soil condition and crop stage.",
    tomato: "Tomato: plan for suitable sunlight, support, steady moisture, and regular checks for pests and disease.",
    coconut: "Coconut: consider rainfall and soil moisture, and observe palm leaves and the soil around each tree."
};
cropSelect?.addEventListener("change", function () {
    if (cropInfo) cropInfo.textContent = cropOverviews[cropSelect.value] || "Choose a crop to see its overview.";
});

// Calculate product mass from a user-supplied nutrient rate and label percentage.
const fertilizerForm = document.getElementById("fertilizerForm");
fertilizerForm?.addEventListener("submit", function (event) {
    event.preventDefault();
    const rate = Number(document.getElementById("nutrientRate").value);
    const percentage = Number(document.getElementById("nutrientPercent").value);
    const area = Number(document.getElementById("fieldArea").value);
    const result = document.getElementById("fertilizerResult");
    if (!fertilizerForm.reportValidity() || !Number.isFinite(rate + percentage + area) || rate <= 0 || percentage <= 0 || percentage > 100 || area <= 0) return;
    const productMass = (rate * area) / (percentage / 100);
    result.textContent = `Estimated product quantity: ${productMass.toLocaleString(undefined, { maximumFractionDigits: 2 })} kg for ${area} acre${area === 1 ? "" : "s"}.`;
});

// Browse the field photo gallery with previous, next, and direct-selection controls.
const gallerySlides = [
    { src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=85", alt: "Green fields and crops under a wide sky", caption: "Fields and growing seasons" },
    { src: "https://images.unsplash.com/photo-1499524029604-8d7e9b96b0f5?auto=format&fit=crop&w=1400&q=85", alt: "Rows of crops growing in a field", caption: "Healthy growth starts with regular observation" },
    { src: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1400&q=85", alt: "Fresh produce harvested from a farm", caption: "A closer look at the harvest" }
];
const galleryImage = document.getElementById("galleryImage");
const galleryCaption = document.getElementById("galleryCaption");
const galleryDots = document.getElementById("galleryDots");
let galleryIndex = 0;
function showGallerySlide(index) {
    galleryIndex = (index + gallerySlides.length) % gallerySlides.length;
    const slide = gallerySlides[galleryIndex];
    if (galleryImage) { galleryImage.src = slide.src; galleryImage.alt = slide.alt; }
    if (galleryCaption) galleryCaption.textContent = slide.caption;
    galleryDots?.querySelectorAll("button").forEach((dot, dotIndex) => {
        dot.setAttribute("aria-pressed", String(dotIndex === galleryIndex));
    });
}
gallerySlides.forEach((slide, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "gallery-dot";
    dot.setAttribute("aria-label", `Show photo ${index + 1}: ${slide.caption}`);
    dot.setAttribute("aria-pressed", String(index === 0));
    dot.addEventListener("click", () => showGallerySlide(index));
    galleryDots?.append(dot);
});
document.getElementById("galleryPrevious")?.addEventListener("click", () => showGallerySlide(galleryIndex - 1));
document.getElementById("galleryNext")?.addEventListener("click", () => showGallerySlide(galleryIndex + 1));

// Check the contact form and show a confirmation message.
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

contactForm?.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("contactName").value.trim();
    formMessage.textContent = "Thanks, " + name + "! Your message is shown in this demo only; it has not been sent.";
    contactForm.reset();
});

// Keep a small field checklist and note in this browser on this device.
const fieldNote = document.getElementById("fieldNote");
const fieldNoteStatus = document.getElementById("fieldNoteStatus");
const saveFieldNote = document.getElementById("saveFieldNote");
const clearFieldNote = document.getElementById("clearFieldNote");
const fieldChecks = document.querySelectorAll("[data-field-check]");
const fieldStorageKey = "green-field-field-notes-v1";

function readFieldNotes() {
    try {
        return JSON.parse(localStorage.getItem(fieldStorageKey) || "{}");
    } catch {
        return {};
    }
}

const savedFieldNotes = readFieldNotes();
if (fieldNote) fieldNote.value = savedFieldNotes.note || "";
fieldChecks.forEach((checkbox) => {
    checkbox.checked = Boolean(savedFieldNotes.checks?.[checkbox.dataset.fieldCheck]);
    checkbox.addEventListener("change", saveFieldNotesLocally);
});

function saveFieldNotesLocally() {
    const checks = {};
    fieldChecks.forEach((checkbox) => { checks[checkbox.dataset.fieldCheck] = checkbox.checked; });
    try {
        localStorage.setItem(fieldStorageKey, JSON.stringify({ note: fieldNote?.value || "", checks }));
        return true;
    } catch {
        if (fieldNoteStatus) fieldNoteStatus.textContent = "Saving is unavailable in this browser.";
        return false;
    }
}

fieldNote?.addEventListener("input", saveFieldNotesLocally);
saveFieldNote?.addEventListener("click", function () {
    if (saveFieldNotesLocally() && fieldNoteStatus) fieldNoteStatus.textContent = "Field note saved in this browser.";
});
clearFieldNote?.addEventListener("click", function () {
    if (fieldNote) fieldNote.value = "";
    fieldChecks.forEach((checkbox) => { checkbox.checked = false; });
    try {
        localStorage.removeItem(fieldStorageKey);
        if (fieldNoteStatus) fieldNoteStatus.textContent = "Field note and checklist cleared.";
    } catch {
        if (fieldNoteStatus) fieldNoteStatus.textContent = "Could not clear saved notes in this browser.";
    }
});
