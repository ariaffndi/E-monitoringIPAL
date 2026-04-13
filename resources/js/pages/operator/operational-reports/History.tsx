import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

type Report = {
   id: number;
   date: string;
   note: string;
   unit_tests_count: number;
   water_tests_count: number;
};

export default function History({ reports }: { reports: Report[] }) {
   return (
      <>
            <Head title="Riwayat Laporan" />

            <div className="space-y-4 p-6">
               <div className="space-y-3">
                  {reports.map((report) => (
                        <div
                           key={report.id}
                           className="flex items-center justify-between rounded-lg border p-4"
                        >
                           <div>
                              <p className="font-semibold">
                                    Tanggal: {report.date}
                              </p>
                              <p className="text-sm text-gray-500">
                                    Unit Test: {report.unit_tests_count} | Water
                                    Test: {report.water_tests_count}
                              </p>
                              <p className="text-sm">{report.note}</p>
                           </div>

                           <Button
                              onClick={() =>
                                    router.get(
                                       `/operational-reports/${report.id}`,
                                    )
                              }
                           >
                              Detail
                           </Button>
                        </div>
                  ))}
               </div>
            </div>
      </>
   );
}

History.layout = {
   breadcrumbs: [{ title: 'Riwayat Laporan' }],
};
