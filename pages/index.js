import { useState, useRef } from "react";
import Head from "next/head";

// ─── DATA ───────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "insurance",   icon: "🛡️", name: "Insurance",   desc: "Claim rejection, delays, mis-selling" },
  { id: "banking",     icon: "🏦", name: "Banking",     desc: "Fraud, charges, loan disputes" },
  { id: "ecommerce",   icon: "📦", name: "E-Commerce",  desc: "Refund, delivery, defective product" },
  { id: "telecom",     icon: "📡", name: "Telecom",     desc: "Overcharging, poor service, plan issues" },
  { id: "realestate",  icon: "🏗️", name: "Real Estate", desc: "Builder delay, possession, refund" },
  { id: "airline",     icon: "✈️", name: "Airlines",    desc: "Cancellation, baggage, refund" },
  { id: "hospital",    icon: "🏥", name: "Healthcare",  desc: "Negligence, overbilling, disputes" },
  { id: "other",       icon: "⚖️", name: "Other",       desc: "Any consumer rights violation" },
];

const LETTER_TYPES = [
  { id: "legal_notice",      label: "Legal Notice" },
  { id: "complaint_company", label: "Complaint to Company" },
  { id: "consumer_forum",    label: "Consumer Forum Complaint" },
  { id: "regulator",         label: "Regulator Complaint" },
];

