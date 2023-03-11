import React from "react";
import HomeCategoryItem from "./HomeCategoryItem";

function HomeCategory({ title }) {
  return (
    <div className="px-12 py-6 flex flex-col gap-4 dark:bg-neutral-600 dark:text-neutral-50">
      <div className="text-3xl font-bold">
        {title ? title : "Unnamed category"}
      </div>

      <div className="overflow-x-scroll overflow-scroll whitespace-nowrap">
        {Array(100)
          .fill(1)
          .map(() => {
            return <HomeCategoryItem />;
          })}
      </div>
    </div>
  );
}

export default HomeCategory;
