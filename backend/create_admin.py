import os
# pyrefly: ignore [missing-import]
import django

print("DEBUG: Available environment variables during build:", list(os.environ.keys()))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

# pyrefly: ignore [missing-import]
from django.contrib.auth.models import User

# Create a default admin user if one doesn't exist
username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@hadescore.com')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'admin12345')

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username, email, password)
    print(f"Superuser '{username}' created successfully!")
else:
    print(f"Superuser '{username}' already exists.")
