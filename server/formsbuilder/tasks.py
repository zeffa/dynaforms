from celery import shared_task

from formsbuilder.notifications import send_notification


@shared_task
def form_submission_notification(emails):
    admin_emails = [admin.email for admin in emails]
    message = "A new form has been sumitted."
    send_notification(
        subject="Form Submission",
        message=message,
        recipient_list=admin_emails,
    )