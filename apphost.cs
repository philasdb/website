#:package CommunityToolkit.Aspire.Hosting.Bun@13.1.2-beta.516
#:sdk Aspire.AppHost.Sdk@13.1.1

var builder = DistributedApplication.CreateBuilder(args);

var web = builder.AddBunApp(
    name: "web-frontend",
    workingDirectory: "./web",
    entryPoint: "dev")
    .WithHttpEndpoint(targetPort: 4321);

builder.Build().Run();
