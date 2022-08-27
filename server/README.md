### About

VPS using NGINX, NodeJS, Let's Encrypt, MySQL/MariaDB

### Server setup

These notes are mostly for myself

Using OVH

Will need
- linux install
- nginx
- node
- mariaDB (not needed yet)
- let's encrypt with nginx
- point and generate cert
- setup the node app with pm2 (was having problems on Pis maybe better on OVH)

Details

07/17/2022
Dang OVH is slow to create the VPS

```
$sudo apt install nginx
$sudo apt install mariadb-server (not needed yet)
$sudo snap... (certbot stuff)
$sudo apt install git-all
```

Making the nginx server blocks before starting each app

Generate a new nginx cert

`$sudo certbot --nginx -d subdomain.domain.com`

Got stuck on this chmod thing
https://stackoverflow.com/questions/25774999/nginx-stat-failed-13-permission-denied

Nginx kept throwing 500/400 due to not being able to get permission to the symlink folder

Sigh of relief this KVM thing on OVH
Way to login

I forgot the deal with the locked out issue, but if I encounter it again I'll write it down here

### NGINX server block

```
server {
    server_name example.com;
    access_log /var/log/nginx/api-access.log;

    location / {
        proxy_pass http://localhost:PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    server_name exampole.com;

    listen 80;
}
```

There's a symlink deal you gotta do

`ln -s /etc/nginx/sites-available/example.conf /etc/nginx/sites-enabled/`

### resources used
https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-20-04
https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04
https://certbot.eff.org/instructions?ws=nginx&os=ubuntufocal
https://stackoverflow.com/questions/18089525/nginx-sites-enabled-sites-available-cannot-create-soft-link-between-config-fil