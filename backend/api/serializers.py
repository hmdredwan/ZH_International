from rest_framework import serializers
from core.models import (
    SiteSettings, HeroSection, About, BusinessPhilosophy,
    ProjectCategory, Project, ProjectImage, ManagementMember,
    ManagingDirectorMessage, Equipment, ManpowerCategory, Manpower,
    GalleryCategory, GalleryImage, ContactSubmission
)


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = '__all__'


class HeroSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroSection
        fields = '__all__'


class AboutSerializer(serializers.ModelSerializer):
    class Meta:
        model = About
        fields = '__all__'


class BusinessPhilosophySerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessPhilosophy
        fields = '__all__'


class ProjectCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectCategory
        fields = '__all__'


class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):
    images = ProjectImageSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Project
        fields = '__all__'


class ProjectListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'title', 'slug', 'short_description', 'location', 'client',
                  'year', 'status', 'featured_image', 'is_featured', 'category', 'category_name']


class ManagementMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManagementMember
        fields = '__all__'


class ManagingDirectorMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManagingDirectorMessage
        fields = '__all__'


class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipment
        fields = '__all__'


class ManpowerCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ManpowerCategory
        fields = '__all__'


class ManpowerSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Manpower
        fields = '__all__'


class GalleryCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryCategory
        fields = '__all__'


class GalleryImageSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = GalleryImage
        fields = '__all__'


class ContactSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = '__all__'
        read_only_fields = ['created_at']
