// Run on LinkedIn job pages
function scrapeJob() {
  const jobTitle = document.querySelector("h1")?.innerText || "";
  const company = document.querySelector(".jobs-unified-top-card__company-name")?.innerText || "";
  const description = document.querySelector(".jobs-description-content__text")?.innerText || "";

  return { jobTitle, company, description };
}

// Listen for popup request
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "scrapeJob") {
    sendResponse(scrapeJob());
  }
});
