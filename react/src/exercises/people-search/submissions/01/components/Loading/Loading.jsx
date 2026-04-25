export function Loading() {
    return (
        <div className="flex flex-col items-center justify-center gap-4 w-full min-h-[60vh]">
            <div className="flex items-end gap-2">
                {[
                    { color: "bg-[#8B5CF6]", delay: "delay-0" },
                    { color: "bg-[#F472B6]", delay: "delay-150" },
                    { color: "bg-[#FBBF24]", delay: "delay-300" },
                ].map(({ color, delay }) => (
                    <span
                        key={delay}
                        className={`block w-4 h-4 rounded-full border-2 border-[#1E293B] ${color} ${delay} animate-bounce`}
                    />
                ))}
            </div>
            <p className="font-bold uppercase tracking-widest text-xs text-[#64748B]">Loading...</p>
        </div>
    );
}