const FIELD_CONFIGS = {
  insurance: [
    { id: "companyName",     label: "Insurance Company Name",          placeholder: "e.g. HDFC Life, LIC, Bajaj Allianz", type: "text" },
    { id: "policyNumber",    label: "Policy Number",                   placeholder: "e.g. POL123456789",                  type: "text" },
    { id: "claimType",       label: "Type of Claim",                   placeholder: "e.g. Health, Life, Motor",           type: "text" },
    { id: "claimAmount",     label: "Claim Amount (₹)",                placeholder: "e.g. 85,000",                        type: "text" },
    { id: "incidentDate",    label: "Date of Incident / Claim Filed",  placeholder: "e.g. 15 January 2025",              type: "text" },
    { id: "rejectionReason", label: "Reason Given for Rejection",      placeholder: "What did they say?",                 type: "text" },
    { id: "timeline",        label: "Full Timeline of Events",         placeholder: "Describe what happened step by step...", type: "textarea" },
  ],
  banking: [
    { id: "bankName",      label: "Bank Name",                        placeholder: "e.g. SBI, ICICI, HDFC Bank",         type: "text" },
    { id: "accountNumber", label: "Account / Card Number (last 4)",   placeholder: "e.g. XXXX1234",                      type: "text" },
    { id: "issueType",     label: "Nature of Issue",                  placeholder: "e.g. Unauthorized debit, fraud",     type: "text" },
    { id: "amount",        label: "Amount Involved (₹)",              placeholder: "e.g. 12,500",                        type: "text" },
    { id: "date",          label: "Date of Incident",                 placeholder: "e.g. 3 February 2025",              type: "text" },
    { id: "timeline",      label: "Full Description",                 placeholder: "What happened? Include prior complaints made to the bank...", type: "textarea" },
  ],
  ecommerce: [
    { id: "companyName", label: "Company Name",      placeholder: "e.g. Amazon, Flipkart, Myntra",         type: "text" },
    { id: "orderId",     label: "Order ID",           placeholder: "e.g. 402-8765432-1234567",              type: "text" },
    { id: "productName", label: "Product Name",       placeholder: "e.g. Samsung TV 55 inch",              type: "text" },
    { id: "amount",      label: "Order Amount (₹)",   placeholder: "e.g. 45,999",                          type: "text" },
    { id: "issueType",   label: "Nature of Issue",    placeholder: "e.g. Refund not received, defective product", type: "text" },
    { id: "timeline",    label: "What Happened?",     placeholder: "Describe the issue and any communication...", type: "textarea" },
  ],
  telecom: [
    { id: "companyName",   label: "Telecom Operator",       placeholder: "e.g. Airtel, Jio, BSNL, Vi",       type: "text" },
    { id: "mobileNumber",  label: "Mobile / Account Number", placeholder: "e.g. 9876543210",                  type: "text" },
    { id: "issueType",     label: "Nature of Issue",         placeholder: "e.g. Excess billing, no internet", type: "text" },
    { id: "amount",        label: "Disputed Amount (₹)",     placeholder: "e.g. 3,200",                       type: "text" },
    { id: "timeline",      label: "Description of Problem",  placeholder: "When did this start? What steps have you taken?", type: "textarea" },
  ],
  realestate: [
    { id: "builderName",    label: "Builder / Developer Name",  placeholder: "e.g. DLF, Sobha, Godrej",         type: "text" },
    { id: "projectName",    label: "Project / Flat Details",    placeholder: "e.g. Green Meadows, Flat B-304",  type: "text" },
    { id: "amount",         label: "Amount Paid (₹)",           placeholder: "e.g. 45,00,000",                  type: "text" },
    { id: "agreementDate",  label: "Agreement / Booking Date",  placeholder: "e.g. March 2022",                 type: "text" },
    { id: "promisedDate",   label: "Promised Possession Date",  placeholder: "e.g. December 2024",              type: "text" },
    { id: "issueType",      label: "Nature of Issue",           placeholder: "e.g. Delay, structural defect, refund", type: "text" },
    { id: "timeline",       label: "Full Details",              placeholder: "What was promised, what happened...", type: "textarea" },
  ],
  airline: [
    { id: "airlineName",   label: "Airline Name",                 placeholder: "e.g. Air India, IndiGo, SpiceJet",  type: "text" },
    { id: "flightNumber",  label: "Flight Number & PNR",          placeholder: "e.g. 6E-456 / ABCDEF",             type: "text" },
    { id: "travelDate",    label: "Date of Travel",               placeholder: "e.g. 10 February 2025",            type: "text" },
    { id: "amount",        label: "Ticket Amount / Refund (₹)",   placeholder: "e.g. 8,500",                       type: "text" },
    { id: "issueType",     label: "Nature of Issue",              placeholder: "e.g. Flight cancelled, baggage lost", type: "text" },
    { id: "timeline",      label: "What Happened?",               placeholder: "Describe in detail...",             type: "textarea" },
  ],
  hospital: [
    { id: "hospitalName", label: "Hospital / Clinic Name",  placeholder: "e.g. Apollo Hospitals",              type: "text" },
    { id: "patientName",  label: "Patient Name",            placeholder: "e.g. Rajesh Kumar",                  type: "text" },
    { id: "dateOfVisit",  label: "Date of Treatment",       placeholder: "e.g. January 2025",                  type: "text" },
    { id: "amount",       label: "Amount Disputed (₹)",     placeholder: "e.g. 1,20,000",                      type: "text" },
    { id: "issueType",    label: "Nature of Issue",         placeholder: "e.g. Overbilling, negligence",       type: "text" },
    { id: "timeline",     label: "Full Description",        placeholder: "Describe what happened, the harm caused...", type: "textarea" },
  ],
  other: [
    { id: "companyName", label: "Company / Person Name", placeholder: "Who is the complaint against?",       type: "text" },
    { id: "issueType",   label: "Nature of Issue",       placeholder: "Briefly describe the problem",        type: "text" },
    { id: "amount",      label: "Amount Involved (₹)",   placeholder: "e.g. 25,000",                         type: "text" },
    { id: "timeline",    label: "Full Description",      placeholder: "Describe everything — dates, what happened, what was promised, what went wrong...", type: "textarea" },
  ],
};

const STEP_LABELS = ["Category", "Your Details", "Generate", "Letter"];

