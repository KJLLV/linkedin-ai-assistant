document.getElementById("generate").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "scrapeJob" }, (jobData) => {
      if (!jobData) {
        document.getElementById("output").innerText = "No job data found.";
        return;
      }

      // Send to backend (replace with your API later)
      fetch("http://localhost:5000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData)
      })
      .then(res => res.json())
      .then(data => {
        document.getElementById("output").innerHTML = `
          <h4>Resume</h4><pre>${data.resume}</pre>
          <h4>Cover Letter</h4><pre>${data.coverLetter}</pre>
        `;
      });
    });
  });
});
