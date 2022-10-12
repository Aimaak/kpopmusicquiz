FROM php:8.1-apache

RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf \
    \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
    locales apt-utils git libicu-dev g++ libpng-dev libxml2-dev libzip-dev libonig-dev libxslt-dev nodejs unzip \
    \
    && echo "en_US.UTF-8 UTF-8" > /etc/locale.gen  \
    && echo "fr_FR.UTF-8 UTF-8" >> /etc/locale.gen \
    && locale-gen \
    \ 
    && docker-php-ext-configure \
    intl \
    && docker-php-ext-install \
    pdo pdo_mysql opcache intl zip calendar dom mbstring gd xsl \
    \
    && pecl install apcu && docker-php-ext-enable apcu

# https://getcomposer.org/doc/03-cli.md#composer-allow-superuser
ENV COMPOSER_ALLOW_SUPERUSER=1
ENV PATH="${PATH}:/root/.composer/vendor/bin"

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# prevent the reinstallation of vendors at every changes in the source code
COPY composer.* symfony.* ./
RUN set -eux; \
    if [ -f composer.json ]; then \
    composer install --prefer-dist --no-dev --no-autoloader --no-scripts --no-progress; \
    composer clear-cache; \
    fi; \
    if [ -f package.json ]; then \
    npm install; \
    npm run dev; \
    fi

WORKDIR /var/www/

# copy sources
COPY . .
RUN rm -Rf docker/