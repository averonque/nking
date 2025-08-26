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
Using the following JSON data, generate a professional Revocable Living Trust document. Guidelines: 
1. Add Other signers from the array. Add a blank line where they can sign. 
2. Also put it so the distribution mode is Continuing Trust. 
3. Use this format but you can adjust like inserting any paragraph or section to implement guidelines:
4. Make the font bigger so it can occupy a page


Revocable Living Trust Document
Article I: Trust Name

The name of this Trust shall be designated as the "Revocable Living Trust." The Trust may be referred to in this document as the "Trust" or by its designated name. The Trust shall be effective upon the signing of this document by the Grantor(s) and the acceptance of the Trustee(s).

Article II: Grantor(s)

The following individual(s), hereinafter referred to as the "Grantor(s)," have established this Trust:

Grantor Information:

Full Legal Name:

Address:

City, State, Zip:

Email:

Phone:

The Grantor(s) hereby transfer, convey, and deliver to the Trustee(s) all property described in Schedule A, to be held in trust under the terms and conditions set forth herein.

Article III: Beneficiaries

The beneficiaries of this Trust shall be as follows:

Primary Beneficiaries: Each Primary Beneficiary shall receive the percentage share indicated below of the Trust Estate, subject to the terms of this Trust and the chosen distribution mode.

Article III-A: Distribution Mode

The Grantor(s) direct that the distribution of the Trust Estate to the beneficiaries shall follow the mode specified in Schedule B – Distribution Instructions.

Outright Distribution

Each beneficiary shall receive their full share of the Trust Estate immediately upon settlement of the Trust.

Once all distributions are made, the Trust shall terminate.

Continuing Trust

The Trustee shall retain the beneficiary’s share in trust for their benefit.

The Trustee shall manage and invest trust assets, distributing income and/or principal as necessary for the beneficiary’s health, education, maintenance, and support (HEMS standard).

The Trustee may withhold or limit distributions to protect trust property from creditors, divorce, or mismanagement.

Staggered Distribution

The beneficiary’s share shall be distributed in stages at ages or milestones designated in Schedule B.

Until a scheduled distribution occurs, the Trustee may use income and/or principal for the beneficiary’s health, education, maintenance, and support.

Any undistributed amounts remain in trust until the next scheduled distribution.

Article IV: Successor Trustee(s)

The Trustee(s) of this Trust are designated as follows:

Primary Trustee:

Name:

Address:

Relationship:

Successor Trustee(s):
If the Primary Trustee is unable or unwilling to serve, the following Successor Trustee(s) shall act, in the order named:

Name:

Address:

Relationship:

Each Successor Trustee shall have the same powers, duties, and responsibilities as the original Trustee.

Article V: Schedule A – Assets Transferred to the Trust

The following assets are hereby transferred to and held by the Trustee(s) of the "Revocable Living Trust":

Real Estate:

Description:

Address:

Financial Accounts:

Institution:

Account Number (last 4 digits):

Digital Assets:

Token/Coin:

Public Wallet Address:

Notes/Description:

Other Property:

Description:

Estimated Value: $

This Schedule A may be amended or supplemented by the Grantor(s) at any time by delivering written notice to the Trustee(s).

Article VI: Schedule B – Distribution Instructions

The Grantor(s) hereby elect the following distribution mode for the Trust Estate:

☐ Outright Distribution

Each beneficiary receives their full share immediately after settlement.

☐ Continuing Trust

Each beneficiary’s share remains in trust for life (or until otherwise directed).

Distributions limited to health, education, maintenance, and support unless Trustee exercises discretion.

☐ Staggered Distribution

Each beneficiary’s share distributed as follows:

____ % (or fraction) at age ____

____ % (or fraction) at age ____

Remainder at age ____

(If staggered, the Trustee may use trust funds for health, education, maintenance, and support until each scheduled distribution.)

Grantor(s) may amend or update this Schedule B by written instrument delivered to the Trustee(s).

Article VII: Execution and Acknowledgment

IN WITNESS WHEREOF, the undersigned Grantor(s) and Trustee(s) have executed this Revocable Living Trust on this ___ day of _______, 20.

Grantor Signature
Name:

Grantor Signature
Name:

Trustee Signature
Name:

Successor Trustee Signature
Name:

Witnesses:

Witness Signature

Witness Signature

STATE OF Alabama
COUNTY OF [County Name]

On this ___ day of _______, 20, before me, the undersigned Notary Public, personally appeared [Grantor Name(s)], known to me or satisfactorily proven to be the person(s) whose names are subscribed to this instrument, and acknowledged that they executed the same for the purposes therein contained.

IN WITNESS WHEREOF, I hereunto set my hand and official seal.

Notary Public
My Commission Expires: __________


     If the array are empty dont include the sections. Make each Article occupy one page as possible. Make it lengthy
    Arrange the content into sections and paragraphs properly. Output exact agreement text only then Generate a html




If the array are empty dont include the sections. Make each Article occupy one page as possible. Make it lengthy.
Arrange the content into sections and paragraphs properly. 
Output exact agreement text only then Generate a html.

JSON:
${JSON.stringify(req.body, null, 2)}
  `;

  try {
     const response = await client.chat.completions.create({
      model: "gpt-4o-mini", // or gpt-4o / gpt-3.5-turbo etc.
      messages: [
       
          { role: "system", content: "You are a document generator. Always return HTML with <div class='page'> wrappers for each logical page." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3

    });

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || "No content generated.";

	

    res.status(200).json({ text: response.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }

}
  
  