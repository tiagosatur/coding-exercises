import { TriangleAlert } from "lucide-react";

export function Error() {
    return (
        <div className="flex justify-center py-16">
            <div className="
          flex flex-col items-center gap-4 p-8
          bg-white border-2 border-[#1E293B] rounded-xl
          shadow-[8px_8px_0px_#F472B6]
          max-w-sm text-center
        ">
                <div className="w-12 h-12 rounded-full bg-[#F472B6] border-2 border-[#1E293B] flex items-center justify-center">
                    <TriangleAlert size={22} strokeWidth={2.5} className="text-white" />
                </div>
                <div>
                    <p className="font-bold text-[#1E293B] text-base">Something went wrong</p>
                    <p className="text-[#64748B] text-sm mt-1">Could not load results. Try again later.</p>
                </div>
            </div>
        </div>
    );
}
