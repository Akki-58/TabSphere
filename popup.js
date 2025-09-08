// Show open tabs
chrome.tabs.query({}, (tabs) => {
    const tabList = document.getElementById("tabList");
    tabList.innerHTML = "";

    tabs.forEach((tab) => {
        const div = document.createElement("div");
        div.className = "tab";

        div.innerHTML = `
        <span>${tab.title}</span>
        <button class="close-btn" data-id="${tab.id}"><i class="fa-solid fa-xmark" style="color: rgba(255, 255, 255, 1);"></i></button>
        <button class="save-btn" data-url="${tab.url}" data-tab-title="${tab.title}"><i class="fa-solid fa-floppy-disk" style="color: #ffffff;"></i></button>
        `;

        tabList.appendChild(div);
    });

    // Close tab
    document.querySelectorAll(".close-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            let tabId = parseInt(btn.getAttribute("data-id"));
            chrome.tabs.remove(tabId);
            btn.parentElement.remove();
        });
    });

    // Save tab
    document.querySelectorAll(".save-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            let url = btn.getAttribute("data-url");
            let tab_title = btn.getAttribute("data-tab-title");
            chrome.storage.local.get({ saved: [] }, (data) => {
                let saved = data.saved;
                if (!saved.find(tab => tab.url === url)) { // Avoid duplicates
                    saved.push({title: tab_title, url: url});
                }
                chrome.storage.local.set({ saved });
                loadSavedTabs();
            });
        });
    });
});

// Load saved tabs
function loadSavedTabs() {
    const savedTabs = document.getElementById("savedTabs");
    savedTabs.innerHTML = "";

    chrome.storage.local.get({ saved: [] }, (data) => {
        data.saved.forEach((tab, index) => {
            const div = document.createElement("div");
            div.className = "saved";
            div.innerHTML = `
            <div>
                <div><strong>${tab.title}</strong></div>
                <div><a href="${tab.url}" target="_blank">${tab.url}</a></div>
            </div>
            <button class="close-btn" data-index="${index}"><i class="fa-solid fa-trash-can" style="color: #ffffff;"></i></button>
            `;
            savedTabs.appendChild(div);
        });

        // Delete saved tab
        document.querySelectorAll(".saved .close-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                let index = parseInt(btn.getAttribute("data-index"));
                chrome.storage.local.get({ saved: [] }, (data) => {
                    let saved = data.saved;
                    saved.splice(index, 1); // remove from array
                    chrome.storage.local.set({ saved });
                    loadSavedTabs(); // refresh list
                });
            });
        });
    });
}

loadSavedTabs();