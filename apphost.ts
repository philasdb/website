import { createBuilder } from "./.modules/aspire.js";

const builder = await createBuilder();

const web = await builder
  .addExecutable("psdb-site", "bun", "./src/philasdb.site", ["run", "dev"])
  .withHttpEndpoint({ targetPort: 4321 });

await builder.build().run();
