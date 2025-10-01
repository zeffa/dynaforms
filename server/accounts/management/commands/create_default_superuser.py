from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction

User = get_user_model()


class Command(BaseCommand):
    help = "Creates a default superuser if not exists"

    @transaction.atomic
    def handle(self, *args, **options):
        username = "admin"
        email = "admin@gmail.com"

        if not User.objects.filter(email=email).exists():
            user = User(
                username=username,
                email=email,
                first_name="Admin",
                last_name="User",
                is_staff=True,
                is_active=True,
                is_superuser=True,
            )
            user.set_password("12345678")  # bypass password validators
            user.save()
            self.stdout.write(self.style.SUCCESS("Default superuser created"))
        else:
            self.stdout.write(self.style.WARNING("Superuser already exists"))
