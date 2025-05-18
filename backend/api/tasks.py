from celery import shared_task
from .models import *
from .services.pdf_processor import AcademicPDFProcessor

@shared_task(bind=True, max_retries=3)
def process_academic_pdf(self, book_id):
    try:
        book = Book.objects.get(pk=book_id)
        result = AcademicPDFProcessor.process(book.pdf_data)
        
        BookSummary.objects.update_or_create(
            book=book,
            defaults={
                'structured_outline': result['structured_outline'],
                'key_definitions': result['key_definitions'],
                'critical_quotes': "\n".join(result['critical_quotes']),
                'tl_dr': result['tl_dr']
            }
        )
    except Exception as e:
        self.retry(exc=e, countdown=60)