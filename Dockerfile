FROM node:10-alpine

COPY /backEnd/package.json ./backEnd/

RUN apk add --no-cache --virtual .gyp \
    && apk add python \
    && apk add make \
    && apk add g++ \
    && cd /backEnd \
    && npm install \
    && apk del .gyp 

COPY ./backEnd /backEnd
COPY gateway ./gateway
EXPOSE 3000
CMD cd /backEnd && rm .env && source preparaAmbiente.sh && npm start