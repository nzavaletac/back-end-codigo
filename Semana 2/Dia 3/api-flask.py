from flask import Flask, request
app = Flask(__name__)
supermercados = []

@app.route('/')
def inicio():
    return 'El servidor funciona exitosamente'
# GET => SE USA PARA SOLICITAR INFORMACION
# POST => SE USA PARA CREAR NUEVA INFORMACION
# PUT => SE USA PARA ACTUALIZAR ALGUN REGISTRO
# DELETE => SE USA PARA ELIMINAR ALGUN REGISTRO
# por defecto el unico metodo (verbo) permitido si no le indicamos va ser el GET
@app.route('/supermercado',methods=['GET','POST'])
def ingresar_supermercado():
    print(request.method)
    if request.method == 'GET':
        return {
            'respuesta':supermercados
        }
    elif request.method == 'POST':
        return 'me hiciste un POST'

if __name__== '__main__':
    app.run(debug=True)