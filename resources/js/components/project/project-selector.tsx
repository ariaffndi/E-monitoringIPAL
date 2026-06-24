import { router, usePage } from '@inertiajs/react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

export function ProjectSelector() {
    const [open, setOpen] = useState(false);

    const { projects, currentProject } = usePage().props as any;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="w-full cursor-pointer justify-between"
                >
                    <div className="min-w-0 flex-1 text-left">
                        <span className="block truncate">
                            {currentProject
                                ? currentProject.name
                                : 'Pilih Project'}
                        </span>
                    </div>

                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[300px] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Cari project..." />

                    <CommandList>
                        <CommandEmpty>Project tidak ditemukan</CommandEmpty>

                        <CommandGroup>
                            {projects.map((project: any) => (
                                <CommandItem
                                    className="cursor-pointer"
                                    key={project.id}
                                    value={`${project.name} ${project.location}`}
                                    onSelect={() => {
                                        router.post(
                                            `/projects/${project.id}/select`,
                                            {},
                                            {
                                                preserveState: false,
                                                preserveScroll: false,
                                                onSuccess: () => {
                                                    window.location.href =
                                                        '/dashboard';
                                                },
                                            },
                                        );

                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            currentProject?.id === project.id
                                                ? 'opacity-100'
                                                : 'opacity-0',
                                        )}
                                    />

                                    <div>
                                        <p className="font-medium">
                                            {project.name}
                                        </p>

                                        <p className="text-xs text-muted-foreground">
                                            {project.location}
                                        </p>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