// ─── STYLES ─────────────────────────────────────────────────────────
const S = {
  // Layout
  page: { minHeight: "100vh", background: "#0C0B09", color: "#F0EBE0", fontFamily: "'DM Sans', sans-serif", position: "relative", overflowX: "hidden" },
  noise: { position: "fixed", inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")", pointerEvents: "none", zIndex: 0 },

  // Navbar
  navbar: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 48px", borderBottom: "1px solid #2A2820", background: "rgba(12,11,9,0.88)", backdropFilter: "blur(16px)" },
  navLogo: { fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 600, color: "#C9A84C", letterSpacing: "0.02em" },
  navBadge: { fontSize: "11px", fontWeight: 500, color: "#7A7060", letterSpacing: "0.12em", textTransform: "uppercase", border: "1px solid #2A2820", padding: "4px 12px", borderRadius: "100px" },

  // Hero
  hero: { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "120px 24px 80px", position: "relative", zIndex: 1, textAlign: "center" },
  heroGlow: { position: "absolute", width: "700px", height: "500px", background: "radial-gradient(ellipse, rgba(201,168,76,0.1) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%, -55%)", pointerEvents: "none" },
  heroTag: { display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.22)", borderRadius: "100px", padding: "6px 16px 6px 8px", fontSize: "12px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#E8D5A3", marginBottom: "32px", animation: "fadeInUp 0.5s ease both" },
  heroTagDot: { width: "6px", height: "6px", borderRadius: "50%", background: "#C9A84C", animation: "pulse 2s ease infinite" },
  heroTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(46px,7vw,88px)", fontWeight: 300, lineHeight: 1.05, letterSpacing: "-0.02em", color: "#F0EBE0", marginBottom: "24px", animation: "fadeInUp 0.5s 0.1s ease both" },
  heroTitleEm: { fontStyle: "italic", color: "#C9A84C" },
  heroSub: { fontSize: "17px", fontWeight: 300, color: "#7A7060", lineHeight: 1.7, maxWidth: "500px", margin: "0 auto 48px", animation: "fadeInUp 0.5s 0.2s ease both" },
  heroCta: { display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", animation: "fadeInUp 0.5s 0.3s ease both" },

  // Buttons
  btnPrimary: { background: "#C9A84C", color: "#0C0B09", border: "none", padding: "14px 32px", borderRadius: "4px", fontSize: "14px", fontWeight: 600, letterSpacing: "0.04em", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" },
  btnSecondary: { background: "transparent", color: "#7A7060", border: "1px solid #2A2820", padding: "14px 28px", borderRadius: "4px", fontSize: "14px", fontWeight: 400, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" },
  btnCopy: { display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px", borderRadius: "4px", fontSize: "13px", fontWeight: 500, cursor: "pointer", background: "#1E1C18", color: "#F0EBE0", border: "1px solid #2A2820", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" },
  btnDl: { display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px", borderRadius: "4px", fontSize: "13px", fontWeight: 500, cursor: "pointer", background: "#C9A84C", color: "#0C0B09", border: "none", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" },

  // Stats
  statsRow: { display: "flex", gap: "48px", justifyContent: "center", flexWrap: "wrap", marginTop: "72px", paddingTop: "48px", borderTop: "1px solid #2A2820", width: "100%", maxWidth: "680px", animation: "fadeInUp 0.5s 0.4s ease both" },
  statNum: { fontFamily: "'Cormorant Garamond', serif", fontSize: "36px", fontWeight: 500, color: "#C9A84C", lineHeight: 1 },
  statLabel: { fontSize: "11px", color: "#7A7060", marginTop: "4px", letterSpacing: "0.07em", textTransform: "uppercase" },

  // How it works
  hiwSection: { padding: "80px 24px", maxWidth: "860px", margin: "0 auto", position: "relative", zIndex: 1 },
  hiwGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1px", background: "#2A2820", border: "1px solid #2A2820", borderRadius: "8px", overflow: "hidden", marginTop: "40px" },
  hiwItem: { background: "#141310", padding: "32px 28px" },
  hiwNum: { fontFamily: "'Cormorant Garamond', serif", fontSize: "48px", fontWeight: 300, color: "#8A6F2E", lineHeight: 1, marginBottom: "16px" },
  hiwTitle: { fontSize: "16px", fontWeight: 500, marginBottom: "8px", color: "#F0EBE0" },
  hiwDesc: { fontSize: "13px", color: "#7A7060", lineHeight: 1.65 },

  // Flow
  flowArea: { maxWidth: "860px", margin: "0 auto", padding: "100px 24px 80px", position: "relative", zIndex: 1, animation: "fadeIn 0.35s ease" },

  // Step indicator
  stepRow: { display: "flex", alignItems: "center", marginBottom: "52px" },
  stepCircle: (active, done) => ({ width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 600, border: `1px solid ${done ? "#C9A84C" : active ? "#C9A84C" : "#2A2820"}`, color: done ? "#0C0B09" : active ? "#E8D5A3" : "#7A7060", background: done ? "#C9A84C" : active ? "rgba(201,168,76,0.1)" : "#141310", flexShrink: 0, transition: "all 0.3s" }),
  stepLabel: (active) => ({ fontSize: "12px", color: active ? "#F0EBE0" : "#7A7060", marginLeft: "8px", letterSpacing: "0.04em" }),
  stepLine: (done) => ({ flex: 1, height: "1px", background: done ? "#8A6F2E" : "#2A2820", margin: "0 12px" }),

  // Section head
  sectionTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: "38px", fontWeight: 400, lineHeight: 1.1, marginBottom: "10px" },
  sectionSub: { fontSize: "15px", color: "#7A7060", lineHeight: 1.6, marginBottom: "36px" },

  // Category grid
  catGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: "12px" },
  catCard: (sel) => ({ background: sel ? "rgba(201,168,76,0.06)" : "#141310", border: `1px solid ${sel ? "#C9A84C" : "#2A2820"}`, borderRadius: "8px", padding: "24px 20px", cursor: "pointer", transition: "all 0.18s", textAlign: "left" }),
  catIcon: { fontSize: "28px", marginBottom: "12px" },
  catName: { fontSize: "15px", fontWeight: 500, color: "#F0EBE0", marginBottom: "4px" },
  catDesc: { fontSize: "12px", color: "#7A7060", lineHeight: 1.55 },

  // Form
  formGroup: { display: "flex", flexDirection: "column", gap: "8px", marginBottom: "18px" },
  formLabel: { fontSize: "11px", fontWeight: 500, letterSpacing: "0.07em", textTransform: "uppercase", color: "#7A7060" },
  formInput: { background: "#141310", border: "1px solid #2A2820", borderRadius: "4px", padding: "12px 16px", fontSize: "14px", color: "#F0EBE0", fontFamily: "'DM Sans', sans-serif", outline: "none", width: "100%", transition: "border-color 0.2s" },
  formTextarea: { background: "#141310", border: "1px solid #2A2820", borderRadius: "4px", padding: "12px 16px", fontSize: "14px", color: "#F0EBE0", fontFamily: "'DM Sans', sans-serif", outline: "none", width: "100%", resize: "vertical", minHeight: "130px", lineHeight: 1.65 },
  formSelect: { background: "#141310", border: "1px solid #2A2820", borderRadius: "4px", padding: "12px 16px", fontSize: "14px", color: "#F0EBE0", fontFamily: "'DM Sans', sans-serif", outline: "none", width: "100%", cursor: "pointer" },
  formRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },

  // Loading
  loadingWrap: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "24px", animation: "fadeIn 0.3s ease" },
  loaderRing: { width: "52px", height: "52px", border: "2px solid #2A2820", borderTopColor: "#C9A84C", borderRadius: "50%", animation: "spin 0.9s linear infinite" },
  loadingTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", textAlign: "center" },
  loadingPhase: (done) => ({ fontSize: "13px", color: done ? "#C9A84C" : "#7A7060", display: "flex", alignItems: "center", gap: "8px", transition: "color 0.4s" }),

  // Result
  resultHeader: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "20px", marginBottom: "28px", flexWrap: "wrap" },
  resultTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", fontWeight: 400, marginBottom: "10px" },
  metaTag: { fontSize: "11px", fontWeight: 500, letterSpacing: "0.07em", textTransform: "uppercase", padding: "4px 10px", borderRadius: "100px", border: "1px solid rgba(201,168,76,0.28)", color: "#E8D5A3", background: "rgba(201,168,76,0.06)", marginRight: "6px", display: "inline-block", marginBottom: "6px" },
  letterPaper: { background: "#FAFAF5", borderRadius: "4px", padding: "56px 64px", color: "#1a1a18", fontFamily: "'Cormorant Garamond', serif", fontSize: "15px", lineHeight: 1.88, whiteSpace: "pre-wrap", boxShadow: "0 24px 80px rgba(0,0,0,0.5)", position: "relative", borderTop: "4px solid #C9A84C" },
  costBanner: { background: "#1E1C18", border: "1px solid #2A2820", borderRadius: "8px", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "24px", flexWrap: "wrap", gap: "16px" },
  costPrice: { fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: 500, color: "#C9A84C" },
  restartBtn: { background: "transparent", color: "#7A7060", border: "none", fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: "6px", padding: "8px 0", marginTop: "28px", transition: "color 0.2s" },
};

