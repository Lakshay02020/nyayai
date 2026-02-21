// Uses Google Gemini API — completely FREE, no credit card needed
// Get your key at: aistudio.google.com → "Get API Key"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { category, formData, letterType, complainantName, complainantCity } = req.body;

  if (!category || !formData || !letterType || !complainantName || !complainantCity) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const LETTER_TYPE_LABELS = {
    complaint_company: "Complaint Letter to Company",
    legal_notice:      "Legal Notice",
    consumer_forum:    "Consumer Forum Complaint",
    regulator:         "Regulator Complaint",
  };

  const CATEGORY_LABELS = {
    insurance:   "Insurance",
    banking:     "Banking & Finance",
    ecommerce:   "E-Commerce",
    telecom:     "Telecommunications",
    realestate:  "Real Estate",
    airline:     "Airlines & Travel",
    hospital:    "Healthcare",
    other:       "Consumer Rights",
  };

  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });

  const prompt = `You are an expert Indian consumer rights lawyer with 20+ years of experience writing legal notices and complaint letters that get results. You write authoritative, legally precise letters that cite exact laws, regulatory authorities, and statutory remedies.

Rules:
- Always cite specific sections of the Consumer Protection Act, 2019
- Reference relevant sector laws (IRDA regulations, RBI guidelines, TRAI rules, RERA, DGCA, etc.) as appropriate
- Name the correct regulatory authority to copy (IRDA Ombudsman, RBI Banking Ombudsman, TRAI, RERA Authority, DGCA, NCDRC, etc.)
- Include a 15-day deadline to respond or face consumer court action
- State specific remedies claimed: refund + compensation + litigation costs
- Use formal, authoritative legal language
- Write the complete letter ONLY. No preamble, no explanations, no commentary before or after.

Now draft a ${LETTER_TYPE_LABELS[letterType]} for this consumer complaint:

COMPLAINANT: ${complainantName}, ${complainantCity}
CATEGORY: ${CATEGORY_LABELS[category]}
DOCUMENT TYPE: ${LETTER_TYPE_LABELS[letterType]}
DATE: ${today}

COMPLAINT FACTS:
${Object.entries(formData).map(([k, v]) => `${k}: ${v}`).join("\n")}

Structure the letter as:
1. Complainant full address block + date (top left)
2. Addressee: Managing Director / Grievance Officer of the company
3. SUBJECT: line in CAPS
4. 5-7 numbered paragraphs: background → facts → specific legal violations with law sections → harm suffered → prior resolution attempts → relief demanded
5. Clear 15-day ultimatum before consumer court
6. Proper signature block for ${complainantName}
7. Cc: to the appropriate regulatory authority

Begin the letter directly — no preamble.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.35,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || "Gemini API error");
    }

    const letter = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!letter) throw new Error("No letter returned. Please try again.");

    return res.status(200).json({ letter });
  } catch (error) {
    console.error("Gemini API error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate letter." });
  }
}
