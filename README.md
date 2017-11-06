# RiegoRPi3
Proyecto de riego bajo RPi3.

![imagen](https://i2.wp.com/joaalsai.com/wp-content/uploads/2017/10/Screenshot_20171031-143126.png?resize=576%2C1024)

Para su instalacion debemos instalar **nodejs-legacy** y **npm**:

**sudo apt-get install nodejs-legacy npm**

Despues simplemente ejecutar:

**npm install**

Esto instalara los modulos necesarios dentro de *node_modules*. Para ejecutar el servidor, lanzar:

**node webserver.js**

Dependiendo de con que usuario se lance el servidor, nos puede dar un error a la hora de acceder a los puertos GPIO. En este caso ejecutar:

**sudo usermod -a -G gpio tu_usuario**

Para acceder al servidor abre el navegador y accede a  [http://localhost:8080](http://localhost:8080). 


Mas informacion en la [entrada](http://joaalsai.com/index.php/2017/10/31/sistema-de-riego/) de mi blog.
