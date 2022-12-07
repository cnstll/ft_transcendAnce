#!/bin/bash
/home/entrypoint_scripts/wait-for-it.sh  db:5432
npm ci;
npx prisma migrate deploy && npx prisma db seed && npm run build && npm run start:prod;
