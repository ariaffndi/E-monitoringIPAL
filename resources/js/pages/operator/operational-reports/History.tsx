import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
   Pagination,
   PaginationContent,
   PaginationEllipsis,
   PaginationItem,
   PaginationLink,
   PaginationNext,
   PaginationPrevious,
} from '@/components/ui/pagination';

type Report = {
   id: number;
   created_at: string;
   note: string;
   unit_tests_count: number;
   water_tests_count: number;
};

export default function History({ reports }: any) {
   const formatTanggal = (dateString: string) => {
       const date = new Date(dateString);
       const hari = date.toLocaleDateString('id-ID', {
           weekday: 'long',
       });
       const tanggal = date.toLocaleDateString('id-ID', {
           day: '2-digit',
           month: '2-digit',
           year: 'numeric',
       });
       
       return `${hari}, ${tanggal.replace(/\//g, '-')}`;
   };

   return (
      <>
            <Head title="Riwayat Laporan" />

            <div className="space-y-4 p-6">
               <div className="space-y-3">
                  {reports.data.map((report: Report) => (
                        <div
                           key={report.id}
                           className="flex items-center justify-between rounded-lg border p-4"
                        >
                           <div>
                              <p className="font-semibold">
                                    Tanggal: {formatTanggal(report.created_at)}
                              </p>
                              <p className="text-sm text-gray-500">
                                    Unit Test: {report.unit_tests_count} | Water
                                    Test: {report.water_tests_count}
                              </p>
                              <p className="text-sm">{report.note}</p>
                           </div>

                           <Button
                              size="sm"
                              className="cursor-pointer px-3 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm"
                              onClick={() =>
                                    router.get(
                                       `/operational-reports/history/${report.id}`,
                                    )
                              }
                           >
                              Detail
                           </Button>
                        </div>
                  ))}
               </div>
               <Pagination className="mt-4">
                  <PaginationContent>
                        {/* PREV */}
                        <PaginationItem>
                           <PaginationPrevious
                              href={reports.prev_page_url || '#'}
                              onClick={(e) => {
                                    e.preventDefault();

                                    if (reports.prev_page_url) {
                                       router.visit(reports.prev_page_url);
                                    }
                              }}
                           />
                        </PaginationItem>

                        {/* NUMBER */}
                        {reports.links.map((link: any, index: number) => {
                           if (
                              link.label.includes('Previous') ||
                              link.label.includes('Next')
                           ) {
                              return null;
                           }

                           if (link.label === '...') {
                              return (
                                    <PaginationItem key={index}>
                                       <PaginationEllipsis />
                                    </PaginationItem>
                              );
                           }

                           return (
                              <PaginationItem key={index}>
                                    <PaginationLink
                                       href={link.url || '#'}
                                       isActive={link.active}
                                       onClick={(e) => {
                                          e.preventDefault();

                                          if (link.url) {
                                                router.visit(link.url);
                                          }
                                       }}
                                    >
                                       {link.label}
                                    </PaginationLink>
                              </PaginationItem>
                           );
                        })}

                        {/* NEXT */}
                        <PaginationItem>
                           <PaginationNext
                              href={reports.next_page_url || '#'}
                              onClick={(e) => {
                                    e.preventDefault();
                                    
                                    if (reports.next_page_url) {
                                       router.visit(reports.next_page_url);
                                    }
                              }}
                           />
                        </PaginationItem>
                  </PaginationContent>
               </Pagination>
            </div>
      </>
   );
}

History.layout = {
   breadcrumbs: [{ title: 'Riwayat Laporan' }],
};
