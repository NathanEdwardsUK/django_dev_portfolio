# web: gunicorn portfolio_site.wsgi

# Default entrypoint: run Django
web: gunicorn --bind 0.0.0.0:$PORT --workers 1 --threads 8 --timeout 0 portfolio_site.wsgi:application

# [START cloudrun_django_procfile_collect]
# Collectstatic files
collect: python manage.py collectstatic --verbosity 2 --no-input
# [END cloudrun_django_procfile_collect]

