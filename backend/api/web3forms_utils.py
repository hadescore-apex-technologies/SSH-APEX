"""
Web3Forms integration utility
Sends form data to Web3Forms as backup/secondary notification system
"""
import requests
from django.conf import settings


def send_to_web3forms(form_type, form_data):
    """
    Send form submission to Web3Forms
    
    Args:
        form_type: Type of form (contact, job, enrollment, etc.)
        form_data: Dictionary with form data
    
    Returns:
        Boolean indicating success
    """
    # Web3Forms API endpoint
    WEB3FORMS_URL = "https://api.web3forms.com/submit"
    
    # Get access key from settings (you'll need to add this)
    WEB3FORMS_ACCESS_KEY = getattr(settings, 'WEB3FORMS_ACCESS_KEY', '')
    
    if not WEB3FORMS_ACCESS_KEY:
        print("⚠️  Web3Forms access key not configured")
        return False
    
    try:
        # Prepare payload for Web3Forms
        payload = {
            "access_key": WEB3FORMS_ACCESS_KEY,
            "subject": f"New {form_type.title()} Submission - Hadescore Apex",
            "from_name": "Hadescore Apex Website",
        }
        
        # Add all form data to payload
        payload.update(form_data)
        
        # Add form type identifier
        payload['form_type'] = form_type
        
        # Send to Web3Forms
        response = requests.post(WEB3FORMS_URL, json=payload, timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            if result.get('success'):
                print(f"✅ Form sent to Web3Forms successfully: {form_type}")
                return True
            else:
                print(f"⚠️  Web3Forms returned error: {result.get('message')}")
                return False
        else:
            print(f"⚠️  Web3Forms HTTP error: {response.status_code}")
            return False
            
    except requests.exceptions.Timeout:
        print("⚠️  Web3Forms request timeout")
        return False
    except Exception as e:
        print(f"⚠️  Error sending to Web3Forms: {e}")
        return False


def format_job_application_for_web3forms(application):
    """Format job application for Web3Forms"""
    return {
        "name": application.get('name', 'N/A'),
        "email": application.get('email', 'N/A'),
        "phone": application.get('phone', 'N/A'),
        "linkedin": application.get('linkedin', 'N/A'),
        "position": application.get('role_title', 'N/A'),
        "type": application.get('role_type', 'N/A'),
        "department": application.get('role_dept', 'N/A'),
        "college": application.get('college_name', 'N/A'),
        "degree": application.get('degree', 'N/A'),
        "graduation_year": application.get('graduation_year', 'N/A'),
        "experience": application.get('experience', 'N/A'),
        "availability": application.get('availability', 'N/A'),
        "cover_letter": application.get('cover_letter', 'N/A'),
        "applied_at": application.get('applied_at', 'N/A'),
    }


def format_enrollment_for_web3forms(enrollment):
    """Format course enrollment for Web3Forms"""
    return {
        "name": enrollment.get('name', 'N/A'),
        "email": enrollment.get('user_email', 'N/A'),
        "phone": enrollment.get('phone', 'N/A'),
        "linkedin": enrollment.get('linkedin', 'N/A'),
        "course": enrollment.get('course_name', 'N/A'),
        "category": enrollment.get('course_category', 'N/A'),
        "mode": enrollment.get('mode', 'N/A'),
        "experience": enrollment.get('experience', 'N/A'),
        "message": enrollment.get('message', 'N/A'),
        "enrolled_at": enrollment.get('enrolled_at', 'N/A'),
    }


def format_contact_for_web3forms(contact):
    """Format contact inquiry for Web3Forms"""
    return {
        "name": contact.get('name', 'N/A'),
        "email": contact.get('email', 'N/A'),
        "phone": contact.get('phone', 'N/A'),
        "company": contact.get('company', 'N/A'),
        "subject": contact.get('subject', 'N/A'),
        "message": contact.get('message', 'N/A'),
        "submitted_at": contact.get('created_at', 'N/A'),
    }


def format_project_brief_for_web3forms(brief):
    """Format project brief for Web3Forms"""
    return {
        "name": brief.get('name', 'N/A'),
        "email": brief.get('email', 'N/A'),
        "phone": brief.get('phone', 'N/A'),
        "service": brief.get('service', 'N/A'),
        "budget": brief.get('budget', 'N/A'),
        "message": brief.get('message', 'N/A'),
        "submitted_at": brief.get('submitted_at', 'N/A'),
    }


def format_newsletter_for_web3forms(newsletter):
    """Format newsletter subscription for Web3Forms"""
    return {
        "email": newsletter.get('email', 'N/A'),
        "subscribed_at": newsletter.get('subscribed_at', 'N/A'),
    }
