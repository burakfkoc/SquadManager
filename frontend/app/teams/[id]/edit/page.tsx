"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import TeamForm from "@/components/TeamForm";

export default function EditTeamPage() {
    const { id } = useParams();
    const [team, setTeam] = useState(null);

    useEffect(() => {
        if (id) {
            api.get(`/teams/${id}/`).then(res => setTeam(res.data));
        }
    }, [id]);

    if (!team) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <TeamForm initialData={team} isEdit />
            </div>
        </div>
    );
}
