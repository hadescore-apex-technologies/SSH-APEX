from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.contrib.auth.models import User, Group
from django.utils import timezone
from django.db import models as django_models
from datetime import timedelta

from .models import (
    ContactInquiry, Contact, Career, JobApplication, InternshipApplication, RegularJobApplication,
    Course, Enrollment, Newsletter, ProjectBrief, ExecutiveLeader, Product,
    ApexItem, EduSkillsMentor, EduSkillsDomain, EduSkillsProject, EduSkillsTrack,
    BlogPost, Testimonial, SEOSetting, Service, Solution, Certificate
)
from .serializers import (
    UserSerializer, GroupSerializer, ContactInquirySerializer, ContactSerializer,
    CareerSerializer, JobApplicationSerializer, CourseSerializer, EnrollmentSerializer,
    NewsletterSerializer, ProjectBriefSerializer, ExecutiveLeaderSerializer, ProductSerializer, ApexItemSerializer,
    EduSkillsMentorSerializer, EduSkillsDomainSerializer, EduSkillsProjectSerializer, EduSkillsTrackSerializer,
    BlogPostSerializer, TestimonialSerializer, SEOSettingSerializer,
    ServiceSerializer, SolutionSerializer, CertificateSerializer
)


# ── Mixin: adds a /mark_read/ action to any viewset whose model has is_read ──
class MarkReadMixin:
    @action(detail=True, methods=['post'], url_path='mark-read')
    def mark_read(self, request, pk=None):
        obj = self.get_object()
        obj.is_read = True
        obj.save(update_fields=['is_read'])
        return Response({'status': 'marked as read'})

    @action(detail=False, methods=['post'], url_path='mark-all-read')
    def mark_all_read(self, request):
        self.get_queryset().filter(is_read=False).update(is_read=True)
        return Response({'status': 'all marked as read'})

    @action(detail=False, methods=['post'], url_path='reset-sequence')
    def reset_sequence(self, request):
        """Reset the auto-increment ID to 1 after all records are deleted."""
        model = self.queryset.model
        if model.objects.exists():
            return Response({'error': 'Cannot reset sequence while records still exist.'}, status=400)
        from django.db import connection
        table = model._meta.db_table
        with connection.cursor() as cursor:
            db_engine = connection.vendor  # 'sqlite', 'postgresql', 'mysql'
            if db_engine == 'sqlite':
                cursor.execute(
                    "DELETE FROM sqlite_sequence WHERE name = %s;", [table]
                )
            elif db_engine == 'postgresql':
                cursor.execute(
                    f"ALTER SEQUENCE {table}_id_seq RESTART WITH 1;"
                )
            elif db_engine == 'mysql':
                cursor.execute(
                    f"ALTER TABLE `{table}` AUTO_INCREMENT = 1;"
                )
        return Response({'status': 'sequence reset to 1'})


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAdminUser]


class ContactInquiryViewSet(MarkReadMixin, viewsets.ModelViewSet):
    queryset = ContactInquiry.objects.all().order_by('-created_at')
    serializer_class = ContactInquirySerializer
    permission_classes = [IsAdminUser]


class ContactViewSet(MarkReadMixin, viewsets.ModelViewSet):
    queryset = Contact.objects.all().order_by('-created_at')
    serializer_class = ContactSerializer
    permission_classes = [IsAdminUser]


class CareerViewSet(viewsets.ModelViewSet):
    queryset = Career.objects.all().order_by('-created_at')
    serializer_class = CareerSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        qs = super().get_queryset()
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            qs = qs.filter(is_active=is_active.lower() == 'true')
        return qs


class JobApplicationViewSet(MarkReadMixin, viewsets.ModelViewSet):
    queryset = JobApplication.objects.all().order_by('-applied_at')
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAdminUser]


class RegularJobApplicationViewSet(MarkReadMixin, viewsets.ModelViewSet):
    queryset = JobApplication.objects.exclude(role_type__icontains='intern').order_by('-applied_at')
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAdminUser]


class InternshipApplicationViewSet(MarkReadMixin, viewsets.ModelViewSet):
    queryset = JobApplication.objects.filter(role_type__icontains='intern').order_by('-applied_at')
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAdminUser]


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().order_by('-created_at')
    serializer_class = CourseSerializer
    permission_classes = [IsAdminUser]


class EnrollmentViewSet(MarkReadMixin, viewsets.ModelViewSet):
    queryset = Enrollment.objects.all().order_by('-enrolled_at')
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAdminUser]


class NewsletterViewSet(MarkReadMixin, viewsets.ModelViewSet):
    queryset = Newsletter.objects.all().order_by('-subscribed_at')
    serializer_class = NewsletterSerializer
    permission_classes = [IsAdminUser]


