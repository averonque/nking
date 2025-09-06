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

Guidelines: 
1. Use this format but you can adjust like inserting any paragraph or section to implement guidelines:
2. Make the font bigger so it can occupy a page
3. Calculate the monthly payment based on the JSON data repayment_duration. Update the monthly payment
4. Only show Section 2.2  and Section 2.3 if the Repayment Schedule selected is monthly or Quarterly payment
PERSONAL LOAN AGREEMENT
This Personal Loan Agreement ("Agreement") is made and entered into on [Date of Agreement] by and between:

Trust Name (Lender): [Insert Trust Name] Borrower’s Full Legal Name: [Insert Borrower Name]

Collectively referred to as the "Parties."

ARTICLE I: LOAN TERMS
Section 1.1 – Loan Amount
The Lender agrees to loan the Borrower the principal sum of $[Loan Amount] ("Loan").

Section 1.2 – Interest Rate
The Loan shall bear interest as follows: ☐ 0% (Interest-Free) ☐ Fixed interest rate of [Insert Rate]% per annum

Interest shall be calculated on the basis of a 12-month calendar year unless otherwise specified.

ARTICLE II: REPAYMENT TERMS
Section 2.1 – Repayment Schedule
The Borrower agrees to repay the Loan according to the following schedule: ☐ Monthly payments ☐ Quarterly payments ☐ Lump sum payment due on [Insert Lump Sum Date]

Section 2.2 – Repayment Duration
The Loan shall be repaid over a period of: ☐ 12 months ☐ 24 months ☐ 36 months ☐ 48 months ☐ Other: [Insert Duration]

Section 2.3 – Monthly Payment Calculation
If repaid monthly, the Borrower shall pay $[Monthly Payment] per month.
ARTICLE III: COLLATERAL
Section 3.1 – Security
☐ The Loan is secured by collateral ☐ The Loan is unsecured

Section 3.2 – Collateral Description
If secured, the Borrower pledges the following collateral: [Insert Collateral Description]

ARTICLE IV: DEFAULT AND REMEDIES
Section 4.1 – Default Definition
The Borrower shall be considered in default if any scheduled payment is missed or if any term of this Agreement is violated.

Section 4.2 – Penalty for Default
☐ A penalty shall apply ☐ No penalty shall apply

If applicable, the penalty shall be [Insert Penalty Rate]% of the outstanding balance per month until the default is cured.

ARTICLE V: GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of the State of [Insert State], without regard to its conflict of law principles.

ARTICLE VI: MISCELLANEOUS
Section 6.1 – Entire Agreement
This document constitutes the entire agreement between the Parties and supersedes all prior discussions, negotiations, and agreements.

Section 6.2 – Amendments
Any amendments to this Agreement must be made in writing and signed by both Parties.

ARTICLE VII: SIGNATURES
IN WITNESS WHEREOF, the Parties have executed this Agreement as of the date first written above.

Borrower Signature: ___________________________ Name: [Insert Borrower Name]

Trustee Signature: ___________________________ Name: [Insert Trustee Name]

Witness/Notary (Optional): ___________________________ Name: [Insert Witness Name]

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
  
  