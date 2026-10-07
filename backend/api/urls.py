from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    SiteSettingsViewSet, HeroSectionViewSet, AboutViewSet,
    BusinessPhilosophyViewSet, ProjectCategoryViewSet, ProjectViewSet,
    ProjectImageViewSet, ManagementMemberViewSet, ManagingDirectorMessageViewSet,
    EquipmentViewSet, ManpowerCategoryViewSet, ManpowerViewSet,
    GalleryCategoryViewSet, GalleryImageViewSet, ContactSubmissionViewSet,
    CustomTokenObtainPairView, homepage_data
)

router = DefaultRouter()
router.register(r'settings', SiteSettingsViewSet, basename='settings')
router.register(r'heroes', HeroSectionViewSet, basename='heroes')
router.register(r'about', AboutViewSet, basename='about')
router.register(r'philosophies', BusinessPhilosophyViewSet, basename='philosophies')
router.register(r'project-categories', ProjectCategoryViewSet, basename='project-categories')
router.register(r'projects', ProjectViewSet, basename='projects')
router.register(r'project-images', ProjectImageViewSet, basename='project-images')
router.register(r'management', ManagementMemberViewSet, basename='management')
router.register(r'md-message', ManagingDirectorMessageViewSet, basename='md-message')
router.register(r'equipment', EquipmentViewSet, basename='equipment')
router.register(r'manpower-categories', ManpowerCategoryViewSet, basename='manpower-categories')
router.register(r'manpower', ManpowerViewSet, basename='manpower')
router.register(r'gallery-categories', GalleryCategoryViewSet, basename='gallery-categories')
router.register(r'gallery', GalleryImageViewSet, basename='gallery')
router.register(r'contacts', ContactSubmissionViewSet, basename='contacts')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('homepage/', homepage_data, name='homepage'),
]
