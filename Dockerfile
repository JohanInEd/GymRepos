FROM ://microsoft.com AS base
WORKDIR /app
EXPOSE 8080

FROM ://microsoft.com AS build
WORKDIR /src

# 1. Copia el archivo de proyecto .csproj desde su ubicación real
COPY ["backend/src/GymSaaS.csproj", "backend/src/"]
RUN dotnet restore "backend/src/GymSaaS.csproj"

# 2. Copia absolutamente todo el código fuente al contenedor
COPY . .

# 3. Muévete a la carpeta donde está el archivo .csproj para compilar
WORKDIR "/src/backend/src"
RUN dotnet build "GymSaaS.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "GymSaaS.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
# 4. El punto de entrada correcto de tu aplicación compilada
ENTRYPOINT ["dotnet", "GymSaaS.dll"]
