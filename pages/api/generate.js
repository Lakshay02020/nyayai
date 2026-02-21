// Uses Google Gemini API — completely FREE
// Get your key at: aistudio.google.com → "Get API Key"

// Models to try in order (in case one is deprecated)
const MODELS = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash-8b",
];

async function callGemini(apiKey, model, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.35, maxOutputTokens: 2048 },
    }),
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty response from model");
  return text;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { category, formData, letterType, complainantName, complainantCity } = req.body;

  if (!category || !formData || !letterType || !complainantName || !complainantCity) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY not set in environment variables." });
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

  const prompt = `You are an expert Indian consumer rights lawyer with 20+ years of experience writing legal notices and complaint letters that get results. Write authoritative, legally precise letters citing exact laws, regulatory authorities, and statutory remedies.

Rules:
- Cite specific sections of the Consumer Protection Act, 2019
- Reference relevant sector laws (IRDA regulations, RBI guidelines, TRAI rules, RERA, DGCA, etc.)
- Name the correct regulatory authority to copy (IRDA Ombudsman, RBI Banking Ombudsman, TRAI, RERA Authority, DGCA, NCDRC)
- Include a 15-day response deadline or consumer court action follows
- Claim: refund + compensation + litigation costs
- Write the complete letter ONLY. No preamble or commentary.

Draft a ${LETTER_TYPE_LABELS[letterType]}:

COMPLAINANT: ${complainantName}, ${complainantCity}
CATEGORY: ${CATEGORY_LABELS[category]}
DATE: ${today}

COMPLAINT FACTS:
${Object.entries(formData).map(([k, v]) => `${k}: ${v}`).join("\n")}

Structure:
1. Complainant address + date
2. Addressee: Managing Director / Grievance Officer
3. SUBJECT: in CAPS
4. 5-7 numbered paragraphs: background → facts → legal violations (cite law sections) → harm → prior resolution attempts → relief demanded
5. 15-day ultimatum
6. Signature block for ${complainantName}
7. Cc: appropriate regulatory authority

Begin the letter directly.`;

  // Try each model in order until one works
  let lastError = null;
  for (const model of MODELS) {
    try {
      const letter = await callGemini(apiKey, model, prompt);
      return res.status(200).json({ letter, model }); // returns which model worked
    } catch (err) {
      lastError = err;
      // If it's a model-not-found error, try next model
      if (err.message?.includes("not found") || err.message?.includes("not supported")) {
        continue;
      }
      // Any other error (auth, quota, etc.) — stop immediately
      break;
    }
  }

  console.error("All Gemini models failed:", lastError?.message);
  return res.status(500).json({
    error: lastError?.message || "Failed to generate letter. Please try again.",
  });
}
