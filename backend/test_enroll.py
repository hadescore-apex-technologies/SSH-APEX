import requests

def test_enroll():
    url = "http://127.0.0.1:8000/api/enroll/"
    data = {
        'course_name': 'Web Development Domain',
        'course_category': 'EduSkills Domain',
        'name': 'Student Tester',
        'user_email': 'student@example.com',
        'phone': '9876543210',
        'mode': 'online'
    }
    
    try:
        response = requests.post(url, json=data)
        print("Status Code:", response.status_code)
        print("Response JSON:", response.text)
    except Exception as e:
        print("Request failed:", e)

if __name__ == '__main__':
    test_enroll()
