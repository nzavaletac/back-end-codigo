from flask import Flask
from base_de_datos import bd
from models.libro import LibroModel
from models.cliente import ClienteModel
from models.prestamo import PrestamoModel
# pip3 install mysqlclient
app = Flask(__name__)
# 'tipobd://usuario:password@servidor/nomb-bd'
# https://flask-sqlalchemy.palletsprojects.com/en/2.x/config/#connection-uri-format
# ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password by 'root';
app.config['SQLALCHEMY_DATABASE_URI']='mysql://root:root@localhost:3306/libreriavirtual'

@app.before_first_request
def creacion_bd():
    # Inicio la aplicacion pasandole la instancia app que internamente va a buscar la llave SQLALCHEMY_DATABASE_URI y si la encuentra va a conectar con la base de datos
    bd.init_app(app)
    # Va a realizar la eliminacion de todos los modelos en mi base de datos
    # bd.drop_all(app=app)
    # Va a realizar la creación de todos los modelos definidos anteriormente
    bd.create_all(app=app)

@app.route('/')
def inicio():
    return 'La API funciona exitosamente!'
if __name__ == '__main__':
    app.run(debug=True)