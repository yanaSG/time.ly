# from celery import shared_task
# from django.db import transaction
# from .models import Book, BookSummary
# from .services.pdf_processor import BookToNotesConverter
# import json
# import logging

# logger = logging.getLogger(__name__)

# @shared_task(bind=True, max_retries=3, autoretry_for=(Exception,), retry_backoff=True)
# def process_book_to_notes(self, book_id):
#     """Celery task to process PDF book into structured notes."""
#     try:
#         book = Book.objects.get(pk=book_id)
#         logger.info(f"Starting processing for book: {book.title} (ID: {book_id})")
        
#         # Process PDF with enhanced converter
#         result = BookToNotesConverter.process(book.pdf_data)
        
#         # Save results atomically
#         with transaction.atomic():
#             BookSummary.objects.update_or_create(
#                 book=book,
#                 defaults={
#                     'structured_notes': json.dumps(result['structured_notes']),
#                     'key_elements': json.dumps(result['key_elements']),
#                     'tldr': result['tldr'],
#                     'processing_status': 'COMPLETED'
#                 }
#             )
        
#         logger.info(f"Successfully processed book: {book.title}")
#         return {
#             'book_id': book_id,
#             'status': 'SUCCESS',
#             'tldr': result['tldr']
#         }
        
#     except Exception as e:
#         logger.error(f"Error processing book {book_id}: {str(e)}", exc_info=True)
        
#         # Update status if book exists
#         if 'book' in locals():
#             BookSummary.objects.filter(book=book).update(
#                 processing_status='FAILED',
#                 processing_error=str(e)
#             )
        
#         raise self.retry(exc=e, countdown=min(60 * (2 ** self.request.retries), max_retries=3))