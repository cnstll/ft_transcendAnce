#!/bin/bash
/home/entrypoint_scripts/wait-for-it.sh  db:5432
npm ci;
npx prisma migrate reset -f && npm run build && npm run start:prod;
