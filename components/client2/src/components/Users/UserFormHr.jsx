import React, { useEffect, useState } from "react";

function UserFormHr({ text }) {
  const wrapperClassList = `flex flex-row items-center ${
    text ? `gap-4` : `gap-0`
  }`;

  return (
    <div className={wrapperClassList}>
      <div className="w-full border-t-2"></div>
      {text && <div>{text}</div>}
      <div className="w-full border-t-2"></div>
    </div>
  );
}

export default UserFormHr;
