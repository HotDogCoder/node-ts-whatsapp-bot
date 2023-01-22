FROM ubuntu:20.04

# Create app directory
WORKDIR /usr/src/app

RUN apt update
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs
RUN apt-get install -y npm
RUN apt install -y gconf-service libgbm-dev libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
RUN apt install -y chromium-browser
# ENTRYPOINT ["/sbin/tini", "--"]
# RUN apt-get update && apt-get install -y init
# RUN apt-get update && apt-get install -y snapd
# RUN systemctl enable --now snapd.socket
# RUN systemctl start snapd
RUN apt update
RUN apt-get install chromium

RUN apt-get update
RUN apt-get install -y wget gnupg 
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - 
RUN sh -c 'echo "deb [arch=arm64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' 
RUN apt update
# RUN apt install -y google-chrome-stable --no-install-recommends
RUN apt-get install -y fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 --no-install-recommends 
RUN rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install -g typescript

RUN npm install

# RUN npm run build
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

# Install puppeteer so it's available in the container.
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser ./lib \
    && chown -R pptruser:pptruser ./.wwebjs_auth \
    && chown -R pptruser:pptruser ./node_modules \
    && chown -R pptruser:pptruser ./package.json \
    && chown -R pptruser:pptruser ./package-lock.json

USER pptruser

RUN npm run build

EXPOSE 8080
CMD ["node", "lib/index.js"]