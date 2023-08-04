# build environment
FROM node:16-alpine as build
WORKDIR /app

COPY package.json /app/package.json
RUN npm install
COPY . /app

RUN npm run build

# production environment
FROM nginx
COPY --from=build /app/dist /var/www
COPY nginx.conf /etc/nginx/nginx.conf

#EXPOSE 3000
ENTRYPOINT ["nginx","-g","daemon off;"]
