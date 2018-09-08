FROM node:9

RUN mkdir /app
WORKDIR /app
# Supposedly speeds up npm install
RUN npm set progress=false

COPY package.json /app

RUN npm install --verbose 
#RUN npm install typescript 

COPY . /app

EXPOSE 3000