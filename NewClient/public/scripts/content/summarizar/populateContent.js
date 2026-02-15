// Function to get query parameter
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to parse markdown and render HTML
function parseMarkdown(markdown) {
    return markdown
        .replace(/^# (.*$)/gim, '<h1>$1</h1>') // H1
        .replace(/^## (.*$)/gim, '<h2>$1</h2>') // H2
        .replace(/^### (.*$)/gim, '<h3>$1</h3>') // H3
        .replace(/^\* (.*$)/gim, '<ul><li>$1</li></ul>') // Bullet list
        .replace(/^\d+\. (.*$)/gim, '<ol><li>$1</li></ol>') // Numbered list
        .replace(/`([^`]+)`/g, '<code>$1</code>') // Inline code
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italics
        .replace(/\n/gim, '<br>'); // Line breaks
}

// Render the parsed content
const summaryText = getQueryParam('summary');
if (summaryText) {
    const parsedHTML = parseMarkdown(decodeURIComponent(summaryText));
    document.getElementById('content').innerHTML = parsedHTML;
} else {
    document.getElementById('content').innerHTML = "<p>No summary content provided.</p>";
}