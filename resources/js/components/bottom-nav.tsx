import { router, usePage } from '@inertiajs/react';
import { Home, PlusCircle, History } from 'lucide-react';
import { NavUser } from '@/components/nav-user';

export default function BottomNav() {
    const { url, props } = usePage() as any;
    const user = props.auth?.user;

    const isOperator = user?.role === 'operator';

    const menus = [
        { label: 'Dashboard', icon: Home, href: '/dashboard' },
        {
            label: 'Input',
            icon: PlusCircle,
            href: '/operational-reports/create',
        },
        {
            label: 'Riwayat',
            icon: History,
            href: '/operational-reports/history',
        },
    ];

    
    if (!isOperator) {
      return null;
    }
    
    return (
        <div className="fixed right-0 bottom-0 left-0 z-50 border-t bg-white md:hidden rounded-t-xl">
            <div className="flex items-center justify-around py-4">
                {menus.map((menu) => {
                    const isActive = url.startsWith(menu.href);

                    return (
                        <button
                            key={menu.href}
                            onClick={() => router.visit(menu.href)}
                            className={`flex flex-col items-center text-xs ${
                                isActive ? 'text-blue-600 scale-110' : 'text-gray-500'
                            }`}
                        >
                            <menu.icon size={20} />
                            {menu.label}
                        </button>
                    );
                })}

                <NavUser variant="mobile" />
            </div>
        </div>
    );
}
