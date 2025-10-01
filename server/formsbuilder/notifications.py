from django.conf import settings
from django.core.mail import send_mail


def send_notification(recipients, subject, message):
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        recipients,
    )
