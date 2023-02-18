# curso basico de docker

Para poder entender completamente este recurso te recomiendo que despues de conar el repositorio vayas haciendo checkout a los commits. Es decir ve al commit inicial, luego al siguiente y al siguiente, leelo bien y al funal ya podras entender todos los archivos que hay hasta este punto.

## instalacion de docker

en linux

```
sudo apt install docker-ce
```

en windows solo baja el ejecutable y dale next text next

## Imagenes

<b> Descargar imagenes </b>

```
# listar imagenes
docker images
# descagar imagenes, en caso de no especificar :<version> se descarga la varsion mas reciente
docker pull node:<version>

```

al dia de este commit, si bajamos la version 19 es lo mismo que si no le especificamos la version, tendriamos dos imagenes con nombre diferente pero el mismo identificador.

<b>Eliminar imagenes</b>

puedes o no especificar la version, depende si hay varias con el mismo nombre

```
# comando largo
docker image rm imagen:version
# comando corto
docker rmi nombre_imagen:version
```

## Contenedores

<b>Crear contenedor</b>

```
# comando largo
docker container create mongo
# comando corto
docker create mongo
# con nombre personalizado
docker create --name mongo_container mongo
```

en caso de no haber encontrado la imagen mongo te la va a bajar automaticamente y nos devolvera el id del contenedor creado.

<b>Iniciar contenedor</b>

```
# por id
docker start id_contenedor
# por nombre
docker start mongo_container

```

<b>Listar contenedores</b>

```
docker ps
```

nos devuelve el mismo id pero en un formato mas corto, el nombre de la imagen usada, el comando que usa el contenedor para crearse, fecha de creacion, estado del contenedor, el puerto expuesto y por ultimo el nombre

<b>Detener contenedores</b>

```
# se puede por
docker stop id_contenedor
# y tambien por nombre
docker stop mongo_container
```

puede ser el id corto o largo, ahora si volvemos a listar los contenedores no nos va a aparecer pero podemos usar

```
docker ps -a
```

que nos muestra todos los contenedores, activos e inactivos, para poder levantar de nuevo nuestro contenedor

<b>Eliminar contenedor</b>

```
# por id
docker rm id_contenedor
# o por nombre
docker rm nombre_contenedor
```

### port mapping

en el escenario de tener varias aplicaciones incluso sin son basadas en la misma imagen, podemos mapear sus puertos para acceder sin que haya conflictos, ejemplo:

- nodeapp_1 expone el puerto 3000
- nodeapp_2 expone el puerto 3000
- mongoapp expone el puerto 27017
  si todas las aplicaciones se comunican nosotros podemos configurar que nuestra computadora acceda a los recursos a travez de los puertos
- 3000
- 3001
- 27017

respectivamente

```
docker create -p27017:27017 --name mongoapp mongo
```

la opcion -p acepta como primer argumento el puerto por el que vamos a acceder, y el segundo es el puerto del contenedor. lueego de esto debemos iniciar el contenedor. y cuando lo listemos obtendremos en la parte de PORTS algo como lo siguiente:

```
0.0.0.0:27017->27017/tcp, :::27017->27017/tcp
```

en caso de no especificar puerto, docker elige el puerto por ti pero se veria con menos orden algo asi:

```
0.0.0.0:32768->27017/tcp, :::32768->27017/tcp
```

### logs

```
docker logs mongoapp
# quedarse en modo escucha
docker logs --folow mongoapp
```

para salir dale ctrl+c

### docker run

verifica si existe la imagen, descarga, crea e inicia el contenedor

```
docker run mongo
```

pero nos va a mostrar los logs como si estuviera en modo de escucha, para devolvernos a la terminal tendriamos que usar:

```
docker run -d mongo
```

pero podemos personalizar igual que como haciamos antes.

```
docker run -d --name mongoapp -p27017:27017 mongo
```

para levantar una aplicacion personalizada, por ejemplo el app.js que teemos, debemos usar

```
docker create -p27017:27017 --name mongoapp -e MONGO_INITDB_ROOT_USERNAME=alan -e MONGO_INITDB_ROOT_PASSWORD=secret mongo

docker start mongoapp

```

### redes

```
# listar
docker network ls
# crear
docker network create red_mongo
# eliminar
docker network rm red_mongo
```

los contenedores se comunican mediante el <b> nombre del contenedor </b> cuando estan en una misma red interna. Significa que en lugar de localhost debe ser mongoapp la configuracion del app.js

```
mongodb://alan:secret@mongoapp:27017/my_database?authSource=admin
```

### docker build

para crear una imagen personalizada

```
docker build -t mongoapp:1.0.0 .
```

como parametros tiene el nombre de la imagen dos puntos seguido de su tag y el directorio donde esta mi archivo Dockerfile

Ahora creamos un nuevo contenedor pero en nuestra red

```
docker create -p27017:27017 --name mongoapp --network red_mongo -e MONGO_INITDB_ROOT_USERNAME=alan -e MONGO_INITDB_ROOT_PASSWORD=secret mongo
```

y otro contenedor para nuestra aplicacion y como es un levantamiento normal de un contenedor el ultimo argumento seria el nombre de la imagen en la cual nos estamos basando, en este caso es nuestra imagen de mongo personalizada o sea mongoapp:1.0.0

```
docker create -p3000:3000 --name nodeapp --network red_mongo mongoapp:1.0.0
```

arrancamos los contenedores

```
docker start mongoapp
docker start nodeapp
```

y ya podemos ir a [localhost:3000](http://localhost:3000) a revisar nuestros datos e ingresar nuevos

## docker compose

para automatizar los comandos anteriores tenemos un archivo de configuracion llamado docker-compose.yml que consta de varias partes, la version de la sintaxis al principio, nombre de los servicios, redes etc.

Y con la configuracion del yml vamos a correr

```
docker compose up
```

y tambien se puede usar el siguiente para eliminar los contenedores y la red de forma automatica

```
docker compose down
```

Es importante notar que cuando declaramos nuestros componentes en el archivo yml, ya no es necesario declarar una red, ya que docker lo hace automaticamente para nuestros contenedores.

## volumenes

los volumes serviran para separar parte del contenedor por ejemplo bases de datos para que sean persistentes y no se eliminen cuando se recarguen los contenedores, hay de 3 tipos:

- anonimos: indicamos la ruta en la que se monta y docker decide donde ponerla, pero no se puede referenciar por otro contenedor.
- anfitrion: elegimos que y donde montarlo.
- nombrado: es parecido al anonimo pero si lo podremos referenciar para reutilizarlo.

## ambientes de trabajo y recarga en caliente

primero tenemos que hacer un archivo parecido al dockerfile y otro al docker-compose.yml

```
cp Dockerfile Dockerfile.dev
cp docker-compose.yml docker-compose-dev.yml
```

y cuando esten listos esos archivos vamos a construir nuestra aplicacion de desarrollo.

```
docker compose -f docker-compose-dev.yml up
```
