# pyrefly: ignore [missing-import]
from django.contrib.auth.models import User, Group
# pyrefly: ignore [missing-import]
from rest_framework import serializers
from .models import (
    ContactInquiry, Contact, Career, JobApplication,
    Course, Enrollment, Newsletter, ProjectBrief, ExecutiveLeader, Product,
    ApexItem, EduSkillsMentor, EduSkillsDomain, EduSkillsProject, EduSkillsTrack,
    BlogPost, Testimonial, SEOSetting, Service, Solution, ChatbotFeedback, ChatbotAnalytics, Certificate
)


class ObjectIdField(serializers.Field):
    """Serialize MongoDB ObjectId as a string."""
    def to_representation(self, value):
        return str(value)

    def to_internal_value(self, data):
        return data


class ServiceSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    tags_list = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_tags_list(self, obj):
        return obj.get_tags_list()


class SolutionSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    tags_list = serializers.SerializerMethodField()

    class Meta:
        model = Solution
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_tags_list(self, obj):
        return obj.get_tags_list()


import base64

def convert_file_to_base64(file_obj):
    if not file_obj:
        return None
    if isinstance(file_obj, str):
        return file_obj
    try:
        content = file_obj.read()
        mime = getattr(file_obj, 'content_type', 'image/jpeg') or 'image/jpeg'
        encoded = base64.b64encode(content).decode('utf-8')
        return f"data:{mime};base64,{encoded}"
    except Exception:
        return str(file_obj)

class FlexibleImageField(serializers.Field):
    def to_internal_value(self, data):
        return data

    def to_representation(self, value):
        return str(value) if value else None

class ExecutiveLeaderSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    image = FlexibleImageField(required=False, allow_null=True)

    class Meta:
        model = ExecutiveLeader
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        image_val = validated_data.get('image')
        if image_val and not isinstance(image_val, str):
            validated_data['image'] = convert_file_to_base64(image_val)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        image_val = validated_data.get('image')
        if image_val and not isinstance(image_val, str):
            validated_data['image'] = convert_file_to_base64(image_val)
        elif image_val is None and 'image' not in self.initial_data:
            validated_data.pop('image', None)
        return super().update(instance, validated_data)


class UserSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name',
                  'is_staff', 'is_active', 'date_joined']
        read_only_fields = ['id', 'date_joined']

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance



class GroupSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)

    class Meta:
        model = Group
        fields = ['id', 'name']
        read_only_fields = ['id']


class ContactInquirySerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)

    class Meta:
        model = ContactInquiry
        fields = '__all__'
        read_only_fields = ['id', 'created_at']


class ContactSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)

    class Meta:
        model = Contact
        fields = ['id', 'name', 'email', 'phone', 'company',
                  'subject', 'message', 'is_read', 'status', 'created_at']
        read_only_fields = ['id', 'created_at']


class CareerSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)

    class Meta:
        model = Career
        fields = ['id', 'title', 'location', 'type', 'experience',
                  'description', 'requirements', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']


class JobApplicationSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    job_title = serializers.CharField(source='job.title', read_only=True, default='')

    class Meta:
        model = JobApplication
        fields = [
            'id', 'job', 'job_title', 'name', 'email', 'phone',
            'linkedin', 'experience', 'college_name', 'degree', 'graduation_year', 'availability', 'cover_letter', 'resume',
            'role_title', 'role_type', 'role_dept', 'is_read', 'status', 'applied_at',
        ]
        read_only_fields = ['id', 'applied_at']

    def validate_resume(self, value):
        if value:
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("Resume size must be under 5MB.")
            import os
            ext = os.path.splitext(value.name)[1].lower()
            if ext not in ['.pdf', '.doc', '.docx']:
                raise serializers.ValidationError("Only PDF, DOC, and DOCX files are allowed.")
        return value


class CourseSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'description', 'category', 'level',
            'duration', 'lessons', 'price', 'icon', 'color',
            'is_active', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class EnrollmentSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    course_title = serializers.SerializerMethodField()
    phone = serializers.CharField(required=True, allow_blank=False, error_messages={
        'required': 'Phone number is mandatory.',
        'blank': 'Phone number cannot be blank.'
    })

    def get_course_title(self, obj):
        if obj.course_name:
            return obj.course_name
        if obj.course:
            return obj.course.title
        return ''

    class Meta:
        model = Enrollment
        fields = [
            'id', 'course', 'course_title', 'course_name', 'course_category',
            'name', 'user_email', 'phone', 'linkedin', 'experience', 'message', 'resume', 'mode',
            'enrolled_at', 'progress', 'completed', 'is_read', 'status',
        ]
        read_only_fields = ['id', 'enrolled_at']

    def validate_resume(self, value):
        if value:
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("Resume size must be under 5MB.")
            import os
            ext = os.path.splitext(value.name)[1].lower()
            if ext not in ['.pdf', '.doc', '.docx']:
                raise serializers.ValidationError("Only PDF, DOC, and DOCX files are allowed.")
        return value


class NewsletterSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)

    class Meta:
        model = Newsletter
        fields = ['id', 'email', 'subscribed_at', 'is_active', 'is_read', 'status']
        read_only_fields = ['id', 'subscribed_at']


class ProjectBriefSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)

    class Meta:
        model = ProjectBrief
        fields = ['id', 'name', 'email', 'phone', 'service',
                  'budget', 'message', 'is_read', 'status', 'submitted_at']
        read_only_fields = ['id', 'submitted_at']


class ProductSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'tagline', 'description', 'icon',
                  'color', 'category', 'is_active', 'is_coming_soon', 'order', 'created_at']
        read_only_fields = ['id', 'created_at']


class ApexItemSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)

    class Meta:
        model = ApexItem
        fields = ['id', 'section', 'title', 'subtitle', 'description', 'tags', 'icon', 'extra', 'link', 'order', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class EduSkillsMentorSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)

    class Meta:
        model = EduSkillsMentor
        fields = '__all__'
        read_only_fields = ['id', 'created_at']


class EduSkillsDomainSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)

    class Meta:
        model = EduSkillsDomain
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

    def validate_curriculum_image(self, value):
        if value:
            import os
            ext = os.path.splitext(value.name)[1].lower()
            if ext not in ['.jpg', '.jpeg', '.png', '.webp']:
                raise serializers.ValidationError("Only JPG, JPEG, PNG, and WEBP images are allowed.")
        return value


class EduSkillsProjectSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)

    class Meta:
        model = EduSkillsProject
        fields = '__all__'
        read_only_fields = ['id', 'created_at']


class EduSkillsTrackSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)

    class Meta:
        model = EduSkillsTrack
        fields = '__all__'
        read_only_fields = ['id', 'created_at']


class BlogPostSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    published_at = serializers.DateTimeField(required=False, allow_null=True)

    class Meta:
        model = BlogPost
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, 'copy') else dict(data)
        if 'published_at' in data and data['published_at'] == '':
            data['published_at'] = None
        return super().to_internal_value(data)

    def validate_published_at(self, value):
        if value is None:
            if self.instance and self.instance.published_at:
                return self.instance.published_at
            # pyrefly: ignore [missing-import]
            from django.utils import timezone
            return timezone.now()
        return value

    def validate_cover_image(self, value):
        if value:
            if value.size > 2 * 1024 * 1024:
                raise serializers.ValidationError("Cover image size must be under 2MB.")
            import os
            ext = os.path.splitext(value.name)[1].lower()
            if ext not in ['.jpg', '.jpeg', '.png', '.webp']:
                raise serializers.ValidationError("Only JPG, JPEG, PNG, and WEBP images are allowed.")
        return value


class TestimonialSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)

    class Meta:
        model = Testimonial
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

    def validate_avatar(self, value):
        if value:
            if value.size > 2 * 1024 * 1024:
                raise serializers.ValidationError("Avatar image size must be under 2MB.")
            import os
            ext = os.path.splitext(value.name)[1].lower()
            if ext not in ['.jpg', '.jpeg', '.png', '.webp']:
                raise serializers.ValidationError("Only JPG, JPEG, PNG, and WEBP images are allowed.")
        return value


class SEOSettingSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)

    class Meta:
        model = SEOSetting
        fields = '__all__'

    def validate_og_image(self, value):
        if value:
            if value.size > 2 * 1024 * 1024:
                raise serializers.ValidationError("OG image size must be under 2MB.")
            import os
            ext = os.path.splitext(value.name)[1].lower()
            if ext not in ['.jpg', '.jpeg', '.png', '.webp']:
                raise serializers.ValidationError("Only JPG, JPEG, PNG, and WEBP images are allowed.")
        return value


class ChatbotFeedbackSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)

    class Meta:
        model = ChatbotFeedback
        fields = '__all__'

class ChatbotAnalyticsSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)

    class Meta:
        model = ChatbotAnalytics
        fields = '__all__'


class CertificateSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)

    class Meta:
        model = Certificate
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_certificate_photo(self, value):
        if value:
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("Certificate file size must be under 5MB.")
        return value
