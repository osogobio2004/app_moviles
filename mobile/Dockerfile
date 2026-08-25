FROM node:24-alpine

RUN npm install -g @ionic/cli

WORKDIR /app

EXPOSE 8100

CMD ["sh", "-c", "if [ ! -f package.json ]; then ionic start temp tabs --type=angular --no-interactive --no-git --capacitor && cp -a temp/. . && rm -rf temp; fi && npm install && ionic serve --host=0.0.0.0 --port=8100 --no-open"]