import OpenAI from "openai";



const openai = new OpenAI({
  apiKey: "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",
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true, 
});


// Function jo message lega aur response return karega
export async function getAIResponse(userMessage) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${"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"}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "<YOUR_SITE_URL>", 
        "X-Title": "<YOUR_SITE_NAME>",    
      },
      body: JSON.stringify({
        model: "openai/gpt-4o",
        messages: [{ role: "user", content: userMessage }],
        max_tokens: 500,  //Free limit ke andar
      }),
    });
    const data = await response.json();
    return data.choices[0].message.content


  // Direct reply text return karega
  } catch (error) {
    console.error("AI Error:", error);
    return "Something went wrong!";
  }
}
