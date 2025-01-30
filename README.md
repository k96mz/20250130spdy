# server-test-01
simple server with nodejs/express

# Recommended environment
* nodejs ver 14 or 16
* pm2 ver 4.4.0

# install
### Raspberry Pi
You can try install.sh.(not tested yet)  
install.sh is only for raspberry pi.. 

### Linux server
You can try

```
git clone https://github.com/ubukawa/server-test-01
cd server-test-01
npm install
vi config/default.hjson
```

# HTTPS setting
If your server's domain is register and you have the SSH/TLS certification, you can use https.
Store your privatekey and certification at the certain place (and define them in the config file).
Edit the "app.js." Activete the scripts module for https and comment out the scripts for http.

# run the server

```
node app.js
```

```
./pmserve.sh
```


# File
Please check index.html  

#### Static hosting
You have "htdocs" folder for static hosting.  
If your vector tiles (pbf) are stored in "htdocs" directory, your VT can be accessible at:  
http://(your server name):8836/(directory name in "htdocs")/{z}/{x}/{y}.pbf


#### Tiles generated from mbtiles
If you stored your mbtiles in "mbtiles" directory, your VT can be accessible at:  
http://(your server name):8836/VT/zxy/(mbtiles name)/{z}/{x}/{y}.pbf


