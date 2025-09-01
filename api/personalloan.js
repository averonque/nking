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
3. Replace all variables "$REPLACE" with values from the JSON data if available if not make a placeholder values.


PERSONAL LOAN AGREEMENT
This Personal Loan Agreement (“Agreement”) is entered into on [Date of Agreement] by and between:

Lender: [Trust Name] Borrower: [Borrower's Full Legal Name]

Collectively referred to as the “Parties.”

ARTICLE I: DEFINITIONS
1.1 “Loan” refers to the principal amount lent by the Lender to the Borrower under this Agreement. 1.2 “Collateral” means any asset pledged by the Borrower to secure the Loan. 1.3 “Default” means any failure by the Borrower to meet the obligations set forth herein.

ARTICLE II: LOAN TERMS
Section 2.1: Principal Amount
The Lender agrees to loan the Borrower the sum of $[Loan Amount].

Section 2.2: Interest
The Loan shall bear interest as follows:

☐ Interest-Free (0%)

☐ Fixed Interest Rate of [Fixed %] per annum

Interest shall accrue daily and be calculated on the basis of a 365-day year.

Section 2.3: Repayment Schedule
The Borrower shall repay the Loan as follows:

☐ Lump Sum Payment on [dd/mm/yyyy]

☐ Installments (customizable clause can be added here)

All payments shall be made in U.S. Dollars unless otherwise agreed in writing.

ARTICLE III: COLLATERAL
Section 3.1: Security
☐ This Loan is secured by collateral described as: [Collateral Description]

☐ This Loan is unsecured.

Section 3.2: Rights to Collateral
In the event of Default, the Lender shall have the right to seize, liquidate, or otherwise dispose of the Collateral in accordance with applicable law.

ARTICLE IV: DEFAULT AND REMEDIES
Section 4.1: Events of Default
Default shall include but not be limited to:

Failure to pay any amount due

Misrepresentation of facts

Insolvency or bankruptcy of the Borrower

Section 4.2: Penalties
☐ Upon Default, a penalty of [Penalty Rate]% of the outstanding balance shall apply.

☐ No penalty shall apply.

Section 4.3: Remedies
The Lender may pursue any or all of the following remedies:

Acceleration of the Loan

Legal action for recovery

Enforcement of Collateral rights

ARTICLE V: REPRESENTATIONS AND WARRANTIES
Section 5.1: Borrower’s Representations
The Borrower represents that:

They are legally competent to enter into this Agreement

The information provided is true and accurate

The Collateral (if any) is free of encumbrances

Section 5.2: Lender’s Representations
The Lender represents that:

They have the authority to lend under the Trust

They will act in good faith and in accordance with fiduciary duties

ARTICLE VI: GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of the State of [Governing Law (State)], without regard to its conflict of law principles.

ARTICLE VII: MISCELLANEOUS
Section 7.1: Amendments
Any amendment to this Agreement must be in writing and signed by both Parties.

Section 7.2: Severability
If any provision is found to be invalid, the remainder shall remain in full force and effect.

Section 7.3: Entire Agreement
This Agreement constitutes the entire understanding between the Parties and supersedes all prior agreements.

ARTICLE VIII: SIGNATURES
IN WITNESS WHEREOF, the Parties have executed this Agreement as of the date first written above.

Borrower Signature: ___________________________ Name: [Borrower Name] Date: ___________________

Trustee Signature: ___________________________ Name: [Trustee Name] Date: ___________________

Witness/Notary (Optional): ___________________________ Name: [Witness/Notary Name] Date: ___________________


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
  
  