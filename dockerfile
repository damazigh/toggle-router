FROM node:lts-alpine3.15 AS BUILD_IMAGE
# env variables

WORKDIR /usr/src/app
COPY . .

# npm related 
RUN npm install --omit=dev
RUN npm install -D @nestjs/cli
RUN npm run build 

# copy content to prod related image
FROM node:lts-alpine3.15
# add bash support
RUN apk add --no-cache bash  

WORKDIR /usr/src/app

# copy resources
COPY --from=BUILD_IMAGE /usr/src/app/dist ./dist
COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules
CMD npm run start