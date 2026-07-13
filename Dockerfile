FROM ://microsoft.com AS base
WORKDIR /app
EXPOSE 8080

FROM ://microsoft.com AS build
WORKDIR /src

# Copia el archivo de proyecto usando tu ruta estructurada
COPY ["backend/src/API/GymSaaS.Api.csproj", "backend/src/API/"]
RUN dotnet restore "backend/src/API/GymSaaS.Api.csproj"

# Copia el resto del código fuente al contenedor
COPY . .
WORKDIR "/src/backend/src/API"
RUN dotnet build "GymSaaS.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "GymSaaS.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "GymSaaS.Api.dll"]
