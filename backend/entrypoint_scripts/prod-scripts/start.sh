#!/bin/bash
/home/entrypoint_scripts/wait-for-it.sh  db:5432
npm ci;
npm run build && npx dotenv -e .env.prod -- npm run start:prod;
