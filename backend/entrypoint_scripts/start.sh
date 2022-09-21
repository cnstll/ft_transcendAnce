#!/bin/bash

npm install -ci;
npx prisma migrate dev --name updatedb; 
npm run start:dev;
