FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . ./
RUN npm run build

# Простой static server
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3000"]