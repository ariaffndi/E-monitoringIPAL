import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';

import ProjectEmptyState from './project-empty-state';

type Props = {
    children: ReactNode;
};

export default function ProjectRequired({ children }: Props) {
    const { auth, currentProject } = usePage().props as any;

    const isAdmin = auth.user.role === 'admin';

    return (
        <div className="relative min-h-screen">
            {children}

            {isAdmin && !currentProject && <ProjectEmptyState />}
        </div>
    );
}