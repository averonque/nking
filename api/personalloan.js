  // api/chatgpt.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // put this in Vercel environment variables
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  
  const prompt = `
You are a legal document generator.
Using the following JSON data, generate a professional Personal Loan Agreement document.
JSON:
${JSON.stringify(req.body, null, 2)}

--Start of Guidelines--
1. Make the font bigger so it can occupy a page
2. Here is the loan data in JSON format. Extract the loan amount, interest rate (as a percent), and repayment 
3.You are a layout-aware HTML generator for PDF rendering using jsPDF. Your goal is to generate enough HTML content to fill exactly one PDF page without overflowing or cutting off. Assume the page size is A4 with margins: top 40px, bottom 60px, left/right 20px. Use a <div class='page'> wrapper. Use clean semantic HTML with inline styles for font size and spacing. Avoid large images or elements that may overflow. Ensure the final content fits within the printable area and ends cleanly before the bottom margin.
4. Generate HTML content inside <div class='page'> that fills one page of a PDF using jsPDF without cutting off at the bottom. Use headings, paragraphs, and spacing to simulate a legal agreement or formal document.
   

If the array are empty dont include the sections. Make each Article occupy one page as possible. Make it lengthy.
Arrange the content into sections and paragraphs properly. 
Output exact agreement text only then Generate a html.

`;

  try {
     const response = await client.chat.completions.create({
      model: "gpt-4o-mini", // or gpt-4o / gpt-3.5-turbo etc.
      messages: [
       
          { role: "system", content: "You are a document generator. Always return HTML with <div class='page'> wrappers for each logical page. Put enough html inside the <div class='page'> to fit in a pdf page with enough margin at the bottom before going to the next page." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3

    });


    res.status(200).json({ text: response.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }

}
  
  