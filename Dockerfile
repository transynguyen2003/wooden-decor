FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
COPY prisma ./prisma/
COPY public ./public/
COPY .next/standalone ./
COPY .next/static ./.next/static/

EXPOSE 3000

CMD ["node", "server.js"]
