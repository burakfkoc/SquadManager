from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Team, Membership, Invitation
from .serializers import TeamSerializer, MembershipSerializer, InvitationSerializer

class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        team = serializer.save()
        # Auto-add creator as Captain
        Membership.objects.create(user=self.request.user, team=team, role='captain')

    def get_queryset(self):
        # Return teams where the user is a member
        return Team.objects.filter(memberships__user=self.request.user)

class MembershipViewSet(viewsets.ModelViewSet):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Filter by team if provided in query params
        team_id = self.request.query_params.get('team_id')
        if team_id:
            return self.queryset.filter(team_id=team_id)
        return self.queryset

class InvitationViewSet(viewsets.ModelViewSet):
    queryset = Invitation.objects.all()
    serializer_class = InvitationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return invitations sent by user OR received by user's email
        return Invitation.objects.filter(
            Q(sender=self.request.user) | Q(email=self.request.user.email)
        )

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

    @action(detail=True, methods=['post'])
    def respond(self, request, pk=None):
        invitation = self.get_object()
        action = request.data.get('action') # 'accept' or 'reject'
        
        if action == 'accept':
            invitation.status = 'accepted'
            invitation.save()
            # Add to team
            Membership.objects.create(
                user=request.user,
                team=invitation.team,
                role=invitation.role
            )
            return Response({'status': 'accepted'})
        elif action == 'reject':
            invitation.status = 'rejected'
            invitation.save()
            return Response({'status': 'rejected'})
        
        return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)
