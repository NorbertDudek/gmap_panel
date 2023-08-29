let currentTabId;
let gmapTabId;
let previousTab;
let previousUnreadMails = 0;

function onError(e) {
    console.log("***Error: " + e);
};

function setButtonIcon(imageURL) {
    try {
        browser.browserAction.setIcon({ path: imageURL });
    } catch (e) {
        onError(e);
    }
};

function createTab() {
    browser.tabs.create(
        {
            url: "https://www.google.pl/maps",
            pinned: false,
            active: true
        }
    )
};

function handleSearch(gmapTabs) {
    //console.log("currentTabId: " + currentTabId);
    if (gmapTabs.length > 0) {
        //console.log("there is a gmap tab");
        gmapTabId = gmapTabs[0].id;
        if (gmapTabId === currentTabId) {
            //console.log("I'm in the gmap tab");
            browser.tabs.update(previousTab, { active: true, });
        } else {
            //console.log("I'm NOT in the gmap tab");
            previousTab = currentTabId;
            browser.tabs.update(gmapTabId, { active: true, });
        }
        setButtonIcon(gmapTabs[0].favIconUrl);
    } else {
        //console.log("there is NO gmap tab");
        previousTab = currentTabId;
        createTab();
    }
};

function handleClick(tab) {
    //console.log("*********Button clicked*********");
    currentTabId = tab.id;
    var querying = browser.tabs.query({ url: "*://www.google.pl/maps/*" });
    querying.then(handleSearch, onError);
};

browser.browserAction.onClicked.addListener(handleClick);