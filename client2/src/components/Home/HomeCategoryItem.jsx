function HomeCategoryItem() {
  return (
    <a
      href=""
      className="w-2/12 inline-block mr-6 text-neutral-500 hover:text-neutral-800"
    >
      <div className="flex flex-col">
        <img
          src="https://dummyimage.com/320x480/000/fff"
          alt="REPLACE THIS PLEASE"
          className="rounded-md"
        />
        <div className="flex flex-row">
          <span className="text-xs p-2">Name</span>
          <span>4.5/5</span>
        </div>
      </div>
    </a>
  );
}

export default HomeCategoryItem;
