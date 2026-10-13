const slotByHour = {
    23: "Midnight", 0: "Midnight",
    1: "2 AM and beyond", 2: "2 AM and beyond", 3: "2 AM and beyond",
    4: "Pre-dawn",
    5: "Early morning", 6: "Early morning", 7:"Early morning",
    8: "Morning", 9: "Morning", 10: "Morning",
    11: "Noon", 12:"Noon", 13: "Noon",
    14: "Afternoon", 15: "Afternoon", 16: "Afternoon",
    17: "Golden hour",
    18: "Dusk and twilight",
    19: "Evening", 20: "Evening",
    21: "Night", 22: "Night"
};

const select = document.querySelector("#timeTag");
const box = document.querySelector("#time-suggestion");

if (select && box) {
    const slotName = slotByHour[new Date().getHours()];
    const group = [...select.querySelectorAll("optgroup")].find(g => g.label === slotName);

    if (group && !select.value) {
        const options = [...group.querySelectorAll("option")];
        const pick = options[Math.floor(Math.random() * options.length)];

        box.querySelector("#suggested-label").textContent = pick.textContent;
        box.hidden = false;

        box.querySelector("#use-suggestion").addEventListener("click", () => {
            select.value = pick.value;
            box.hidden = true;
        });
    }
}

