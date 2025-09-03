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
Using the following JSON data, generate a professional Corporate Loan Agreement document.
JSON:
${JSON.stringify(req.body, null, 2)}

Guidelines: 
1. Use this format but you can adjust like inserting any paragraph or section to implement guidelines:
2. Make the font bigger so it can occupy a page
3. Replace all variables "$REPLACE" with values from the JSON data if available if not make a placeholder values.


Corporate Loan Agreement
This Corporate Loan Agreement (“Agreement”) is entered into as of [Effective Date] by and between:

Borrower: [Corporate Legal Name], a corporation duly organized under the laws of [State of Incorporation], with its principal place of business at [Business Address], EIN: [Tax ID / EIN].

Lender: [Trust Name], a trust with its principal address at [Trust Address], represented by [Trustee Name], [Trustee Title].

Article I – Definitions
Section 1.01 Definitions Terms used in this Agreement shall have the meanings assigned to them in this Article or as otherwise defined throughout the Agreement.

Section 1.02 Interpretation Headings are for convenience only and shall not affect interpretation. Singular includes plural and vice versa.

Article II – Borrower Identity and Authority
Section 2.01 Corporate Status Borrower is a duly incorporated entity under the laws of [State of Incorporation], in good standing.

Section 2.02 Authorized Signers The following individual is authorized to execute this Agreement on behalf of Borrower:

Name: [Signer’s Full Legal Name]

Title: CEO

Section 2.03 Board Resolution Borrower shall provide a certified copy of a Board Resolution authorizing the execution of this Agreement.

Section 2.04 Officer’s Certificate Borrower shall deliver an Officer’s Certificate confirming the authority of the signer and the accuracy of corporate records.

Article III – Loan Terms
Section 3.01 Loan Amount Lender agrees to loan Borrower the principal sum of $[Loan Amount].

Section 3.02 Interest Rate The loan shall bear interest at an annual rate of [Interest Rate]% calculated on a [monthly/annual] basis.

Section 3.03 Term The loan shall have a term of [Term] months/years, commencing on the Effective Date.

Section 3.04 Payment Schedule Borrower shall make monthly payments beginning on [First Payment Date].

Section 3.05 Late Fee A late fee of $[Late Fee] shall apply to any payment not received within [X] days of the due date.

Section 3.06 Prepayment Borrower may prepay the loan in whole or in part at any time without penalty.

Article IV – Loan Purpose and Restrictions
Section 4.01 Purpose The loan proceeds shall be used exclusively for the following purpose:

[Describe Loan Purpose]

Section 4.02 Restricted Uses Borrower shall not use loan proceeds for:

Payment of dividends

Any unlawful activity

Article V – Collateral
Section 5.01 Secured Loan This loan is secured by the following collateral:

[Collateral Description]

Section 5.02 UCC-1 Filing Borrower shall cooperate with Lender in filing a UCC-1 Financing Statement to perfect Lender’s security interest.

Article VI – Guarantees
Section 6.01 Guaranty Requirement Borrower shall provide a personal or corporate guaranty from [Guarantor Name], guaranteeing full repayment of the loan.

Article VII – Financial and Operational Covenants
Section 7.01 Financial Covenants Borrower shall:

Maintain a Debt Service Coverage Ratio of at least [X]

Maintain Minimum Net Worth of $[X]

Deliver audited financial statements annually

Provide quarterly profit & loss statements and balance sheets

Section 7.02 Negative Covenants Borrower shall not:

Incur additional debt exceeding $[X]

Declare dividends exceeding $[X]

Engage in mergers, acquisitions, or asset sales without Lender’s consent

Change control or ownership without prior notice

Section 7.03 Affirmative Covenants Borrower shall:

Maintain adequate insurance coverage

Pay all taxes and remain in good legal standing

Maintain accurate books and records and allow Lender inspection rights

Article VIII – Default and Remedies
Section 8.01 Events of Default Default shall occur upon:

Failure to pay any amount due within [Grace Period] days

Bankruptcy or insolvency of Borrower

False representations or warranties

Breach of any covenant or obligation

Section 8.02 Remedies Upon default, Lender may:

Accelerate the loan and demand immediate repayment

Enforce security interests

Pursue legal action in accordance with governing law

Article IX – Legal Provisions
Section 9.01 Governing Law This Agreement shall be governed by the laws of the State of [Governing Law].

Section 9.02 Dispute Resolution Any disputes shall be resolved in the courts of [Governing Law State].

Section 9.03 Assignment Lender may assign its rights under this Agreement. Borrower may not assign without Lender’s written consent.

Section 9.04 Electronic Signatures This Agreement may be executed electronically and shall be deemed valid and enforceable.

Article X – Miscellaneous
Section 10.01 Entire Agreement This Agreement constitutes the entire understanding between the parties and supersedes all prior agreements.

Section 10.02 Amendments No amendment shall be valid unless in writing and signed by both parties.

Section 10.03 Severability If any provision is found unenforceable, the remainder shall remain in full force.

Section 10.04 Notices All notices shall be sent to the addresses listed above via certified mail or electronic delivery.

Article XI – Execution
Section 11.01 Effective Date This Agreement shall be effective as of [Effective Date].

Section 11.02 Signatures IN WITNESS WHEREOF, the parties have executed this Agreement:

Borrower Signature: ___________________________ Name: [Signer’s Full Legal Name] Title: CEO Date: ___________________

Lender Signature: ___________________________ Name: [Trustee Name] Title: [Trustee Title] Date: ___________________

Witness / Notary Block Subscribed and sworn before me on this ___ day of ____________, 20___ Notary Public: ___________________________ Commission No.: _________________________ My Commission Expires: ___________________

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
  
  