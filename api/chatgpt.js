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

Guidelines: 
1. Use this format but you can adjust like inserting any paragraph or section to implement guidelines:
2. Make the font bigger so it can occupy a page
3. Replace all variables "$REPLACE" with values from the JSON data if available if not make a placeholder values.

Revocable Living Trust Agreement
This Revocable Living Trust Agreement (“Agreement”) is made and entered into on the 17th day of September, 2025, by and between the undersigned Grantor(s) and Trustee(s), pursuant to the laws of the State of Arizona.

Article I. Name and Establishment of Trust
Section 1.01 Trust Name: This Trust shall be known as the "asdf Revocable Living Trust" (“Trust”).

Section 1.02 Effective Date: The Trust shall become effective upon execution by the Grantor(s) and acceptance by the Trustee(s).

Section 1.03 Revocability: The Trust is revocable and may be amended or terminated by the Grantor(s) at any time during their lifetime.

Article II. Grantor(s)
Section 2.01 Identity of Grantor(s): The individuals establishing this Trust (“Grantor(s)”) shall be listed in Schedule C attached hereto.

Section 2.02 Transfer of Assets: The Grantor(s) hereby transfer, convey, and assign all assets listed in Schedule A to the Trustee(s) to be held in trust under the terms of this Agreement.

Article III. Trustee(s)
Section 3.01 Appointment of Trustee(s): The individuals designated in Schedule D shall serve as the initial Trustee(s).

Section 3.02 Powers and Duties: Trustee(s) shall have full authority to manage, invest, and distribute Trust assets in accordance with this Agreement and applicable law.

Section 3.03 Successor Trustee(s): In the event that a Trustee is unable or unwilling to serve, the Successor Trustee(s) named in Schedule D shall assume all responsibilities.

Article IV. Beneficiaries
Section 4.01 Designation of Beneficiaries: The individuals or entities listed in Schedule E shall be the beneficiaries of this Trust.

Section 4.02 Rights of Beneficiaries: Beneficiaries shall receive distributions from the Trust Estate in accordance with the mode specified in Article V.

Article V. Distribution of Trust Estate
Section 5.01 Distribution Mode: The Grantor(s) have elected Staggered Distribution (Mode 2) as outlined in Schedule B.

Section 5.02 Staggered Terms: Beneficiaries shall receive their share of the Trust Estate in stages, based on age or milestones. Until such time, the Trustee may use Trust assets for the beneficiary’s health, education, maintenance, and support.

Section 5.03 Termination: The Trust shall terminate once all distributions have been made and no assets remain.

Article VI. Trust Assets
Section 6.01 Schedule A: Assets transferred to the Trust include:

Other Property:

Description: vvvvvvvvv

Account Number: 555555555

Estimated Value: $555,555

Additional Assets:

Description: asdfasdf

Identifier: wqerwer

Estimated Value: $5,555,123,333

Section 6.02 Amendments: Grantor(s) may amend Schedule A at any time by written notice to the Trustee(s).

Article VII. Administration of Trust
Section 7.01 Trustee Powers: Trustee(s) shall have the power to:

Buy, sell, and lease property

Open and manage bank accounts

Invest in stocks, bonds, and mutual funds

Hire professionals (e.g., attorneys, accountants)

Make distributions per Article V

Section 7.02 Accounting: Trustee(s) shall maintain accurate records and provide annual statements to beneficiaries upon request.

Article VIII. Incapacity and Death of Grantor(s)
Section 8.01 Incapacity: If a Grantor becomes incapacitated, the Trustee shall continue to manage the Trust for the benefit of the Grantor and beneficiaries.

Section 8.02 Death: Upon the death of the last surviving Grantor, the Trust shall become irrevocable and distributions shall proceed per Article V.

Article IX. Governing Law
Section 9.01 Jurisdiction: This Agreement shall be governed by and construed in accordance with the laws of the State of Arizona.

Section 9.02 Venue: Any disputes shall be resolved in the courts of Arizona.

Article X. Amendment and Revocation
Section 10.01 Amendment: Grantor(s) may amend this Trust by written instrument signed and delivered to the Trustee(s).

Section 10.02 Revocation: This Trust may be revoked in whole or in part by the Grantor(s) at any time during their lifetime.

Article XI. Execution and Acknowledgment
IN WITNESS WHEREOF, the undersigned Grantor(s) and Trustee(s) have executed this Revocable Living Trust Agreement on the date first written above.

Grantor(s):

Name: [To be filled]

Trustee(s):

Name: [To be filled]

Successor Trustee(s):

Name: [To be filled]

Witnesses:

Signature

Signature

Article XII. Notary Acknowledgment
State of Arizona County of ____________

On this 17th day of September, 2025, before me, the undersigned Notary Public, personally appeared the above-named Grantor(s) and Trustee(s), known to me or satisfactorily proven to be the persons whose names are subscribed to this instrument, and acknowledged that they executed the same for the purposes therein contained.

IN WITNESS WHEREOF, I hereunto set my hand and official seal.

Notary Public Signature: ____________________ My Commission Expires: __________

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
  
  