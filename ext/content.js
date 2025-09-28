// Run on LinkedIn job pages
function scrapeJob() {
  const jobTitle = document.querySelector(".jobs-unified-top-card__job-title")?.innerText || "";
  const company = document.querySelector(".jobs-unified-top-card__company-name")?.innerText || "";
  const location = document.querySelector(".jobs-unified-top-card__bullet")?.innerText || "";
  const description = document.querySelector(".jobs-description__content")?.innerText || "";

  return { jobTitle, company, location, description };
}


// Listen for popup request
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "scrapeJob") {
    sendResponse(scrapeJob());
  }
  return true;
});
