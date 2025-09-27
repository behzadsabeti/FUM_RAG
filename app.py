#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FastAPI Web Application for University Rules RAG Chatbot
Serves API endpoints for the RAG system with Persian language support
"""

import os
import time
from typing import Dict, Any
from datetime import datetime
from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
import uvicorn

# Import our RAG system
from src.enhanced_rag_with_llm import UniversityRulesRAGWithLLM

# Initialize FastAPI app
app = FastAPI(
    title="دستیار هوشمند قوانین دانشگاه فردوسی مشهد",
    description="سامانه پاسخگویی هوشمند به سؤالات مربوط به قوانین و مقررات پژوهشی دانشگاه",
    version="1.0.0"
)

# Add CORS middleware for frontend requests
# In production, you should restrict this to your frontend's domain
# For example: allow_origins=["http://localhost:3000", "https://your-frontend.com"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files directory
app.mount("/static", StaticFiles(directory="static"), name="static")

# Initialize RAG system globally
rag_system = None

@app.on_event("startup")
async def startup_event():
    """Initialize RAG system on server startup"""
    global rag_system
    print("🚀 Initializing RAG System...")
    try:
        rag_system = UniversityRulesRAGWithLLM()
        print("✅ RAG System initialized successfully")
    except Exception as e:
        print(f"❌ Failed to initialize RAG system: {e}")
        raise

# Request/Response models
class ChatRequest(BaseModel):
    message: str
    max_sources: int = 5

class ChatResponse(BaseModel):
    message: str
    answer: str
    answer_plain_text: str
    category: str
    sources: list
    response_time: float
    timestamp: str
    status: str
    detected_academic_level: str = 'general'
    academic_level_confidence: float = 0.0

@app.get("/")
async def serve_frontend():
    """Serve the main frontend page"""
    return FileResponse("static/index.html")

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    global rag_system
    
    if rag_system is None:
        raise HTTPException(status_code=503, detail="RAG system not initialized")
    
    return {
        "status": "healthy",
        "rag_system": "active",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Main chat endpoint for RAG queries"""
    global rag_system
    
    if rag_system is None:
        raise HTTPException(status_code=503, detail="RAG system not initialized")
    
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Empty message not allowed")
    
    try:
        start_time = time.time()
        
        # Get response from RAG system
        response = rag_system.answer_question(
            query=request.message.strip(),
            top_k=request.max_sources
        )
        
        # Prepare sources with PDF links and enhanced metadata
        formatted_sources = []
        for source in response.sources:
            pdf_url = source.get("pdf_url", "")
            # Check if PDF URL is properly configured
            has_valid_pdf = pdf_url and pdf_url != "PDF_URL" and pdf_url.startswith(("http://", "https://"))
            
            source_info = {
                "document": source["document"],
                "category": source["category"],
                "pdf_url": pdf_url if has_valid_pdf else "",
                "has_pdf": has_valid_pdf,
                "academic_level": source.get("academic_level", "general"),
                "article_number": source.get("article_number", 0),
                "note_number": source.get("note_number", 0),
                "confidence": source.get("confidence", 0.0)
            }
            formatted_sources.append(source_info)
        
        response_time = time.time() - start_time
        
        return ChatResponse(
            message=request.message,
            answer=response.answer,
            answer_plain_text=response.answer_plain_text,
            category=response.category,
            sources=formatted_sources,
            response_time=response_time,
            timestamp=datetime.now().isoformat(),
            status="success",
            detected_academic_level=response.detected_academic_level,
            academic_level_confidence=response.academic_level_confidence
        )
        
    except Exception as e:
        print(f"❌ Error processing chat request: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"خطا در پردازش درخواست: {str(e)}"
        )

@app.get("/api/system/stats")
async def system_stats():
    """Get system statistics"""
    global rag_system
    
    if rag_system is None:
        raise HTTPException(status_code=503, detail="RAG system not initialized")
    
    try:
        stats = rag_system.get_system_statistics()
        return {
            "stats": stats,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting stats: {str(e)}")

@app.get("/api/system/categories")
async def get_categories():
    """Get available categories from the RAG system"""
    global rag_system
    if rag_system is None:
        raise HTTPException(status_code=503, detail="RAG system not initialized")
    
    try:
        categories = rag_system.get_available_categories()
        return {
            "categories": categories,
            "total": len(categories)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting categories: {str(e)}")

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    return JSONResponse(
        status_code=404,
        content={
            "error": "صفحه مورد نظر یافت نشد",
            "status_code": 404,
            "timestamp": datetime.now().isoformat()
        }
    )

@app.exception_handler(500)
async def internal_error_handler(request: Request, exc):
    return JSONResponse(
        status_code=500,
        content={
            "error": "خطای داخلی سرور",
            "status_code": 500,
            "timestamp": datetime.now().isoformat()
        }
    )

if __name__ == "__main__":
    print("🌟 Starting University Rules RAG Chatbot Server")
    print("="*60)
    print("📚 University: Ferdowsi University of Mashhad")
    print("🤖 AI Model: Gemini-2.0-flash")
    print("🔍 Embedding: paraphrase-multilingual-MiniLM-L12-v2")
    print("🌐 Server: FastAPI")
    print("📍 URL: http://localhost:8000")
    print("="*60)
    
    uvicorn.run(
        "app:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info"
    )