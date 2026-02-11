import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface PatientFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    activeTab: 'active' | 'inactive';
    setActiveTab: (tab: 'active' | 'inactive') => void;
    activeCount: number;
    inactiveCount: number;
}

export function PatientFilters({
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    activeCount,
    inactiveCount
}: PatientFiltersProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-auto flex-1">
                <Input
                    type="text"
                    placeholder="חיפוש מטופל לפי שם, שם הורה או טלפון..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    icon={<Search size={20} />}
                />
            </div>

            <div className="flex p-1 bg-gray-100/50 rounded-2xl border border-gray-100">
                <Button
                    variant={activeTab === 'active' ? 'primary' : 'ghost'}
                    onClick={() => setActiveTab('active')}
                    className={activeTab === 'active' ? "bg-white text-blue-600 shadow-sm hover:bg-white hover:text-blue-700 hover:shadow-md" : "text-gray-400"}
                >
                    פעילים ({activeCount})
                </Button>
                <Button
                    variant={activeTab === 'inactive' ? 'primary' : 'ghost'}
                    onClick={() => setActiveTab('inactive')}
                    className={activeTab === 'inactive' ? "bg-white text-gray-800 shadow-sm hover:bg-white hover:text-gray-900 border-none" : "text-gray-400 hover:bg-transparent"}
                >
                    ארכיון ({inactiveCount})
                </Button>
            </div>
        </div>
    );
}
