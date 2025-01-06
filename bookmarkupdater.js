// Create the context menu item
browser.contextMenus.create({
    id: "update-bookmark-current-page",
    title: browser.i18n.getMessage("updateBookmarkCurrentPage"),
    contexts: ["bookmark"]
});

// Handle the context menu click event
browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "update-bookmark-current-page") {
        // Get the current active tab's URL
        browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
            if (tabs.length > 0) {
                let currentTabUrl = tabs[0].url;
                // Update the bookmark URL
                browser.bookmarks.update(info.bookmarkId, {
                    url: currentTabUrl
                }).then(() => {
                    console.log("Bookmark URL updated successfully");
                }).catch((error) => {
                    console.error("Error updating bookmark URL:", error);
                });
            } else {
                console.error("No active tab found");
            }
        });
    }
});

// Listen for bookmark selection
browser.contextMenus.onShown.addListener((info, tab) => {
    if (info.contexts.includes("bookmark")) {
        browser.bookmarks.get(info.bookmarkId).then((bookmarkItems) => {
            const bookmarkItem = bookmarkItems[0];
            if (bookmarkItem.type === "bookmark") {
                browser.contextMenus.update("update-bookmark-current-page", { visible: true });
            } else {
                browser.contextMenus.update("update-bookmark-current-page", { visible: false });
            }
            browser.contextMenus.refresh();
        });
    }
});