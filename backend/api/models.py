# pyrefly: ignore [missing-import]
from django.db import models
# pyrefly: ignore [missing-import]
from django.utils import timezone

class ContactInquiry(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    status = models.CharField(max_length=20, default='pending', choices=[('pending', 'Pending'), ('reviewed', 'Reviewed'), ('contacted', 'Contacted'), ('rejected', 'Rejected')])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.email}"


class Contact(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    company = models.CharField(max_length=200, blank=True)
    subject = models.CharField(max_length=300)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    status = models.CharField(max_length=20, default='pending', choices=[('pending', 'Pending'), ('reviewed', 'Reviewed'), ('contacted', 'Contacted'), ('rejected', 'Rejected')])
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.subject}"


class Career(models.Model):
    title = models.CharField(max_length=200)
    location = models.CharField(max_length=100)
    type = models.CharField(max_length=50)
    experience = models.CharField(max_length=100)
    description = models.TextField()
    requirements = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class JobApplication(models.Model):
    job = models.ForeignKey(Career, on_delete=models.CASCADE, related_name='applications', null=True, blank=True)
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    linkedin = models.URLField(blank=True)
    experience = models.CharField(max_length=100, blank=True)
    college_name = models.CharField(max_length=200, blank=True)
    degree = models.CharField(max_length=200, blank=True)
    graduation_year = models.CharField(max_length=20, blank=True)
    availability = models.CharField(max_length=100, blank=True)
    cover_letter = models.TextField(blank=True)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    # Direct application fields (no FK required)
    role_title = models.CharField(max_length=200, blank=True)
    role_type = models.CharField(max_length=50, blank=True)
    role_dept = models.CharField(max_length=100, blank=True)
    is_read = models.BooleanField(default=False)
    status = models.CharField(max_length=20, default='pending', choices=[('pending', 'Pending'), ('reviewed', 'Reviewed'), ('contacted', 'Contacted'), ('rejected', 'Rejected')])
    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-applied_at']

    def __str__(self):
        title = self.role_title or (self.job.title if self.job else 'Unknown')
        return f"{self.name} - {title}"


class InternshipApplication(JobApplication):
    class Meta:
        proxy = True
        verbose_name = "Internship Application"
        verbose_name_plural = "Internship Applications"


class RegularJobApplication(JobApplication):
    class Meta:
        proxy = True
        verbose_name = "Job Application"
        verbose_name_plural = "Job Applications"


