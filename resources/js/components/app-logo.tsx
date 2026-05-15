import AppLogoIcon from '@/components/app-logo-icon';

type Props = {
    textClassName?: string;
    iconClassName?: string;
};

export default function AppLogo({
    textClassName = 'text-sm',
    iconClassName = 'size-8',
}: Props) {
    return (
        <>
            <div
                className={`flex aspect-square items-center justify-center rounded-md text-sidebar-primary-foreground ${iconClassName}`}
            >
                <AppLogoIcon />
            </div>

            <div className={`ml-1 grid flex-1 text-left ${textClassName}`}>
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    E-Monitoring IPAL
                </span>
            </div>
        </>
    );
}
