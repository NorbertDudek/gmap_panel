let currentTabId;
let gmailTabId;
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

function createPinnedTab() {
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
        //console.log("there is a gmail tab");
        gmailTabId = gmapTabs[0].id;
        if (gmailTabId === currentTabId) {
            //console.log("I'm in the gmail tab");
            browser.tabs.update(previousTab, { active: true, });
        } else {
            //console.log("I'm NOT in the gmail tab");
            previousTab = currentTabId;
            browser.tabs.update(gmailTabId, { active: true, });
        }
        setButtonIcon(gmapTabs[0].favIconUrl);
    } else {
        //console.log("there is NO gmail tab");
        previousTab = currentTabId;
        createPinnedTab();
    }
};

function handleClick(tab) {
    //console.log("*********Button clicked*********");
    currentTabId = tab.id;
    var querying = browser.tabs.query({ url: "*://www.google.pl/maps/*" });
    querying.then(handleSearch, onError);
};

function setCheckMailTimeOut(checkMailTime) {
};

function showNotificationPopup(unreadMails) {
}

function notificationHandler(unreadMails, showNotifications, repetitiveNotifications) {
    //var soundNotifications = false; //configurable
    if (showNotifications) {
        if (repetitiveNotifications) {
            showNotificationPopup(unreadMails);
            /*
            no sound notifications so far
            if(soundNotifications){
              console.log("play sound");
            };
            */
        } else {
            //console.log("previousUnreadMails: " + previousUnreadMails);
            //console.log("unreadMails: " + unreadMails);
            if (previousUnreadMails < unreadMails) {
                showNotificationPopup(unreadMails);
                /*
                no sound notifications so far
                if(soundNotifications){
                  console.log("play sound");
                };
                */
            };
        };
    };
    previousUnreadMails = unreadMails;
};

function checkMail(gmapTabs) {
};

function update(details) {
    if (details.reason === "install" || details.reason === "update") {
        browser.runtime.openOptionsPage();
    }
};

browser.browserAction.onClicked.addListener(handleClick);
browser.runtime.onInstalled.addListener(update);

browser.storage.sync.get("checkMailTime").then(function (item) {
    var checkMailTime = item.checkMailTime || 1;
    setCheckMailTimeOut(checkMailTime);
});