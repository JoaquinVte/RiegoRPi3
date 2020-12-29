# RiegoRPi3
Proyecto de riego bajo RPi3.
![Alt text](20171122_125640.jpg?raw=true "Title")
![alt tag](http://mystorehouse.ddns.net/wp-content/uploads/2017/10/20171122_125640.jpg)
![imagen](http://mystorehouse.ddns.net/wp-content/uploads/2017/10/20171122_125640.jpg)

Para su instalacion debemos instalar **nodejs-legacy** y **npm**:

**sudo apt-get install nodejs-legacy npm**

Despues simplemente desde el directorio *RiegoRPi3* ejecutar:

**npm install**

Esto instalara los modulos necesarios dentro de *node_modules*. Para ejecutar el servidor, lanzar:

**node webserver.js**

Es recomendable añadir la entrada siguiente a crontab para que el servicio se ejecute en cada reinicio:

**@reboot /usr/bin/node /home/joaalsai/RiegoRPi3/webserver.js &**

Dependiendo de con que usuario se lance el servidor, nos puede dar un error a la hora de acceder a los puertos GPIO. En este caso ejecutar:

**sudo usermod -a -G gpio tu_usuario**

Para acceder al servidor abre el navegador y accede a  [http://localhost:8080](http://localhost:8080). 


Mas informacion en la [entrada](http://joaalsai.com/index.php/2017/10/31/sistema-de-riego/) de mi blog.
