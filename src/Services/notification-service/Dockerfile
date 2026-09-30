FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:5074
EXPOSE 5074
EXPOSE 5074

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src/src/Services
COPY ["src/Services/notification-service/NotificationService.csproj", "notification-service/"]
COPY ["src/Shared/Shared.BuildingBlocks/Shared.BuildingBlocks.csproj", "../Shared/Shared.BuildingBlocks/"]
RUN dotnet restore "notification-service/NotificationService.csproj"
COPY src/Services/notification-service/ notification-service/
COPY src/Shared/Shared.BuildingBlocks/ ../Shared/Shared.BuildingBlocks/
WORKDIR "/src/src/Services/notification-service"
RUN dotnet build "./NotificationService.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./NotificationService.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "NotificationService.dll"]
