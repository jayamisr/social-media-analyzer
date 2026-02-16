import { NextRequest, NextResponse } from 'next/server';
const PDFParser = require("pdf2json");

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // 1. SAFE Text Extraction
    const rawText: string = await new Promise((resolve, reject) => {
      const pdfParser = new PDFParser(null, 1); // '1' flag suppresses memory-heavy formatting
      pdfParser.on("pdfParser_dataReady", () => resolve(pdfParser.getRawTextContent()));
      pdfParser.on("pdfParser_dataError", (err: any) => reject(err));
      pdfParser.parseBuffer(buffer);
    });

    // FIX: Removing decodeURIComponent to prevent "URI malformed" error
    // We use a regex to clean up the URL-encoded characters instead
    const cleanText = rawText
      .replace(/%[0-9A-F]{2}/gi, ' ') // Safely replaces encoded chars with spaces
      .replace(/\s+/g, ' ')
      .trim();

    const words = cleanText.toLowerCase().split(/\s+/).filter(w => w.length > 1);
    const wordCount = words.length;

    // 2. DYNAMIC GENRE ENGINE (Keyword Frequency)
    const dictionary: Record<string, string[]> = {
      Technology: ['ai', 'code', 'software', 'tech', 'data', 'web', 'python', 'java', 'digital'],
      Business: ['growth', 'market', 'startup', 'sales', 'business', 'money', 'strategy', 'roi'],
      Entertainment: ['bollywood', 'movie', 'film', 'actor', 'music', 'dance', 'song', 'star'],
      Health: ['fitness', 'workout', 'diet', 'health', 'yoga', 'gym', 'wellness', 'nutrition'],
      Creative: ['art', 'design', 'paint', 'script', 'creative', 'style', 'vibe', 'story']
    };

    let genre = "General Content";
    let maxMatches = 0;

    Object.entries(dictionary).forEach(([key, keywords]) => {
      const matches = words.filter(word => keywords.includes(word)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        genre = key;
      }
    });

    // 3. TONE ENGINE
    const hasExclamation = cleanText.includes('!');
    const hasQuestion = cleanText.includes('?');
    const avgWordLength = wordCount > 0 ? words.join('').length / wordCount : 0;

    let tone = "Conversational";
    if (avgWordLength > 6) tone = "Professional / Academic";
    if (hasExclamation) tone = "Energetic";
    if (hasQuestion && hasExclamation) tone = "Dynamic / Engaging";

    // 4. STRENGTH METER FORMULA (Dynamic & Accurate)
    let score = 20; // Base
    if (wordCount > 40 && wordCount < 250) score += 30; // Length optimization
    if (hasExclamation) score += 15;
    if (hasQuestion) score += 15;
    const hashtagMatches = cleanText.match(/#\w+/g) || [];
    if (hashtagMatches.length >= 2) score += 20;

    // Ensure score is unique by adding a tiny bit of "word diversity" math
    const uniqueWords = new Set(words).size;
    const diversityBonus = wordCount > 0 ? (uniqueWords / wordCount) * 10 : 0;
    const finalStrength = Math.min(Math.round(score + diversityBonus), 100);

    // 5. IMPROVEMENTS
    const improvements = [];
    if (!hasQuestion) improvements.push("Add a question to drive community comments.");
    if (hashtagMatches.length < 3) improvements.push("Include 3-5 hashtags to increase reach.");
    if (wordCount < 50) improvements.push("Try expanding the content for better authority.");
    if (genre === "General Content") improvements.push("Use more industry-specific keywords.");

    return NextResponse.json({
      text: cleanText,
      analysis: {
        genre,
        tone,
        strength: finalStrength,
        wordCount,
        hashtagCount: hashtagMatches.length,
        improvements: improvements.length > 0 ? improvements : ["Your content is fully optimized!"]
      },
      success: true
    });

  } catch (err: any) {
    return NextResponse.json({ error: "Analysis Error: " + err.message }, { status: 500 });
  }
}