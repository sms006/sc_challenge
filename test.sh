#!/bin/bash

#navigate to the project folder

npm install
npm run build
npm start

if npm test | egrep "6 passing"; then
  echo "passing"
else
  echo "failing"
fi