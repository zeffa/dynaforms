from celery import shared_task

from formsbuilder.notifications import send_notification


@shared_task
def form_submission_notification(emails):
    print(emails)
    message = "A new form has been sumitted."
    send_notification(
        subject="Form Submission",
        message=message,
        recipients=emails,
    )