class ProjectBriefViewSet(MarkReadMixin, viewsets.ModelViewSet):
    queryset = ProjectBrief.objects.all().order_by('-submitted_at')
    serializer_class = ProjectBriefSerializer
    permission_classes = [IsAdminUser]


from rest_framework.parsers import MultiPartParser, FormParser

class ExecutiveLeaderViewSet(viewsets.ModelViewSet):
    queryset = ExecutiveLeader.objects.all().order_by('order', 'id')
    serializer_class = ExecutiveLeaderSerializer
    permission_classes = [IsAdminUser]
    parser_classes = (MultiPartParser, FormParser)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('order', '-created_at')
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        qs = super().get_queryset()
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            qs = qs.filter(is_active=is_active.lower() == 'true')
        return qs


class ApexItemViewSet(viewsets.ModelViewSet):
    queryset = ApexItem.objects.all().order_by('section', 'order', '-created_at')
    serializer_class = ApexItemSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        qs = super().get_queryset()
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            qs = qs.filter(is_active=is_active.lower() == 'true')
        return qs


class EduSkillsMentorViewSet(viewsets.ModelViewSet):
    queryset = EduSkillsMentor.objects.all().order_by('order', 'id')
    serializer_class = EduSkillsMentorSerializer
    permission_classes = [IsAdminUser]

    @action(detail=False, methods=['post'], url_path='bulk-upload')
    def bulk_upload(self, request):
        """
        Bulk upload mentors via CSV.
        Expected CSV columns: name,role,company,exp,tag,email,order,is_active
        tag options: AI / ML, Fullstack, Cyber, Data, Cloud, Robotics, Design, Marketing, Others
        """
        import csv
        import io
        
        csv_file = request.FILES.get('file')
        if not csv_file:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not csv_file.name.endswith('.csv'):
            return Response({'error': 'File must be a CSV'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            decoded_file = csv_file.read().decode('utf-8')
            io_string = io.StringIO(decoded_file)
            reader = csv.DictReader(io_string)
            
            # Get the max order for auto-increment
            max_order = EduSkillsMentor.objects.aggregate(max_order=django_models.Max('order'))['max_order'] or 0
            current_order = max_order + 1
            
            created_count = 0
            errors = []
            
            # Valid category options
            valid_categories = ['AI / ML', 'Fullstack', 'Cyber', 'Data', 'Cloud', 'Robotics', 'Design', 'Marketing', 'Others']
            
            for idx, row in enumerate(reader, start=2):  # start=2 because row 1 is header
                # Skip comment rows or empty rows
                if not row or not row.get('name') or str(row.get('name', '')).strip().startswith('#'):
                    continue
                    
                try:
                    # Clean and prepare data
                    name = row.get('name', '').strip()
                    role = row.get('role', '').strip()
                    company = row.get('company', '').strip()
                    exp = row.get('exp', '').strip()
                    tag = row.get('tag', '').strip()
                    email = row.get('email', '').strip()
                    order_val = row.get('order', '').strip()
                    is_active_val = row.get('is_active', 'true').strip().lower()
                    
                    if not name or not role or not company:
                        errors.append(f"Row {idx}: Missing required fields (name, role, company)")
                        continue
                    
                    # Validate category
                    if tag and tag not in valid_categories:
                        errors.append(f"Row {idx}: Invalid category '{tag}'. Must be one of: {', '.join(valid_categories)}")
                        continue
                    
                    # Convert order to int or auto-increment
                    if order_val:
                        try:
                            order = int(order_val)
                        except ValueError:
                            order = current_order
                            current_order += 1
                    else:
                        order = current_order
                        current_order += 1
                    
                    # Convert is_active to boolean
                    is_active = is_active_val in ['true', '1', 'yes', 'active']
                    
                    # Create mentor
                    EduSkillsMentor.objects.create(
                        name=name,
                        role=role,
                        company=company,
                        exp=exp,
                        tag=tag,
                        email=email,
                        order=order,
                        is_active=is_active
                    )
                    created_count += 1
                    
                except Exception as e:
                    errors.append(f"Row {idx}: {str(e)}")
            
            return Response({
                'success': True,
                'created': created_count,
                'errors': errors
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({'error': f'Failed to process CSV: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='download-template')
    def download_template(self, request):
        """Download a CSV template for bulk upload"""
        import csv
        from django.http import HttpResponse
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="mentors_template.csv"'
        
        writer = csv.writer(response)
        # Header row with instructions
        writer.writerow(['# Mentors Bulk Upload Template'])
        writer.writerow(['# Category options: AI / ML, Fullstack, Cyber, Data, Cloud, Robotics, Design, Marketing, Others'])
        writer.writerow(['# is_active: true or false'])
        writer.writerow(['# order: Leave empty for auto-increment, or specify number'])
        writer.writerow([])  # Empty row
        writer.writerow(['name', 'role', 'company', 'exp', 'tag', 'email', 'order', 'is_active'])
        writer.writerow(['John Doe', 'Senior AI Engineer', 'Google', '10 yrs', 'AI / ML', 'john@example.com', '', 'true'])
        writer.writerow(['Jane Smith', 'Lead Full Stack Developer', 'Microsoft', '8 yrs', 'Fullstack', 'jane@example.com', '', 'true'])
        writer.writerow(['Mike Johnson', 'Security Architect', 'Amazon', '12 yrs', 'Cyber', 'mike@example.com', '', 'true'])
        
        return response


class EduSkillsDomainViewSet(viewsets.ModelViewSet):
    queryset = EduSkillsDomain.objects.all().order_by('order', 'id')
    serializer_class = EduSkillsDomainSerializer
    permission_classes = [IsAdminUser]


class EduSkillsProjectViewSet(viewsets.ModelViewSet):
    queryset = EduSkillsProject.objects.all().order_by('order', 'id')
    serializer_class = EduSkillsProjectSerializer
    permission_classes = [IsAdminUser]


class EduSkillsTrackViewSet(viewsets.ModelViewSet):
    queryset = EduSkillsTrack.objects.all().order_by('order', 'id')
    serializer_class = EduSkillsTrackSerializer
    permission_classes = [IsAdminUser]


class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.all().order_by('-published_at', '-created_at')
    serializer_class = BlogPostSerializer
    permission_classes = [IsAdminUser]


class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all().order_by('order', '-created_at')
    serializer_class = TestimonialSerializer
    permission_classes = [IsAdminUser]


class SEOSettingViewSet(viewsets.ModelViewSet):
    queryset = SEOSetting.objects.all().order_by('page_name')
    serializer_class = SEOSettingSerializer
    permission_classes = [IsAdminUser]


class NotificationsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response({
            'contacts': Contact.objects.filter(is_read=False).count(),
            'contact-inquiries': ContactInquiry.objects.filter(is_read=False).count(),
            'job-applications': JobApplication.objects.all().filter(is_read=False).count(),
            'regular-job-applications': JobApplication.objects.exclude(role_type__icontains='intern').filter(is_read=False).count(),
            'internship-applications': JobApplication.objects.filter(role_type__icontains='intern').filter(is_read=False).count(),
            'enrollments': Enrollment.objects.filter(is_read=False).count(),
            'project-briefs': ProjectBrief.objects.filter(is_read=False).count(),
            'newsletters': Newsletter.objects.filter(is_read=False).count(),
        })


class DashboardStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        now = timezone.now()
        last_30 = now - timedelta(days=30)
        last_7 = now - timedelta(days=7)

        stats = {
            # Totals
            'total_contacts': Contact.objects.count(),
            'unread_contacts': Contact.objects.filter(is_read=False).count(),
            'total_applications': JobApplication.objects.count(),
            'unread_applications': JobApplication.objects.filter(is_read=False).count(),
            'total_enrollments': Enrollment.objects.count(),
            'unread_enrollments': Enrollment.objects.filter(is_read=False).count(),
            'total_newsletters': Newsletter.objects.count(),
            'total_project_briefs': ProjectBrief.objects.count(),
            'unread_briefs': ProjectBrief.objects.filter(is_read=False).count(),
            'total_careers': Career.objects.count(),
            'active_careers': Career.objects.filter(is_active=True).count(),
            'total_courses': Course.objects.count(),
            'active_courses': Course.objects.filter(is_active=True).count(),
            'total_leaders': ExecutiveLeader.objects.count(),
            'total_products': Product.objects.count(),
            'active_products': Product.objects.filter(is_active=True).count(),
            'total_users': User.objects.count(),
            'total_blog_posts': BlogPost.objects.count(),
            'total_testimonials': Testimonial.objects.count(),
            # 30-day
            'contacts_30d': Contact.objects.filter(created_at__gte=last_30).count(),
            'applications_30d': JobApplication.objects.filter(applied_at__gte=last_30).count(),
            'enrollments_30d': Enrollment.objects.filter(enrolled_at__gte=last_30).count(),
            'newsletters_30d': Newsletter.objects.filter(subscribed_at__gte=last_30).count(),
            # 7-day
            'contacts_7d': Contact.objects.filter(created_at__gte=last_7).count(),
            'applications_7d': JobApplication.objects.filter(applied_at__gte=last_7).count(),
            'enrollments_7d': Enrollment.objects.filter(enrolled_at__gte=last_7).count(),
        }

        # Recent rows (5 each)
        stats['recent_contacts'] = list(
            Contact.objects.order_by('-created_at')[:5].values(
                'id', 'name', 'email', 'subject', 'is_read', 'created_at'
            )
        )
        stats['recent_applications'] = list(
            JobApplication.objects.order_by('-applied_at')[:5].values(
                'id', 'name', 'email', 'role_title', 'is_read', 'applied_at'
            )
        )
        stats['recent_enrollments'] = list(
            Enrollment.objects.order_by('-enrolled_at')[:5].values(
                'id', 'name', 'user_email', 'course_name', 'is_read', 'enrolled_at'
            )
        )

        return Response(stats)


class ServiceViewSet(viewsets.ModelViewSet):
    """Full CRUD for Service cards (Services page)."""
    queryset = Service.objects.all().order_by('order', 'id')
    serializer_class = ServiceSerializer
    permission_classes = [IsAdminUser]


class SolutionViewSet(viewsets.ModelViewSet):
    """Full CRUD for Solution cards (Solutions page)."""
    queryset = Solution.objects.all().order_by('order', 'id')
    serializer_class = SolutionSerializer
    permission_classes = [IsAdminUser]


class CertificateViewSet(viewsets.ModelViewSet):
    """Full CRUD for Certificate registry (Admin)."""
    queryset = Certificate.objects.all().order_by('-created_at')
    serializer_class = CertificateSerializer
    permission_classes = [IsAdminUser]

    @action(detail=False, methods=['POST'], url_path='bulk-upload')
    def bulk_upload(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({'detail': 'No file uploaded.'}, status=status.HTTP_400_BAD_REQUEST)
        
        import csv
        import io
        
        try:
            decoded_file = file.read().decode('utf-8')
            io_string = io.StringIO(decoded_file)
            reader = csv.reader(io_string)
            
            header = next(reader, None)
            if not header:
                return Response({'detail': 'CSV file is empty.'}, status=status.HTTP_400_BAD_REQUEST)
            
            headers = [h.strip().lower().replace(' ', '_') for h in header]
            
            required_fields = ['certificate_id', 'student_name', 'course_name', 'issue_date']
            for field in required_fields:
                if field not in headers:
                    return Response({
                        'detail': f"Missing required column: '{field}'. Headers: {header}"
                    }, status=status.HTTP_400_BAD_REQUEST)
            
            cert_id_idx = headers.index('certificate_id')
            student_name_idx = headers.index('student_name')
            course_name_idx = headers.index('course_name')
            issue_date_idx = headers.index('issue_date')
            issuer_idx = headers.index('issuer') if 'issuer' in headers else -1
            
            created_count = 0
            updated_count = 0
            errors = []
            
            for row_idx, row in enumerate(reader, start=2):
                if not row or all(cell.strip() == '' for cell in row):
                    continue
                
                try:
                    if len(row) <= max(cert_id_idx, student_name_idx, course_name_idx, issue_date_idx):
                        errors.append(f"Row {row_idx}: Insufficient columns.")
                        continue
                    
                    certificate_id = row[cert_id_idx].strip().upper()
                    student_name = row[student_name_idx].strip()
                    course_name = row[course_name_idx].strip()
                    issue_date = row[issue_date_idx].strip()
                    
                    issuer_val = row[issuer_idx].strip() if (issuer_idx != -1 and issuer_idx < len(row)) else ''
                    issuer = issuer_val if issuer_val else 'Hadescore Apex & Technologies Certification Board'
                    
                    if not certificate_id or not student_name or not course_name or not issue_date:
                        errors.append(f"Row {row_idx}: Missing required values.")
                        continue
                    
                    certificate, created = Certificate.objects.update_or_create(
                        certificate_id=certificate_id,
                        defaults={
                            'student_name': student_name,
                            'course_name': course_name,
                            'issue_date': issue_date,
                            'issuer': issuer
                        }
                    )
                    if created:
                        created_count += 1
                    else:
                        updated_count += 1
                except Exception as row_err:
                    errors.append(f"Row {row_idx}: {str(row_err)}")
            
            return Response({
                'detail': f'Bulk upload completed. Registered {created_count} new, updated {updated_count} certificates.',
                'errors': errors,
                'created_count': created_count,
                'updated_count': updated_count
            })
        except Exception as e:
            return Response({'detail': f'Failed to process file: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
