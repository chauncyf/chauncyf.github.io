FROM ruby:2.7-alpine

# Install base packages
RUN apk update
RUN apk upgrade
RUN apk add ca-certificates && update-ca-certificates
# Change TimeZone
RUN apk add --update tzdata
ENV TZ=America/New_York
# Clean APK cache
RUN rm -rf /var/cache/apk/*


RUN apk add --no-cache git build-base

# debug
RUN bundle version

COPY entrypoint.sh /

ENTRYPOINT ["/entrypoint.sh"]
