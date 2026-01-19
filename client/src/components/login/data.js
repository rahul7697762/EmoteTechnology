import { Shield, GraduationCap, Users } from 'lucide-react';

export const roles = [
    {
        id: 'admin',
        label: 'Admin',
        description: 'Manage platform',
        icon: Shield,
        gradient: 'from-violet-500 to-purple-600',
        glow: 'shadow-violet-500/30',
        bg: 'bg-violet-500/10',
        border: 'border-violet-500/50',
    },
    {
        id: 'student',
        label: 'Student',
        description: 'Learn & grow',
        icon: GraduationCap,
        gradient: 'from-teal-500 to-cyan-500',
        glow: 'shadow-teal-500/30',
        bg: 'bg-teal-500/10',
        border: 'border-teal-500/50',
    },
    {
        id: 'faculty',
        label: 'Faculty',
        description: 'Teach & inspire',
        icon: Users,
        gradient: 'from-orange-500 to-amber-500',
        glow: 'shadow-orange-500/30',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/50',
    },
];
