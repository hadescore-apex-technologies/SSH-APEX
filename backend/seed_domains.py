import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import EduSkillsDomain

domains_data = [
    { 'title': 'AI & Data Science', 'desc': 'Neural networks, ML, GenAI, analytics', 'salary': '8-32 LPA', 'duration': '9 mo', 'badge': 'MOST POPULAR', 'icon': 'brain', 'status': '92% placed', 'order': 1 },
    { 'title': 'Cybersecurity', 'desc': 'Ethical hacking, SOC, forensics', 'salary': '7-28 LPA', 'duration': '8 mo', 'badge': '', 'icon': 'shield', 'status': '94% placed', 'order': 2 },
    { 'title': 'Fullstack Dev', 'desc': 'MERN, APIs, cloud-native apps', 'salary': '6-24 LPA', 'duration': '7 mo', 'badge': '', 'icon': 'code', 'status': '95% placed', 'order': 3 },
    { 'title': 'Robotics & Mechatronics', 'desc': 'Smart factories, automation', 'salary': '6-22 LPA', 'duration': '9 mo', 'badge': '', 'icon': 'gear', 'status': '88% placed', 'order': 4 },
    { 'title': 'Drone Technology', 'desc': 'Mapping, survey, agri-drones', 'salary': '5-18 LPA', 'duration': '6 mo', 'badge': '', 'icon': 'flight', 'status': '97% placed', 'order': 5 },
    { 'title': 'Biotechnology', 'desc': 'Bioinformatics, research labs', 'salary': '5-20 LPA', 'duration': '8 mo', 'badge': '', 'icon': 'biotech', 'status': '85% placed', 'order': 6 },
    { 'title': 'Mechanical', 'desc': 'CAD, simulation, product design', 'salary': '5-18 LPA', 'duration': '7 mo', 'badge': '', 'icon': 'wrench', 'status': '87% placed', 'order': 7 },
    { 'title': 'Civil & Smart City', 'desc': 'BIM, infra, construction tech', 'salary': '5-16 LPA', 'duration': '7 mo', 'badge': '', 'icon': 'building', 'status': '86% placed', 'order': 8 },
    { 'title': 'IoT & Industry 4.0', 'desc': 'Connected systems & sensors', 'salary': '6-20 LPA', 'duration': '6 mo', 'badge': '', 'icon': 'cpu', 'status': '90% placed', 'order': 9 },
    { 'title': 'EV Technology', 'desc': 'Battery tech, e-mobility', 'salary': '6-22 LPA', 'duration': '8 mo', 'badge': 'NEW', 'icon': 'bolt', 'status': '91% placed', 'order': 10 }
]

print('='*80)
print('SEEDING EDUSKILLS DOMAINS')
print('='*80)

for data in domains_data:
    domain, created = EduSkillsDomain.objects.get_or_create(
        title=data['title'],
        defaults=data
    )
    if created:
        print('Created: ' + str(data['title']))
    else:
        print('Already exists: ' + str(data['title']))

print('='*80)
print('DONE!')
print('='*80)
