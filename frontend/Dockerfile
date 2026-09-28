FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# Required for Next.js standalone build / static generation
ENV NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
