import dotenv from "dotenv";

dotenv.config();


const getGroqAiResponse = async (message) =>{
    const options = {
      method: 'POST',
      headers:{
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model:  "openai/gpt-oss-20b", 
        messages:[
          {
            role: "system",
            content: "Answer in simple, direct language using a short paragraph of 1 to 3 sentences. Avoid tables, headings, Markdown formatting, and HTML unless the user explicitly asks for them. Include extra detail only when requested.",
          },
          {
            role: "user",
            content: message,
          },

        ]
      })
     };

     try{
      const response = await fetch ("https://api.groq.com/openai/v1/chat/completions", options);
      const data = await response.json();
      //console.log(data.choices[0]?.message?.content || "No content returned.");
      return data.choices[0]?.message?.content || "No content returned.";
     } catch(err){
      console.log("Error fetching chat completion:", err);
     }
}


export default getGroqAiResponse;