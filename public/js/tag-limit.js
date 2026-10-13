const MAX_TAGS = 3;
const boxes = [...document.querySelectorAll('input[name="tagSlugs"')];
const counter = document.querySelector("#tag-count");

function update() {
    const chosen = boxes.filter(box => box.checked).length;
    counter.textContent = `(${chosen} of ${MAX_TAGS} chosen)`;
    boxes.forEach(box => {box.disabled = !box.checked && chosen >= MAX_TAGS;});
}

if (boxes.length && counter) {
    boxes.forEach(box => box.addEventListener("change", update));
    update();
}