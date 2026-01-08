"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

interface Team {
  id: number;
  name: string;
  foundation_year: number;
  team_type: string;
  role?: string; // We might need to fetch this separately or enrich the API
}

interface Invitation {
  id: number;
  team_name: string;
  sender_name: string;
  role: string;
  status: string;
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchTeams();
      fetchInvitations();
    }
  }, [user]);

  const fetchTeams = async () => {
    try {
      const res = await api.get("/teams/");
      setTeams(res.data);
    } catch (err) {
      console.error("Failed to fetch teams", err);
    }
  };

  const fetchInvitations = async () => {
    try {
      const res = await api.get("/invitations/");
      setInvitations(res.data.filter((inv: Invitation) => inv.status === 'pending'));
    } catch (err) {
      console.error("Failed to fetch invitations", err);
    }
  };

  const handleInviteResponse = async (id: number, action: 'accept' | 'reject') => {
    try {
      await api.post(`/invitations/${id}/respond/`, { action });
      fetchInvitations();
      fetchTeams(); // Refresh teams if accepted
    } catch (err) {
      console.error("Failed to respond to invite", err);
    }
  };

  const filteredTeams = teams.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div>Loading...</div>;
  if (!user) return null; // Wait for redirect

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-8">

        {/* Invitations Section */}
        {invitations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Incoming Invitations</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team</TableHead>
                    <TableHead>Invited By</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitations.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell>{inv.team_name}</TableCell>
                      <TableCell>{inv.sender_name}</TableCell>
                      <TableCell className="capitalize">{inv.role}</TableCell>
                      <TableCell className="space-x-2">
                        <Button size="sm" onClick={() => handleInviteResponse(inv.id, 'accept')}>Accept</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleInviteResponse(inv.id, 'reject')}>Reject</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Teams Section */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Teams</h1>
          <Link href="/teams/create">
            <Button>+ New Team</Button>
          </Link>
        </div>

        <div className="flex gap-4">
          <Input
            placeholder="Search teams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <Card key={team.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {team.name}
                  <span className="text-sm font-normal text-gray-500">{team.foundation_year}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 capitalize">{team.team_type.replace('_', ' ')}</p>
                <div className="flex gap-2">
                  <Link href={`/teams/${team.id}/edit`}>
                    <Button variant="outline" size="sm">Edit</Button>
                  </Link>
                  <Link href={`/teams/${team.id}/members`}>
                    <Button variant="secondary" size="sm">Manage Members</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
