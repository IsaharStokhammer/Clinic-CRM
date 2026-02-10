export default function Loading() {
    return (
        <div className="p-8 space-y-8 animate-pulse" dir="rtl">
            <div className="h-12 w-64 bg-gray-200 rounded-xl"></div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                <div className="xl:col-span-8 space-y-6">
                    <div className="h-[200px] bg-red-50 rounded-[2rem]"></div>
                    <div className="h-[400px] bg-gray-200 rounded-[2rem]"></div>
                </div>
                <div className="xl:col-span-4">
                    <div className="h-[500px] bg-gray-200 rounded-[2rem]"></div>
                </div>
            </div>
        </div>
    );
}
