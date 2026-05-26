import { Head, router, useForm } from '@inertiajs/react';
import {
   MoreVertical,
   Pencil,
   PlusCircle,
   Search,
   Trash2,
   FolderOpen,
   LayoutDashboard,
   Building2,
   Factory,
   Hospital,
   MapPin,
   Plus,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import ModalConfirmDelete from '@/components/modal-confirm-delete';
import ModalCreate from '@/components/modal-create';
import ProjectStatCard from '@/components/project-stat-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import {
   Card,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Field, FieldLabel } from '@/components/ui/field';

import { Input } from '@/components/ui/input';

import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';

import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';

type Project = {
   id: number;
   name: string;
   location: string;
   type: string;
   capacity: string;
   image?: string | null;
};

type Props = {
   projects: Project[];
};

export default function Index({ projects }: Props) {
   const [search, setSearch] = useState('');

   const [loading, setLoading] = useState(false);

   const [openCreate, setOpenCreate] = useState(false);

   const [isEdit, setIsEdit] = useState(false);

   const [selectedProject, setSelectedProject] = useState<Project | null>(
      null,
   );

   const [openDelete, setOpenDelete] = useState(false);

   const [selectedId, setSelectedId] = useState<number | null>(null);

   const { data, setData, post, processing, reset, errors } = useForm({
      name: '',
      location: '',
      type: '',
      capacity: '',
      image: null as File | null,
   });

   // SEARCH
   useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(true);

      const delay = setTimeout(() => {
            router.get('/projects', search ? { search } : {}, {
               preserveState: true,
               replace: true,
               onFinish: () => setLoading(false),
            });
      }, 300);

      return () => clearTimeout(delay);
   }, [search]);

   // SUBMIT
   const handleSubmit = () => {
      if (isEdit && selectedProject) {
            router.post(
               `/projects/${selectedProject.id}`,
               {
                  ...data,
                  _method: 'put',
               },
               {
                  forceFormData: true,
                  onSuccess: () => {
                        setOpenCreate(false);

                        setIsEdit(false);

                        reset();

                        toast.success('Project berhasil diupdate');
                  },
               },
            );

            return;
      }

      post('/projects', {
            forceFormData: true,
            onSuccess: () => {
               setOpenCreate(false);

               reset();

               toast.success('Project berhasil ditambahkan');
            },
      });
   };

   // EDIT
   const handleEdit = (project: Project) => {
      setSelectedProject(project);

      setData({
            name: project.name,
            location: project.location,
            type: project.type,
            capacity: project.capacity,
            image: null,
      });

      setIsEdit(true);

      setOpenCreate(true);
   };

   // DELETE
   const handleDelete = () => {
      if (!selectedId) {
            return;
      }

      router.delete(`/projects/${selectedId}`, {
            onSuccess: () => {
               setOpenDelete(false);

               toast.success('Project berhasil dihapus');
            },
      });
   };

   const confirmDelete = (id: number) => {
      setSelectedId(id);

      setOpenDelete(true);
   };

   const handleCloseModal = () => {
      setOpenCreate(false);

      setIsEdit(false);

      reset();
   };

   const getTypeColor = (type: string) => {
      switch (type) {
            case 'Domestik':
               return 'bg-green-100 text-green-700';

            case 'Industri':
               return 'bg-yellow-100 text-yellow-700';

            case 'Medis':
               return 'bg-red-100 text-red-700';

            default:
               return 'bg-gray-100 text-gray-700';
      }
   };

   return (
      <>
            <Head title="Projects" />

            <div className="flex flex-col gap-4 p-6">
               {/* HEADER */}
               <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                           Select Project
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                           Welcome back. Please select an IPAL Project to begin
                           monitoring and reporting.
                        </p>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="relative w-full sm:w-80">
                           <Search
                              className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
                              size={16}
                           />

                           <Input
                              placeholder="Cari project..."
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              className="pl-10"
                           />

                           {loading && (
                              <div className="absolute top-1/2 right-3 -translate-y-1/2">
                                    <Spinner className="size-4" />
                              </div>
                           )}
                        </div>

                        <Button
                           onClick={() => setOpenCreate(true)}
                           className="cursor-pointer bg-blue-600 transition-transform duration-500 hover:scale-105 hover:bg-blue-700"
                        >
                           <PlusCircle />
                           Tambah Project
                        </Button>
                  </div>
               </div>

               <Separator />

               {/* STATS */}
               <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3 xl:grid-cols-4">
                  <ProjectStatCard
                        title="Total Project"
                        value={projects.length}
                        icon={LayoutDashboard}
                        iconBg="bg-blue-100"
                        iconColor="text-blue-600"
                  />

                  <ProjectStatCard
                        title="Project Domestik"
                        value={
                           projects.filter((p) => p.type === 'Domestik').length
                        }
                        icon={Building2}
                        iconBg="bg-green-100"
                        iconColor="text-green-600"
                  />

                  <ProjectStatCard
                        title="Project Industri"
                        value={
                           projects.filter((p) => p.type === 'Industri').length
                        }
                        icon={Factory}
                        iconBg="bg-yellow-100"
                        iconColor="text-yellow-600"
                  />

                  <ProjectStatCard
                        title="Project Medis"
                        value={
                           projects.filter((p) => p.type === 'Medis').length
                        }
                        icon={Hospital}
                        iconBg="bg-red-100"
                        iconColor="text-red-600"
                  />
               </div>

               {/* EMPTY */}
               {projects.length === 0 ? (
                  <div className="flex min-h-112.5 flex-col items-center justify-center rounded-3xl border border-dashed bg-muted/20 p-10 text-center">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
                           <FolderOpen size={50} className="text-blue-600" />
                        </div>

                        <h2 className="mt-6 text-2xl font-bold">
                           Belum Ada Project
                        </h2>

                        <p className="mt-2 max-w-md text-muted-foreground">
                           Tambahkan project IPAL untuk mulai melakukan
                           monitoring kualitas air limbah.
                        </p>

                        <Button
                           onClick={() => setOpenCreate(true)}
                           className="mt-6 cursor-pointer"
                        >
                           <PlusCircle />
                           Tambah Project
                        </Button>
                  </div>
               ) : (
                  <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {projects.map((project) => (
                           <Card
                              onClick={() => {
                                    router.post(
                                       `/projects/${project.id}/select`,
                                    );
                              }}
                              key={project.id}
                              className="group cursor-pointer overflow-hidden rounded-2xl pt-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                           >
                              {/* IMAGE */}
                              <div className="relative">
                                    {/* OVERLAY */}
                                    <div className="absolute inset-0 z-10 bg-black/10" />

                                    {/* BADGE */}
                                    <div className="absolute top-4 left-4 z-20">
                                       <Badge
                                          className={getTypeColor(
                                                project.type,
                                          )}
                                       >
                                          {project.type}
                                       </Badge>
                                    </div>

                                    {/* DROPDOWN */}
                                    <div className="absolute top-4 right-4 z-20">
                                       <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                                <Button
                                                   variant="ghost"
                                                   size="icon"
                                                   className="cursor-pointer rounded-full bg-transparent p-0 hover:bg-white/10"
                                                >
                                                   <MoreVertical
                                                      size={28}
                                                      strokeWidth={2.5}
                                                      className="text-white"
                                                   />
                                                </Button>
                                          </DropdownMenuTrigger>

                                          <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                   className="cursor-pointer text-yellow-500 focus:text-yellow-500"
                                                   onClick={(e) => {
                                                      e.stopPropagation();

                                                      handleEdit(project);
                                                   }}
                                                >
                                                   <Pencil
                                                      size={16}
                                                      className="mr-2"
                                                   />
                                                   Edit
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                   className="cursor-pointer text-red-500 focus:text-red-500"
                                                   onClick={(e) => {
                                                      e.stopPropagation();

                                                      confirmDelete(
                                                            project.id,
                                                      );
                                                   }}
                                                >
                                                   <Trash2
                                                      size={16}
                                                      className="mr-2"
                                                   />
                                                   Hapus
                                                </DropdownMenuItem>
                                          </DropdownMenuContent>
                                       </DropdownMenu>
                                    </div>

                                    {/* IMAGE */}
                                    {project.image ? (
                                       <img
                                          src={`/storage/${project.image}`}
                                          alt={project.name}
                                          className="relative z-0 aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                       />
                                    ) : (
                                       <div className="flex aspect-video w-full items-center justify-center bg-blue-100">
                                          <FolderOpen
                                                size={60}
                                                className="text-blue-600"
                                          />
                                       </div>
                                    )}
                              </div>

                              {/* CONTENT */}
                              <CardHeader className="">
                                    {/* TITLE */}
                                    <div>
                                       <CardTitle className="line-clamp-1 text-lg">
                                          {project.name}
                                       </CardTitle>
                                    </div>

                                    {/* LOCATION & CAPACITY */}
                                    <div className="flex items-center justify-between gap-4">
                                       <CardDescription className="flex-column line-clamp-1 flex items-center gap-1">
                                          <MapPin size={16} />{' '}
                                          {project.location}
                                       </CardDescription>
                                       <CardDescription className="line-clamp-1">
                                          {project.capacity} m³/hari
                                       </CardDescription>
                                    </div>
                              </CardHeader>

                              {/* SEPARATOR */}
                              <div className="px-6">
                                    <Separator />
                              </div>

                              {/* FOOTER */}
                              <CardFooter className="">
                                    <Button
                                       className="w-full cursor-pointer bg-blue-100 text-blue-600 hover:bg-blue-500 hover:text-white"
                                       onClick={() => {
                                          router.post(
                                                `/projects/${project.id}/select`,
                                          );
                                       }}
                                    >
                                       Masuk Project
                                    </Button>
                              </CardFooter>
                           </Card>
                        ))}
                        {/* ADD NEW PROJECT CARD */}
                        <Card
                           onClick={() => setOpenCreate(true)}
                           className="flex h-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-50 hover:shadow-xl"
                        >
                           <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 transition-colors duration-300 group-hover:bg-blue-200">
                              <Plus
                                    size={42}
                                    className="text-muted-foreground"
                              />
                           </div>
                           <h2 className="text-lg font-semibold text-muted-foreground">
                              Add New Project
                           </h2>

                           <p className="max-w-xs text-sm text-muted-foreground">
                              Configure a new IPAL unit for real-time
                              monitoring
                           </p>
                        </Card>
                  </div>
               )}
            </div>

            {/* MODAL CREATE */}
            <ModalCreate
               open={openCreate}
               setOpen={handleCloseModal}
               title={isEdit ? 'Edit Project' : 'Tambah Project'}
               onSubmit={handleSubmit}
               processing={processing}
            >
               <Field>
                  <FieldLabel>Nama Project</FieldLabel>

                  <Input
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                  />

                  {errors.name && (
                        <p className="text-xs text-red-500">{errors.name}</p>
                  )}
               </Field>

               <Field>
                  <FieldLabel>Lokasi</FieldLabel>

                  <Input
                        value={data.location}
                        onChange={(e) => setData('location', e.target.value)}
                  />
               </Field>

               <Field>
                  <FieldLabel htmlFor="type">Jenis IPAL</FieldLabel>

                  <Select
                        value={data.type}
                        onValueChange={(value) => setData('type', value)}
                  >
                        <SelectTrigger className="cursor-pointer">
                           <SelectValue placeholder="Pilih Jenis IPAL" />
                        </SelectTrigger>

                        <SelectContent>
                           <SelectGroup>
                              <SelectItem value="Domestik">
                                    Domestik
                              </SelectItem>

                              <SelectItem value="Industri">
                                    Industri
                              </SelectItem>

                              <SelectItem value="Medis">Medis</SelectItem>

                              <SelectItem value="Lainnya">Lainnya</SelectItem>
                           </SelectGroup>
                        </SelectContent>
                  </Select>

                  {errors.type && (
                        <p className="text-xs text-red-500">{errors.type}</p>
                  )}
               </Field>

               <Field>
                  <FieldLabel>Kapasitas (m3/Hari)</FieldLabel>

                  <Input
                        value={data.capacity}
                        onChange={(e) => setData('capacity', e.target.value)}
                        type="number"
                  />
               </Field>

               <Field>
                  <FieldLabel htmlFor="picture">Gambar</FieldLabel>

                  {(isEdit && selectedProject?.image) || data.image ? (
                        <div>
                           <img
                              src={
                                    data.image
                                       ? URL.createObjectURL(data.image)
                                       : selectedProject?.image
                                          ? `/storage/${selectedProject.image}`
                                          : ''
                              }
                              alt={data.name || 'Preview'}
                              className="mt-2 h-25 w-25 rounded-lg object-cover"
                           />
                        </div>
                  ) : (
                        <div className="mb-2 text-sm text-muted-foreground">
                           Belum ada gambar
                        </div>
                  )}

                  <Input
                        type="file"
                        className="cursor-pointer"
                        onChange={(e) => {
                           const file = e.target.files?.[0] ?? null;

                           setData('image', file);
                        }}
                  />

                  {errors.image && (
                        <p className="text-xs text-red-500">{errors.image}</p>
                  )}
               </Field>
            </ModalCreate>

            {/* DELETE */}
            <ModalConfirmDelete
               open={openDelete}
               setOpen={setOpenDelete}
               title="Hapus Project?"
               description="Apakah anda yakin ingin menghapus project ini?"
               onConfirm={handleDelete}
            />
      </>
   );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Home',
            href: '/dashboard',
        },
        {
            title: 'Project IPAL',
        },
    ],
};
