from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Team, Membership, Invitation

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'

class MembershipSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    team_name = serializers.CharField(source='team.name', read_only=True)
    
    class Meta:
        model = Membership
        fields = ['id', 'user', 'team', 'team_name', 'role', 'joined_at']

class InvitationSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.username', read_only=True)
    team_name = serializers.CharField(source='team.name', read_only=True)
    
    class Meta:
        model = Invitation
        fields = ['id', 'sender', 'sender_name', 'email', 'team', 'team_name', 'role', 'status', 'created_at']
        read_only_fields = ['sender']
