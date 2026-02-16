# 📊 Social Media Content Optimizer: Precision Auditing for Creators

**"Stop guessing and start posting with confidence."**

Most social media drafts fail because they lack a hook, are the wrong length for the platform, or don't hit the right tone. While most tools today rely on expensive, rate-limited AI APIs, I built a standalone "Content Scientist" that audits your drafts in milliseconds, with 100% uptime and zero privacy concerns.

---

## 🚀 The Mission
This project was born out of a challenge: How do you provide deep content insights without being held hostage by third-party API quotas? This application isn't just a wrapper for a chatbot; it is a dedicated text-processing engine designed to give creators instant, reliable feedback on their PDF drafts.

## 🛠️ The Architecture (Our Approach)
I opted for a **Standalone Heuristic Architecture** over a traditional LLM-based approach. Here’s how the "Brain" of the project works:

### 1. The Extraction Layer
Using `pdf2json`, the system parses raw document buffers into clean text. I implemented a custom regex-based sanitization process to handle URL-encoded characters, ensuring the analysis is performed on raw, human-readable strings.

### 2. The Heuristic NLP Engine
Instead of sending data to an external server, I developed a local keyword-density algorithm. 
- **Genre Mapping:** Cross-references text against a dynamic dictionary (Tech, Business, Entertainment, etc.).
- **Tone Detection:** Analyzes sentence structure and punctuation patterns to identify the "vibe" (e.g., Professional vs. Energetic).

### 3. The Proprietary Strength Meter
The "Strength Meter" isn't a random number. It’s a mathematical calculation based on three pillars:
- **Optimal Length:** Identifying the "sweet spot" between 50 and 250 words.
- **Engagement Triggers:** Detecting hooks (exclamations) and community-drivers (questions).
- **Diversity Index:** Measuring unique word ratios to ensure the content isn't repetitive.

---

## 💡 Why We Built It This Way
During development, I pivoted from using third-party AI to a custom-built engine. Why?
* **Zero Latency:** No waiting for API handshakes. The results are instant.
* **Privacy-First:** Your drafts never leave the server.
* **Total Reliability:** There are no "429 Too Many Requests" errors here. It works every time, for every file, regardless of traffic.

---

## 🏗️ Technical Stack
- **Frontend:** Next.js 15 (App Router) + TypeScript
- **Backend:** Node.js Serverless Functions
- **Styling:** Clean, minimalist UI focused on data visualization
- **Deployment:** Vercel

---

## 🚦 How to Get Started
1. **Clone the Repo:**
   ```bash
   git clone [https://github.com/jayamisr/social-media-analyzer.git](https://github.com/jayamisr/social-media-analyzer.git)