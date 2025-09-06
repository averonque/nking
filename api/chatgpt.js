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
Using the following JSON data, generate a professional Revocable Living Trust document.
JSON:
${JSON.stringify(req.body, null, 2)}
--Start of Guidelines--
1.You are a layout-aware HTML generator for PDF rendering using jsPDF. Your goal is to generate enough HTML content to fill exactly one PDF page without overflowing or cutting off. Assume the page size is A4 with margins: top 40px, bottom 60px, left/right 20px. Use a <div class='page'> wrapper. Use clean semantic HTML with inline styles for font size and spacing. Avoid large images or elements that may overflow. Ensure the final content fits within the printable area and ends cleanly before the bottom margin.
2. Generate HTML content inside <div class='page'> that fills one page of a PDF using jsPDF without cutting off at the bottom. Use headings, paragraphs, and spacing to simulate a legal agreement or formal document.
3. Include needed blank lines where to sign
4. Use this template for
article III

Article III-A: Distribution Mode
The Grantor (s) direct that the distribution of the Trust Estate to the beneficiaries shall follow the mode specified in Schedule B – Distribution Instructions .
Staggered Distribution
The beneficiary’s share shall be distributed in stages at ages or milestones designated in Schedule B. Until a scheduled distribution occurs , the Trustee may use income and/or principal for the beneficiary’s health, education, maintenance, and support and investments. No more than 1% is to be used per year


article IV
Article IV: Successor Trustee (s)
The Trustee (s) of this Trust are designated as follows :
Primary Trustee:
Name: 
Address : 
Relationship : 
Successor Trustee (s): If the Primary Trustee is unable or unwilling to serve , the following Successor Trustee (s) shall act, in the order named:
Name:
Address: 
Relationship: 

article VI
Article VI: Schedule B – Distribution Instructions
The Grantor (s) hereby elect the following distribution mode for the Trust Estate:
& Staggered Distribution
Each beneficiary’s share distributed as follows :

1% (or fraction ) at grantor’s death and at age 20, 1% every year for 9 remaining years.  Use to grow your own wealth with assets. Do not waste on liabilities. Invest. Use for Vital (growth)80%. A lesser amount for Good (Fun) 15%.  And even less for busy (non-essentials) 5%.

1% (or fraction ) at Grantor’s Death 
Remainder at age 20 for 9 consecutive years at 1%.
(If staggered , the Trustee may use trust funds for health, education, maintenance, investments and (If staggered , the Trustee may use trust funds for health, education, maintenance, investments and support until each scheduled distribution.) of own distribution at owns discretion. 

Grantor (s) may amend or update this Schedule B by written instrument delivered to the
Trustee (s).

5. Generate the rest of the articles not present above.






4. Put this at the end Witness Signature: ____________________________

Witness Signature:____________________________

STATE OF Florida
COUNTY OF Seminole 
On this 4th day of September, 2025, before me, the undersigned Notary Public, personally appeared Jeramy K. Freeman, known to me or satisfactorily proven to be the person whose name is subscribed to this instrument , and acknowledged that they executed the same for the purposes therein contained .

IN WITNESS WHEREOF , I hereunto set my hand and official seal.

Notary Public: ____________________________

My Commission Expires:__________

--End of Guidelines--  

If the array are empty dont include the sections. Make each Article occupy one page as possible. Make it lengthy.
Arrange the content into sections and paragraphs properly. 
Output exact agreement text only then Generate a html.
 
  `;

  try {
     const response = await client.chat.completions.create({
      model: "gpt-4o-mini", // or gpt-4o / gpt-3.5-turbo etc.
      messages: [
       
          { role: "system", content: "You are a document generator. Always return HTML with <div class='page'> wrappers for each logical page. Don't include line breaks at the end each page. Put enough html inside the <div class='page'> to fit in a pdf page with enough margin at the bottom before going to the next page." },
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
  
  