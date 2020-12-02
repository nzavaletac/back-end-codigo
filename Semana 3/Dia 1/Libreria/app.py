from flask import Flask
from base_de_datos import bd
from flask_restful import Api
# from models.libro import LibroModel
from controllers.libro import LibrosController, LibroController
from models.cliente import ClienteModel
from models.prestamo import PrestamoModel
# pip3 install mysqlclient

app = Flask(__name__)
# Creo una instancia de mi clase Api en la cual le tengo que pasar la app para que pueda registrar posteriormente todas mis rutas con sus respectivos controladores, si no hago eso, todos los controladores registrados no se podrán usar
api = Api(app)

# 'tipobd://usuario:password@servidor/nomb-bd'
# https://flask-sqlalchemy.palletsprojects.com/en/2.x/config/#connection-uri-format
# ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password by 'root';
app.config['SQLALCHEMY_DATABASE_URI']='mysql://root:root@localhost:3306/libreriavirtual'
# sirve para evitar el warning de que la funcionalidad del sqlalchemy de track modification en un futuro estará deprecada
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']= False

@app.before_first_request
def creacion_bd():
    # Inicio la aplicacion pasandole la instancia app que internamente va a buscar la llave SQLALCHEMY_DATABASE_URI y si la encuentra va a conectar con la base de datos
    bd.init_app(app)
    # Va a realizar la eliminacion de todos los modelos en mi base de datos
    bd.drop_all(app=app)
    # Va a realizar la creación de todos los modelos definidos anteriormente
    bd.create_all(app=app)

@app.route('/')
def inicio():
    return 'La API funciona exitosamente!'

# Definiendo las rutas de mi aplicacion
# en el add_resource van dos o mas parametros, obligatoriamente en el primero va el Recurso (comportamiento) y en el segundo o mas van las rutas de acceso 

api.add_resource(LibrosController, '/libro')
api.add_resource(LibroController, '/libro/<int:id>')

if __name__ == '__main__':
    app.run(debug=True)