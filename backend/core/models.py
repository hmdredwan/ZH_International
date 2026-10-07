from django.db import models
from django.utils.text import slugify


class SiteSettings(models.Model):
    """Global site configuration – singleton pattern."""
    company_name = models.CharField(max_length=200, default="ZH International")
    tagline = models.CharField(max_length=300, default="Building A Better Tomorrow")
    logo = models.ImageField(upload_to='site/', blank=True, null=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    address = models.TextField(blank=True)
    facebook = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)
    twitter = models.URLField(blank=True)
    instagram = models.URLField(blank=True)
    youtube = models.URLField(blank=True)
    footer_text = models.TextField(blank=True, default="© ZH International. All rights reserved.")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Site Settings"
        verbose_name_plural = "Site Settings"

    def __str__(self):
        return self.company_name

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)


class HeroSection(models.Model):
    """Homepage hero content."""
    title = models.CharField(max_length=200, default="Building A Better Tomorrow")
    subtitle = models.TextField(blank=True)
    background_image = models.ImageField(upload_to='hero/', blank=True, null=True)
    cta_text = models.CharField(max_length=50, default="Explore Our Projects")
    cta_link = models.CharField(max_length=200, default="/projects")
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = "Hero Section"
        verbose_name_plural = "Hero Sections"

    def __str__(self):
        return self.title


class About(models.Model):
    """About page content."""
    title = models.CharField(max_length=200, default="About ZH International")
    short_description = models.TextField(blank=True)
    full_content = models.TextField(blank=True)
    vision = models.TextField(blank=True)
    mission = models.TextField(blank=True)
    values = models.TextField(blank=True, help_text="JSON or plain text values")
    image = models.ImageField(upload_to='about/', blank=True, null=True)
    years_of_experience = models.PositiveIntegerField(default=0)
    projects_completed = models.PositiveIntegerField(default=0)
    clients_served = models.PositiveIntegerField(default=0)
    team_members = models.PositiveIntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "About"
        verbose_name_plural = "About"

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)


class BusinessPhilosophy(models.Model):
    """Business philosophy / principles."""
    title = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(max_length=50, blank=True, help_text="Icon name e.g. 'shield', 'users'")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']
        verbose_name_plural = "Business Philosophies"

    def __str__(self):
        return self.title


class ProjectCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = "Project Categories"
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Project(models.Model):
    """Completed / Ongoing projects."""
    STATUS_CHOICES = [
        ('completed', 'Completed'),
        ('ongoing', 'Ongoing'),
        ('upcoming', 'Upcoming'),
    ]
    title = models.CharField(max_length=250)
    slug = models.SlugField(max_length=270, unique=True, blank=True)
    category = models.ForeignKey(ProjectCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='projects')
    short_description = models.TextField(blank=True)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=200, blank=True)
    client = models.CharField(max_length=200, blank=True)
    year = models.PositiveIntegerField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='completed')
    featured_image = models.ImageField(upload_to='projects/', blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-year', 'order', '-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title)
            slug = base
            counter = 1
            while Project.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class ProjectImage(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='projects/gallery/')
    caption = models.CharField(max_length=250, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.project.title} - Image {self.order}"


class ManagementMember(models.Model):
    """Company Management / Leadership team."""
    name = models.CharField(max_length=150)
    position = models.CharField(max_length=150)
    bio = models.TextField(blank=True)
    photo = models.ImageField(upload_to='management/', blank=True, null=True)
    email = models.EmailField(blank=True)
    linkedin = models.URLField(blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    is_md = models.BooleanField(default=False, help_text="Is Managing Director?")

    class Meta:
        ordering = ['order', 'name']
        verbose_name = "Management Member"
        verbose_name_plural = "Management Members"

    def __str__(self):
        return f"{self.name} - {self.position}"


class ManagingDirectorMessage(models.Model):
    """MD's message page."""
    title = models.CharField(max_length=200, default="Message from the Managing Director")
    message = models.TextField()
    photo = models.ImageField(upload_to='md/', blank=True, null=True)
    name = models.CharField(max_length=150, default="Managing Director")
    designation = models.CharField(max_length=150, default="Managing Director")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "MD Message"
        verbose_name_plural = "MD Message"

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)


class Equipment(models.Model):
    """Equipment Owned."""
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    quantity = models.PositiveIntegerField(default=1)
    image = models.ImageField(upload_to='equipment/', blank=True, null=True)
    category = models.CharField(max_length=100, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', 'name']
        verbose_name_plural = "Equipment"

    def __str__(self):
        return f"{self.name} ({self.quantity})"


class ManpowerCategory(models.Model):
    name = models.CharField(max_length=150, unique=True)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']
        verbose_name_plural = "Manpower Categories"

    def __str__(self):
        return self.name


class Manpower(models.Model):
    """Manpower / Human resources list."""
    category = models.ForeignKey(ManpowerCategory, on_delete=models.CASCADE, related_name='members', null=True, blank=True)
    role = models.CharField(max_length=150)
    count = models.PositiveIntegerField(default=1)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', 'role']
        verbose_name_plural = "Manpower"

    def __str__(self):
        return f"{self.role} ({self.count})"


class GalleryCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)

    class Meta:
        verbose_name_plural = "Gallery Categories"
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class GalleryImage(models.Model):
    category = models.ForeignKey(GalleryCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='images')
    title = models.CharField(max_length=200, blank=True)
    image = models.ImageField(upload_to='gallery/')
    caption = models.CharField(max_length=300, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-uploaded_at']
        verbose_name_plural = "Gallery Images"

    def __str__(self):
        return self.title or f"Gallery Image {self.pk}"


class ContactSubmission(models.Model):
    """Contact form submissions from frontend."""
    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True)
    subject = models.CharField(max_length=200, blank=True)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.subject or 'No subject'}"
