### To run the servers (in order):

##### Django
`python manage.py runserver`

##### Celery
`celery -A your_project worker --pool=solo -l info`