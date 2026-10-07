from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.contrib.auth.models import User
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from core.models import (
    SiteSettings, HeroSection, About, BusinessPhilosophy,
    ProjectCategory, Project, ProjectImage, ManagementMember,
    ManagingDirectorMessage, Equipment, ManpowerCategory, Manpower,
    GalleryCategory, GalleryImage, ContactSubmission
)
from .serializers import (
    SiteSettingsSerializer, HeroSectionSerializer, AboutSerializer,
    BusinessPhilosophySerializer, ProjectCategorySerializer, ProjectSerializer,
    ProjectListSerializer, ProjectImageSerializer, ManagementMemberSerializer,
    ManagingDirectorMessageSerializer, EquipmentSerializer,
    ManpowerCategorySerializer, ManpowerSerializer,
    GalleryCategorySerializer, GalleryImageSerializer, ContactSubmissionSerializer
)


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff


class SiteSettingsViewSet(viewsets.ModelViewSet):
    queryset = SiteSettings.objects.all()
    serializer_class = SiteSettingsSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def list(self, request, *args, **kwargs):
        obj, _ = SiteSettings.objects.get_or_create(pk=1)
        serializer = self.get_serializer(obj)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        obj, _ = SiteSettings.objects.get_or_create(pk=1)
        serializer = self.get_serializer(obj)
        return Response(serializer.data)


class HeroSectionViewSet(viewsets.ModelViewSet):
    queryset = HeroSection.objects.filter(is_active=True)
    serializer_class = HeroSectionSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        if self.request.user.is_staff:
            return HeroSection.objects.all()
        return HeroSection.objects.filter(is_active=True)


class AboutViewSet(viewsets.ModelViewSet):
    queryset = About.objects.all()
    serializer_class = AboutSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def list(self, request, *args, **kwargs):
        obj, _ = About.objects.get_or_create(pk=1)
        serializer = self.get_serializer(obj)
        return Response(serializer.data)


class BusinessPhilosophyViewSet(viewsets.ModelViewSet):
    queryset = BusinessPhilosophy.objects.filter(is_active=True)
    serializer_class = BusinessPhilosophySerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_staff:
            return BusinessPhilosophy.objects.all()
        return BusinessPhilosophy.objects.filter(is_active=True)


class ProjectCategoryViewSet(viewsets.ModelViewSet):
    queryset = ProjectCategory.objects.all()
    serializer_class = ProjectCategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    lookup_field = 'slug'
    filterset_fields = ['status', 'category', 'is_featured', 'year']
    search_fields = ['title', 'location', 'client', 'short_description']

    def get_serializer_class(self):
        if self.action == 'list':
            return ProjectListSerializer
        return ProjectSerializer

    def get_queryset(self):
        qs = Project.objects.select_related('category').prefetch_related('images')
        if not self.request.user.is_staff:
            return qs.filter(status__in=['completed', 'ongoing'])
        return qs


class ProjectImageViewSet(viewsets.ModelViewSet):
    queryset = ProjectImage.objects.all()
    serializer_class = ProjectImageSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class ManagementMemberViewSet(viewsets.ModelViewSet):
    queryset = ManagementMember.objects.filter(is_active=True)
    serializer_class = ManagementMemberSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        if self.request.user.is_staff:
            return ManagementMember.objects.all()
        return ManagementMember.objects.filter(is_active=True)


class ManagingDirectorMessageViewSet(viewsets.ModelViewSet):
    queryset = ManagingDirectorMessage.objects.all()
    serializer_class = ManagingDirectorMessageSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def list(self, request, *args, **kwargs):
        obj, _ = ManagingDirectorMessage.objects.get_or_create(
            pk=1,
            defaults={'message': 'Welcome to ZH International.'}
        )
        serializer = self.get_serializer(obj)
        return Response(serializer.data)


class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = Equipment.objects.filter(is_active=True)
    serializer_class = EquipmentSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Equipment.objects.all()
        return Equipment.objects.filter(is_active=True)


class ManpowerCategoryViewSet(viewsets.ModelViewSet):
    queryset = ManpowerCategory.objects.all()
    serializer_class = ManpowerCategorySerializer
    permission_classes = [IsAdminOrReadOnly]


class ManpowerViewSet(viewsets.ModelViewSet):
    queryset = Manpower.objects.filter(is_active=True)
    serializer_class = ManpowerSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Manpower.objects.select_related('category')
        return Manpower.objects.filter(is_active=True).select_related('category')


class GalleryCategoryViewSet(viewsets.ModelViewSet):
    queryset = GalleryCategory.objects.all()
    serializer_class = GalleryCategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'


class GalleryImageViewSet(viewsets.ModelViewSet):
    queryset = GalleryImage.objects.all()
    serializer_class = GalleryImageSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filterset_fields = ['category', 'is_featured']


class ContactSubmissionViewSet(viewsets.ModelViewSet):
    queryset = ContactSubmission.objects.all()
    serializer_class = ContactSubmissionSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def perform_create(self, serializer):
        serializer.save(is_read=False)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['username'] = self.user.username
        data['is_staff'] = self.user.is_staff
        data['is_superuser'] = self.user.is_superuser
        return data


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def homepage_data(request):
    """Aggregated homepage data for performance."""
    about, _ = About.objects.get_or_create(pk=1)
    hero = HeroSection.objects.filter(is_active=True).order_by('order')[:3]
    featured_projects = Project.objects.filter(is_featured=True, status='completed')[:6]
    philosophies = BusinessPhilosophy.objects.filter(is_active=True)[:6]
    settings_obj, _ = SiteSettings.objects.get_or_create(pk=1)

    return Response({
        'settings': SiteSettingsSerializer(settings_obj).data,
        'about': AboutSerializer(about).data,
        'heroes': HeroSectionSerializer(hero, many=True).data,
        'featured_projects': ProjectListSerializer(featured_projects, many=True).data,
        'philosophies': BusinessPhilosophySerializer(philosophies, many=True).data,
    })
