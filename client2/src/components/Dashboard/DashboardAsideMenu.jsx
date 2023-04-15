import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function DashboardAsideMenu() {
  const [entryList] = useState([
    {
      name: "Statistic",
      url: "/dashboard/",
    },
    {
      name: "Comics",
      url: "/dashboard/comics",
    },
    {
      name: "Users",
      url: "/dashboard/users",
    },
  ]);

  return (
    <div className="mx-2 flex flex-col gap-4 mt-12 sticky top-14">
      {entryList.map((_item, _index) => {
        return <DashboardMenuItem name={_item.name} url={_item.url} />;
      })}
    </div>
  );
}

function DashboardMenuItem({ name, url }) {
  return (
    <div className="px-4 py-1 font-bold">
      <Link to={url}>{name}</Link>
    </div>
  );
}
