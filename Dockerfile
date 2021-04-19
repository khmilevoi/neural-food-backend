FROM node:latest

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm i

CMD ["npm", "run", "data"]
#CMD ["/bin/bash"]
