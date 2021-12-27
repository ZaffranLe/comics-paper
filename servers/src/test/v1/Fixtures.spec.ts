import ComicPaperV1 from "../../v1/ComicPaperV1";
import { MainApplication } from "../../v1/MainApplication";

export async function mochaGlobalSetup() {
  // this.server = await startSomeServer({port: process.env.TEST_PORT});
  // console.log(`server running on port ${this.server.port}`);

  // Setup v1
  const v1Application = ComicPaperV1();
  MainApplication.init(v1Application);

  // Start v1
  v1Application.listen(process.env.PORT, () => {
    console.log(`v1 server running on port ${process.env.PORT}`);
  });
}

export async function mochaGlobalTeardown() {
  // await this.server.stop();
  // console.log('server stopped!');
}
