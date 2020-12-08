from flask import Flask
from base_de_datos import bd
from flask_restful import Api
# from models.libro import LibroModel
from controllers.libro import LibrosController, LibroController
# from models.cliente import ClienteModel
from controllers.cliente import ClientesController, ClienteModel
# from models.prestamo import PrestamoModel
from controllers.prestamo import PrestamosController
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
    # bd.drop_all(app=app)
    # Va a realizar la creación de todos los modelos definidos anteriormente
    bd.create_all(app=app)

@app.route('/')
def inicio():
    return 'La API funciona exitosamente!'

# Definiendo las rutas de mi aplicacion
# en el add_resource van dos o mas parametros, obligatoriamente en el primero va el Recurso (comportamiento) y en el segundo o mas van las rutas de acceso 

api.add_resource(LibrosController, '/libro')
api.add_resource(LibroController, '/libro/<int:id>')
api.add_resource(ClientesController, '/cliente')
api.add_resource(PrestamosController, '/prestamo')

if __name__ == '__main__':
    app.run(debug=True)






# INSERT INTO `libreriavirtual`.`t_cliente` (`cli_dni`, `cli_nomb`, `cli_ape`, `estado`) VALUES ('10735145', 'Eduardo', 'de Rivero', '1');
# INSERT INTO `libreriavirtual`.`t_cliente` (`cli_dni`, `cli_nomb`, `cli_ape`, `estado`) VALUES ('15481526', 'Juan', 'Marquez', '1');
# INSERT INTO `libreriavirtual`.`t_cliente` (`cli_dni`, `cli_nomb`, `cli_ape`, `estado`) VALUES ('57687902', 'Maria', 'Palacios', '1');
# INSERT INTO `libreriavirtual`.`t_libro` (`lib_nom`, `lib_edicion`, `lib_autor`, `lib_cant`, `estado`) VALUES ('Winnie Pooh', '2020-02-01', 'Condorito', '2', '1');
# INSERT INTO `libreriavirtual`.`t_libro` (`lib_nom`, `lib_edicion`, `lib_autor`, `lib_cant`, `estado`) VALUES ('Star wars', '2020-07-22', 'bryce', '5', '1');
# INSERT INTO `libreriavirtual`.`t_libro` (`lib_nom`, `lib_edicion`, `lib_autor`, `lib_cant`, `estado`) VALUES ('Harry Potter', '2020-04-10', 'llosa', '3', '1');
# INSERT INTO `libreriavirtual`.`t_prestamo` (`prestamo_fechin`, `prestamo_fechfin`, `prestamo_fechentrega`, `estado`, `cli_id`, `lib_id`) VALUES ('2020-12-03', '2020-12-05', '2020-12-05', '1', '1', '1');
# INSERT INTO `libreriavirtual`.`t_prestamo` (`prestamo_fechin`, `prestamo_fechfin`, `prestamo_fechentrega`, `estado`, `cli_id`, `lib_id`) VALUES ('2020-12-06', '2020-12-07', '2020-12-07', '1', '1', '1');
# INSERT INTO `libreriavirtual`.`t_prestamo` (`prestamo_fechin`, `prestamo_fechfin`, `estado`, `cli_id`, `lib_id`) VALUES ('2020-12-07', '2020-12-10', '1', '2', '3');
# INSERT INTO `libreriavirtual`.`t_prestamo` (`prestamo_fechin`, `prestamo_fechfin`, `prestamo_fechentrega`, `estado`, `cli_id`, `lib_id`) VALUES ('2020-12-03', '2020-12-06', '2020-12-05', '1', '3', '2');
