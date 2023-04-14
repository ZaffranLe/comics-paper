import React from "react";

function UserInput({ icon, ...children }) {
  return (
    <div className="flex flex-row items-center gap-4">
      <span>{icon || null}</span>
      <input
        className="px-2 py-2 rounded text-md shadow-sm border border-neutral-400
      w-full outline-none focus:border-neutral-800 focus:shadow-neutral-300
      transition-all ease-in-out dark:bg-neutral-500
      "
        {...children}
      />
    </div>
  );
}

export default UserInput;
