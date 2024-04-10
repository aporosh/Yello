FROM node:19.2-alpine as build
WORKDIR /app
COPY yello-front/package.json /app/package.json
RUN npm install
COPY yello-front/. .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]