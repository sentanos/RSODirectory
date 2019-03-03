FROM node:10.15.1
WORKDIR /app
COPY . /app
RUN npm install
RUN npm run-script build
EXPOSE 3000
CMD ["npm", "start"]