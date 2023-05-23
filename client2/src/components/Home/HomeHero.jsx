import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

function HomeHero() {
  return (
    <div
      className=" py-16 
      flex flex-row gap-12 px-36 bg-gradient-to-r from-cyan-500 to-blue-400 relative
      dark:from-cyan-800 dark:to-blue-600 dark:text-neutral-50"
    >
      {/* Thumbnail */}
      <div className="w-2/6">
        <a href="">
          <img
            src="https://dummyimage.com/320x480/000/fff"
            alt="REPLACE THIS PLEASE"
            className="rounded-md shadow-md"
          />
        </a>
      </div>
      {/* Right side */}
      <div className="w-4/6 flex flex-col gap-4 mt-4">
        <h1 className="text-4xl font-bold">Title of the comics</h1>
        <div>Rating: 4.6/5</div>
        <p className="">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </p>
      </div>

      <button className="absolute left-0 top-0 w-12 h-full flex flex-col items-center justify-center text-cyan-600 hover:text-cyan-900 transition-colors ease-in-out">
        <HiChevronLeft className="text-3xl " />
      </button>

      <button className="absolute right-0 top-0 w-12 h-full flex flex-col items-center justify-center text-blue-600 hover:text-blue-900 transition-colors ease-in-out">
        <HiChevronRight className="text-3xl " />
      </button>
    </div>
  );
}

export default HomeHero;
