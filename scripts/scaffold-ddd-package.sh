
nest generate app $1

# cleanup
rm -r ./apps/$1/test  
rm ./apps/$1/src/$1.controller.spec.ts
rm ./apps/$1/src/$1.controller.ts
rm ./apps/$1/src/$1.service.ts

# core
mkdir -p ./apps/$1/src/core/application/ports
mkdir -p ./apps/$1/src/core/application/services
mkdir -p ./apps/$1/src/core/domain/aggregates
mkdir -p ./apps/$1/src/core/domain/entities
mkdir -p ./apps/$1/src/core/domain/services
mkdir -p ./apps/$1/src/core/domain/value-objects

# infrastructure
mkdir -p ./apps/$1/src/infrastructure/adapters
mkdir -p ./apps/$1/src/infrastructure/mappers
mkdir -p ./apps/$1/src/infrastructure/repositories

# interface
mkdir -p ./apps/$1/src/interface/commands
mkdir -p ./apps/$1/src/interface/controllers
mkdir -p ./apps/$1/src/interface/dtos
mkdir -p ./apps/$1/src/interface/presenters
mkdir -p ./apps/$1/src/interface/queries