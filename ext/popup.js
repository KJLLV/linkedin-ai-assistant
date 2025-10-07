document.getElementById("generate").addEventListener("click", () => {
  const status = document.getElementById("status");
  const output = document.getElementById("output");

  status.innerText = "⏳ Generating...";
  output.classList.add("hidden");

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "scrapeJob" }, (jobData) => {
      if (!jobData) {
        status.innerText = "⚠️ No job data found.";
        return;
      }

      fetch("http://localhost:5050/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData)
      })
        .then(res => res.json())
        .then(data => {
          status.innerText = "✅ Generated successfully!";
          output.classList.remove("hidden");
          document.getElementById("resume").innerText = data.resume;
          document.getElementById("coverLetter").innerText = data.coverLetter;
        })
        .catch(err => {
          console.error(err);
          status.innerText = "❌ Error generating content. See console.";
        });
    });
  });
});

// Copy to clipboard buttons
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("copy-btn")) {
    const targetId = e.target.getAttribute("data-target");
    const text = document.getElementById(targetId).innerText;
    navigator.clipboard.writeText(text);
    e.target.innerText = "✅ Copied!";
    setTimeout(() => (e.target.innerText = "📋 Copy"), 1500);
  }
});




