FROM kong

USER root
COPY kong.yml /home/kong/kong.yml

RUN apk update && apk add nodejs npm && npm install -g kong-pdk
COPY /plugins  /usr/local/kong/js-plugins
RUN cd /usr/local/kong/js-plugins && npm install --save

USER kong