// ─── COMPONENT ──────────────────────────────────────────────────────
export default function Home() {
  const [step, setStep] = useState(0); // 0=hero, 1=cat, 2=form, 3=loading, 4=result
  const [category, setCategory] = useState(null);
  const [letterType, setLetterType] = useState("legal_notice");
  const [formData, setFormData] = useState({});
  const [complainantName, setComplainantName] = useState("");
  const [complainantCity, setComplainantCity] = useState("");
  const [letter, setLetter] = useState("");
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const flowRef = useRef(null);

  const handleStart = () => {
    setStep(1);
    setTimeout(() => flowRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  const handleCategorySelect = (catId) => {
    setCategory(catId);
    setFormData({});
  };

  const handleFormChange = (id, value) => setFormData(p => ({ ...p, [id]: value }));

  const isFormValid = () => {
    const fields = FIELD_CONFIGS[category] || [];
    return fields.every(f => formData[f.id]?.trim()) && complainantName.trim() && complainantCity.trim();
  };

  const handleGenerate = async () => {
    setStep(3);
    setLoadingPhase(0);
    setError("");

    [600, 1500, 2600].forEach((delay, i) =>
      setTimeout(() => setLoadingPhase(i + 1), delay)
    );

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, formData, letterType, complainantName, complainantCity }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setLetter(data.letter);
      setStep(4);
    } catch (err) {
      setError(err.message);
      setStep(2);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([letter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `legal-notice-${category}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRestart = () => {
    setStep(1);
    setCategory(null);
    setFormData({});
    setLetter("");
    setComplainantName("");
    setComplainantCity("");
    setLoadingPhase(0);
    setError("");
    setTimeout(() => flowRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  const curStep = step <= 1 ? 0 : step - 1;

  return (
    <>
      <Head>
        <title>NyayAI — Consumer Legal Notice Generator India</title>
        <meta name="description" content="Generate legally sharp consumer complaint letters and legal notices in 60 seconds. Insurance, banking, e-commerce, telecom, real estate." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={S.page}>
        <div style={S.noise} />

        {/* NAVBAR */}
        <nav style={S.navbar}>
          <div style={S.navLogo}>Nyay<span style={{ color: "#F0EBE0" }}>AI</span></div>
          <div style={S.navBadge}>Consumer Rights · AI-Powered</div>
        </nav>

        {/* ── HERO ── */}
        {step === 0 && (
          <>
            <section style={S.hero}>
              <div style={S.heroGlow} />
              <div style={S.heroTag}>
                <div style={S.heroTagDot} />
                Legal Notice Generator — India&apos;s First AI Tool
              </div>
              <h1 style={S.heroTitle}>
                Fight Back.<br />
                <em style={S.heroTitleEm}>Write it like a lawyer.</em>
              </h1>
              <p style={S.heroSub}>
                Turn your consumer complaint into a powerful, law-cited legal notice in under 60 seconds. No lawyers. No jargon. Just results.
              </p>
              <div style={S.heroCta}>
                <button
                  style={S.btnPrimary}
                  onClick={handleStart}
                  onMouseOver={e => { e.target.style.background = "#E8D5A3"; e.target.style.transform = "translateY(-1px)"; }}
                  onMouseOut={e => { e.target.style.background = "#C9A84C"; e.target.style.transform = "translateY(0)"; }}
                >
                  Generate My Legal Notice →
                </button>
                <button
                  style={S.btnSecondary}
                  onClick={handleStart}
                  onMouseOver={e => { e.target.style.color = "#F0EBE0"; e.target.style.borderColor = "#7A7060"; }}
                  onMouseOut={e => { e.target.style.color = "#7A7060"; e.target.style.borderColor = "#2A2820"; }}
                >
                  See How It Works
                </button>
              </div>
              <div style={S.statsRow}>
                {[["₹149", "Per letter"], ["60s", "Generation time"], ["8+", "Complaint types"], ["IPC", "Law-cited letters"]].map(([n, l]) => (
                  <div key={l} style={{ textAlign: "center" }}>
                    <div style={S.statNum}>{n}</div>
                    <div style={S.statLabel}>{l}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* HOW IT WORKS */}
            <div style={S.hiwSection}>
              <div style={{ textAlign: "center", marginBottom: "0" }}>
                <h2 style={{ ...S.sectionTitle, fontSize: "36px" }}>How It Works</h2>
                <p style={{ color: "#7A7060", marginTop: "8px", fontSize: "15px" }}>Three steps. One powerful letter.</p>
              </div>
              <div style={S.hiwGrid}>
                {[
                  ["01", "Pick your category", "Insurance, banking, telecom, e-commerce, real estate — we cover every major consumer sector in India."],
                  ["02", "Fill in the facts", "Answer simple guided questions about your case. No legal knowledge needed. Plain language is fine."],
                  ["03", "Get your letter", "A legally sharp notice citing exact laws, regulatory authorities, and remedies — ready to send immediately."],
                ].map(([num, title, desc]) => (
                  <div key={num} style={S.hiwItem}>
                    <div style={S.hiwNum}>{num}</div>
                    <div style={S.hiwTitle}>{title}</div>
                    <div style={S.hiwDesc}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── FLOW AREA ── */}
        {step >= 1 && (
          <div style={S.flowArea} ref={flowRef}>

            {/* Step Indicator */}
            {step !== 3 && step !== 4 && (
              <div style={S.stepRow}>
                {STEP_LABELS.map((label, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEP_LABELS.length - 1 ? 1 : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={S.stepCircle(curStep === i, curStep > i)}>
                        {curStep > i ? "✓" : i + 1}
                      </div>
                      <span style={S.stepLabel(curStep === i)}>{label}</span>
                    </div>
                    {i < STEP_LABELS.length - 1 && <div style={S.stepLine(curStep > i)} />}
                  </div>
                ))}
              </div>
            )}

            {/* ── STEP 1: CATEGORY ── */}
            {step === 1 && (
              <div style={{ animation: "fadeInUp 0.4s ease" }}>
                <h2 style={S.sectionTitle}>What&apos;s your complaint about?</h2>
                <p style={S.sectionSub}>Select the category that best matches your issue.</p>
                <div style={S.catGrid}>
                  {CATEGORIES.map(cat => (
                    <div
                      key={cat.id}
                      style={S.catCard(category === cat.id)}
                      onClick={() => handleCategorySelect(cat.id)}
                      onMouseOver={e => { if (category !== cat.id) e.currentTarget.style.borderColor = "#8A6F2E"; }}
                      onMouseOut={e => { if (category !== cat.id) e.currentTarget.style.borderColor = "#2A2820"; }}
                    >
                      <div style={S.catIcon}>{cat.icon}</div>
                      <div style={S.catName}>{cat.name}</div>
                      <div style={S.catDesc}>{cat.desc}</div>
                    </div>
                  ))}
                </div>
                {category && (
                  <div style={{ marginTop: "32px", display: "flex", justifyContent: "flex-end" }}>
                    <button style={S.btnPrimary} onClick={() => setStep(2)}
                      onMouseOver={e => e.target.style.background = "#E8D5A3"}
                      onMouseOut={e => e.target.style.background = "#C9A84C"}
                    >
                      Continue →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 2: FORM ── */}
            {step === 2 && category && (
              <div style={{ animation: "fadeInUp 0.4s ease" }}>
                <h2 style={S.sectionTitle}>Tell us what happened</h2>
                <p style={S.sectionSub}>The more detail you provide, the stronger your letter will be.</p>

                {error && (
                  <div style={{ background: "rgba(192,57,43,0.1)", border: "1px solid rgba(192,57,43,0.3)", borderRadius: "4px", padding: "12px 16px", marginBottom: "20px", fontSize: "13px", color: "#e74c3c" }}>
                    ⚠ {error}
                  </div>
                )}

                {/* Complainant info */}
                <div style={S.formRow}>
                  <div style={S.formGroup}>
                    <label style={S.formLabel}>Your Full Name</label>
                    <input style={S.formInput} placeholder="e.g. Priya Sharma" value={complainantName}
                      onChange={e => setComplainantName(e.target.value)}
                      onFocus={e => e.target.style.borderColor = "#8A6F2E"}
                      onBlur={e => e.target.style.borderColor = "#2A2820"} />
                  </div>
                  <div style={S.formGroup}>
                    <label style={S.formLabel}>Your City & State</label>
                    <input style={S.formInput} placeholder="e.g. Mumbai, Maharashtra" value={complainantCity}
                      onChange={e => setComplainantCity(e.target.value)}
                      onFocus={e => e.target.style.borderColor = "#8A6F2E"}
                      onBlur={e => e.target.style.borderColor = "#2A2820"} />
                  </div>
                </div>

                {/* Letter type */}
                <div style={S.formGroup}>
                  <label style={S.formLabel}>Type of Document</label>
                  <select style={S.formSelect} value={letterType} onChange={e => setLetterType(e.target.value)}>
                    {LETTER_TYPES.map(lt => <option key={lt.id} value={lt.id}>{lt.label}</option>)}
                  </select>
                </div>

                {/* Dynamic fields */}
                {(FIELD_CONFIGS[category] || []).map(field => (
                  <div key={field.id} style={S.formGroup}>
                    <label style={S.formLabel}>{field.label}</label>
                    {field.type === "textarea" ? (
                      <textarea style={S.formTextarea} placeholder={field.placeholder}
                        value={formData[field.id] || ""}
                        onChange={e => handleFormChange(field.id, e.target.value)}
                        onFocus={e => e.target.style.borderColor = "#8A6F2E"}
                        onBlur={e => e.target.style.borderColor = "#2A2820"} />
                    ) : (
                      <input style={S.formInput} type="text" placeholder={field.placeholder}
                        value={formData[field.id] || ""}
                        onChange={e => handleFormChange(field.id, e.target.value)}
                        onFocus={e => e.target.style.borderColor = "#8A6F2E"}
                        onBlur={e => e.target.style.borderColor = "#2A2820"} />
                    )}
                  </div>
                ))}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
                  <button style={S.btnSecondary} onClick={() => setStep(1)}>← Back</button>
                  <button
                    style={{ ...S.btnPrimary, opacity: isFormValid() ? 1 : 0.4, cursor: isFormValid() ? "pointer" : "not-allowed" }}
                    onClick={isFormValid() ? handleGenerate : undefined}
                  >
                    Generate Letter →
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: LOADING ── */}
            {step === 3 && (
              <div style={S.loadingWrap}>
                <div style={S.loaderRing} />
                <div style={{ textAlign: "center" }}>
                  <div style={S.loadingTitle}>Drafting your legal notice...</div>
                  <div style={{ fontSize: "13px", color: "#7A7060", marginTop: "6px" }}>Our AI is analysing your case and citing relevant laws</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    "Analysing your complaint details",
                    "Matching relevant Indian consumer laws",
                    `Drafting your ${LETTER_TYPES.find(l => l.id === letterType)?.label}`,
                  ].map((phase, i) => (
                    <div key={i} style={S.loadingPhase(loadingPhase > i)}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "currentColor" }} />
                      {phase}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── STEP 4: RESULT ── */}
            {step === 4 && (
              <div style={{ animation: "fadeInUp 0.5s ease" }}>
                <div style={S.resultHeader}>
                  <div>
                    <div style={S.resultTitle}>Your letter is ready</div>
                    <div>
                      <span style={S.metaTag}>{CATEGORIES.find(c => c.id === category)?.name}</span>
                      <span style={S.metaTag}>{LETTER_TYPES.find(l => l.id === letterType)?.label}</span>
                      <span style={S.metaTag}>Law-cited</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button style={S.btnCopy} onClick={handleCopy}>{copied ? "✓ Copied!" : "⎘ Copy"}</button>
                    <button style={S.btnDl} onClick={handleDownload}>↓ Download</button>
                  </div>
                </div>

                <div style={S.letterPaper}>{letter}</div>

                <div style={S.costBanner}>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: 500, marginBottom: "4px" }}>Unlock Full Access</div>
                    <div style={{ fontSize: "13px", color: "#7A7060" }}>Formatted PDF, lawyer review add-on, send via registered email</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <div style={S.costPrice}>₹149 <span style={{ fontSize: "14px", color: "#7A7060", fontFamily: "'DM Sans', sans-serif" }}>/ letter</span></div>
                    <button style={S.btnPrimary}>Pay & Download PDF</button>
                  </div>
                </div>

                <button style={S.restartBtn} onClick={handleRestart}
                  onMouseOver={e => e.currentTarget.style.color = "#F0EBE0"}
                  onMouseOut={e => e.currentTarget.style.color = "#7A7060"}
                >
                  ← Generate another letter
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
