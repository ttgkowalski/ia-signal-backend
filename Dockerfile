FROM node:24-slim AS builder

WORKDIR /app

COPY . .

RUN npm install -g pnpm

RUN cd src/atriun-lib-sdk-ts && pnpm install

RUN pnpm install

RUN pnpm run build

FROM node:24-slim

COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD [ "node", "dist/src/index.js" ]