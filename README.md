# University Rules RAG Chatbot 🤖📚

A Persian-language AI chatbot that answers questions about Ferdowsi University of Mashhad research rules and regulations using Retrieval-Augmented Generation (RAG) technology.

## ✨ Features

- 🇮🇷 **Persian Language Support** - Full RTL interface and natural language processing
- 🔍 **Smart Search** - RAG system with vector similarity search
- 🤖 **AI-Powered Answers** - Powered by Google Gemini 2.0 Flash
- 📄 **Source Citations** - Direct links to PDF documents
- 🎯 **Academic Level Detection** - Automatically detects undergraduate/graduate context
- 🌐 **Web Interface** - Clean, responsive Bootstrap UI
- ⚡ **Fast API** - RESTful API with real-time responses

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/University-RAG-Chatbot.git
   cd University-RAG-Chatbot
   ```

2. **Create virtual environment**
   ```bash
   python -m venv myenv
   source myenv/bin/activate  # On Windows: myenv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Setup environment variables**
   ```bash
   touch .env  # On Windows:     echo. > .env
   # Edit .env and add your GEMINI_API_KEY and QDRANT_API_KEY 
   ```

5. **Run the application**
   ```bash
   python app.py
   ```

6. **Open your browser**
   ```
   http://localhost:8000
   ```

## 🛠️ Technology Stack

- **Backend**: FastAPI, Python
- **AI/ML**: Google Gemini 2.0 Flash, Sentence Transformers
- **Vector DB**: Qdrant
- **Frontend**: HTML5, Bootstrap 5, JavaScript
- **Language**: Persian (Farsi) with RTL support

## 📖 Usage

1. **Ask Questions** in Persian about university research rules
2. **Get AI Answers** with source citations
3. **View Sources** with direct PDF links
4. **Check Categories** to see available topics

"

## 📁 Project Structure

```
├── app.py                 # Main FastAPI application
├── src/                   # Core RAG system
├── static/               # Web interface files
├── data/                 # Knowledge base (JSON files)
├── deployment/           # Production deployment files
└── docs/                # Documentation
```

## 🚀 Deployment

### Local Development
```bash
python app.py
```

### Production (Render/Heroku)
See DEPLOYMENT_GUIDE.md for detailed instructions.

## 🔧 Configuration

### Environment Variables
```env
GEMINI_API_KEY=your_gemini_api_key_here
QDRANT_HOST= DM_me_to_send_you
QDRANT_API_KEY= DM_me_to_send_you
```

## 🧪 API Endpoints

- `GET /` - Web interface
- `POST /api/chat` - Chat with the bot
- `GET /api/health` - Health check
- `GET /api/system/stats` - System statistics
- `GET /api/system/categories` - Available categories

## 📝 **Development Roadmap & TODO List**

### 🚀 **Upcoming Features**

#### 1. 📊 **Logging System for RAG Inference**
**Priority: High** 🔴

Add comprehensive logging to track and monitor the RAG system's decision-making process.

**Implementation Goals:**
- Query preprocessing logs (tokenization, normalization)
- Vector similarity search logs (scores, retrieved chunks)
- LLM prompt construction logs
- Response generation timing and token usage
- Error tracking and debugging information
- User interaction analytics

**Benefits:** Debug retrieval accuracy, monitor performance, optimize queries, track user patterns

---

#### 2. 🧠 **Add Reasoning Variant** 
**Priority: Medium** 🟡

Implement advanced reasoning capabilities for complex multi-step questions.

**Implementation Goals:**
- Chain-of-thought reasoning prompts
- Multi-hop question decomposition
- Step-by-step logical inference
- Evidence synthesis from multiple sources
- Confidence scoring for reasoning steps
- Explanation generation for complex answers

**Benefits:** Handle complex queries, provide transparent reasoning, improve multi-part answers

---

#### 3. 🧪 **RAG Logic Validation Tests**
**Priority: High** 🔴

Create comprehensive test suite to validate RAG system accuracy and reliability.

**Implementation Goals:**
- Unit tests for embedding similarity
- Integration tests for end-to-end queries
- Ground truth dataset for Persian university rules
- Automated accuracy metrics (BLEU, ROUGE, semantic similarity)
- Regression tests for system updates
- Performance benchmarks

**Benefits:** Ensure quality, catch regressions, measure improvements, validate Persian processing

---

#### 4. 🎨 **UI/UX Improvements**
**Priority: Medium** 🟡

Enhance user experience with modern, intuitive interface design.

**Implementation Goals:**
- Modern chat interface with WhatsApp-style bubbles
- Loading animations and typing indicators
- Source preview with inline PDF modal
- Search history and question suggestions
- Dark mode toggle
- Mobile optimization and accessibility
- Better Persian typography

**Benefits:** Improved engagement, better mobile experience, professional appearance

---

#### 5. 💬 **Chat History Integration**
**Priority: High** 🔴
Return and maintain chat history context in each inference for better conversational experience.

**Implementation Goals:**
- Store conversation context across sessions
- Include previous Q&A pairs in LLM prompts
- Implement context-aware follow-up questions
- Add conversation memory management
- Export/import chat history functionality
- Context length optimization for better performance

**Benefits:** Conversational continuity, better follow-up answers, personalized experience, context-aware responses



## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.



## 📞 Support

If you have any questions or issues, please open an issue on GitHub or contact [bsabeti13@gmail.com](mailto:bsabeti13@gmail.com).

---

**Built with ❤️ for Ferdowsi University of Mashhad students and researchers**
