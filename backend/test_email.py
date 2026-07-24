"""
Quick email test script
Run with: python test_email.py
"""
import os
import sys
import django

# Setup Django environment
sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.core.mail import send_mail
from django.conf import settings
from api.email_utils import send_application_notification, send_confirmation_email

def test_basic_email():
    """Test basic email sending"""
    print("Testing basic email...")
    try:
        send_mail(
            subject='Test Email - Hadescore Apex',
            message='This is a test email to verify SMTP configuration works correctly.',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.ADMIN_EMAIL],
            fail_silently=False,
        )
        print("✅ Basic email sent successfully!")
        return True
    except Exception as e:
        print(f"❌ Failed to send basic email: {e}")
        return False

def test_application_notification():
    """Test application notification email"""
    print("\nTesting application notification email...")
    try:
        test_data = {
            'name': 'John Doe',
            'email': 'john@example.com',
            'phone': '+91 9876543210',
            'company': 'Test Company',
            'subject': 'Website Inquiry',
            'message': 'This is a test contact form submission.',
            'created_at': '2026-06-26 10:30:00'
        }
        result = send_application_notification('contact', test_data)
        if result:
            print("✅ Application notification sent successfully!")
        else:
            print("⚠️  Application notification may have failed (check logs)")
        return result
    except Exception as e:
        print(f"❌ Failed to send application notification: {e}")
        return False

def test_confirmation_email():
    """Test confirmation email to applicant"""
    print("\nTesting confirmation email...")
    try:
        result = send_confirmation_email(
            recipient_email=settings.ADMIN_EMAIL,  # Send to admin for testing
            recipient_name='Test User',
            application_type='contact'
        )
        if result:
            print("✅ Confirmation email sent successfully!")
        else:
            print("⚠️  Confirmation email may have failed (check logs)")
        return result
    except Exception as e:
        print(f"❌ Failed to send confirmation email: {e}")
        return False

def main():
    print("=" * 60)
    print("SMTP EMAIL CONFIGURATION TEST")
    print("=" * 60)
    print(f"\nEmail Backend: {settings.EMAIL_BACKEND}")
    print(f"Email Host: {settings.EMAIL_HOST}")
    print(f"Email Port: {settings.EMAIL_PORT}")
    print(f"Email User: {settings.EMAIL_HOST_USER}")
    print(f"Admin Email: {settings.ADMIN_EMAIL}")
    print(f"From Email: {settings.DEFAULT_FROM_EMAIL}")
    print("\n" + "=" * 60)
    
    # Run tests
    test_basic_email()
    test_application_notification()
    test_confirmation_email()
    
    print("\n" + "=" * 60)
    print("TEST COMPLETED")
    print("=" * 60)
    print("\nCheck your inbox at:", settings.ADMIN_EMAIL)
    print("You should have received 3 test emails.")

if __name__ == '__main__':
    main()
