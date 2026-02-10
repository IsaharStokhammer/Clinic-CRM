'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Calendar, CreditCard, Clock, Settings, LogOut } from 'lucide-react';

const menuItems = [
    { name: 'דשבורד', icon: Home, href: '/' },
    { name: 'יומן', icon: Calendar, href: '/calendar' },
    { name: 'מטופלים', icon: Users, href: '/patients' },
    { name: 'מפגשים', icon: Clock, href: '/sessions' },
    { name: 'כספים', icon: CreditCard, href: '/billing' },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden lg:flex flex-col w-64 bg-white border-l border-gray-100 p-6 space-y-8 h-screen sticky top-0 overflow-y-auto z-50">
            <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">
                    C
                </div>
                <span className="font-bold text-xl text-gray-900 leading-none">Management App</span>
            </div>

            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive
                                ? 'bg-blue-50 text-blue-700 shadow-sm shadow-blue-100'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="pt-6 border-t border-gray-100">
                <button className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl font-medium transition-all w-full text-right">
                    <Settings size={20} />
                    <span>הגדרות</span>
                </button>
                <button className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl font-medium transition-all w-full text-right mt-1">
                    <LogOut size={20} />
                    <span>התנתק</span>
                </button>
            </div>
        </aside>
    );
}
