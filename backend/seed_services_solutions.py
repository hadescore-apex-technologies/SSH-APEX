"""
Seed script: populates Service and Solution tables with the original
hardcoded data from ServicesPage.jsx and SolutionsPage.jsx.

Run with:  python seed_services_solutions.py
"""
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import Service, Solution

# ── Services ─────────────────────────────────────────────────────────────────
SERVICES = [
    {
        'title': 'Technology Services',
        'subtitle': 'Build Digital. Build Fast. Build Right.',
        'icon_type': 'web',
        'order': 1,
        'tags': (
            'Website Development (corporate, eCommerce, portfolio, custom)\n'
            'Mobile App Development (Android, iOS, cross-platform)\n'
            'ERP & CRM Solutions\n'
            'UI/UX Design\n'
            'AI Integration Services'
        ),
    },
    {
        'title': 'Digital Marketing',
        'subtitle': 'Get Seen. Get Leads. Get Results.',
        'icon_type': 'marketing',
        'order': 2,
        'tags': (
            'Brand Identity & Strategy\n'
            'Search Engine Optimization (SEO)\n'
            'Social Media Management\n'
            'Performance Marketing (Meta, Google Ads)\n'
            'Content Production & Copywriting'
        ),
    },
    {
        'title': 'AI & Automation',
        'subtitle': 'Work Smarter with Intelligent Systems.',
        'icon_type': 'ai',
        'order': 3,
        'tags': (
            'Business Process Automation\n'
            'AI Chatbots & Virtual Assistants\n'
            'Data Analytics & Reporting\n'
            'Custom AI Tool Integration\n'
            'Predictive Modelling & ML Pipelines'
        ),
    },
    {
        'title': 'Cybersecurity',
        'subtitle': 'Protect What You Build.',
        'icon_type': 'cyber',
        'order': 4,
        'tags': (
            'Security Audits & Vulnerability Assessment\n'
            'Network Security Solutions\n'
            'Data Protection & Compliance\n'
            'Security Awareness Training\n'
            'Penetration Testing & Red Team Ops'
        ),
    },
    {
        'title': 'UI/UX Design',
        'subtitle': 'Design That Converts.',
        'icon_type': 'uiux',
        'order': 5,
        'tags': (
            'Product Wireframing & Prototyping\n'
            'User Research & Testing\n'
            'Mobile & Web UI Design\n'
            'Design System Creation\n'
            'Accessibility & Inclusive Design'
        ),
    },
    {
        'title': 'Cloud & DevOps',
        'subtitle': 'Scalable. Reliable. Automated.',
        'icon_type': 'database',
        'order': 6,
        'tags': (
            'AWS, Azure & GCP Cloud Infrastructure\n'
            'CI/CD Pipelines & DevOps Automation\n'
            'Infrastructure as Code (IaC / Terraform)\n'
            'Docker & Kubernetes Containerization\n'
            '24/7 Monitoring, Alerting & SRE'
        ),
    },
    {
        'title': 'E-Commerce & Retail Tech',
        'subtitle': 'Sell Everywhere. Scale Faster.',
        'icon_type': 'RET',
        'order': 7,
        'tags': (
            'Custom E-Commerce Architectures & Backends\n'
            'Shopify, WooCommerce & Magento Integrations\n'
            'Payment Gateway & POS Sync Setup\n'
            'Inventory, Warehousing & Order APIs\n'
            'Conversion Rate Optimization (CRO) Audits'
        ),
    },
    {
        'title': 'IoT & Embedded Systems',
        'subtitle': 'Connecting Hardware to the Cloud.',
        'icon_type': 'cpu',
        'order': 8,
        'tags': (
            'Firmware & Microcontroller Programming\n'
            'Telemetry & Sensor Data Ingestion\n'
            'Embedded C/C++ & FreeRTOS Development\n'
            'Edge Computing & Embedded AI Analytics\n'
            'Smart Automations & IoT Integrations'
        ),
    },
    {
        'title': 'Mobile App Development',
        'subtitle': 'Build Native. Build Cross-Platform.',
        'icon_type': 'mobile',
        'order': 9,
        'tags': (
            'iOS & Android Native Development\n'
            'Flutter & React Native Cross-Platform Apps\n'
            'App Store Submission & Optimisation\n'
            'Push Notifications & Real-Time Sync\n'
            'App Maintenance & Version Updates'
        ),
    },
    {
        'title': 'Startup Incubation',
        'subtitle': 'From Idea to Funded Startup.',
        'icon_type': 'incubate',
        'order': 10,
        'tags': (
            'MVP Development & Go-To-Market Strategy\n'
            'Investor Deck & Financial Modelling\n'
            'Company Registration & Legal Compliance\n'
            'Mentorship from Industry Experts\n'
            'Fundraising & Incubator Network Access'
        ),
    },
    {
        'title': 'Talent Acceleration',
        'subtitle': 'Upskill Your Team. Hire Ready Talent.',
        'icon_type': 'recruitment',
        'order': 11,
        'tags': (
            'Corporate Tech Training Programs\n'
            'Campus Placement Partnerships\n'
            'Internship & Apprenticeship Programs\n'
            'Skill Gap Assessments & Roadmaps\n'
            'Industry-Certified Bootcamps'
        ),
    },
    {
        'title': 'Internship Programs',
        'subtitle': 'Bridge the Gap Between Campus & Corporate.',
        'icon_type': 'internship',
        'order': 12,
        'tags': (
            'Real-Time Industry Project Exposure\n'
            'Professional Development & Code Audits\n'
            'Web & App Development Practice\n'
            'AI, Machine Learning & SOC Operations\n'
            '1-on-1 Mentorship & Career Guidance\n'
            'Certified Coursework & Recommendations'
        ),
    },
    {
        'title': 'Trading & FinTech Solutions',
        'subtitle': 'Automate Your Strategy. Maximize Market Edge.',
        'icon_type': 'trading',
        'order': 13,
        'tags': (
            'Algorithmic Trading Systems & Bot Development\n'
            'Quantitative Finance & Backtesting Frameworks\n'
            'Stock Market & Crypto Analysis Tools\n'
            'Live Market Data Feeds & WebSocket Integrations\n'
            'Risk Management & Portfolio Optimizers\n'
            'Secure Gateway & Broker API Integrations'
        ),
    },
    {
        'title': 'Web3 & Blockchain Systems',
        'subtitle': 'Decentralized. Secure. Future-Proof.',
        'icon_type': 'web3',
        'order': 14,
        'tags': (
            'Smart Contract Development & Security Audits\n'
            'Decentralized Applications (DApps) & Protocols\n'
            'Tokenomics Design & Token Launch Consulting\n'
            'Custom Blockchain Networks & Sidechains\n'
            'NFT Smart Contracts & IPFS Solutions\n'
            'Web3 Wallet & Gateway Integrations'
        ),
    },
]

