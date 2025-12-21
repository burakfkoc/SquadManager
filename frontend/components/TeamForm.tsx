"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface TeamFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function TeamForm({ initialData, isEdit = false }: TeamFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        foundation_year: new Date().getFullYear(),
        team_type: "",
        is_graduated: false,
        education_level: "",
        school_type: "",
        school_name: "",
        country: "",
        city: "",
        district: "",
        description: "",
        intro_file: null as File | null,
    });

    useEffect(() => {
        if (initialData) {
            setFormData({ ...initialData, intro_file: null });
        }
    }, [initialData]);

    const handleChange = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null) {
                if (key === 'intro_file' && value instanceof File) {
                    data.append(key, value);
                } else {
                    data.append(key, String(value));
                }
            }
        });

        try {
            if (isEdit && initialData?.id) {
                await api.put(`/teams/${initialData.id}/`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success("Team updated successfully");
            } else {
                await api.post("/teams/", data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success("Team created successfully");
            }
            router.push("/");
        } catch (err) {
            console.error(err);
            toast.error("Operation failed");
        }
    };

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>{isEdit ? "Edit Team" : "Create New Team"}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Team Name *</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Foundation Year *</Label>
                            <Input
                                type="number"
                                value={formData.foundation_year}
                                onChange={(e) => handleChange("foundation_year", e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Team Type *</Label>
                            <Select value={formData.team_type} onValueChange={(val) => handleChange("team_type", val)}>
                                <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="startup">Startup</SelectItem>
                                    <SelectItem value="research">Research Group</SelectItem>
                                    <SelectItem value="student_club">Student Club</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Education Details */}
                    <div className="space-y-4 border-t pt-4">
                        <h3 className="font-semibold">Education Details</h3>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                checked={formData.is_graduated}
                                onCheckedChange={(checked) => handleChange("is_graduated", checked)}
                            />
                            <Label>Graduated</Label>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Education Level</Label>
                                <Select value={formData.education_level} onValueChange={(val) => handleChange("education_level", val)}>
                                    <SelectTrigger><SelectValue placeholder="Select Level" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="high_school">High School</SelectItem>
                                        <SelectItem value="undergraduate">Undergraduate</SelectItem>
                                        <SelectItem value="graduate">Graduate</SelectItem>
                                        <SelectItem value="phd">PhD</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>School Type</Label>
                                <Select value={formData.school_type} onValueChange={(val) => handleChange("school_type", val)}>
                                    <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="public">Public</SelectItem>
                                        <SelectItem value="private">Private</SelectItem>
                                        <SelectItem value="foundation">Foundation</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label>School Name</Label>
                                <Input
                                    value={formData.school_name}
                                    onChange={(e) => handleChange("school_name", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-4 border-t pt-4">
                        <h3 className="font-semibold">Location</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Country</Label>
                                <Input value={formData.country} onChange={(e) => handleChange("country", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>City</Label>
                                <Input value={formData.city} onChange={(e) => handleChange("city", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>District</Label>
                                <Input value={formData.district} onChange={(e) => handleChange("district", e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-4 border-t pt-4">
                        <h3 className="font-semibold">Details</h3>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => handleChange("description", e.target.value)}
                                rows={4}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Intro File</Label>
                            <Input
                                type="file"
                                onChange={(e) => handleChange("intro_file", e.target.files?.[0] || null)}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit">Save Team</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
