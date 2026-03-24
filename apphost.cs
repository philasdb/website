#:package CommunityToolkit.Aspire.Hosting.Bun@13.1.2-beta.516
#:sdk Aspire.AppHost.Sdk@13.3.0-preview.1.26126.7

var builder = DistributedApplication.CreateBuilder(args);

var web = builder.AddBunApp(
    name: "psdb-site",
    workingDirectory: "./src/philasdb.site",
    entryPoint: "dev")
    .WithHttpEndpoint(targetPort: 4321);

builder.Build().Run();
