#!/bin/bash
/home/entrypoint_scripts/wait-for-it.sh  db:5432
npm ci;
npx prisma migrate dev --name updatedb && npm run start:dev;
