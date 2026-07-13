FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

# Imagen para compilar
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar el proyecto
COPY ["backend/src/GymSaaS.csproj", "backend/src/"]

# Restaurar paquetes
RUN dotnet restore "backend/src/GymSaaS.csproj"

# Copiar el resto del código
COPY . .

# Ir al proyecto
WORKDIR "/src/backend/src"

# Compilar
RUN dotnet build "GymSaaS.csproj" -c Release -o /app/build

# Publicar
FROM build AS publish
RUN dotnet publish "GymSaaS.csproj" \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false

# Imagen final
FROM base AS final
WORKDIR /app

COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "GymSaaS.dll"]