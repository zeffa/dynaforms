from django.conf import settings
from django.core.mail import send_mail


def send_notification(recipient_list, subject, message):
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        recipient_list,
    )
