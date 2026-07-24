from django.urls import path
from .views import (
    server_status, contact_view, careers_list, 
    apply_job, courses_list, enroll_course, newsletter_subscribe,
    submit_project_brief, leaders_list, products_list, apex_list,
    services_list, solutions_list,
    eduskills_mentors_list, eduskills_domains_list, eduskills_projects_list, eduskills_tracks_list,
    blog_posts_list, blog_post_detail, testimonials_list, seo_settings_by_page,
    chatbot_api, chatbot_feedback_api, verify_certificate
)

urlpatterns = [
    path('status/', server_status, name='server_status'),
    path('contact/', contact_view, name='contact'),
    path('careers/', careers_list, name='careers'),
    path('careers/apply/', apply_job, name='apply_job'),
    path('courses/', courses_list, name='courses'),
    path('enroll/', enroll_course, name='enroll'),
    path('newsletter/', newsletter_subscribe, name='newsletter'),
    path('project-submit/', submit_project_brief, name='project_submit'),
    path('leaders/', leaders_list, name='leaders_list'),
    path('products/', products_list, name='products_list'),
    path('apex/', apex_list, name='apex_list'),
    path('services/', services_list, name='services_list'),
    path('solutions/', solutions_list, name='solutions_list'),
    path('eduskills/mentors/', eduskills_mentors_list, name='eduskills_mentors'),
    path('eduskills/domains/', eduskills_domains_list, name='eduskills_domains'),
    path('eduskills/projects/', eduskills_projects_list, name='eduskills_projects'),
    path('eduskills/tracks/', eduskills_tracks_list, name='eduskills_tracks'),
    path('blog/', blog_posts_list, name='blog_posts'),
    path('blog/<slug:slug>/', blog_post_detail, name='blog_post_detail'),
    path('testimonials/', testimonials_list, name='testimonials_list'),
    path('seo/<str:page_name>/', seo_settings_by_page, name='seo_settings_by_page'),
    path('chatbot/', chatbot_api, name='chatbot_api'),
    path('chatbot/feedback/', chatbot_feedback_api, name='chatbot_feedback'),
    path('certificate/verify/<str:certificate_id>/', verify_certificate, name='verify_certificate'),
]

# Admin Routes
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .admin_views import (
    UserViewSet, GroupViewSet, ContactInquiryViewSet, ContactViewSet,
    CareerViewSet, JobApplicationViewSet, RegularJobApplicationViewSet, InternshipApplicationViewSet, CourseViewSet, EnrollmentViewSet, NewsletterViewSet,
    ProjectBriefViewSet, NotificationsView, ExecutiveLeaderViewSet, DashboardStatsView, ProductViewSet,
    EduSkillsMentorViewSet, EduSkillsDomainViewSet, EduSkillsProjectViewSet, EduSkillsTrackViewSet, ApexItemViewSet,
    BlogPostViewSet, TestimonialViewSet, SEOSettingViewSet,
    ServiceViewSet, SolutionViewSet, CertificateViewSet
)

router = DefaultRouter()
router.register(r'admin/users', UserViewSet, basename='admin-users')
router.register(r'admin/groups', GroupViewSet, basename='admin-groups')
router.register(r'admin/contact-inquiries', ContactInquiryViewSet, basename='admin-contact-inquiries')
router.register(r'admin/contacts', ContactViewSet, basename='admin-contacts')
router.register(r'admin/careers', CareerViewSet, basename='admin-careers')
router.register(r'admin/job-applications', JobApplicationViewSet, basename='admin-job-applications')
router.register(r'admin/regular-job-applications', RegularJobApplicationViewSet, basename='admin-regular-job-applications')
router.register(r'admin/internship-applications', InternshipApplicationViewSet, basename='admin-internship-applications')
router.register(r'admin/courses', CourseViewSet, basename='admin-courses')
router.register(r'admin/enrollments', EnrollmentViewSet, basename='admin-enrollments')
router.register(r'admin/newsletters', NewsletterViewSet, basename='admin-newsletters')
router.register(r'admin/project-briefs', ProjectBriefViewSet, basename='admin-project-briefs')
router.register(r'admin/leaders', ExecutiveLeaderViewSet, basename='admin-leaders')
router.register(r'admin/products', ProductViewSet, basename='admin-products')
router.register(r'admin/eduskills-mentors', EduSkillsMentorViewSet, basename='admin-eduskills-mentors')
router.register(r'admin/eduskills-domains', EduSkillsDomainViewSet, basename='admin-eduskills-domains')
router.register(r'admin/eduskills-projects', EduSkillsProjectViewSet, basename='admin-eduskills-projects')
router.register(r'admin/eduskills-tracks', EduSkillsTrackViewSet, basename='admin-eduskills-tracks')
router.register(r'admin/apex-items', ApexItemViewSet, basename='admin-apex-items')
router.register(r'admin/blogs', BlogPostViewSet, basename='admin-blogs')
router.register(r'admin/testimonials', TestimonialViewSet, basename='admin-testimonials')
router.register(r'admin/seo-settings', SEOSettingViewSet, basename='admin-seo-settings')
router.register(r'admin/services', ServiceViewSet, basename='admin-services')
router.register(r'admin/solutions', SolutionViewSet, basename='admin-solutions')
router.register(r'admin/certificates', CertificateViewSet, basename='admin-certificates')

urlpatterns += [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('admin/notifications/', NotificationsView.as_view(), name='admin-notifications'),
    path('admin/dashboard-stats/', DashboardStatsView.as_view(), name='admin-dashboard-stats'),
] + router.urls


