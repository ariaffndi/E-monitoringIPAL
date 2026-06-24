import { FolderOpen } from 'lucide-react';

export default function ProjectEmptyState() {
    return (
        <div className="absolute inset-0 z-40 flex items-center justify-center rounded-xl bg-black/20 backdrop-blur-xs">
            <div className="flex max-w-md flex-col items-center text-center">
                <FolderOpen className="mb-4 h-14 w-14 text-muted-foreground" />

                <h2 className="text-xl font-semibold">
                    Pilih Project Terlebih Dahulu
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                    Silakan pilih project IPAL untuk menampilkan data dashboard,
                    unit, operator, parameter air, dan laporan operasional.
                </p>
            </div>
        </div>
    );
}
