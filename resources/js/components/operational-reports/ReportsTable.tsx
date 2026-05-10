type Props = {
    reports: any[];
};

export default function ReportsTable({ reports }: Props) {
    return (
        <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
                <tr>
                    <th className="border p-2">No</th>
                    <th className="border p-2">Tanggal</th>
                    <th className="border p-2">Operator</th>
                    <th className="border p-2">Catatan</th>
                </tr>
            </thead>

            <tbody>
                {reports.map((report, index) => (
                    <tr key={report.id}>
                        <td className="border p-2 text-center">{index + 1}</td>

                        <td className="border p-2">
                            {new Date(report.created_at).toLocaleDateString(
                                'id-ID',
                            )}
                        </td>

                        <td className="border p-2">{report.user?.name}</td>

                        <td className="border p-2">{report.note || '-'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
