from flask import Flask
from base_de_datos import bd
# pip3 install mysqlclient
app = Flask(__name__)
# 'tipobd://usuario:password@servidor/nomb-bd'
# https://flask-sqlalchemy.palletsprojects.com/en/2.x/config/#connection-uri-format
app.config['SQLALCHEMY_DATABASE_URI']='mysql://root:root@localhost/libreriavirtual'

@app.before_first_request
def creacion_bd():
    # Inicio la aplicacion pasandole la instancia app que internamente va a buscar la llave SQLALCHEMY_DATABASE_URI y si la encuentra va a conectar con la base de datos
    bd.init_app(app)
    # Va a realizar la eliminacion de todos los modelos en mi base de datos
    # bd.drop_all(app=app)
    # Va a realizar la creación de todos los modelos definidos anteriormente
    bd.create_all(app=app)


if __name__ == '__main__':
    app.run(debug=True)