class Course(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=100)
    level = models.CharField(max_length=50)
    duration = models.CharField(max_length=50)
    lessons = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    icon = models.CharField(max_length=50, blank=True)
    color = models.CharField(max_length=20, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Enrollment(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments', null=True, blank=True)
    # Direct enrollment (no DB course FK required)
    course_name = models.CharField(max_length=200, blank=True)
    course_category = models.CharField(max_length=100, blank=True)
    name = models.CharField(max_length=200, blank=True)
    user_email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    linkedin = models.URLField(blank=True)
    experience = models.CharField(max_length=100, blank=True)
    message = models.TextField(blank=True)
    resume = models.FileField(upload_to='enroll_resumes/', blank=True, null=True)
    mode = models.CharField(max_length=20, default='online')
    enrolled_at = models.DateTimeField(auto_now_add=True)
    progress = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
    is_read = models.BooleanField(default=False)
    status = models.CharField(max_length=20, default='pending', choices=[('pending', 'Pending'), ('reviewed', 'Reviewed'), ('contacted', 'Contacted'), ('rejected', 'Rejected')])

    class Meta:
        ordering = ['-enrolled_at']

    def __str__(self):
        title = self.course_name or (self.course.title if self.course else 'Unknown')
        return f"{self.user_email} - {title}"


class Newsletter(models.Model):
    email = models.EmailField(unique=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    is_read = models.BooleanField(default=False)
    status = models.CharField(max_length=20, default='pending', choices=[('pending', 'Pending'), ('reviewed', 'Reviewed'), ('contacted', 'Contacted'), ('rejected', 'Rejected')])

    class Meta:
        ordering = ['-subscribed_at']

    def __str__(self):
        return self.email


class ProjectBrief(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    service = models.CharField(max_length=200)
    budget = models.CharField(max_length=100)
    message = models.TextField(blank=True)
    is_read = models.BooleanField(default=False)
    status = models.CharField(max_length=20, default='pending', choices=[('pending', 'Pending'), ('reviewed', 'Reviewed'), ('contacted', 'Contacted'), ('rejected', 'Rejected')])
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-submitted_at']

    def __str__(self):
        return f"{self.name} — {self.service}"

class ExecutiveLeader(models.Model):
    COLOR_CHOICES = [
        ('cyan', 'Cyan Glow'),
        ('purple', 'Purple Glow'),
        ('green', 'Green Glow'),
        ('pink', 'Pink/Magenta Glow'),
        ('blue', 'Blue Glow'),
    ]

    name = models.CharField(max_length=200)
    role = models.CharField(max_length=200)
    is_founder = models.BooleanField(default=False, help_text='Whether this person is the founder')
    initials = models.CharField(max_length=10, blank=True, help_text='Initials (e.g. RH). Will auto-compute if blank.')
    color_theme = models.CharField(max_length=20, choices=COLOR_CHOICES, default='cyan')
    
    # Founder-specific fields
    quote = models.TextField(blank=True, help_text='Founder quote or detail statement')
    stat1_value = models.CharField(max_length=50, blank=True, help_text='e.g. 12+')
    stat1_label = models.CharField(max_length=100, blank=True, help_text='e.g. YEARS BUILDING')
    stat2_value = models.CharField(max_length=50, blank=True, help_text='e.g. 4')
    stat2_label = models.CharField(max_length=100, blank=True, help_text='e.g. VENTURES')
    stat3_value = models.CharField(max_length=50, blank=True, help_text='e.g. 2K+')
    stat3_label = models.CharField(max_length=100, blank=True, help_text='e.g. MENTEES')
    
    # Existing fields
    detail = models.CharField(max_length=300, blank=True)
    image = models.ImageField(upload_to='leaders/', blank=True, null=True)
    linkedin_url = models.URLField(blank=True, help_text='LinkedIn profile URL')
    portfolio_url = models.URLField(blank=True, help_text='Portfolio website URL')
    email = models.EmailField(blank=True, default='', help_text='Contact email address')
    domain = models.ForeignKey('EduSkillsDomain', on_delete=models.SET_NULL, null=True, blank=True, help_text='Associated placement domain')
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'id']

    def save(self, *args, **kwargs):
        if not self.initials and self.name:
            parts = self.name.split()
            self.initials = "".join([p[0].upper() for p in parts if p][:2])
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({'Founder' if self.is_founder else 'Leader'})"


class Service(models.Model):
    """Admin-manageable service card displayed on the Services page."""
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=300, blank=True)
    icon_type = models.CharField(
        max_length=50, default='web',
        help_text='Icon key — matches CardIcon component types (web, marketing, ai, cyber, uiux, database, cpu, RET, mobile, incubate, growth, seo, social, recruitment, FIN, SUP, HLT, MFG, EDU)'
    )
    tags = models.TextField(
        blank=True,
        help_text='One tag per line. Each line becomes a bullet point on the card.'
    )
    order = models.IntegerField(default=0, help_text='Display order (lower = first)')
    is_active = models.BooleanField(default=True, help_text='Show on public website')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'id']

    def get_tags_list(self):
        return [t.strip() for t in self.tags.splitlines() if t.strip()]

    def __str__(self):
        return self.title


class Solution(models.Model):
    """Admin-manageable solution card displayed on the Solutions page."""
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=300, blank=True)
    icon_type = models.CharField(
        max_length=50, default='incubate',
        help_text='Icon key — matches CardIcon component types'
    )
    accent_color = models.CharField(
        max_length=20, default='#0ea5e9',
        help_text='Hex colour for the card accent (e.g. #0ea5e9)'
    )
    tags = models.TextField(
        blank=True,
        help_text='One tag per line. Each line becomes a bullet point on the card.'
    )
    order = models.IntegerField(default=0, help_text='Display order (lower = first)')
    is_active = models.BooleanField(default=True, help_text='Show on public website')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'id']

    def get_tags_list(self):
        return [t.strip() for t in self.tags.splitlines() if t.strip()]

    def __str__(self):
        return self.title


