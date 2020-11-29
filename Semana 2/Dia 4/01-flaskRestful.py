# pip3 install flask-restful
from flask import Flask, request
from flask_restful import Resource, Api
app = Flask(__name__)
api = Api(app)
items =[{
    'prodNomb': 'Sapolio',
    'prodPrec':5.40,
    'prodCar':['LIMPIA TODO','DESENGRASANTE','LAVAVAJILLAS']
},{
    'prodNom':'Ayudin',
    'prodPrec':3.8,
    'prodCar':['ESPONJA GRATIS','LIQUIDO','DESENGRASANTE', 'PULIDOR']
},{
    'prodNom':'PEPSI 3L',
    'prodPrec':5.8,
    'prodCar':['GASEOSA','CARBONATADA','LIQUIDO','ALTO EN AZUCAR']
}]
# DE ACUERDO A UN BUSCADOR QUE ME INDIQUE TODOS LOS PRODUCTOS QUE TENGAN ESA CARACTERISTICA
# 127.0.0.1/buscar {"palabra":"CHELAS"}
@app.route('/')
def inicio():
    return 'La api funciona'

@app.route('/buscar', methods=['POST'])
def buscar():
    # DEBO USAR DOBLE FOR
    data = request.get_json()
    palabra = data['palabra']
    # print(palabra)
    resultado = []
    for item in items:
        # print(item['prodCar'])
        # USANDO EL METODO upper() y lower() filtrar ya se sea si se ingresa la palabra en mayus o en minus
        for caracteristica in item['prodCar']:
            if caracteristica.lower() == palabra.lower():
                resultado.append(item)
            # print(caracteristica)
    return {
        'ok':True,
        'content': resultado
    }



class Item(Resource):
    def get(self, id):
        if len(item) > id:
            return {
                'ok': True,
                'message':None,
                'content': item[id]
            }
        else:
            return {
                'ok':False,
                'message': 'No se encontro el item a buscar',
                'content': None
            }
    def post(self):
        return 'ok'

# Con el uso de flask_restfill ya no se necesitan decoradores , solamente se pasa un parametro para agregar un recurso a la api
api.add_resource(Item,'/item','/item/<int:id>')

if __name__ == '__main__':
    app.run(debug=True)
