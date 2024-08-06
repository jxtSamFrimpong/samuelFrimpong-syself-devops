FROM node:18.15.0-alpine3.17
COPY . /app

WORKDIR /app

ENV PORT=8080
# ENV TEST_MONGODB_URI should be provided for test env
# ENV MONGODB_URI should be provided for prod env
# If both TEST_MONGODB_URI and MONGODB_URI are given, TEST_MONGODB_URI has higher priority 
# ENV SECRET should be provided


EXPOSE 8080

ENTRYPOINT [ "node", "index.js", "--host", "0.0.0.0" ]