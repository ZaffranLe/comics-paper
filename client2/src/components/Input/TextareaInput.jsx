import React from "react";

export default function TextareaInput({ className, ...children }) {
  return (
    <textarea
      className={`border border-neutral-400 solid 
        shadow-sm focus:shadow-md bg-neutral-200 w-full text-xl 
        px-4 py-2 rounded-md placeholder:text-neutral-400 
        text-neutral-700 transition-all ease-in-out outline-none ${className}`}
      {...children}
    ></textarea>
  );
}
