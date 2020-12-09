from flask import Flask, render_template
from bd import bd
from models.usuario import UsuarioModel
from models.contacto import ContactoModel
from models.proyecto import ProyectoModel
from models.redsocial import RedSocialModel

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI']='mysql://root:root@localhost:3306/portafolioflask'
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
    nombre = "Silvia"
    edad = 30
    # template tags
    return render_template('index.html', nombreCliente=nombre, edadCliente = edad)

@app.route('/proyectos')
def proyectos():
    mis_proyectos = ['Proyecto1', 'Proyecto2', 'Proyecto3', 'Proyecto4']
    return render_template('proyectos.html', proyectos=mis_proyectos)

@app.route('/contact')
def contactamen():
    return render_template('contact-me.html')

if __name__ == '__main__':
    app.run(debug=True)