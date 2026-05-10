import { getStatusColor } from './utils';

type Props = {
    unitRecap: {
        name: string;
        avg: number;
        status: string;
    }[];
};

export default function UnitRecapTable({ unitRecap }: Props) {
    return (
        <table className="w-full border-collapse border text-sm">
            <thead>
                <tr className="bg-gray-100">
                    <th className="border p-2">Unit</th>

                    <th className="border p-2">Rata-rata</th>

                    <th className="border p-2">Status</th>
                </tr>
            </thead>

            <tbody>
                {unitRecap.map((item, index) => (
                    <tr key={index}>
                        <td className="border p-2">{item.name}</td>

                        <td className="border p-2 text-center">{item.avg}</td>

                        <td className="border p-2 text-center">
                            <span
                                className={`rounded-full px-3 py-1 text-xs ${getStatusColor(
                                    item.status,
                                )}`}
                            >
                                {item.status}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
