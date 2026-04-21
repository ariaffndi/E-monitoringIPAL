import { Head } from '@inertiajs/react';
import { Separator } from '@/components/ui/separator';

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
      type: string;
   };
};

type Report = {
   created_at: string;
   note: string;
   unit_tests: UnitTest[];
   water_tests: WaterTest[];
};

export default function HistoryShow({ report }: { report: Report }) {
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

   const getConditionColor = (condition: string) => {
      switch (condition?.toLowerCase()) {
            case 'sangat baik':
               return 'bg-green-100 text-green-700';
            case 'baik':
               return 'bg-blue-100 text-blue-700';
            case 'cukup':
               return 'bg-yellow-100 text-yellow-700';
            case 'kurang':
               return 'bg-orange-100 text-orange-700';
            case 'sangat kurang':
               return 'bg-red-100 text-red-700';
            default:
               return 'bg-gray-100 text-gray-700';
      }
   };

   const groupByType = (data: WaterTest[]) => {
      return {
            fisika: data.filter((d) => d.water_parameter?.type === 'fisika'),
            kimia: data.filter((d) => d.water_parameter?.type === 'kimia'),
            biologi: data.filter((d) => d.water_parameter?.type === 'biologi'),
      };
   };

   const inlet = report.water_tests.filter((w) => w.location === 'inlet');
   const outlet = report.water_tests.filter((w) => w.location === 'outlet');

   const renderTable = (data: WaterTest[]) => (
      <table className="min-w-full border text-center text-sm">
            <thead className="bg-secondary">
               <tr>
                  <th className="p-2">No</th>
                  <th className="p-2">Parameter</th>
                  <th className="p-2">Value</th>
               </tr>
            </thead>
            <tbody>
               {data.map((item, index) => (
                  <tr key={item.id}>
                        <td className="p-2">{index + 1}</td>
                        <td className="p-2">
                           {item.water_parameter?.name} (
                           {item.water_parameter?.unit})
                        </td>
                        <td className="p-2">{item.value}</td>
                  </tr>
               ))}
            </tbody>
      </table>
   );

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

               <Separator />

               {/* UNIT TEST */}
               <div className="space-y-4 my-8">
                  <h2 className="font-semibold">Unit Test</h2>

                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                     {report.unit_tests.map((item) => (
                           <div
                              key={item.id}
                              className="space-y-2 rounded border p-3 text-center"
                           >
                              <p className="font-medium">
                                 {item.unit?.name ?? '-'}
                              </p>

                              <span
                                 className={`inline-block rounded px-2 py-1 text-xs ${getConditionColor(
                                       item.condition,
                                 )}`}
                              >
                                 {item.condition || '-'}
                              </span>

                              {item.test_image ? (
                                 <img
                                       src={`/storage/${item.test_image}`}
                                       className="mx-auto h-24 w-24 rounded object-cover"
                                 />
                              ) : (
                                 <div className="mx-auto flex h-24 w-24 items-center justify-center rounded bg-muted text-xs text-gray-400">
                                       No Image
                                 </div>
                              )}
                           </div>
                     ))}
                  </div>
               </div>

               {/* WATER TEST */}
               <div className="space-y-4 my-8">
                  <h2 className="font-semibold">Water Test</h2>

                  <div className="flex flex-col gap-6 md:flex-row">
                     {/* INLET */}
                     <div className="w-full space-y-4 md:w-1/2">
                           <div className="flex items-center justify-center">
                              <h3 className="font-semibold text-blue-600">
                                 Inlet
                              </h3>
                           </div>

                           {Object.entries(groupByType(inlet)).map(
                              ([type, data]) =>
                                 data.length > 0 && (
                                       <div key={type}>
                                          <p className="mb-1 font-medium capitalize">
                                             {type}
                                          </p>
                                          {renderTable(data)}
                                       </div>
                                 ),
                           )}
                     </div>

                     {/* SEPARATOR */}
                     <div className="hidden w-px bg-border md:block" />

                     {/* OUTLET */}
                     <div className="w-full space-y-4 md:w-1/2">
                           <div className="flex items-center justify-center">
                              <h3 className="font-semibold text-green-600">
                                 Outlet
                              </h3>
                           </div>

                           {Object.entries(groupByType(outlet)).map(
                              ([type, data]) =>
                                 data.length > 0 && (
                                       <div key={type}>
                                          <p className="mb-1 font-medium capitalize">
                                             {type}
                                          </p>
                                          {renderTable(data)}
                                       </div>
                                 ),
                           )}
                     </div>
                  </div>
               </div>
         </div>
      </>
   );
}

HistoryShow.layout = {
   breadcrumbs: [{ title: 'Detail Riwayat Laporan' }],
};
