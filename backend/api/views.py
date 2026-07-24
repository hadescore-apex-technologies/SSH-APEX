from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import connection
from django.views.decorators.cache import never_cache
from .models import ContactInquiry
from .email_utils import send_application_notification, send_confirmation_email
from .web3forms_utils import (
    send_to_web3forms, 
    format_contact_for_web3forms,
    format_job_application_for_web3forms,
    format_enrollment_for_web3forms,
    format_project_brief_for_web3forms,
    format_newsletter_for_web3forms
)

@api_view(['GET'])
def server_status(request):
    db_ok = True
    try:
        connection.ensure_connection()
    except Exception:
        db_ok = False
    
    return Response({
        "status": "online",
        "message": "Welcome to Hadescore Apex & Technologies API",
        "database": "connected" if db_ok else "disconnected",
        "version": "1.0.0"
    })

from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings
from .models import (
    Contact, Career, JobApplication, Course, Enrollment, Newsletter, ProjectBrief, ExecutiveLeader, Product,
    ApexItem, EduSkillsMentor, EduSkillsDomain, EduSkillsProject, EduSkillsTrack,
    BlogPost, Testimonial, SEOSetting, Service, Solution, Certificate
)
from .serializers import (
    ContactSerializer, CareerSerializer, JobApplicationSerializer,
    CourseSerializer, EnrollmentSerializer, NewsletterSerializer, ProjectBriefSerializer, ExecutiveLeaderSerializer, ProductSerializer, ApexItemSerializer,
    EduSkillsMentorSerializer, EduSkillsDomainSerializer, EduSkillsProjectSerializer, EduSkillsTrackSerializer,
    BlogPostSerializer, TestimonialSerializer, SEOSettingSerializer,
    ServiceSerializer, SolutionSerializer, CertificateSerializer
)



