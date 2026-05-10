import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from 'recharts';

type ChartItem = {
    date: string;
    compliance: number;
};

type Props = {
    chartData: ChartItem[];
    printMode?: boolean;
};

export default function ComplianceChart({
    chartData,
    printMode = false,
}: Props) {
    return (
        <div className="h-[320px] p-4">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient
                            id="fillCompliance"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor="#2563eb"
                                stopOpacity={0.4}
                            />

                            <stop
                                offset="95%"
                                stopColor="#2563eb"
                                stopOpacity={0.05}
                            />
                        </linearGradient>
                    </defs>

                    <CartesianGrid vertical={false} />

                    <XAxis dataKey="date" />

                    <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />

                    <Area
                        type="natural"
                        dataKey="compliance"
                        stroke="#2563eb"
                        fill="url(#fillCompliance)"
                        strokeWidth={2}
                        isAnimationActive={!printMode}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
