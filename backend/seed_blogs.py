import os
import django
import urllib.request
from datetime import datetime

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import BlogPost

MOCK_POSTS = [
    {
        'slug': 'unlocking-hyper-growth-ai-automation',
        'title': 'Unlocking Hyper-Growth: The Power of AI & Automation for Modern Enterprises',
        'author': 'Aravind Swaminathan',
        'published_at': '2026-06-15T10:00:00Z',
        'image_url': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        'filename': 'ai_automation.jpg',
        'content': 'Discover how workflow automation and predictive models are driving dramatic efficiency improvements and defining the future of business operations.'
    },
    {
        'slug': 'architecting-resilient-cloud-infrastructure',
        'title': 'Architecting Resilient Cloud Infrastructure: A Deep-Dive into DevOps Best Practices',
        'author': 'Karthik Raja',
        'published_at': '2026-06-08T10:00:00Z',
        'image_url': 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=800&q=80',
        'filename': 'cloud_devops.jpg',
        'content': 'Learn the core methodologies behind container orchestration, zero-downtime deployments, and infrastructure-as-code for scaling web applications.'
    },
    {
        'slug': 'mastering-ui-ux-design-spatial-computing',
        'title': 'Mastering UI/UX in 2026: Designing for Spatial Computing & Immersive Web',
        'author': 'Deepika Sen',
        'published_at': '2026-05-24T10:00:00Z',
        'image_url': 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
        'filename': 'ui_ux_spatial.jpg',
        'content': 'An in-depth look at designing interfaces for immersive devices, glassmorphic layout models, and micro-interactions that captivate modern audiences.'
    }
]

def seed():
    media_blog_dir = os.path.join('media', 'blog')
    os.makedirs(media_blog_dir, exist_ok=True)
    
    # Delete the previous seed attempts
    print("Deleting previous empty-cover blog posts...")
    BlogPost.objects.all().delete()
    
    for p in MOCK_POSTS:
        img_path = os.path.join(media_blog_dir, p['filename'])
        # Download cover image using a browser User-Agent to prevent unsplash 403/404 errors
        try:
            print(f"Downloading cover image for {p['slug']}...")
            req = urllib.request.Request(
                p['image_url'], 
                headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36'}
            )
            with urllib.request.urlopen(req) as response, open(img_path, 'wb') as out_file:
                out_file.write(response.read())
            cover_image_val = f"blog/{p['filename']}"
            print("Download successful!")
        except Exception as e:
            print(f"Failed to download image {p['image_url']}: {e}")
            cover_image_val = None
            
        # Create BlogPost
        post = BlogPost(
            title=p['title'],
            slug=p['slug'],
            content=p['content'],
            author=p['author'],
            cover_image=cover_image_val,
            is_published=True,
            published_at=datetime.fromisoformat(p['published_at'].replace('Z', '+00:00'))
        )
        post.save()
        print(f"Created post: {p['title']}")

if __name__ == '__main__':
    seed()
