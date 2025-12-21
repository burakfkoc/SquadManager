from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from teams.models import Team, Membership

class Command(BaseCommand):
    help = 'Seeds the database with initial data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding database...')

        # Create User
        user, created = User.objects.get_or_create(username='testuser', email='test@example.com')
        if created:
            user.set_password('password123')
            user.save()
            self.stdout.write(self.style.SUCCESS('Created user: testuser / password123'))
        else:
            self.stdout.write('User testuser already exists')

        # Create Teams
        teams_data = [
            {
                'name': 'RoboDunkers',
                'foundation_year': 2023,
                'team_type': 'student_club',
                'education_level': 'undergraduate',
                'school_type': 'public',
                'school_name': 'Tech University',
                'country': 'Turkey',
                'city': 'Istanbul',
                'district': 'Kadikoy',
                'description': 'We dunk robots.',
            },
            {
                'name': 'Elektrogram2',
                'foundation_year': 2024,
                'team_type': 'startup',
                'education_level': 'graduate',
                'school_type': 'private',
                'school_name': 'Innovation Hub',
                'country': 'Turkey',
                'city': 'Ankara',
                'district': 'Cankaya',
                'description': 'High voltage ideas.',
            }
        ]

        for data in teams_data:
            team, created = Team.objects.get_or_create(name=data['name'], defaults=data)
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created team: {team.name}"))
            else:
                self.stdout.write(f"Team {team.name} already exists")

        # Add Membership
        team1 = Team.objects.get(name='RoboDunkers')
        Membership.objects.get_or_create(user=user, team=team1, role='captain')
        self.stdout.write(self.style.SUCCESS(f"Added testuser to {team1.name} as Captain"))

        self.stdout.write(self.style.SUCCESS('Database seeded successfully!'))
