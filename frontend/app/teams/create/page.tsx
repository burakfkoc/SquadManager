"use client";

import Navbar from "@/components/Navbar";
import TeamForm from "@/components/TeamForm";

export default function CreateTeamPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <TeamForm />
            </div>
        </div>
    );
}
