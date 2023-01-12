FROM amd64/node

# Create app directory
WORKDIR /usr/src/app

RUN apt-get update 
RUN apt-get install -y build-essential libssl-dev
RUN apt-get install -y wget gnupg curl

# RUN curl -sL https://deb.nodesource.com/setup_14.x
# RUN apt-get install -y nodejs
# RUN apt-get install -y npm

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - 
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' 

# RUN apt-get update 
# RUN rm -rf /var/lib/apt/lists/*
# RUN apt-get update 
RUN apt-get install -y libnss3 --no-install-recommends 
# RUN apt-get update 
# RUN apt-get install -y chromium-browser --no-install-recommends
RUN apt-get install -y gconf-service --no-install-recommends
RUN apt-get install -y libgbm-dev --no-install-recommends
RUN apt-get install -y libasound2 --no-install-recommends
RUN apt-get install -y libatk1.0-0 --no-install-recommends
RUN apt-get install -y libc6 --no-install-recommends
RUN apt-get install -y libcairo2 --no-install-recommends
RUN apt-get install -y libcups2 --no-install-recommends
RUN apt-get install -y libdbus-1-3 --no-install-recommends
RUN apt-get install -y libexpat1 --no-install-recommends
RUN apt-get install -y libfontconfig1 --no-install-recommends
RUN apt-get install -y libgcc1 --no-install-recommends
RUN apt-get update
# RUN apt-get install -y libgconf-2-4 --no-install-recommends
RUN apt-get install -y libgdk-pixbuf2.0-0 --no-install-recommends
RUN apt-get install -y libglib2.0-0 --no-install-recommends
RUN apt-get install -y libgtk-3-0 --no-install-recommends
RUN apt-get install -y libnspr4 --no-install-recommends
RUN apt-get install -y libpango-1.0-0 --no-install-recommends
RUN apt-get install -y libpangocairo-1.0-0 --no-install-recommends
RUN apt-get install -y libstdc++6 --no-install-recommends
RUN apt-get install -y libx11-6 --no-install-recommends
RUN apt-get install -y libx11-xcb1 --no-install-recommends
RUN apt-get install -y libxcb1 --no-install-recommends
RUN apt-get install -y libxcomposite1 --no-install-recommends
RUN apt-get install -y libxcursor1 --no-install-recommends
RUN apt-get install -y libxdamage1 --no-install-recommends
RUN apt-get install -y libxext6 --no-install-recommends
RUN apt-get install -y libxfixes3 --no-install-recommends
RUN apt-get install -y libxi6 --no-install-recommends
RUN apt-get install -y libxrandr2 --no-install-recommends
RUN apt-get install -y libxrender1 --no-install-recommends
RUN apt-get install -y libxss1 --no-install-recommends
RUN apt-get install -y libxtst6 --no-install-recommends
RUN apt-get install -y ca-certificates --no-install-recommends
RUN apt-get install -y fonts-liberation --no-install-recommends
RUN apt-get install -y libappindicator1 --no-install-recommends
RUN apt-get install -y lsb-release --no-install-recommends
RUN apt-get install -y xdg-utils --no-install-recommends
RUN apt-get install -y wget --no-install-recommends
RUN apt-get install -f
RUN apt-get update
# RUN apt-get install -y google-chrome-stable --no-install-recommends
# RUN apt-get install -y fonts-ipafont-gothic --no-install-recommends
# RUN apt-get install -y fonts-wqy-zenhei --no-install-recommends
# RUN apt-get install -y fonts-thai-tlwg --no-install-recommends
# RUN apt-get install -y fonts-kacst --no-install-recommends
# RUN apt-get install -y fonts-freefont-ttf --no-install-recommends
# RUN apt-get install -y libasound2:amd64

RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN apt-get install ./google-chrome-stable_current_amd64.deb -y

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install -g typescript

RUN npm install

RUN npm run build
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "lib/index.js" ]