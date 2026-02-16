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
    setExtractedText("");
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
        alert(data.error || "Processing failed.");
      }
    } catch (err) {
      alert("Connection failed. Check your internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '30px 20px', fontFamily: '"Segoe UI", sans-serif', color: '#111827' }}>
      
      {/* 1. Header Area */}
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.5rem', margin: '0 0 10px 0' }}>Social Media <span style={{ color: '#2563eb' }}>Optimizer</span></h1>
        <p style={{ color: '#6b7280' }}>Powered by Gemini AI • Professional Content Intelligence</p>
      </header>

      {/* 2. Instructional Guide (Metrics for Non-Tech Users) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '30px' }}>
        {[
          { icon: "📄", title: "Upload", desc: "Select your PDF draft" },
          { icon: "🧠", title: "Analyze", desc: "Gemini Quality Audit" },
          { icon: "🔥", title: "Optimize", desc: "Viral Potential Score" }
        ].map((item, i) => (
          <div key={i} style={{ padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '5px' }}>{item.icon}</div>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{item.title}</div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>{item.desc}</div>
          </div>
        ))}
      </div>
      
      {/* 3. Compact Action Area (Smaller Upload Box) */}
      <div style={{ maxWidth: '600px', margin: '0 auto 20px auto' }}>
        <div style={{ 
          border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '20px', 
          textAlign: 'center', background: '#fff', cursor: 'pointer'
        }} onClick={() => fileInputRef.current?.click()}>
          <input type="file" ref={fileInputRef} hidden accept=".pdf" 
                 onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} />
          <p style={{ margin: 0, fontWeight: '600' }}>{file ? `📄 ${file.name}` : "Click to select a draft PDF"}</p>
          <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '5px' }}>Maximum confidence in every post.</p>
        </div>

        <button onClick={handleUpload} disabled={loading || !file}
          style={{ 
            width: '100%', marginTop: '15px', padding: '15px', background: '#111827', 
            color: '#fff', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', border: 'none' 
          }}>
          {loading ? "✨ AI is reviewing your brilliance..." : "Analyze Content →"}
        </button>
      </div>

      {/* 4. Results Section (Strength Meter & Insights) */}
      {analysis && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '25px', marginTop: '40px' }}>
          
          <div style={{ padding: '20px', background: '#f1f5f9', borderRadius: '12px' }}>
            <h3 style={{ marginTop: 0, fontSize: '1rem' }}>Extracted Draft</h3>
            <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#475569', maxHeight: '450px', overflowY: 'auto' }}>
              {extractedText}
            </div>
          </div>

          <div style={{ padding: '25px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            
            {/* VIRAL POTENTIAL (Strength Meter) */}
            <div style={{ marginBottom: '30px', textAlign: 'center' }}>
               <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Viral Potential Score</h4>
               <div style={{ width: '100%', background: '#e2e8f0', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{ width: `${analysis.strength || 0}%`, height: '100%', background: '#10b981', transition: 'width 1.2s ease' }}></div>
               </div>
               <span style={{ fontWeight: 'bold', fontSize: '1.3rem', marginTop: '8px', display: 'block' }}>{analysis.strength || 0}/100</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
              <div style={{ padding: '12px', background: '#eff6ff', borderRadius: '8px' }}>
                <small style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '10px' }}>GENRE</small>
                <div style={{ fontWeight: '600' }}>{analysis.genre}</div>
              </div>
              <div style={{ padding: '12px', background: '#f5f3ff', borderRadius: '8px' }}>
                <small style={{ color: '#8b5cf6', fontWeight: 'bold', fontSize: '10px' }}>TONE</small>
                <div style={{ fontWeight: '600' }}>{analysis.tone}</div>
              </div>
            </div>

            {/* ACTIONABLE INSIGHTS */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '1.1rem', color: '#1e293b' }}>✨ Actionable Insights</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(analysis.improvements || []).map((tip: string, i: number) => (
                  <div key={i} style={{ padding: '12px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '10px' }}>✅</span>
                    <span style={{ fontWeight: '500' }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'right', fontSize: '12px', color: '#94a3b8' }}>
              Words: {analysis.wordCount} • Hashtags: {analysis.hashtagCount}
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}