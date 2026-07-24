"""
Email notification utilities for Hadescore Apex
Includes Gmail SMTP and Web3Forms cloud backup
"""
from django.core.mail import send_mail, EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import requests
import json


def send_to_web3forms(application_type, application_data):
    """
    Send application data to Web3Forms as cloud backup
    
    Args:
        application_type: Type of application
        application_data: Dictionary with application details
    
    Returns:
        bool: True if successful, False otherwise
    """
    
    # Web3Forms API endpoint
    WEB3FORMS_URL = 'https://api.web3forms.com/submit'
    WEB3FORMS_ACCESS_KEY = getattr(settings, 'WEB3FORMS_ACCESS_KEY', '')
    
    # Skip if no access key configured
    if not WEB3FORMS_ACCESS_KEY or WEB3FORMS_ACCESS_KEY == 'YOUR_WEB3FORMS_ACCESS_KEY':
        print("⚠️  Web3Forms not configured (skipping cloud backup)")
        return False
    
    # Format data for Web3Forms
    form_data = {
        'access_key': WEB3FORMS_ACCESS_KEY,
        'subject': f'[{application_type.upper()}] New Application - Hadescore Apex',
        'from_name': 'Hadescore Apex Website',
        'redirect': 'false',  # Don't redirect, return JSON
    }
    
    # Add all application data to form
    for key, value in application_data.items():
        if value and key not in ['resume', 'resume_url']:  # Skip file fields
            form_data[key] = str(value)
    
    # Add application type
    form_data['application_type'] = application_type
    
    try:
        response = requests.post(WEB3FORMS_URL, data=form_data, timeout=10)
        if response.status_code == 200:
            result = response.json()
            if result.get('success'):
                print(f"✅ Web3Forms backup successful for {application_type}")
                return True
            else:
                print(f"⚠️  Web3Forms returned error: {result.get('message')}")
                return False
        else:
            print(f"⚠️  Web3Forms API error: Status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Web3Forms backup failed: {e}")
        return False


def send_application_notification(application_type, application_data):
    """
    Send email notification when a new application is submitted
    
    Args:
        application_type: 'job', 'enrollment', 'contact', 'newsletter', 'project_brief'
        application_data: Dictionary with application details
    """
    
    subject_map = {
        'job': f'New Job Application: {application_data.get("name", "Unknown")}',
        'enrollment': f'New Course Enrollment: {application_data.get("name", "Unknown")}',
        'contact': f'New Contact Inquiry: {application_data.get("name", "Unknown")}',
        'newsletter': f'New Newsletter Subscription: {application_data.get("email", "Unknown")}',
        'project_brief': f'New Project Brief: {application_data.get("name", "Unknown")}'
    }
    
    subject = subject_map.get(application_type, 'New Application Received')
    
    # Create email body
    if application_type == 'job':
        message = f"""
New Job Application Received!

Applicant Details:
------------------
Name: {application_data.get('name', 'N/A')}
Email: {application_data.get('email', 'N/A')}
Phone: {application_data.get('phone', 'N/A')}
LinkedIn: {application_data.get('linkedin', 'N/A')}

Position Applied For:
--------------------
Role: {application_data.get('role_title', 'N/A')}
Type: {application_data.get('role_type', 'N/A')}
Department: {application_data.get('role_dept', 'N/A')}

Education:
---------
College: {application_data.get('college_name', 'N/A')}
Degree: {application_data.get('degree', 'N/A')}
Graduation Year: {application_data.get('graduation_year', 'N/A')}

Experience: {application_data.get('experience', 'N/A')}
Availability: {application_data.get('availability', 'N/A')}

Cover Letter:
-------------
{application_data.get('cover_letter', 'N/A')}

Resume: {application_data.get('resume_url', 'Attached' if application_data.get('resume') else 'Not provided')}

Applied at: {application_data.get('applied_at', 'N/A')}

---
Please review this application in the admin panel.
"""

    elif application_type == 'enrollment':
        message = f"""
New Course Enrollment Received!

Student Details:
---------------
Name: {application_data.get('name', 'N/A')}
Email: {application_data.get('user_email', 'N/A')}
Phone: {application_data.get('phone', 'N/A')}
LinkedIn: {application_data.get('linkedin', 'N/A')}

Course Information:
------------------
Course: {application_data.get('course_name', 'N/A')}
Category: {application_data.get('course_category', 'N/A')}
Mode: {application_data.get('mode', 'N/A')}

Experience Level: {application_data.get('experience', 'N/A')}

Message:
--------
{application_data.get('message', 'N/A')}

Resume: {application_data.get('resume_url', 'Attached' if application_data.get('resume') else 'Not provided')}

Enrolled at: {application_data.get('enrolled_at', 'N/A')}

---
Please review this enrollment in the admin panel.
"""

    elif application_type == 'contact':
        message = f"""
New Contact Inquiry Received!

Contact Details:
---------------
Name: {application_data.get('name', 'N/A')}
Email: {application_data.get('email', 'N/A')}
Phone: {application_data.get('phone', 'N/A')}
Company: {application_data.get('company', 'N/A')}

Subject: {application_data.get('subject', 'N/A')}

Message:
--------
{application_data.get('message', 'N/A')}

Submitted at: {application_data.get('created_at', 'N/A')}

---
Please respond to this inquiry from the admin panel.
"""

    elif application_type == 'newsletter':
        message = f"""
New Newsletter Subscription!

Email: {application_data.get('email', 'N/A')}
Subscribed at: {application_data.get('subscribed_at', 'N/A')}

---
Add this subscriber to your newsletter mailing list.
"""

    elif application_type == 'project_brief':
        message = f"""
New Project Brief Submitted!

Client Details:
--------------
Name: {application_data.get('name', 'N/A')}
Email: {application_data.get('email', 'N/A')}
Phone: {application_data.get('phone', 'N/A')}

Project Information:
-------------------
Service: {application_data.get('service', 'N/A')}
Budget: {application_data.get('budget', 'N/A')}

Project Details:
---------------
{application_data.get('message', 'N/A')}

Submitted at: {application_data.get('submitted_at', 'N/A')}

---
Please review this project brief in the admin panel.
"""

    else:
        message = f"New application received: {application_data}"
    
    # Send to Web3Forms as cloud backup
    web3forms_success = send_to_web3forms(application_type, application_data)
    
    try:
        # Send email to admin via SMTP
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.ADMIN_EMAIL],
            fail_silently=False,
        )
        print(f"✅ Email notification sent for {application_type}")
        return True
    except Exception as e:
        print(f"❌ Error sending email: {e}")
        # Even if email fails, Web3Forms backup might have succeeded
        return web3forms_success


def send_confirmation_email(recipient_email, recipient_name, application_type):
    """
    Send confirmation email to applicant
    
    Args:
        recipient_email: Email of the applicant
        recipient_name: Name of the applicant
        application_type: Type of application
    """
    
    subject = "Application Received - Hadescore Apex & Technologies"
    
    message = f"""
Dear {recipient_name},

Thank you for your application! We have successfully received your submission.

Our team will review your application and get back to you within 2-3 business days.

If you have any questions, feel free to reach out to us at:
Email: hadescore.apex.technologies@gmail.com
Phone: +91 9790080274

Best regards,
Hadescore Apex & Technologies Team
Bengaluru, Karnataka, India
"""
    
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient_email],
            fail_silently=True,  # Don't fail if confirmation email fails
        )
        return True
    except Exception as e:
        print(f"Error sending confirmation email: {e}")
        return False
