from flask import Flask, render_template

app = Flask(__name__)
# para pasar variables de mi funcion a mi html uso en el html {{variable}}
# para usar statements como por ejemplo un for, un bloque u otros se usa 
# {% template_tag %}....
# {% fin_template_tag %}

@app.route('/')
def pagina_principal():
    nombre = "Silvia"
    edad = 30
    # template tags
    return render_template('index.html', nombreCliente=nombre, edadCliente = edad)

@app.route('/proyectos')
def proyectos():
    return render_template('proyectos.html')

@app.route('/contact')
def contactamen():
    return render_template('contact-me.html')

if __name__ == '__main__':
    app.run(debug=True)