# ── Solutions ─────────────────────────────────────────────────────────────────
SOLUTIONS = [
    {
        'title': 'For Startups',
        'subtitle': 'Launch Fast. Scale Smart.',
        'icon_type': 'incubate',
        'accent_color': '#0ea5e9',
        'order': 1,
        'tags': (
            'MVP Website or App Development\n'
            'Brand Identity Setup\n'
            'Digital Marketing Launch Package\n'
            'AI Tool Integration\n'
            'Mentorship & Incubation Support'
        ),
    },
    {
        'title': 'For SMBs',
        'subtitle': 'Grow Your Business Online.',
        'icon_type': 'growth',
        'accent_color': '#10b981',
        'order': 2,
        'tags': (
            'Business Website or eCommerce Platform\n'
            'CRM & ERP Setup\n'
            'Social Media & SEO\n'
            'Automation Tools\n'
            'Recruitment Support'
        ),
    },
    {
        'title': 'For Institutions',
        'subtitle': 'Bridge Campus and Industry.',
        'icon_type': 'EDU',
        'accent_color': '#f59e0b',
        'order': 3,
        'tags': (
            'Internship Programs for Students\n'
            'Technical Workshops & Seminars\n'
            'MOU Partnerships\n'
            'Training & Certification Programs\n'
            'Campus Placement Collaboration'
        ),
    },
    {
        'title': 'For Enterprises',
        'subtitle': 'Transform. Automate. Lead.',
        'icon_type': 'FIN',
        'accent_color': '#8b5cf6',
        'order': 4,
        'tags': (
            'Custom Software Development\n'
            'AI & Data Analytics Solutions\n'
            'Cybersecurity Services\n'
            'Digital Transformation Consulting\n'
            'Dedicated Tech Team'
        ),
    },
    {
        'title': 'For Healthcare',
        'subtitle': 'Secure. Compliant. Patient-First.',
        'icon_type': 'HLT',
        'accent_color': '#ef4444',
        'order': 5,
        'tags': (
            'Patient Records & EHR Systems\n'
            'Telemedicine Platform Development\n'
            'HIPAA-Compliant Data Handling\n'
            'Diagnostic & Imaging Portals\n'
            'Hospital Management Software'
        ),
    },
    {
        'title': 'For Manufacturing',
        'subtitle': 'Automate the Factory Floor.',
        'icon_type': 'MFG',
        'accent_color': '#f97316',
        'order': 6,
        'tags': (
            'IoT-Enabled Factory Monitoring\n'
            'Predictive Maintenance Systems\n'
            'Supply Chain & Inventory APIs\n'
            'Quality Control Automation\n'
            'ERP Integration & Dashboards'
        ),
    },
]

def seed():
    created_s = 0
    for data in SERVICES:
        obj, created = Service.objects.get_or_create(title=data['title'], defaults=data)
        if created:
            created_s += 1
        else:
            # Update existing
            for k, v in data.items():
                setattr(obj, k, v)
            obj.save()
    print(f'Services: {created_s} created, {len(SERVICES) - created_s} updated.')

    created_sol = 0
    for data in SOLUTIONS:
        obj, created = Solution.objects.get_or_create(title=data['title'], defaults=data)
        if created:
            created_sol += 1
        else:
            for k, v in data.items():
                setattr(obj, k, v)
            obj.save()
    print(f'Solutions: {created_sol} created, {len(SOLUTIONS) - created_sol} updated.')

if __name__ == '__main__':
    seed()
