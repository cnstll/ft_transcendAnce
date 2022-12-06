#!/bin/bash
/home/entrypoint_scripts/wait-for-it.sh  db:5432
npm ci;
npx prisma migrate deploy && npm run build && npm run start:prod;
