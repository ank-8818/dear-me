// function markTruncated() {
//     document.querySelectorAll(".post-card__preview").forEach(preview => {
//         const isCutOff = preview.scrollHeight > preview.clientHeight + 1;
//         preview.closest(".post-card").classList.toggle("is-truncated", isCutOff);
//     });
// }

// markTruncated();
// document.fonts.ready.then(markTruncated);   // measure again once fonts load
// window.addEventListener("resize", markTruncated);

function markTruncated(cards) {
    cards.forEach(card => {
        const preview = card.querySelector(".post-card__preview");
        if (!preview) return;
        card.classList.toggle("is-truncated", preview.scrollHeight > preview.clientHeight + 1);
    });
}

const allCards = () => document.querySelectorAll(".post-card");
markTruncated(allCards());
document.fonts?.ready.then(() => markTruncated(allCards()));
window.addEventListener("resize", () => markTruncated(allCards()));

window.markTruncated = markTruncated;