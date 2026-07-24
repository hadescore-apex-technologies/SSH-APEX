import os
import django
from django.core.files.uploadedfile import SimpleUploadedFile

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.serializers import JobApplicationSerializer
from api.models import JobApplication

def test_serializer():
    print("Testing JobApplicationSerializer with mock data...")
    # Mock resume file
    resume = SimpleUploadedFile("resume.pdf", b"pdf content", content_type="application/pdf")
    
    data = {
        'name': 'John Doe',
        'email': 'john@example.com',
        'phone': '9876543210',
        'linkedin': 'https://linkedin.com/in/johndoe',
        'cover_letter': 'Hello',
        'role_title': 'Full Stack Developer',
        'role_type': 'Full-Time',
        'role_dept': 'Engineering',
        'resume': resume
    }
    
    serializer = JobApplicationSerializer(data=data)
    if serializer.is_valid():
        print("Serializer is VALID")
        instance = serializer.save()
        print(f"Saved instance ID: {instance.id}")
        print(f"Resume path: {instance.resume.name}")
    else:
        print("Serializer is INVALID:")
        print(serializer.errors)

if __name__ == '__main__':
    test_serializer()
