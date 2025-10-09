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
        body: JSON.stringify(jobData),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("🧠 AI Response:", data); // ✅ Debugging: see what keys come back

          status.innerText = "✅ Generated successfully!";
          output.classList.remove("hidden");

          // 🧠 Extract resume and cover letter even if both come together
let resume = "";
let coverLetter = "";

// Case A: combined string inside data.resume
if (data.resume && !data.coverLetter) {
  // Split where "Cover Letter" starts (handles variants like "Cover letter:" or "COVER LETTER -")
  const parts = data.resume.split(/Cover\s*Letter[:\-]*/i);
  resume = parts[0].trim();
  coverLetter = parts[1] ? parts[1].trim() : "Cover letter not generated.";
} else {
  // Case B: backend sends them separately
  resume = data.resume || "Resume not generated.";
  coverLetter = data.coverLetter || "Cover letter not generated.";
}

          // ✅ Display both clearly
          document.getElementById("resume").innerText = resume;
          document.getElementById("coverLetter").innerText = coverLetter;
        })
        .catch((err) => {
          console.error("❌ Error:", err);
          status.innerText = "❌ Error generating content. See console.";
        });
    });
  });
});

// ✅ Copy to clipboard buttons (unchanged)
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("copy-btn")) {
    const targetId = e.target.getAttribute("data-target");
    const text = document.getElementById(targetId).innerText;
    navigator.clipboard.writeText(text);
    e.target.innerText = "✅ Copied!";
    setTimeout(() => (e.target.innerText = "📋 Copy"), 1500);
  }
});
