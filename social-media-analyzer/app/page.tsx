"use client";
import React, { useState, useRef } from 'react';

export default function AnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setAnalysis(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/analyze', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) {
        setExtractedText(data.text);
        setAnalysis(data.analysis);
      } else {
        alert(data.error || "Analysis failed.");
      }
    } catch (err) {
      alert("Error connecting to the analyzer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif', color: '#333' }}>
      
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 'bold' }}>Social Media Content <span style={{ color: '#2563eb' }}>Analyzer</span></h1>
        <p style={{ color: '#666' }}>Upload a PDF draft to get instant insights and engagement scores.</p>
      </header>

      {/* UPLOAD SECTION */}
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div 
          onClick={() => fileInputRef.current?.click()}
          style={{ 
            border: '2px dashed #ccc', borderRadius: '12px', padding: '30px', 
            textAlign: 'center', cursor: 'pointer', backgroundColor: '#fafafa' 
          }}
        >
          <input type="file" ref={fileInputRef} hidden accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <p style={{ margin: 0, fontWeight: '500' }}>{file ? `📄 ${file.name}` : "Click to select a PDF file"}</p>
        </div>

        <button 
          onClick={handleUpload} 
          disabled={loading || !file}
          style={{ 
            width: '100%', marginTop: '20px', padding: '15px', borderRadius: '8px',
            backgroundColor: '#111', color: '#fff', fontWeight: 'bold', cursor: 'pointer',
            border: 'none', opacity: (loading || !file) ? 0.6 : 1
          }}
        >
          {loading ? "Analyzing..." : "Run Analysis →"}
        </button>
      </div>

      {/* RESULTS DISPLAY */}
      {analysis && (
        <div style={{ marginTop: '50px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          
          {/* LEFT: EXTRACTED TEXT */}
          <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '15px' }}>Extracted Content</h3>
            <div style={{ fontSize: '0.9rem', color: '#555', lineHeight: '1.6', maxHeight: '300px', overflowY: 'auto' }}>
              {extractedText}
            </div>
          </div>

          {/* RIGHT: METRICS */}
          <div style={{ padding: '20px', backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            
            {/* STRENGTH METER */}
            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#888' }}>ENGAGEMENT STRENGTH</span>
              <div style={{ height: '12px', background: '#eee', borderRadius: '6px', margin: '10px 0', overflow: 'hidden' }}>
                <div style={{ width: `${analysis.strength}%`, height: '100%', backgroundColor: '#10b981', transition: 'width 1s' }}></div>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{analysis.strength}/100</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              <div style={{ padding: '10px', background: '#f0f7ff', borderRadius: '6px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: 'bold' }}>GENRE</div>
                <div style={{ fontWeight: 'bold' }}>{analysis.genre}</div>
              </div>
              <div style={{ padding: '10px', background: '#f5f3ff', borderRadius: '6px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: '#7c3aed', fontWeight: 'bold' }}>TONE</div>
                <div style={{ fontWeight: 'bold' }}>{analysis.tone}</div>
              </div>
            </div>

            {/* ACTIONABLE INSIGHTS */}
            <div>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '10px' }}>✨ Recommendations</h4>
              <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: '#444' }}>
                {analysis.improvements.map((tip: string, i: number) => (
                  <li key={i} style={{ marginBottom: '8px' }}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}