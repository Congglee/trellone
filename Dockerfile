FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 8000

CMD ["npm", "run", "preview", "--", "--host", "--port", "8000"]