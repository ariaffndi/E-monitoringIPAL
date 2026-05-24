import type { LucideIcon } from 'lucide-react';

type ProjectStatCardProps = {
    title: string;
    value: number;
    icon: LucideIcon;
    iconBg: string;
    iconColor: string;
};

export default function ProjectStatCard({
    title,
    value,
    icon: Icon,
    iconBg,
    iconColor,
}: ProjectStatCardProps) {
    return (
        <div className="rounded-2xl border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-4">
                {/* ICON */}
                <div
                    className={`flex h-12 w-12 items-center justify-center rounded-md ${iconBg}`}
                >
                    <Icon className={iconColor} size={24} />
                </div>

                {/* TEXT */}
                <div>
                    <p className="text-sm text-muted-foreground">{title}</p>

                    <h2 className="text-2xl font-bold">{value}</h2>
                </div>
            </div>
        </div>
    );
}
