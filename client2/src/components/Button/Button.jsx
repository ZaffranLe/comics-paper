import React from "react";

export default function Button({ className, text, ...children }) {
  return (
    <button
      className={`px-3 rounded-md bg-neutral-100 
            text-neutral-700 hover:bg-neutral-200 border-neutral-300
            hover:border-neutral-400 solid border
            shadow-none hover:shadow-sm focus:shadow-sm 
            focus:border-neutral-500 shadow-neutral-800 outline-none ${className}`}
      {...children}
    >
      {text}
    </button>
  );
}
