import { WebExtensionBlocker } from '@cliqz/adblocker-webextension';

if (typeof browser === "undefined") {
    var browser = chrome;
}

WebExtensionBlocker.fromPrebuiltAdsAndTracking().then((blocker) => {
  blocker.enableBlockingInBrowser(browser);
});