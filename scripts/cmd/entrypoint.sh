#!/bin/sh

if ["$SEED" = "true"]; then
  pnpm ts-node prisma/seed.ts
fi

pnpm db:migrate
node dist/main.js