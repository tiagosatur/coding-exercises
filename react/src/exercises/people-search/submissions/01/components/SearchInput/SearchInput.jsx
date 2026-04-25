import React from "react";

export function SearchInput({ onChange }) {
  return (
    <form>
      <label
        htmlFor="query"
        className="block text-xs font-bold uppercase tracking-widest text-[#1E293B] mb-2"
      >
        Search
      </label>
      <input
        id="query"
        type="text"
        name="query"
        onChange={onChange}
        className="
          w-full bg-white text-[#1E293B]
          border-2 border-[#CBD5E1] rounded-lg
          px-4 py-2.5
          shadow-[4px_4px_0px_transparent]
          outline-none
          transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          focus:border-[#8B5CF6] focus:shadow-[4px_4px_0px_#8B5CF6]
        "
      />
    </form>
  );
}
