// Function to get the query parameter from the URL
function getQueryParam(param) {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Get the summary from the URL and display it
let summaryText = getQueryParam('summary');
document.getElementById('summary').textContent = decodeURIComponent(summaryText);
