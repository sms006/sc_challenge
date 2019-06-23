FROM node:8.16.0-alpine AS builder 
WORKDIR /src
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
#optimizing image size through multi-stage building and apline image
FROM node:8.16.0-alpine 
WORKDIR /src
COPY --from=builder /src /src

CMD [ "npm", "start" ]
