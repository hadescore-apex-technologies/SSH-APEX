import requests

def test_api():
    url = "http://127.0.0.1:8000/api/careers/apply/"
    
    # We will simulate a multipart/form-data upload
    files = {
        'resume': ('test_resume.pdf', b'PDF file content...', 'application/pdf')
    }
    data = {
        'name': 'API Tester',
        'email': 'tester@example.com',
        'phone': '1234567890',
        'linkedin': 'http://linkedin.com/tester',
        'cover_letter': 'Test application',
        'role_title': 'Junior Intern',
        'role_type': 'Internship',
        'role_dept': 'Engineering'
    }
    
    try:
        response = requests.post(url, data=data, files=files)
        print("Status Code:", response.status_code)
        print("Response JSON:", response.text)
    except Exception as e:
        print("Request failed:", e)

if __name__ == '__main__':
    test_api()