@api_view(['GET', 'POST'])
def contact_view(request):
    if request.method == 'POST':
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            contact = serializer.save()
            
            # Prepare application data
            application_data = {
                'name': contact.name,
                'email': contact.email,
                'phone': contact.phone or 'N/A',
                'company': contact.company or 'N/A',
                'subject': contact.subject,
                'message': contact.message,
                'created_at': contact.created_at.strftime('%Y-%m-%d %H:%M:%S')
            }
            
            # 1. Send to Gmail (Email notification)
            send_application_notification('contact', application_data)
            send_confirmation_email(contact.email, contact.name, 'contact')
            
            # 2. Send to Web3Forms (Cloud backup)
            web3forms_data = format_contact_for_web3forms(application_data)
            send_to_web3forms('contact', web3forms_data)
            
            # 3. Data already saved in Database ✅
            # 4. Visible in Admin Panel ✅
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    contacts = Contact.objects.all()
    serializer = ContactSerializer(contacts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def careers_list(request):
    careers = Career.objects.filter(is_active=True)
    serializer = CareerSerializer(careers, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def apply_job(request):
    serializer = JobApplicationSerializer(data=request.data)
    if serializer.is_valid():
        application = serializer.save()
        
        # Prepare application data
        application_data = {
            'name': application.name,
            'email': application.email,
            'phone': application.phone or 'N/A',
            'linkedin': application.linkedin or 'N/A',
            'role_title': application.role_title or 'N/A',
            'role_type': application.role_type or 'N/A',
            'role_dept': application.role_dept or 'N/A',
            'college_name': application.college_name or 'N/A',
            'degree': application.degree or 'N/A',
            'graduation_year': application.graduation_year or 'N/A',
            'experience': application.experience or 'N/A',
            'availability': application.availability or 'N/A',
            'cover_letter': application.cover_letter or 'N/A',
            'resume': application.resume.name if application.resume else None,
            'applied_at': application.applied_at.strftime('%Y-%m-%d %H:%M:%S')
        }
        
        # 1. Send to Gmail
        send_application_notification('job', application_data)
        send_confirmation_email(application.email, application.name, 'job')
        
        # 2. Send to Web3Forms
        web3forms_data = format_job_application_for_web3forms(application_data)
        send_to_web3forms('job_application', web3forms_data)
        
        # 3. Database ✅ 4. Admin Panel ✅
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def courses_list(request):
    category = request.GET.get('category')
    courses = Course.objects.filter(is_active=True)
    if category:
        courses = courses.filter(category=category)
    serializer = CourseSerializer(courses, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def enroll_course(request):
    data = request.data.copy()
    course_id = data.get('course_id')
    
    if course_id:
        try:
            course = Course.objects.get(id=course_id, is_active=True)
            data['course'] = course.id
            if not data.get('course_name'):
                data['course_name'] = course.title
            if not data.get('course_category'):
                data['course_category'] = course.category
        except Course.DoesNotExist:
            return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
            
    serializer = EnrollmentSerializer(data=data)
    if serializer.is_valid():
        enrollment = serializer.save()
        
        # Prepare application data
        application_data = {
            'name': enrollment.name or 'N/A',
            'user_email': enrollment.user_email,
            'phone': enrollment.phone or 'N/A',
            'linkedin': enrollment.linkedin or 'N/A',
            'course_name': enrollment.course_name or 'N/A',
            'course_category': enrollment.course_category or 'N/A',
            'mode': enrollment.mode,
            'experience': enrollment.experience or 'N/A',
            'message': enrollment.message or 'N/A',
            'resume': enrollment.resume.name if enrollment.resume else None,
            'enrolled_at': enrollment.enrolled_at.strftime('%Y-%m-%d %H:%M:%S')
        }
        
        # 1. Send to Gmail
        send_application_notification('enrollment', application_data)
        send_confirmation_email(enrollment.user_email, enrollment.name or 'Student', 'enrollment')
        
        # 2. Send to Web3Forms
        web3forms_data = format_enrollment_for_web3forms(application_data)
        send_to_web3forms('enrollment', web3forms_data)
        
        # 3. Database ✅ 4. Admin Panel ✅
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def newsletter_subscribe(request):
    serializer = NewsletterSerializer(data=request.data)
    if serializer.is_valid():
        newsletter = serializer.save()
        
        # Prepare application data
        application_data = {
            'email': newsletter.email,
            'subscribed_at': newsletter.subscribed_at.strftime('%Y-%m-%d %H:%M:%S')
        }
        
        # 1. Send to Gmail
        send_application_notification('newsletter', application_data)
        
        # 2. Send to Web3Forms
        web3forms_data = format_newsletter_for_web3forms(application_data)
        send_to_web3forms('newsletter', web3forms_data)
        
        # 3. Database ✅ 4. Admin Panel ✅
        
        return Response({'message': 'Subscribed successfully'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def submit_project_brief(request):
    serializer = ProjectBriefSerializer(data=request.data)
    if serializer.is_valid():
        brief = serializer.save()
        
        # Prepare application data
        application_data = {
            'name': brief.name,
            'email': brief.email,
            'phone': brief.phone or 'N/A',
            'service': brief.service,
            'budget': brief.budget,
            'message': brief.message or 'N/A',
            'submitted_at': brief.submitted_at.strftime('%Y-%m-%d %H:%M:%S')
        }
        
        # 1. Send to Gmail
        send_application_notification('project_brief', application_data)
        send_confirmation_email(brief.email, brief.name, 'project_brief')
        
        # 2. Send to Web3Forms
        web3forms_data = format_project_brief_for_web3forms(application_data)
        send_to_web3forms('project_brief', web3forms_data)
        
        # 3. Database ✅ 4. Admin Panel ✅
        
        return Response({'success': True, 'message': 'Brief submitted successfully'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@never_cache
@api_view(['GET'])
def leaders_list(request):
    leaders = ExecutiveLeader.objects.all()
    serializer = ExecutiveLeaderSerializer(leaders, many=True)
    response = Response(serializer.data)
    response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    return response

@never_cache
@api_view(['GET'])
def products_list(request):
    products = Product.objects.filter(is_active=True).order_by('order', '-created_at')
    serializer = ProductSerializer(products, many=True)
    response = Response(serializer.data)
    response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    return response


@never_cache
@api_view(['GET'])
def apex_list(request):
    items = ApexItem.objects.filter(is_active=True).order_by('section', 'order', '-created_at')
    serializer = ApexItemSerializer(items, many=True)
    response = Response(serializer.data)
    response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    return response


@api_view(['GET'])
def services_list(request):
    services = Service.objects.filter(is_active=True).order_by('order', 'id')
    serializer = ServiceSerializer(services, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def solutions_list(request):
    solutions = Solution.objects.filter(is_active=True).order_by('order', 'id')
    serializer = SolutionSerializer(solutions, many=True)
    return Response(serializer.data)


@never_cache
@api_view(['GET'])
def eduskills_mentors_list(request):
    mentors = EduSkillsMentor.objects.filter(is_active=True).order_by('order', 'id')
    serializer = EduSkillsMentorSerializer(mentors, many=True)
    response = Response(serializer.data)
    # Add cache control headers
    response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response['Pragma'] = 'no-cache'
    response['Expires'] = '0'
    return response


@never_cache
@api_view(['GET'])
def eduskills_domains_list(request):
    domains = EduSkillsDomain.objects.filter(is_active=True).order_by('order', 'id')
    serializer = EduSkillsDomainSerializer(domains, many=True)
    response = Response(serializer.data)
    response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response['Pragma'] = 'no-cache'
    response['Expires'] = '0'
    return response


@never_cache
@api_view(['GET'])
def eduskills_projects_list(request):
    projects = EduSkillsProject.objects.filter(is_active=True).order_by('order', 'id')
    serializer = EduSkillsProjectSerializer(projects, many=True)
    response = Response(serializer.data)
    response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response['Pragma'] = 'no-cache'
    response['Expires'] = '0'
    return response


@never_cache
@api_view(['GET'])
def eduskills_tracks_list(request):
    tracks = EduSkillsTrack.objects.filter(is_active=True).order_by('order', 'id')
    serializer = EduSkillsTrackSerializer(tracks, many=True)
    response = Response(serializer.data)
    response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response['Pragma'] = 'no-cache'
    response['Expires'] = '0'
    return response


@never_cache
@api_view(['GET'])
def blog_posts_list(request):
    posts = BlogPost.objects.filter(is_published=True).order_by('published_at', 'created_at')
    serializer = BlogPostSerializer(posts, many=True)
    response = Response(serializer.data)
    # Add cache control headers
    response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response['Pragma'] = 'no-cache'
    response['Expires'] = '0'
    return response


@never_cache
@api_view(['GET'])
def blog_post_detail(request, slug):
    try:
        post = BlogPost.objects.get(slug=slug, is_published=True)
        serializer = BlogPostSerializer(post)
        response = Response(serializer.data)
        response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        return response
    except BlogPost.DoesNotExist:
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)


@never_cache
@api_view(['GET'])
def testimonials_list(request):
    testimonials = Testimonial.objects.filter(is_approved=True).order_by('order', '-created_at')
    serializer = TestimonialSerializer(testimonials, many=True)
    response = Response(serializer.data)
    response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    return response


@api_view(['GET'])
def seo_settings_by_page(request, page_name):
    try:
        setting = SEOSetting.objects.get(page_name=page_name)
        serializer = SEOSettingSerializer(setting)
        return Response(serializer.data)
    except SEOSetting.DoesNotExist:
        return Response({
            'page_name': page_name,
            'title': '',
            'description': '',
            'keywords': '',
            'og_image': None
        })

from django.utils import timezone
from .chatbot import get_chatbot_reply, get_chatbot_reply_with_context, format_rich_response

@api_view(['POST'])
def chatbot_api(request):
    query = request.data.get('query', '')
    session_id = request.data.get('session_id', None)
    
    if not query:
        return Response({'reply': 'Please ask a question.', 'is_error': True})
    
    # Use context-aware version if session_id provided
    if session_id:
        reply = get_chatbot_reply_with_context(query, session_id)
    else:
        reply = get_chatbot_reply(query)
    
    is_error = "I can only assist with questions regarding Hadescore Apex" in reply
    
    # Determine intent for rich actions (buttons)
    intent = None
    query_lower = query.lower()
    if any(w in query_lower for w in ["course", "program", "learn", "study"]):
        intent = "courses"
    elif any(w in query_lower for w in ["contact", "phone", "email", "address", "location", "call", "whatsapp"]):
        intent = "contact"
    elif any(w in query_lower for w in ["career", "job", "apply", "hiring", "resume"]):
        intent = "careers"
    elif any(w in query_lower for w in ["price", "cost", "pricing", "fee", "fees"]):
        intent = "pricing"
    elif any(w in query_lower for w in ["service", "services", "develop", "build"]):
        intent = "services"
    elif any(w in query_lower for w in ["solution", "solutions", "industry", "industries"]):
        intent = "solutions"
    elif any(w in query_lower for w in ["leader", "team", "founder", "executive", "ceo", "management"]):
        intent = "leaders"
    elif any(w in query_lower for w in ["product", "products", "saas", "app"]):
        intent = "products"
    elif any(w in query_lower for w in ["apex", "stack", "technologies", "tech"]):
        intent = "apex"
    elif any(w in query_lower for w in ["start", "hire", "proposal", "brief", "quote"]):
        intent = "start_project"
    elif any(w in query_lower for w in ["blog", "blogs", "post", "posts", "news", "article", "articles"]):
        intent = "blogs"
    
    actions = []
    if intent:
        rich_data = format_rich_response(intent, reply)
        actions = rich_data.get("actions", [])
    
    return Response({
        'reply': reply, 
        'is_error': is_error,
        'session_id': session_id,
        'timestamp': timezone.now().isoformat(),
        'actions': actions
    })

@api_view(['POST'])
def chatbot_feedback_api(request):
    from .serializers import ChatbotFeedbackSerializer
    serializer = ChatbotFeedbackSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'status': 'success', 'message': 'Thank you for your feedback!'})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def services_list(request):
    services = Service.objects.filter(is_active=True).order_by('order', 'id')
    serializer = ServiceSerializer(services, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def solutions_list(request):
    solutions = Solution.objects.filter(is_active=True).order_by('order', 'id')
    serializer = SolutionSerializer(solutions, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def verify_certificate(request, certificate_id):
    try:
        certificate = Certificate.objects.get(certificate_id=certificate_id.upper().strip())
        serializer = CertificateSerializer(certificate, context={'request': request})
        return Response(serializer.data)
    except Certificate.DoesNotExist:
        return Response({'detail': 'Certificate not found in registry.'}, status=status.HTTP_404_NOT_FOUND)

