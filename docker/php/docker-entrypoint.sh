#!/bin/sh
set -e

if [ "$APP_ENV" != 'prod' ]; then
    composer install --prefer-dist --no-progress --no-interaction
else
    echo "TODO: setup prod deployment"
fi

if [ -f package.json ]; then
    npm install
    if [ "$APP_ENV" != 'prod' ]; then
        npm run dev
    else
        npm run build
    fi
fi