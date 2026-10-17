
document.addEventListener("DOMContentLoaded", () => {
    const feed = document.querySelector(".feed");
    const moreContainer = document.querySelector(".feed__more");
    const moreLink = moreContainer?.querySelector("a");

    if (!feed || !moreLink) return;

    let isLoading = false;

    moreLink.addEventListener("click", async (event) => {
        // Allow opening the link in a new tab normally.
        if (
            event.button !== 0 ||
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey ||
            event.altKey
        ) return;

        event.preventDefault();

        if (isLoading) return;

        isLoading = true;

        const nextUrl = moreLink.href;
        const originalText = moreLink.textContent;

        moreLink.textContent = "Loading thoughts…";
        moreLink.setAttribute("aria-disabled", "true");
        feed.setAttribute("aria-busy", "true");

        try {
            // Fetch the next page without navigating away.
            const response = await fetch(nextUrl);

            if (!response.ok) {
                throw new Error("Unable to load posts");
            }

            const html = await response.text();

            // Convert the HTML response into a document.
            const parser = new DOMParser();
            const nextPage = parser.parseFromString(
                html,
                "text/html"
            );

            // Get only the post cards from that page.
            const newPosts = [
                ...nextPage.querySelectorAll(".feed > .post-card")
            ];

            if (newPosts.length === 0) {
                throw new Error("No post cards found");
            }

            // Insert new posts BEFORE the More thoughts button.
            moreContainer.before(...newPosts);
            window.markTruncated?.(newPosts);

            // Find out whether another page exists.
            const nextLink = nextPage.querySelector(
                ".feed__more a"
            );

            if (nextLink) {
                // Update the link for the next batch.
                moreLink.setAttribute(
                    "href",
                    nextLink.getAttribute("href")
                );
            } else {
                // No more posts — remove the button.
                moreContainer.remove();
            }

            // Bring keyboard focus to the first new post.
            newPosts[0].setAttribute("tabindex", "-1");
            newPosts[0].focus();

        } catch (error) {
            console.error("Load more failed:", error);

            // Fall back to normal pagination if loading fails.
            window.location.assign(nextUrl);

        } finally {
            isLoading = false;
            feed.removeAttribute("aria-busy");

            if (moreLink.isConnected) {
                moreLink.textContent = originalText;
                moreLink.removeAttribute("aria-disabled");
            }
        }
    });
});
