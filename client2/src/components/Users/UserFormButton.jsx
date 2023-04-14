import React from "react";
import { Link } from "react-router-dom";

function UserFormButton({ href, text, ...children }) {
  return href ? (
    <Link
      to={href}
      className="w-full bg-neutral-500 hover:bg-neutral-700 text-neutral-100 
      px-2 py-3 rounded-md shadow-md focus:bg-neutral-700
      transition-all ease-in-out disabled:bg-neutral-400 text-center outline-1"
      {...children}
      tabIndex={0}
    >
      {text}
    </Link>
  ) : (
    <button
      className="w-full bg-neutral-500 hover:bg-neutral-700 text-neutral-100 
      px-2 py-3 rounded-md shadow-md focus:bg-neutral-700
      transition-all ease-in-out disabled:bg-neutral-400 outline-1"
      {...children}
      tabIndex={0}
    >
      {text}
    </button>
  );
}

export default UserFormButton;
