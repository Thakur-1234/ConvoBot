import OpenAI from "openai";



const openai = new OpenAI({
  apiKey: YOUR API 🗝 KEY,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true, 
});


// Function jo message lega aur response return karega
export async function getAIResponse(userMessage) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${YOUR API KEY}`,
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
