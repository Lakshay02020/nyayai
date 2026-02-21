// Uses Groq API — completely FREE, no credit card, works in India
// Get your key at: console.groq.com → "API Keys" → "Create API Key"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { category, formData, letterType, complainantName, complainantCity } = req.body;

  if (!category || !formData || !letterType || !complainantName || !complainantCity) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GROQ_API_KEY not set in environment variables." });
  }

  const LETTER_TYPE_LABELS = {
    complaint_company: "Complaint Letter to Company",
    legal_notice:      "Legal Notice",
    consumer_forum:    "Consumer Forum Complaint",
    regulator:         "Regulator Complaint",
  };

  const CATEGORY_LABELS = {
    insurance:  "Insurance",
    banking:    "Banking & Finance",
    ecommerce:  "E-Commerce",
    telecom:    "Telecommunications",
    realestate: "Real Estate",
    airline:    "Airlines & Travel",
    hospital:   "Healthcare",
    other:      "Consumer Rights",
  };

  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });

  const systemPrompt = `You are an expert Indian consumer rights lawyer with 20+ years of experience writing legal notices and complaint letters that force companies to act. You write authoritative, legally precise letters that cite exact laws, regulatory authorities, and statutory remedies. Write the complete letter ONLY — no preamble, no explanations, no commentary before or after the letter.`;

  const userPrompt = `Draft a ${LETTER_TYPE_LABELS[letterType]} for this consumer complaint.

COMPLAINANT: ${complainantName}, ${complainantCity}
CATEGORY: ${CATEGORY_LABELS[category]}
DOCUMENT TYPE: ${LETTER_TYPE_LABELS[letterType]}
DATE: ${today}

COMPLAINT FACTS:
${Object.entries(formData).map(([k, v]) => `${k}: ${v}`).join("\n")}

Requirements:
- Cite specific sections of the Consumer Protection Act, 2019
- Reference relevant sector laws (IRDA regulations, RBI guidelines, TRAI rules, RERA, DGCA etc.)
- Name the correct regulatory authority in the Cc line
- Demand: full refund + compensation + litigation costs
- Set a hard 15-day deadline to respond before consumer court action

Structure:
1. Complainant full address + date (top left)
2. Addressee: Managing Director / Grievance Officer of the company  
3. SUBJECT: in CAPS
4. 5-6 numbered paragraphs: background → facts → specific legal violations with law sections → harm suffered → prior resolution attempts → relief demanded
5. Clear 15-day ultimatum
6. Signature block for ${complainantName}
7. Cc: appropriate regulatory authority

Begin the letter directly with the address block.`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user",   content: userPrompt },
        ],
        temperature: 0.35,
        max_tokens: 2048,
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || "Groq API error");
    }

    const letter = data.choices?.[0]?.message?.content;
    if (!letter) throw new Error("No letter returned. Please try again.");

    return res.status(200).json({ letter });
  } catch (error) {
    console.error("Groq API error:", error);
    return res.status(500).json({
      error: error.message || "Failed to generate letter. Please try again.",
    });
  }
}
