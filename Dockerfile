FROM node:20.11.1-alpine

LABEL author "Abhinav Pandey <abhinav.pandey.1512@gmail.com>"

WORKDIR /app

RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .
RUN pnpm build

EXPOSE 8080

CMD ["pnpm", "start:prod"]