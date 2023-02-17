# curso basico de docker

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
