export const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'sangat baik':
            return 'bg-green-100 text-green-700';

        case 'baik':
            return 'bg-blue-100 text-blue-700';

        case 'cukup':
            return 'bg-yellow-100 text-yellow-700';

        case 'kurang':
            return 'bg-orange-100 text-orange-700';

        default:
            return 'bg-red-100 text-red-700';
    }
};
