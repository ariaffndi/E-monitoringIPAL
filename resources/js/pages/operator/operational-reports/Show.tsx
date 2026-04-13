import { Head } from '@inertiajs/react';

type UnitTest = {
   id: number;
   condition: string;
   test_image?: string | null;
   unit?: {
      name: string;
   };
};

type WaterTest = {
   id: number;
   location: string;
   value: string;
   test_image?: string | null;
   water_parameter?: {
      name: string;
      unit: string;
   };
};

type Report = {
   created_at: string;
   note: string;
   unit_tests: UnitTest[];
   water_tests: WaterTest[];
};

export default function Show({ report }: { report: Report }) {
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
            <Head title="Detail Laporan" />

            <div className="space-y-6 p-6">
               {/* HEADER */}
               <div>
                  <p>
                        <b>Tanggal:</b> {formatTanggal(report.created_at)}
                  </p>
                  <p>
                        <b>Catatan:</b> {report.note || '-'}
                  </p>
               </div>

               {/* UNIT TEST */}
               <div>
                  <h2 className="font-semibold">Unit Test</h2>

                  {report.unit_tests?.length ? (
                        report.unit_tests.map((item) => (
                           <div
                              key={item.id}
                              className="mb-2 rounded border p-3"
                           >
                              <p className="font-medium">
                                    {item.unit?.name ?? '-'}
                              </p>
                              <p>Kondisi: {item.condition ?? '-'}</p>

                              {item.test_image && (
                                    <img
                                       src={`/storage/${item.test_image}`}
                                       className="mt-2 h-24 w-24 rounded object-cover"
                                    />
                              )}
                           </div>
                        ))
                  ) : (
                        <p className="text-sm text-gray-500">
                           Tidak ada data unit test
                        </p>
                  )}
               </div>

               {/* WATER TEST */}
               <div>
                  <h2 className="font-semibold">Water Test</h2>

                  {report.water_tests?.length ? (
                        report.water_tests.map((item) => (
                           <div
                              key={item.id}
                              className="mb-2 rounded border p-3"
                           >
                              <p className="font-medium">
                                    {item.water_parameter?.name ?? '-'} (
                                    {item.location})
                              </p>

                              <p>
                                    Value: {item.value}{' '}
                                    {item.water_parameter?.unit ?? ''}
                              </p>

                              {item.test_image && (
                                    <img
                                       src={`/storage/${item.test_image}`}
                                       className="mt-2 h-24 w-24 rounded object-cover"
                                    />
                              )}
                           </div>
                        ))
                  ) : (
                        <p className="text-sm text-gray-500">
                           Tidak ada data water test
                        </p>
                  )}
               </div>
            </div>
      </>
   );
}

Show.layout = {
   breadcrumbs: [{ title: 'Detail Laporan' }],
};
