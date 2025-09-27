#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PDF URLs Configuration
Centralized configuration for all PDF document URLs used in the RAG system
"""

# PDF URLs mapping for university rules documents
PDF_URLS = {
    "rules_01": "https://vpr.um.ac.ir/images/32/stories/moavenat/maghalat/87.1.18-darj-sahih-neshani-daneshgah-dar-maghale2.pdf",  # Fill with actual PDF URL
    "rules_02": "https://vpr.um.ac.ir/images/32/stories/moavenat/maghalat/91.10.16-tartibe-asami-va-nahve-darj-neshani4.pdf",  
    "rules_03": "https://vpr.um.ac.ir/images/32/stories/moavenat/maghalat/93.3.17-darje-neshani-post-electronic.pdf",  # Fill with actual PDF URL
    "rules_04": "https://vpr.um.ac.ir/images/32/stories/moavenat/tahsilat-takmili/9333-tartibe-asami-nevisandegan-maghalat-va-nevisande-masool.pdf",  # Fill with actual PDF URL
    "rules_05": "https://vpr.um.ac.ir/images/32/stories/moavenat/mosavabat/heyat-raeese/13980702comission.pdf",  # Fill with actual PDF URL
    "rules_06": "https://vpr.um.ac.ir/images/32/stories/moavenat/maghalat/letter.pdf",  # Fill with actual PDF URL
    "rules_07": "https://vpr.um.ac.ir/images/32/stories/moavenat/tahsilat-takmili/shora-pajoheshi-1400-03-25.pdf",  # Fill with actual PDF URL
    "rules_08": "https://vpr.um.ac.ir/images/32/stories/moavenat/maghalat/94.8.3-comision-takhasosi-tahsilat-takmili.pdf",  # Fill with actual PDF URL
    "rules_09": "https://vpr.um.ac.ir/images/32/stories/moavenat/maghalat/94.3.27-shora-pajoohesh-va-fanavari.pdf",  # Fill with actual PDF URL
    "rules_10": "https://vpr.um.ac.ir/images/32/banners/ostadmehvar1404-1405.pdf",  # Fill with actual PDF URL
    "rules_11": "https://vpr.um.ac.ir/images/32/stories/moavenat/mosavabat/shoraye-pajoohesh-va-fanavari/chapresale1403.pdf",  # Fill with actual PDF URL
    "rules_12": "https://vpr.um.ac.ir/images/32/stories/moavenat/tahsilat-takmili/mafad-ejraii.pdf",  # Fill with actual PDF URL - Special rules document with academic levels
}

# Document titles mapping (for display purposes)
DOCUMENT_TITLES = {
    "rules_01": "مقررات درج صحیح نشانی دانشگاه در مقاله",
    "rules_02": "ترتیب اسامی و نحوه درج نشانی", 
    "rules_03": "درجه نشانی پست الکترونیک",
    "rules_04": "ترتیب اسامی نویسندگان مقالات و نویسنده مسئول",
    "rules_05": "مصوبات کمیسیون",
    "rules_06": "نامه اداری",
    "rules_07": "مصوبات شورای پژوهشی",
    "rules_08": "مقررات اضافی ۸",
    "rules_09": "مقررات اضافی ۹", 
    "rules_10": "مقررات اضافی ۱۰",
    "rules_11": "مقررات اضافی ۱۱",
    "rules_12": "مقررات تحصیلات تکمیلی و مقاطع مختلف دانشگاه",
}

# Categories mapping (for better organization)
DOCUMENT_CATEGORIES = {
    "rules_01": "قوانین انتشار",
    "rules_02": "قوانین انتشار",
    "rules_03": "سیاست پست الکترونیک",
    "rules_04": "قوانین نویسندگی",
    "rules_05": "مصوبات",
    "rules_06": "اسناد اداری",
    "rules_07": "مصوبات",
    "rules_08": "مقررات عمومی",
    "rules_09": "مقررات عمومی",
    "rules_10": "مقررات عمومی", 
    "rules_11": "مقررات عمومی",
    "rules_12": "مقررات تحصیلات تکمیلی",
}

def get_pdf_url(document_id: str) -> str:
    """Get PDF URL for a document ID"""
    return PDF_URLS.get(document_id, "")

def get_document_title(document_id: str) -> str:
    """Get document title for a document ID"""
    return DOCUMENT_TITLES.get(document_id, document_id)

def get_document_category(document_id: str) -> str:
    """Get document category for a document ID"""
    return DOCUMENT_CATEGORIES.get(document_id, "نامشخص")

def get_all_categories() -> list:
    """Get a unique list of all categories"""
    return sorted(list(set(DOCUMENT_CATEGORIES.values())))

def get_all_documents_info() -> dict:
    """Get complete information for all documents"""
    return {
        doc_id: {
            "title": get_document_title(doc_id),
            "category": get_document_category(doc_id),
            "pdf_url": get_pdf_url(doc_id)
        }
        for doc_id in PDF_URLS.keys()
    }

def update_pdf_url(document_id: str, new_url: str) -> bool:
    """Update PDF URL for a document (for programmatic updates)"""
    if document_id in PDF_URLS:
        PDF_URLS[document_id] = new_url
        return True
    return False

def validate_urls() -> dict:
    """Validate which URLs are properly configured"""
    results = {}
    for doc_id, url in PDF_URLS.items():
        if url == "PDF_URL" or not url:
            results[doc_id] = "Not configured"
        elif url.startswith(("http://", "https://")):
            results[doc_id] = "Valid URL"
        else:
            results[doc_id] = "Invalid URL format"
    return results

# Example usage and testing
if __name__ == "__main__":
    print("📚 PDF URLs Configuration")
    print("=" * 50)
    
    print("\n📋 Documents Overview:")
    for doc_id in sorted(PDF_URLS.keys()):
        title = get_document_title(doc_id)
        category = get_document_category(doc_id)
        url_status = "✅ Configured" if get_pdf_url(doc_id) != "PDF_URL" else "⚠️ Needs URL"
        print(f"  {doc_id}: {title}")
        print(f"    Category: {category}")
        print(f"    Status: {url_status}")
        print()
    
    print("\n🔍 URL Validation:")
    validation_results = validate_urls()
    for doc_id, status in validation_results.items():
        status_icon = "✅" if status == "Valid URL" else "⚠️" if status == "Not configured" else "❌"
        print(f"  {status_icon} {doc_id}: {status}")
    
    print(f"\n📊 Summary:")
    total_docs = len(PDF_URLS)
    configured_urls = sum(1 for url in PDF_URLS.values() if url != "PDF_URL")
    print(f"  Total documents: {total_docs}")
    print(f"  Configured URLs: {configured_urls}")
    print(f"  Pending URLs: {total_docs - configured_urls}")