import React from "react";
import AppHeaderSetting from "./AppHeaderSetting";

function AppHeader() {
  return (
    <div className="app-header-wrapper">
      <div className=" mx-8 py-4 flex flex-row gap-4 items-center">
        <div>
          <b className="text-3xl">Comics Paper</b> | Read the way you want
        </div>
        <div className="flex-1 flex flex-row-reverse">
          <AppHeaderSetting />
        </div>
      </div>
    </div>
  );
}

export default AppHeader;
