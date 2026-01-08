"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface Member {
    id: number;
    user: {
        id: number;
        username: string;
        email: string;
    };
    role: string;
    joined_at: string;
}

interface Invitation {
    id: number;
    email: string;
    role: string;
    status: string;
}

export default function MemberOperationsPage() {
    const { id } = useParams();
    const [members, setMembers] = useState<Member[]>([]);
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("member");
    const [isInviteOpen, setIsInviteOpen] = useState(false);

    useEffect(() => {
        if (id) {
            fetchMembers();
            fetchInvitations();
        }
    }, [id]);

    const fetchMembers = async () => {
        try {
            const res = await api.get(`/memberships/?team_id=${id}`);
            setMembers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchInvitations = async () => {
        try {
            // Ideally backend should filter by team, but our current endpoint returns all user related invites.
            // We might need to adjust backend or filter here.
            // Let's assume for now we see invites for this team if we are captain.
            // Actually the backend `InvitationViewSet` returns "invitations sent by user OR received by user".
            // If I am the captain, I sent them. So I should see them.
            // But I need to filter by team_id on client side if backend doesn't support it yet.
            const res = await api.get("/invitations/");
            setInvitations(res.data.filter((inv: any) => String(inv.team) === String(id)));
        } catch (err) {
            console.error(err);
        }
    };

    const handleInvite = async () => {
        try {
            await api.post("/invitations/", {
                email: inviteEmail,
                role: inviteRole,
                team: parseInt(id as string)
            });
            toast.success("Invitation sent");
            setIsInviteOpen(false);
            setInviteEmail("");
            fetchInvitations();
        } catch (err) {
            console.error(err);
            toast.error("Failed to send invitation");
        }
    };

    const handleRemoveMember = async (memberId: number) => {
        if (!confirm("Are you sure?")) return;
        try {
            await api.delete(`/memberships/${memberId}/`);
            toast.success("Member removed");
            fetchMembers();
        } catch (err) {
            console.error(err);
            toast.error("Failed to remove member");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8 space-y-8">

                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Member Operations</h1>
                    <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                        <DialogTrigger asChild>
                            <Button>Invite Member</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Invite New Member</DialogTitle>
                                <DialogDescription>
                                    Send an invitation to a new member to join your team.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Role</Label>
                                    <Select value={inviteRole} onValueChange={setInviteRole}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="captain">Captain</SelectItem>
                                            <SelectItem value="mentor">Mentor</SelectItem>
                                            <SelectItem value="member">Member</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button onClick={handleInvite} className="w-full">Send Invitation</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Members List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Team Members</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Joined At</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {members.map((member) => (
                                    <TableRow key={member.id}>
                                        <TableCell>{member.user.username}</TableCell>
                                        <TableCell>{member.user.email}</TableCell>
                                        <TableCell className="capitalize">{member.role}</TableCell>
                                        <TableCell>{new Date(member.joined_at).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Button variant="destructive" size="sm" onClick={() => handleRemoveMember(member.id)}>Kick</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Sent Invitations */}
                <Card>
                    <CardHeader>
                        <CardTitle>Sent Invitations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invitations.map((inv) => (
                                    <TableRow key={inv.id}>
                                        <TableCell>{inv.email}</TableCell>
                                        <TableCell className="capitalize">{inv.role}</TableCell>
                                        <TableCell className="capitalize">{inv.status}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
