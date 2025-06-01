FROM mcr.microsoft.com/playwright:v1.52.0-noble


ENV CACHEBUST 1

ENV ENVIRONNEMENT  integ
ENV PLAYWRIGHT_BROWSERS_PATH /ms-playwright

WORKDIR /app

COPY . /app

# RUN npm ci

# RUN npx playwright install --only-shell chromium
# RUN npx playwright install --only-shell chrome
# RUN npx playwright install --only-shell msedge
# RUN npx playwright install --only-shell firefox

# ENV http_proxy ""
# ENV https_proxy ""

