function markTruncated() {
    document.querySelectorAll(".post-card__preview").forEach(preview => {
        const isCutOff = preview.scrollHeight > preview.clientHeight + 1;
        preview.closest(".post-card").classList.toggle("is-truncated", isCutOff);
    });
}

markTruncated();
document.fonts.ready.then(markTruncated);   // measure again once fonts load
window.addEventListener("resize", markTruncated);