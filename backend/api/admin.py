from django.contrib import admin
from .models import *  

admin.site.register(CustomUser)
admin.site.register(Notebook)
admin.site.register(NotebookContent)
admin.site.register(Book)
admin.site.register(BookSummary)