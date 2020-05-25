# Ref: https://github.com/helaili/jekyll-action

FROM ruby:2.7-alpine

# Install base packages
RUN apk add ca-certificates && update-ca-certificates
RUN apk add --no-cache git build-base
RUN apk add --update tzdata
RUN apk add --update imagemagick

# Clean APK cache
RUN rm -rf /var/cache/apk/*

# debug
RUN bundle version

COPY entrypoint.sh /

ENTRYPOINT ["/entrypoint.sh"]
