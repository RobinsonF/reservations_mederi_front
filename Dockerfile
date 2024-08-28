FROM node:alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run build

FROM nginx:alpine

ADD ./config/default.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/reservations_mederi_front/browser /var/www/app

EXPOSE 4200

CMD ["nginx", "-g", "daemon off;"]
