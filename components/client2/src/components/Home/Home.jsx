import React, { Suspense } from "react";

import HomeHero from "./HomeHero";

/**
 * Lazy load
 */

const HomeCategory = React.lazy(() => import("./HomeCategory"));

function Home(props) {
  return (
    <div>
      {/* Hero  */}
      <HomeHero />

      {/* Last update */}
      <Suspense children={<div>Hi</div>}>
        <HomeCategory title="Last updated" />
      </Suspense>

      {/* New arrived */}
      <HomeCategory title="New arrived" />

      {/* Your comics */}
      <HomeCategory title="Your comics" />
    </div>
  );
}

export default Home;
