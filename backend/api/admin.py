from django.contrib import admin
from .models import (
    ContactInquiry, Contact, Career, JobApplication, InternshipApplication, RegularJobApplication, Course, Enrollment, 
    Newsletter, ProjectBrief, Product, ExecutiveLeader,
    EduSkillsMentor, EduSkillsDomain, EduSkillsProject, EduSkillsTrack,
    ApexItem, BlogPost, Testimonial, SEOSetting, Certificate
)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'is_active', 'order', 'created_at']
    search_fields = ['name', 'tagline', 'category']
    list_filter = ['is_active', 'category', 'created_at']
    readonly_fields = ['created_at']


@admin.register(ExecutiveLeader)
class ExecutiveLeaderAdmin(admin.ModelAdmin):
    list_display = ['name', 'role', 'is_founder', 'color_theme', 'email', 'linkedin_url', 'order', 'created_at']
    search_fields = ['name', 'role', 'email']
    list_filter = ['is_founder', 'color_theme', 'created_at']
    readonly_fields = ['created_at']
    fields = [
        'name', 'role', 'is_founder', 'initials', 'color_theme', 
        'quote', 'stat1_value', 'stat1_label', 'stat2_value', 'stat2_label', 'stat3_value', 'stat3_label',
        'detail', 'image', 'linkedin_url', 'email', 'order', 'created_at'
    ]


@admin.register(ContactInquiry)
class ContactInquiryAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'created_at']
    search_fields = ['name', 'email']
    list_filter = ['created_at']

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'created_at']
    search_fields = ['name', 'email', 'subject']
    list_filter = ['created_at']
    readonly_fields = ['created_at']

@admin.register(Career)
class CareerAdmin(admin.ModelAdmin):
    list_display = ['title', 'location', 'type', 'experience', 'is_active', 'created_at']
    search_fields = ['title', 'location']
    list_filter = ['type', 'is_active', 'created_at']
    readonly_fields = ['created_at']

@admin.register(InternshipApplication)
class InternshipApplicationAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'phone', 'role_title', 'college_name', 'availability', 'experience', 'resume', 'applied_at']
    search_fields = ['name', 'email', 'role_title', 'role_dept']
    list_filter = ['applied_at', 'role_dept']
    readonly_fields = ['applied_at']

    def get_queryset(self, request):
        return super().get_queryset(request).filter(role_type__icontains='intern')


@admin.register(RegularJobApplication)
class RegularJobApplicationAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'phone', 'role_title', 'experience', 'resume', 'applied_at']
    search_fields = ['name', 'email', 'role_title', 'role_dept']
    list_filter = ['applied_at', 'role_dept']
    readonly_fields = ['applied_at']

    def get_queryset(self, request):
        return super().get_queryset(request).exclude(role_type__icontains='intern')

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'level', 'price', 'is_active', 'created_at']
    search_fields = ['title', 'category']
    list_filter = ['category', 'level', 'is_active', 'created_at']
    readonly_fields = ['created_at']

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'user_email', 'phone', 'course_title_display', 'mode', 'enrolled_at']
    search_fields = ['name', 'user_email', 'course_name', 'course__title', 'phone']
    list_filter = ['mode', 'completed', 'enrolled_at']
    readonly_fields = ['enrolled_at']

    def course_title_display(self, obj):
        return obj.course_name or (obj.course.title if obj.course else 'Unknown')
    course_title_display.short_description = 'Course/Domain'

@admin.register(Newsletter)
class NewsletterAdmin(admin.ModelAdmin):
    list_display = ['email', 'is_active', 'subscribed_at']
    search_fields = ['email']
    list_filter = ['is_active', 'subscribed_at']
    readonly_fields = ['subscribed_at']

@admin.register(ProjectBrief)
class ProjectBriefAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'service', 'budget', 'submitted_at']
    search_fields = ['name', 'email', 'service']
    list_filter = ['service', 'budget', 'submitted_at']
    readonly_fields = ['submitted_at']


@admin.register(EduSkillsMentor)
class EduSkillsMentorAdmin(admin.ModelAdmin):
    list_display = ['name', 'role', 'company', 'tag', 'order', 'is_active']
    search_fields = ['name', 'role', 'company', 'tag']
    list_filter = ['is_active', 'tag']


@admin.register(EduSkillsDomain)
class EduSkillsDomainAdmin(admin.ModelAdmin):
    list_display = ['title', 'salary', 'status', 'order', 'is_active']
    search_fields = ['title', 'salary', 'status']
    list_filter = ['is_active']


@admin.register(EduSkillsProject)
class EduSkillsProjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'complexity', 'duration', 'mentor', 'order', 'is_active']
    search_fields = ['name', 'complexity', 'mentor', 'stack']
    list_filter = ['is_active', 'complexity']


@admin.register(EduSkillsTrack)
class EduSkillsTrackAdmin(admin.ModelAdmin):
    list_display = ['title', 'duration', 'price', 'popular', 'order', 'is_active']
    search_fields = ['title', 'price']
    list_filter = ['is_active', 'popular']


@admin.register(ApexItem)
class ApexItemAdmin(admin.ModelAdmin):
    list_display = ['title', 'section', 'subtitle', 'order', 'is_active', 'created_at']
    list_filter = ['section', 'is_active', 'created_at']
    search_fields = ['title', 'subtitle', 'description', 'tags']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['section', 'order']


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'slug', 'author', 'is_published', 'published_at', 'created_at']
    search_fields = ['title', 'content', 'author']
    list_filter = ['is_published', 'published_at', 'created_at']
    readonly_fields = ['created_at', 'updated_at']
    prepopulated_fields = {'slug': ('title',)}


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ['name', 'role', 'company', 'rating', 'is_approved', 'order', 'created_at']
    search_fields = ['name', 'role', 'company', 'review_text']
    list_filter = ['is_approved', 'rating', 'created_at']
    readonly_fields = ['created_at']


@admin.register(SEOSetting)
class SEOSettingAdmin(admin.ModelAdmin):
    list_display = ['page_name', 'title', 'updated_at']
    search_fields = ['page_name', 'title', 'description', 'keywords']
    readonly_fields = ['updated_at']



from .models import ChatbotFeedback, ChatbotAnalytics

@admin.register(ChatbotFeedback)
class ChatbotFeedbackAdmin(admin.ModelAdmin):
    list_display = ['session_id', 'feedback', 'timestamp', 'user_email']
    search_fields = ['session_id', 'message', 'user_email']
    list_filter = ['feedback', 'timestamp']
    readonly_fields = ['timestamp']
    ordering = ['-timestamp']

@admin.register(ChatbotAnalytics)
class ChatbotAnalyticsAdmin(admin.ModelAdmin):
    list_display = ['date', 'total_queries', 'successful_responses', 'failed_responses', 'unique_sessions']
    list_filter = ['date']
    readonly_fields = ['date']
    ordering = ['-date']


@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ['certificate_id', 'student_name', 'course_name', 'issue_date', 'grade', 'created_at']
    search_fields = ['certificate_id', 'student_name', 'course_name']
    list_filter = ['created_at', 'issue_date']
    readonly_fields = ['created_at', 'updated_at']
