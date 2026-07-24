import os
# pyrefly: ignore [missing-import]
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import Product

products_data = [
    {
        'name': 'Hadescore CRM',
        'tagline': 'Manage Your Leads. Close More Deals.',
        'description': 'A simple yet powerful CRM built for startups and growing businesses to manage contacts, track pipelines, and close faster.',
        'icon': '🏢',
        'color': '#0ea5e9',
        'category': 'CRM',
        'is_active': True,
        'order': 1
    },
    {
        'name': 'Hadescore LMS',
        'tagline': 'Train Your Team. Teach Your Students.',
        'description': 'A full-featured Learning Management System for institutions, trainers, and corporate teams — with course creation, assessments, and certifications built in.',
        'icon': '🎓',
        'color': '#f59e0b',
        'category': 'LMS',
        'is_active': True,
        'order': 2
    },
    {
        'name': 'Hadescore Attend',
        'tagline': 'Smart Attendance. Zero Hassle.',
        'description': 'A modern attendance management platform for colleges and organizations with real-time tracking and reporting.',
        'icon': '📋',
        'color': '#10b981',
        'category': 'SaaS',
        'is_active': True,
        'order': 3
    },
    {
        'name': 'Hadescore AutoAI',
        'tagline': 'Automate the Repetitive. Focus on What Matters.',
        'description': 'AI-powered automation tools to streamline business workflows, reduce manual work, and improve team efficiency.',
        'icon': '🤖',
        'color': '#8b5cf6',
        'category': 'AI/ML',
        'is_active': True,
        'order': 4
    },
    {
        'name': 'Hadescore BizManager',
        'tagline': 'Run Your Business from One Dashboard.',
        'description': 'An all-in-one business management platform for invoicing, project tracking, team management, and client communication.',
        'icon': '💼',
        'color': '#ec4899',
        'category': 'ERP',
        'is_active': True,
        'order': 5
    }
]

print('\n' + '='*80)
print('SEEDING PRODUCTS')
print('='*80 + '\n')

for data in products_data:
    product, created = Product.objects.get_or_create(
        name=data['name'],
        defaults=data
    )
    if created:
        print(f'[Created] {product.name}')
    else:
        print(f'[Already exists] {product.name}')

print('\n' + '='*80)
print(f'DONE! Total products in database: {Product.objects.count()}')
print('='*80 + '\n')
