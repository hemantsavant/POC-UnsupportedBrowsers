// compile this file with browserify: "browserify checkBrowser.js -o bundle.js"
const Bowser = require("bowser");
const browser = Bowser.getParser(window.navigator.userAgent);
const browsersConfigFileUrl = "https://uat.cloud.api.aig.net/lnr/staticassets/json/SupportedBrowsers.json";

// hide the Warning message for unsupported browsers
document.getElementById('divUnSupportedBrowserWarning').style.display = 'none';

// Check the current user browser satisfies the supported browsers config, if not - display warning message
const displayUnsupportedBrowserWarningMsg = (config) => {
    const isValidBrowser = browser.satisfies(config);
    if (isValidBrowser == false) {
        document.getElementById('divUnSupportedBrowserWarning').style.display = 'inline';
    }
}

// Get Supported browsers config from S3-bucket
let getSupportedBrowsersConfig = new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open('GET', browsersConfigFileUrl, true);
    xhr.setRequestHeader('Access-Control-Allow-Headers', '*');
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            console.log(`xhr.responseText: ${xhr.responseText}`);
            resolve(xhr.responseText);
        }
    };
    xhr.send();
});

// Check the Supported Browsers config set in microsite
if (window.SupportedBrowsersConfig) {
    displayUnsupportedBrowserWarningMsg(window.SupportedBrowsersConfig);
}
else { // No local config, get it from S3 bucket
    getSupportedBrowsersConfig.then((response) => {
        displayUnsupportedBrowserWarningMsg(JSON.parse(response));
    });
}














