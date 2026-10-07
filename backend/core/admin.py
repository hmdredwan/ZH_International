from django.contrib import admin
from .models import (
    SiteSettings, HeroSection, About, BusinessPhilosophy,
    ProjectCategory, Project, ProjectImage, ManagementMember,
    ManagingDirectorMessage, Equipment, ManpowerCategory, Manpower,
    GalleryCategory, GalleryImage, ContactSubmission
)


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ['company_name', 'email', 'phone', 'updated_at']


@admin.register(HeroSection)
class HeroSectionAdmin(admin.ModelAdmin):
    list_display = ['title', 'is_active', 'order']
    list_editable = ['is_active', 'order']


@admin.register(About)
class AboutAdmin(admin.ModelAdmin):
    list_display = ['title', 'years_of_experience', 'projects_completed', 'updated_at']


@admin.register(BusinessPhilosophy)
class BusinessPhilosophyAdmin(admin.ModelAdmin):
    list_display = ['title', 'order', 'is_active']
    list_editable = ['order', 'is_active']


@admin.register(ProjectCategory)
class ProjectCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'year', 'status', 'is_featured', 'location']
    list_filter = ['status', 'is_featured', 'category', 'year']
    search_fields = ['title', 'location', 'client']
    prepopulated_fields = {'slug': ('title',)}
    inlines = [ProjectImageInline]


@admin.register(ManagementMember)
class ManagementMemberAdmin(admin.ModelAdmin):
    list_display = ['name', 'position', 'is_md', 'order', 'is_active']
    list_editable = ['order', 'is_active']


@admin.register(ManagingDirectorMessage)
class ManagingDirectorMessageAdmin(admin.ModelAdmin):
    list_display = ['title', 'name', 'designation', 'updated_at']


@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'quantity', 'category', 'order', 'is_active']
    list_editable = ['order', 'is_active']


@admin.register(ManpowerCategory)
class ManpowerCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'order']


@admin.register(Manpower)
class ManpowerAdmin(admin.ModelAdmin):
    list_display = ['role', 'category', 'count', 'order', 'is_active']
    list_editable = ['order', 'is_active']


@admin.register(GalleryCategory)
class GalleryCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'is_featured', 'order', 'uploaded_at']
    list_filter = ['category', 'is_featured']
    list_editable = ['order', 'is_featured']


@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at']
    readonly_fields = ['name', 'email', 'phone', 'subject', 'message', 'created_at']
