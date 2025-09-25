import os

from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "base.settings")

app = Celery("base", backend="rpc://", broker="pyamqp://guest:guest@rabbitmq:5672//")

app.config_from_object("django.conf:settings", namespace="CELERY")

# auto-discover tasks.py in installed apps
app.autodiscover_tasks()

if __name__ == "__main__":
    app.start()
