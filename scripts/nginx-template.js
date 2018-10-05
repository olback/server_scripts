const process = require('process');
const fs = require('fs');

const site = process.argv[2];

if (!site) {
    console.error('Invalid input');
    return -1;
}

const template = `
# nginx config for ${site}

server {

    listen 443 ssl http2 spdy;
    server_name ${site} www.${site};

    ssl_certificate /etc/letsencrypt/live/${site}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${site}/privkey.pem;

    error_log /var/log/nginx/${site}/error.log warn;
    access_log /var/log/nginx/${site}/access.log;

    location / {
    }

}

server {

    listen 80;
    server_name ${site} www.${site};
    # rewrite 301 https://${site}$request_uri;
    rewrite ^/(.*)$ https://${site}/$1 permanent;

}
`;

fs.writeFileSync(`/etc/nginx/sites-available/${site}`, template, 'utf8');
