FROM ://microsoft.com AS base
WORKDIR /app
EXPOSE 8080

FROM ://microsoft.com AS build
WORKDIR /src

# Copia el archivo de proyecto usando tu ruta estructurada
COPY ["backend/src/GymSaaS.csproj", "backend/src/"]
RUN dotnet restore "backend/src/GymSaaS.csproj"

# Copia el resto del código fuente al contenedor
COPY . .
WORKDIR "/src/backend/src"
RUN dotnet build "GymSaaS.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "GymSaaS.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "GymSaaS.dll"]
