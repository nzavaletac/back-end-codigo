from flask import Flask, render_template, request, send_file
from bd import bd
from models.usuario import UsuarioModel
from models.contacto import ContactoModel
from models.proyecto import ProyectoModel
from models.redsocial import RedSocialModel
import os
from werkzeug.utils import secure_filename
from datetime import datetime
FOLDER_MULTIMEDIA = 'media'

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI']='mysql://root:root@localhost:3306/portafolioflask'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=True

app.config['UPLOAD_FOLDER']= FOLDER_MULTIMEDIA


# para pasar variables de mi funcion a mi html uso en el html {{variable}}
# para usar statements como por ejemplo un for, un bloque u otros se usa 
# {% template_tag %}....
# {% fin_template_tag %}

@app.before_first_request
def creacion_tablas():
    bd.init_app(app)
    bd.create_all(app=app)

@app.route('/')
def pagina_principal():
    usuario=UsuarioModel.query.first()
    print(usuario.usu_titulos)
    titulos = usuario.usu_titulos.split(', ')
    print(titulos)
    # template tags
    return render_template('index.html',usuario=usuario, titulos=titulos)

@app.route('/proyectos')
def proyectos():
    mis_proyectos = ['Proyecto1', 'Proyecto2', 'Proyecto3', 'Proyecto4']
    return render_template('proyectos.html', proyectos=mis_proyectos)

@app.route('/contact')
def contactamen():
    return render_template('contact-me.html')

@app.route('/subirArchivo', methods=['POST'])
def subir_archivo():
    # print(request.files)
    if 'imagen' not in request.files:
        return 'no has mandado ningun archivo'
    archivo = request.files['imagen']
    if archivo.filename == '':
        return 'no hay ningun archivo en la llave imagen'
    # para evitar que el mismo usuario u otro usuario ingrese otro archivo pero con un mismo nombre que ya esta en el servidor se agrega a su nombre la fecha actual
    # print(datetime.now().timestamp())
    fecha = str(datetime.now().timestamp()).replace(".","")
    # print(fecha)
    nombreModificado = fecha +'-'+archivo.filename
    filename = secure_filename(nombreModificado)
    # print(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    archivo.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    # que faltaria para agregar esa direccion de la imagen a mi proyecto
    return 'se guardo!'

@app.route('/devolverImagen/<string:nombre>')
def devolver_imagen(nombre):
    try:
        return send_file(os.path.join(app.config['UPLOAD_FOLDER'],nombre))
    except:
        return send_file(os.path.join(app.config['UPLOAD_FOLDER'],'default.png'))




if __name__ == '__main__':
    app.run(debug=True)


# INSERT INTO `portafolioflask`.`t_usuario` (`usu_nom`, `usu_ape`, `usu_titulos`) VALUES ('EDUARDO', 'DE RIVERO', 'DEVELOPER FULL STACK, DBA, DRON PILOT, BIKER');
# INSERT INTO `portafolioflask`.`t_proyecto` (`proy_desc`, `proy_duracion`, `proy_img`, `usu_id`) VALUES ('PROYECTO VETERINARIAS', '3', 'https://micarrerauniversitaria.com/wp-content/uploads/2018/03/veterinario-1.gif', '1');
# INSERT INTO `portafolioflask`.`t_proyecto` (`proy_desc`, `proy_duracion`, `proy_img`, `usu_id`) VALUES ('PROYECTO VOTACIONES', '1', 'https://s1.eestatic.com/2018/09/03/actualidad/Actualidad_335230041_130288736_1024x576.jpg', '1');
# INSERT INTO `portafolioflask`.`t_proyecto` (`proy_desc`, `proy_duracion`, `proy_img`, `usu_id`) VALUES ('PROYECTO LIBRERIA', '1', 'https://d2qc4bb64nav1a.cloudfront.net/cdn/13/images/libreriagrande01.jpg', '1');
# INSERT INTO `portafolioflask`.`t_redsocial` (`rs_nomb`, `rs_link`, `usu_id`) VALUES ('LINKEDIN', 'https://www.linkedin.com/in/ederiveroman/', '1');
# INSERT INTO `portafolioflask`.`t_redsocial` (`rs_nomb`, `rs_link`, `usu_id`) VALUES ('FACEBOOK', 'https://www.facebook.com/profile.php', '1');
# INSERT INTO `portafolioflask`.`t_contacto` (`contact_nomb`, `contact_email`, `contact_mensaje`, `usu_id`) VALUES ('JUAN ARANDA', 'jaranda@gmail.com', 'Hola quiero tus servicios!', '1');
# INSERT INTO `portafolioflask`.`t_contacto` (`contact_nomb`, `contact_email`, `contact_mensaje`, `usu_id`) VALUES ('Rosmery Rodriguez', 'rrodriguez@hotmail.com', 'Deseo una pagina web!', '1');
