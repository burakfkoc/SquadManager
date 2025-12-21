from django.db import models
from django.contrib.auth.models import User

class Team(models.Model):
    TEAM_TYPES = [
        ('startup', 'Startup'),
        ('research', 'Research Group'),
        ('student_club', 'Student Club'),
        ('other', 'Other'),
    ]
    
    EDUCATION_LEVELS = [
        ('high_school', 'High School'),
        ('undergraduate', 'Undergraduate'),
        ('graduate', 'Graduate'),
        ('phd', 'PhD'),
    ]
    
    SCHOOL_TYPES = [
        ('public', 'Public'),
        ('private', 'Private'),
        ('foundation', 'Foundation'),
    ]

    name = models.CharField(max_length=255)
    foundation_year = models.PositiveIntegerField()
    team_type = models.CharField(max_length=50, choices=TEAM_TYPES)
    is_graduated = models.BooleanField(default=False)
    education_level = models.CharField(max_length=50, choices=EDUCATION_LEVELS)
    school_type = models.CharField(max_length=50, choices=SCHOOL_TYPES)
    school_name = models.CharField(max_length=255)
    
    # Location
    country = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    
    description = models.TextField()
    intro_file = models.FileField(upload_to='team_intros/', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Membership(models.Model):
    ROLES = [
        ('captain', 'Captain'),
        ('mentor', 'Mentor'),
        ('member', 'Member'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='memberships')
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='memberships')
    role = models.CharField(max_length=20, choices=ROLES)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'team')

    def __str__(self):
        return f"{self.user.username} - {self.team.name} ({self.role})"

class Invitation(models.Model):
    ROLES = [
        ('captain', 'Captain'),
        ('mentor', 'Mentor'),
        ('member', 'Member'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]

    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_invitations')
    email = models.EmailField()
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='invitations')
    role = models.CharField(max_length=20, choices=ROLES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Invite to {self.email} for {self.team.name}"
