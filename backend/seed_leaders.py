import django
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import ExecutiveLeader

# Clear existing to ensure a clean state
ExecutiveLeader.objects.all().delete()

leaders = [
    {
        'name': 'Rohit Hadescore',
        'role': 'Founder & CEO',
        'is_founder': True,
        'color_theme': 'cyan',
        'quote': 'India has the talent. India has the ambition. We are here to bridge that gap with world-class engineering, startup incubation, and hands-on talent acceleration. Hadescore Apex is the beginning of a self-sustaining digital era.',
        'stat1_value': '12+',
        'stat1_label': 'YEARS BUILDING',
        'stat2_value': '4',
        'stat2_label': 'VENTURES',
        'stat3_value': '2K+',
        'stat3_label': 'MENTEES',
        'email': 'rohit@hadescore.com',
        'linkedin_url': 'https://linkedin.com/in/rohit-hadescore',
        'order': 1
    },
    {
        'name': 'Anika Verma',
        'role': 'Chief Operations Officer',
        'is_founder': False,
        'color_theme': 'purple',
        'detail': 'Scaling operations, streamlining cross-functional teams, and executing strategic ecosystem initiatives.',
        'email': 'anika@hadescore.com',
        'linkedin_url': 'https://linkedin.com/in/anika-verma',
        'order': 2
    },
    {
        'name': 'Karan Mehta',
        'role': 'Chief Technology Officer',
        'is_founder': False,
        'color_theme': 'green',
        'detail': 'Driving technology strategy, cloud architectures, and next-generation product development platforms.',
        'email': 'karan@hadescore.com',
        'linkedin_url': 'https://linkedin.com/in/karan-mehta',
        'order': 3
    },
    {
        'name': 'Priya Sharma',
        'role': 'Head of Talent Placement',
        'is_founder': False,
        'color_theme': 'pink',
        'detail': 'Bridging the academic-industry gap, leading partner relations, and driving talent placement outcomes.',
        'email': 'priya@hadescore.com',
        'linkedin_url': 'https://linkedin.com/in/priya-sharma',
        'order': 4
    }
]

for l in leaders:
    ExecutiveLeader.objects.create(**l)

print("Successfully seeded leaders!")
