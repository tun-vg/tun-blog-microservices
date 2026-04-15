export function getPreviewContent(html, maxLength = 100) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  const text = tempDiv.textContent || tempDiv.innerText || "";

  return text.length > maxLength
    ? text.substring(0, maxLength) + "..."
    : text;
}

export function extractFirstImage(html) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  const img = tempDiv.querySelector("img");
  return img ? img.src : '/notebook.png';
}

export function getShortContent(html, maxLength = 970) {
  return html.length > maxLength
    ? html.substring(0, maxLength) + "..."
    : html;
}