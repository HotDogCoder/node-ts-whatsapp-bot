FROM buildkite/puppeteer

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g typescript

RUN tsc --version

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

RUN npm run build

EXPOSE 8080
CMD [ "node", "lib/index.js" ]