class Product(models.Model):
    name = models.CharField(max_length=200)
    tagline = models.CharField(max_length=300)
    description = models.TextField()
    icon = models.CharField(max_length=10, blank=True, help_text='Emoji or short text icon, e.g. 🚀')
    color = models.CharField(max_length=20, default='#4f9cff')
    category = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    is_coming_soon = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.name


class ApexItem(models.Model):
    SECTION_CHOICES = [
        ('hero', 'Hero'),
        ('stats', 'Stats'),
        ('labs', 'Innovation Labs'),
        ('programs', 'Startup Programs'),
        ('portfolio', 'Portfolio'),
        ('research', 'Research'),
        ('events', 'Events'),
        ('cta', 'CTA / Apply'),
    ]

    section = models.CharField(max_length=30, choices=SECTION_CHOICES, default='hero')
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=300, blank=True)
    description = models.TextField(blank=True)
    tags = models.CharField(max_length=300, blank=True)
    icon = models.CharField(max_length=50, blank=True)
    extra = models.CharField(max_length=200, blank=True)
    link = models.CharField(max_length=500, blank=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['section', 'order', '-created_at']

    def __str__(self):
        return f"{self.section} - {self.title}"


class EduSkillsDomain(models.Model):
    title = models.CharField(max_length=200)
    desc = models.CharField(max_length=300)
    salary = models.CharField(max_length=100, help_text="e.g. ₹14 LPA avg")
    status = models.CharField(max_length=100, help_text="e.g. 92% placed")
    duration = models.CharField(max_length=50, blank=True, default='', help_text="e.g. 9 mo")
    badge = models.CharField(max_length=50, blank=True, default='', help_text="e.g. MOST POPULAR")
    icon = models.CharField(max_length=50, blank=True, default='code', help_text="e.g. brain, shield, code, gear, flight, biotech, wrench, building, cpu, bolt")
    category = models.CharField(max_length=100, blank=True, default='', help_text="e.g. AI / ML, Fullstack, Cyber - Used to match mentors")
    details_json = models.TextField(blank=True, default='', help_text="Detailed subpage JSON structure override.")
    curriculum_image = models.ImageField(upload_to='curriculum/', blank=True, null=True, help_text="Curriculum image file that users can download.")
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return self.title


class EduSkillsMentor(models.Model):
    name = models.CharField(max_length=200)
    role = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    exp = models.CharField(max_length=50, help_text="e.g. 14 yrs")
    tag = models.CharField(max_length=100, help_text="e.g. AI / ML")
    initial = models.CharField(max_length=10, blank=True, help_text="e.g. AM. Left blank, dynamically computed.")
    email = models.EmailField(blank=True, default='', help_text="Contact email address")
    domain = models.ForeignKey(EduSkillsDomain, on_delete=models.SET_NULL, null=True, blank=True, help_text='Associated placement domain')
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'id']

    def save(self, *args, **kwargs):
        if not self.initial and self.name:
            parts = self.name.split()
            self.initial = "".join([p[0].upper() for p in parts if p][:2])
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class EduSkillsProject(models.Model):
    name = models.CharField(max_length=200)
    complexity = models.CharField(max_length=100, help_text="e.g. Advanced, Pro, Intermediate")
    duration = models.CharField(max_length=100, help_text="e.g. 8 weeks")
    desc = models.TextField()
    stack = models.CharField(max_length=300, help_text="Comma-separated technologies, e.g. Python, LangChain, FastAPI")
    mentor = models.CharField(max_length=200, blank=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return self.name


class EduSkillsTrack(models.Model):
    title = models.CharField(max_length=200)
    duration = models.CharField(max_length=100, help_text="e.g. 3 months")
    price = models.CharField(max_length=100, help_text="e.g. ₹19,999")
    popular = models.BooleanField(default=False)
    desc = models.TextField()
    features = models.TextField(help_text="Comma-separated or newline-separated features")
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return self.title


class BlogPost(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    content = models.TextField()
    cover_image = models.ImageField(upload_to='blog/', blank=True, null=True)
    author = models.CharField(max_length=150, default='Admin')
    is_published = models.BooleanField(default=True)
    github_url = models.URLField(blank=True, default='')
    live_url = models.URLField(blank=True, default='')
    published_at = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-published_at', '-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            # pyrefly: ignore [missing-import]
            from django.utils.text import slugify
            base_slug = slugify(self.title) or "post"
            slug = base_slug
            counter = 1
            qs = BlogPost.objects.all()
            if self.pk:
                qs = qs.exclude(pk=self.pk)
            while qs.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Testimonial(models.Model):
    name = models.CharField(max_length=200)
    role = models.CharField(max_length=200)
    company = models.CharField(max_length=200, blank=True)
    review_text = models.TextField()
    rating = models.IntegerField(default=5)
    avatar = models.ImageField(upload_to='testimonials/', blank=True, null=True)
    is_approved = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return f"{self.name} - {self.company}"


class SEOSetting(models.Model):
    page_name = models.CharField(max_length=100, unique=True, help_text="e.g. home, solutions, services, etc.")
    title = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    keywords = models.CharField(max_length=500, blank=True, help_text="Comma-separated keywords")
    og_image = models.ImageField(upload_to='seo/', blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.page_name


class ChatbotFeedback(models.Model):
    session_id = models.CharField(max_length=100)
    message = models.TextField()
    user_query = models.TextField(blank=True)
    feedback = models.CharField(max_length=20, choices=[('helpful', 'Helpful'), ('not_helpful', 'Not Helpful')])
    timestamp = models.DateTimeField(auto_now_add=True)
    user_email = models.EmailField(blank=True, null=True)
    
    class Meta:
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.feedback} - {self.timestamp.strftime('%Y-%m-%d %H:%M')}"


class ChatbotAnalytics(models.Model):
    date = models.DateField(auto_now_add=True)
    total_queries = models.IntegerField(default=0)
    successful_responses = models.IntegerField(default=0)
    failed_responses = models.IntegerField(default=0)
    avg_response_time = models.FloatField(default=0.0)
    top_intents = models.JSONField(default=dict, blank=True)
    unique_sessions = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-date']
    
    def __str__(self):
        return f"Analytics - {self.date}"


class Certificate(models.Model):
    """A certificate stored in the secure registry."""
    certificate_id = models.CharField(max_length=100, unique=True, db_index=True)
    student_name = models.CharField(max_length=200)
    course_name = models.CharField(max_length=200)
    issue_date = models.CharField(max_length=100) # Simple text date or DateField
    grade = models.CharField(max_length=100, blank=True)
    certificate_photo = models.FileField(upload_to='certificates/', blank=True, null=True)
    blockchain_block = models.CharField(max_length=100, blank=True, default='#1,902,482')
    tx_hash = models.CharField(max_length=200, blank=True, default='0x4a9d7b23c2ef5c10b981ec4899f8be78b5cf6a27')
    smart_contract = models.CharField(max_length=200, blank=True, default='0x00e5ff8b5cf6ec489910b981f59e0b4f9cffbf5c')
    issuer = models.CharField(max_length=200, default='Hadescore Apex & Technologies Certification Board')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.certificate_id} - {self.student_name}"
