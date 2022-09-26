#!/bin/bash
/home/entrypoint_scripts/wait-for-it.sh  db:5433
npm ci;
npx dotenv -e .env.test -- prisma migrate reset -f && pm run start:dev;
