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
Using the following JSON data, generate a professional Loan Agreement document.

Guidelines: 
1. Add Other signers from the array. Add a blank line where they can sign.  
2. Use this format but you can adjust like inserting any paragraph or section to implement guidelines:
3. Make the font bigger so it can occupy a page


Scope & Goal

A loan from the Trust (Lender) to a Corporation or Large Business (Borrower).
Builder produces:

Loan Agreement (core contract)

Auto-attached exhibits (depending on answers):

Promissory Note (Exhibit A)

Security Agreement (Exhibit B)

Personal/Corporate Guarantees (Exhibit C)

UCC-1 Financing Statement Info Sheet (Exhibit D)

Collateral Schedule (Exhibit E)

Board Resolution (Exhibit F) authorizing the loan

Officer’s Certificate (Exhibit G) verifying authority & good standing

Footer reminder: “This document is for educational purposes only. It is not legal advice. Consult a licensed attorney or notary.”

1) Questions (form answers)
A. Borrower Identity

Entity type → Corporation / Large LLC / Other

Corporate legal name → {{borrowerLegalName}}

State of incorporation → {{stateOfIncorporation}}

Business address → {{borrowerAddress}}

Tax ID / EIN (optional)

B. Authorized Signers

Signer’s full legal name → {{signerName}}

Signer’s corporate office → CEO, President, CFO, Treasurer, etc.

Is a Board Resolution required?

Yes → Exhibit F auto-attached

No → skip

C. Officer Certificate

Officer’s Certificate required?

Yes → Exhibit G auto-attached

No → skip

D. Lender (Trust) Info

Trust name → {{trustName}}

Trust address → {{trustAddress}}

Trustee name & title → {{trusteeName}}, {{trusteeTitle}}

E. Loan Terms

Loan amount → {{loanAmount}}

Interest rate (%) → {{interestRate}} (0% or fixed)

Term (months/years) → {{termMonths}}

Payment schedule → Monthly / Quarterly / Balloon

First payment date → {{firstPaymentDate}}

Late fee → {{lateFee}}

Prepayment → Allowed anytime / Allowed with penalty %

F. Purpose

Describe loan purpose → {{loanPurpose}}

Restricted uses toggle (e.g., no dividends, no unlawful use)

G. Collateral

Secured? → Yes/No

Collateral description → {{collateralDescription}}

UCC-1 filing needed? → Yes/No

Collateral schedule → Exhibit E

H. Guarantees

Require corporate or personal guaranty?

Yes → Exhibit C

No

I. Expanded Covenants

Financial covenants (check any)

Maintain Debt Service Coverage Ratio of X

Maintain Minimum Net Worth of $X

Deliver audited financials annually

Quarterly management-prepared P&L and balance sheet

Negative covenants (check any)

No additional debt > $X without consent

No dividends / distributions > $X

No mergers, acquisitions, or major asset sales

No change of control without consent

Affirmative covenants (check any)

Maintain insurance with lender named as loss payee

Pay all taxes and remain in good standing

Keep adequate books and allow inspection

J. Default & Remedies

Grace period for missed payment → {{graceDays}}

Other default triggers toggle (bankruptcy, false reps, covenant breaches)

K. Legal Boilerplate

Governing law (state) → {{governingLawState}}

Dispute resolution → Court / Arbitration

Notices auto-pulled from addresses

Assignment clause → Allowed / Not allowed

E-sign clause → Include / Exclude

L. Execution

Effective date → today by default

Witness/Notary block? → Yes/No

2) Clause Library
A. Parties & Intro
This Corporate Loan Agreement (“Agreement”) is made effective as of {{effectiveDate}} by and between {{trustName}} (“Lender”) and {{borrowerLegalName}}, a corporation organized under the laws of {{stateOfIncorporation}}, with its principal office at {{borrowerAddress}} (“Borrower”).

B. Loan Terms
Loan Amount. Lender agrees to lend Borrower ${{loanAmount}}. 
Interest. {{#if interestRate}}The loan shall bear interest at {{interestRate}}% per annum.{{else}}This loan shall be interest-free.{{/if}}
Repayment. The Loan shall be repaid in {{paymentSchedule}} installments beginning {{firstPaymentDate}}, continuing until {{termMonths}} months/years, unless accelerated upon default.
Prepayment. {{prepayClause}}
Late Fee. A late fee of {{lateFee}} applies after {{graceDays}} days delinquent.

C. Covenants (toggle inserts)

Financial covenants: Net worth, ratios, audited financials, etc.

Negative covenants: No excess debt, dividends, M&A, change of control.

Affirmative covenants: Insurance, taxes, good standing, inspections.

D. Security (if collateral)
Borrower grants Lender a first-priority security interest in the Collateral described in Exhibit E. Borrower agrees to execute all documents necessary to perfect this interest, including UCC-1 filings.

E. Guarantees
Guaranty. As additional assurance, {{guarantorName}} guarantees full repayment of Borrower’s obligations. See Exhibit C.

F. Defaults & Remedies
Events of Default include: 
- Nonpayment after {{graceDays}} days, 
- Insolvency or bankruptcy, 
- Breach of covenant or representation, 
- Unauthorized transfer or merger.  

Upon Default, Lender may accelerate all amounts due, enforce security interests, collect collateral, and seek legal remedies including attorney’s fees.

G. Miscellaneous

Governing law / venue clause

Arbitration option

Notices clause

Assignment clause

Entire Agreement, Amendments, Counterparts, E-signatures

Usury savings clause

3) Exhibits

Exhibit A – Promissory Note (corporate borrower format)

Exhibit B – Security Agreement (if collateral pledged)

Exhibit C – Guaranty (if selected, could be corporate subsidiary or personal owners)

Exhibit D – UCC-1 Info Sheet

Exhibit E – Collateral Schedule

Exhibit F – Board Resolution

Approves borrowing

Names officer authorized to sign

Exhibit G – Officer’s Certificate

Certifies borrower is in good standing

Attaches Articles of Incorporation and Bylaws excerpts

Confirms board resolution validity

4) Signatures
IN WITNESS WHEREOF, the parties execute this Agreement as of {{effectiveDate}}.

Borrower: {{borrowerLegalName}}
By: ________________________  
Name: {{signerName}}  
Title: {{signerTitle}}

Lender: {{trustName}}
By: ________________________  
Name: {{trusteeName}}  
Title: {{trusteeTitle}}


Optional Notary block same as Small Business version.



If the array are empty dont include the sections. Make each Article occupy one page as possible. Make it lengthy.
Arrange the content into sections and paragraphs properly. 
Output exact agreement text only then Generate a html.

JSON:
${JSON.stringify(req.body, null, 2)}`;

  try {
     const response = await client.chat.completions.create({
      model: "gpt-4o-mini", // or gpt-4o / gpt-3.5-turbo etc.
      messages: [
       
          { role: "system", content: "You are a document generator. Always return HTML with <div class='page'> wrappers for each logical page." },
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
  
  