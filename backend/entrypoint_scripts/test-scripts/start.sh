#!/bin/bash
/home/entrypoint_scripts/wait-for-it.sh  test-db:5432
npm ci;
npx dotenv -e .env.test -- prisma migrate reset -f && npx npx dotenv -e .env.test -- npm run start:dev;
