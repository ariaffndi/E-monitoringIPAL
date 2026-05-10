type Props = {
    parameterRecap: {
        name: string;
        min: number;
        max: number;
        avg_inlet: number;
        avg_outlet: number;
    }[];
};

export default function ParameterRecapTable({ parameterRecap }: Props) {
    return (
        <table className="w-full border-collapse border text-sm">
            <thead>
                <tr className="bg-gray-100">
                    <th className="border p-2">Parameter</th>
                    <th className="border p-2">Min</th>
                    <th className="border p-2">Max</th>
                    <th className="border p-2">Avg Inlet</th>
                    <th className="border p-2">Avg Outlet</th>
                </tr>
            </thead>

            <tbody>
                {parameterRecap.map((item, index) => (
                    <tr key={index}>
                        <td className="border p-2">{item.name}</td>

                        <td className="border p-2 text-center">{item.min}</td>

                        <td className="border p-2 text-center">{item.max}</td>

                        <td className="border p-2 text-center">
                            {item.avg_inlet}
                        </td>

                        <td className="border p-2 text-center">
                            {item.avg_outlet}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
