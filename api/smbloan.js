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

Small Business Loan Agreement
This Small Business Loan Agreement (“Agreement”) is entered into and made effective as of [Effective Date], by and between:

Borrower: [Legal Business Name], a limited liability company (LLC) organized under the laws of [State of Formation], with principal business address at [Business Address] (“Borrower”).

Lender: [Trust Name], a trust organized under applicable law, with principal address at [Trust Address] (“Lender”).

Article I. Definitions
Section 1.01 “Loan” refers to the principal amount of USD $[Loan Amount] provided by Lender to Borrower under this Agreement.

Section 1.02 “Interest-Free” means no interest shall accrue on the Loan.

Section 1.03 “Authorized Signer” refers to [Signer’s Full Legal Name], acting in the capacity of [Signer’s Title], authorized via [Operating Agreement / Member Consent].

Section 1.04 “Trustee” refers to [Trustee Signing Name], acting as [Trustee Title] on behalf of the Lender.

Article II. Loan Terms
Section 2.01 Loan Amount: The Lender agrees to loan the Borrower the principal sum of USD $[Loan Amount].

Section 2.02 Interest: The Loan shall be interest-free.

Section 2.03 Term: The Loan shall have a term of [Term Length] months.

Section 2.04 Repayment Schedule: Payments shall be made monthly, commencing on [First Payment Due Date].

Section 2.05 Late Fee: A late fee of [Late Fee Amount or %] shall apply to any payment not received within [Grace Days] days of the due date.

Section 2.06 Prepayment: Borrower may prepay the Loan in whole or in part at any time without penalty.

Article III. Purpose and Use of Proceeds
Section 3.01 The Borrower shall use the Loan proceeds exclusively for the following business purpose: [Business Purpose].

Article IV. Collateral
Section 4.01 The Loan is unsecured. No collateral shall be pledged.

Section 4.02 No UCC-1 filing shall be made in connection with this Loan.

Article V. Personal Guarantees
Section 5.01 No personal guarantees are required under this Agreement.

Article VI. Covenants
Borrower agrees to the following covenants throughout the term of the Loan:

Section 6.01 Financial Reporting: Provide periodic financial reports upon request.

Section 6.02 Insurance: Maintain adequate liability insurance.

Section 6.03 Debt Restrictions: Not incur additional debt without Lender’s written consent.

Section 6.04 Distributions: Not make distributions exceeding [Threshold] without Lender’s consent.

Section 6.05 Collateral Integrity: Not sell or transfer any collateral (if applicable).

Section 6.06 Legal Standing: Maintain good standing in its state of formation.

Section 6.07 Compliance: Pay all taxes and comply with applicable laws and regulations.

Article VII. Defaults and Remedies
Section 7.01 Events of Default include:

Failure to make payment within [Grace Days] days of due date.

Insolvency or bankruptcy of Borrower.

Material misrepresentation or false statements.

Breach of any covenant in Article VI.

Section 7.02 Remedies: Upon default, Lender may:

Declare the entire Loan immediately due and payable.

Pursue legal action to recover outstanding amounts.

Exercise any other rights available under law.

Article VIII. Legal Provisions
Section 8.01 Governing Law: This Agreement shall be governed by the laws of the State of [Governing Law State].

Section 8.02 Dispute Resolution: Any disputes shall be resolved in court located in [Jurisdiction].

Section 8.03 Assignment: Neither party may assign this Agreement without prior written consent.

Section 8.04 Electronic Signatures: This Agreement may be executed electronically and shall be deemed valid and enforceable.

Article IX. Execution
Section 9.01 Effective Date: This Agreement shall be effective as of [Effective Date].

Section 9.02 Signatures:

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

Borrower: By: ___________________________ Name: [Signer’s Full Legal Name] Title: [Signer’s Title]

Lender (Trust): By: ___________________________ Name: [Trustee Signing Name] Title: [Trustee Title]

Article X. Notary Acknowledgment
State of [Governing Law State] County of ____________

On this ___ day of ____________, 20___, before me, the undersigned Notary Public, personally appeared [Signer’s Full Legal Name] and [Trustee Signing Name], known to me to be the persons whose names are subscribed to the foregoing instrument, and acknowledged that they executed the same for the purposes therein contained.

Notary Public Signature: ____________________ My Commission Expires: ____________________

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
  
  