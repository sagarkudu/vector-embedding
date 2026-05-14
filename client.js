import { marked } from "marked";

const form = document.querySelector("form");
const input = document.querySelector("input");
const reply = document.querySelector(".reply");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();

  if (!userMessage) return;

  try {
    /* LOADING UI */

    reply.innerHTML = `
<div class="thinking">
    🎬 Finding the best movie matches for you...
</div>
`;

    /* API CALL */

    const response = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
      }),
    });

    if (!response.ok) {
      throw new Error("Server request failed");
    }

    const data = await response.json();

    /* SOURCES */

    let sourcesHtml = "";

    //     if (data.sources?.length) {
    //       sourcesHtml = `
    // <div class="sources">
    //     <h3>Matched Sources</h3>

    //     ${data.sources
    //       .map(
    //         (s) => `

    //         <div class="source-item">
    //             Match Score:
    //             ${(s.similarity * 100).toFixed(1)}%
    //         </div>

    //     `,
    //       )
    //       .join("")}
    // </div>
    // `;
    //     }

    /* FINAL UI */

    reply.innerHTML = `
<div class="response">
    ${marked.parse(data.reply)}

    ${sourcesHtml}
</div>
`;

    input.value = "";
  } catch (err) {
    console.error(err);

    reply.innerHTML = `
<div class="error">
    ⚠️ Unable to connect to movie assistant.
</div>
`;
  }
});
