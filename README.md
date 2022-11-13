# AlkyBank - (backend)

Proyecto para Alkemy - Desarrollo fullstack JS.
Wallet que le permite a los usuarios realizar transacciones de forma virtual y facilitar las
operaciones entre personas.

## Stack de tecnologías

[Node.js](https://nodejs.org) -
[Express](https://expressjs.com/) -
[Sequelize](https://sequelize.org/) -
[JWT](https://github.com/auth0/node-jsonwebtoken#readme) -
[Bcrypt](https://github.com/kelektiv/node.bcrypt.js#readme) -
[Socket.io](https://socket.io/)

## Instalación

#### Clonar el proyecto:

```bash
  git clone https://github.com/arkangel3d/Skill-Up-JS-Backend-01.git
  cd Skill-Up-JS-Backend-01
```

#### Reconstruir las dependencias:

```bash
  npm install
```

#### Variables de entorno

Para ejecuar este proyecto, es necesario agregar las siguentes variables de entorno en su archivo **.env** .

`PORT`

`DB_NAME`
`DB_PORT`
`DB_HOST`
`DB_USER`
`DB_PASSWORD`

`SECRET`

`CLOUDINARY_CLOUD_NAME`
`CLOUDINARY_API_KEY`
`CLOUDINARY_API_SECRET`
`CLOUDINARY_FOLDER_NAME`
`CLOUDINARY_IMAGE_WIDTH`
`CLOUDINARY_IMAGE_HEIGHT`

Puede renombrar el archivo **.env.example** a **.env** . En él encontrará datos de ejemplo para correr el proyecto en modo local.

#### Obtener credenciales de Cloudinary :

Registrarse en [Cloudinary](https://cloudinary.com/) . Dirigirse al Dashboard para obtener el _Cloud Name_, _API Key_ y _API Secret_ .
![Cloudinary](https://nazgul.com.ar/images/cloudinary.jpg)

#### Creación de la base de datos, migraciones y seeds:

```bash
  npx sequelize-cli db:drop
  npx sequelize-cli db:create
  npx sequelize-cli db:migrate
  npx sequelize-cli db:seed:all
```

Ejecutar el proyecto:

```bash
  npm start
```

## Autores

- [Diego Aguilar](https://www.linkedin.com/in/diego-mathias-aguilar-13233a56/)
- [Adrián Centurión](https://www.linkedin.com/in/adrian-centurion/)
- [Luca Gelmini](https://www.linkedin.com/in/lgelmini/)
- [Federico González](https://www.linkedin.com/in/fededg/)
