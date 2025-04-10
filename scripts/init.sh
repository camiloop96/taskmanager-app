#!/bin/bash

# Lista de modulos
modules=("security" "orders" "deliveries" "users" "database" "common" "config" "stats")

# Crear estructura de carpetas
for module in "${modules[@]}"; do
  mkdir -p ./src/$module/{domain/{entities,repository,services},application/{dto/{in,out},services},infrastructure/{controllers,entities,migrations,repositories}}
done

# Crear carpetas comunes
mkdir -p ./src/{common,config}
