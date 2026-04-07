FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:5270
EXPOSE 5270
EXPOSE 5271

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["src/Services/post_service/Post.API/Post.API.csproj", "Post.API/"]
COPY ["src/Services/post_service/Post.Application/Post.Application.csproj", "Post.Application/"]
COPY ["src/Services/post_service/Post.Domain/Post.Domain.csproj", "Post.Domain/"]
COPY ["src/Services/post_service/Post.Contract/Post.Contract.csproj", "Post.Contract/"]
COPY ["src/Services/post_service/Post.Infrastructure/Post.Infrastructure.csproj", "Post.Infrastructure/"]
COPY ["src/Services/post_service/Post.Persistence/Post.Persistence.csproj", "Post.Persistence/"]

RUN dotnet restore "./Post.API/Post.API.csproj"
COPY src/Services/post_service/ .

WORKDIR "/src/Post.API"
RUN dotnet build "./Post.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Post.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Post.API.dll"]