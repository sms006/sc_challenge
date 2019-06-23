FROM node:alpine AS builder
WORKDIR /src
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM alpine
WORKDIR /src
COPY --from=builder /src /src

CMD [ "npm", "start" ]
