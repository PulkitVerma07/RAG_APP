<div align="center">

# 🔮 Lumen

### Ask your documents anything.

A Retrieval-Augmented Generation (RAG) application that lets you upload a PDF and have a real conversation with it — powered by semantic search and Google's Gemini models.

[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![ChromaDB](https://img.shields.io/badge/ChromaDB-FF6F00?style=for-the-badge&logo=databricks&logoColor=white)](https://www.trychroma.com/)
[![Gemini](https://img.shields.io/badge/Gemini_API-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)

<br/>

![status](https://img.shields.io/badge/status-live-success?style=flat-square)
![license](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![made with](https://img.shields.io/badge/made%20with-☕%20and%20late%20nights-orange?style=flat-square)

</div>

---

## 📖 What is this?

Lumen takes a PDF you upload, breaks it into meaningful chunks, converts those chunks into vectors it can search by *meaning* (not just keywords), and lets you ask natural-language questions about it. Every answer is grounded in your actual document — not the model guessing from general knowledge — and comes with the source passages it was built from.

> Upload → Chunk → Embed → Store → Ask → Retrieve → Answer. That's the whole pipeline, built from scratch, no black-box framework hiding the mechanics.

---

## ✨ Features

- 📄 **PDF ingestion** — drag, drop, done
- 🧩 **Smart chunking** — heading/subheading-aware splitting, not blind word-count slicing
- 🧠 **Semantic search** — finds the *meaning* closest to your question, not just matching keywords
- 💬 **Grounded answers** — responses are generated only from retrieved context, with source passages shown alongside
- ⚡ **Lightweight embeddings** — runs fully local via ONNX, no GPU or paid embedding API required
- 🌐 **Fully deployed** — live frontend + backend, not just a local demo

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend Framework** | FastAPI |
| **PDF Parsing** | PyPDF2 |
| **Embeddings** | fastembed (local, ONNX runtime) |
| **Vector Database** | ChromaDB |
| **LLM (Answer Generation)** | Google Gemini API |
| **Frontend** | Vercel |
| **Backend Hosting** | Render |

---

## 🧠 How it works

```
 ┌─────────────┐     ┌───────────┐     ┌─────────────┐     ┌─────────────┐
 │  Upload PDF │ ──▶ │  Chunking │ ──▶ │  Embedding  │ ──▶ │  ChromaDB   │
 └─────────────┘     └───────────┘     └─────────────┘     └─────────────┘
                                                                    │
 ┌─────────────┐     ┌───────────┐     ┌─────────────┐            │
 │   Answer    │ ◀── │  Gemini   │ ◀── │  Retrieval  │ ◀──────────┘
 └─────────────┘     └───────────┘     └─────────────┘
                                              ▲
                                        ┌───────────┐
                                        │  Question │
                                        └───────────┘
```

---

## 💻 Run it locally

```bash
# 1. Clone the repo
git clone https://github.com/PulkitVerma07/RAG_APP.git
cd RAG_APP

# 2. Set up a virtual environment
python -m venv venv
venv\Scripts\activate      # Windows
source venv/bin/activate   # macOS/Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Add your environment variables
# create a .env file in the backend folder:
GEMINI_API_KEY=your_key_here

# 5. Run the backend
uvicorn backend.app.main:app --reload

# 6. Open the interactive API docs
http://127.0.0.1:8000/docs
```

---

## 📂 Project Structure

```
RAG_APP/
├── backend/
│   └── app/
│       ├── core/
│       │   └── config.py         # env vars, model + DB setup
│       ├── routes/
│       │   ├── upload.py         # /upload_file endpoint
│       │   └── user_question.py  # /ask endpoint
│       ├── services/
│       │   ├── ingestion.py      # PDF → chunks → embeddings → storage
│       │   └── retreival.py      # question → retrieval → context
│       └── main.py
├── frontend/                     # deployed separately on Vercel
├── requirements.txt
└── README.md
```

---

## 🗺️ Roadmap

- [x] PDF upload + text extraction
- [x] Chunking + local embeddings
- [x] Vector search + grounded generation
- [x] Full deployment (frontend + backend)
- [ ] Multi-document context switching
- [ ] Heading/subheading-aware chunk categorization *(in progress)*
- [ ] Basic auth
- [ ] Chat history persistence

---

<div align="center">

Built by **Pulkit Verma** — first-year Mechanical Engineering student pivoting into backend + applied AI.

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat-square&logo=github&logoColor=white)](https://github.com/PulkitVerma07)

</div>