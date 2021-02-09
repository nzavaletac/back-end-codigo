import requests
from datetime import datetime
from .models import CabeceraComandaModel
def emitirComprobante(  tipo_comprobante, 
                        serie, 
                        numero, 
                        cliente_tipo_documento, 
                        cliente_documento, 
                        cliente_email,
                        cabecera,
                        observaciones
                        ):
    # sunat_transaction sirve para indicar que tipo de transaccion estas realizando, generalmente es el 1 "VENTA INTERNA"
    # moneda => 1: SOLES , 2: DOLARES, 3: EUROS
    # formato_de_pdf => A4, A5, TICKET
    # buscar el cliente segun su documento
    base_url_apiperu = "https://apiperu.dev/api/"
    if cliente_tipo_documento == "RUC":
        base_url_apiperu = base_url_apiperu+"ruc/{}".format(cliente_documento)
    else:
        base_url_apiperu = base_url_apiperu+"dni/{}".format(cliente_documento)
    
    headers = {
        "Authorization": "Bearer 6287da8da77342f7e4aab59b670dbe153f0e803c2553e7a7dcbcc7d2510ba793",
        "Content-Type": "application/json"
    }
    respuestaApiPeru = requests.get(url=base_url_apiperu, headers=headers)
    print(base_url_apiperu)
    print(respuestaApiPeru.json())
    print("VAMOS AL BREAK")

    comprobante_body={
        "operacion": "generar_comprobante",
        "tipo_de_comprobante": tipo_comprobante,
        "serie": serie,
        "numero": numero,
        "sunat_transaction": 1,
        "cliente_tipo_documento": cliente_tipo_documento,
        "cliente_denominacion" : "nombre",
        "cliente_direccion": "",
        "cliente_email": cliente_email,
        "fecha_de_emision": datetime.now().strftime("%d-%m-%Y"),
        "moneda": 1,
        "total_gravada":"total_gravada",
        "total_igv": "total_igv",
        "total": "total",
        "detraccion": False,
        "observaciones":observaciones,
        "enviar_automaticamente_a_la_sunat": True,
        "enviar_automaticamente_al_cliente": True,
        "medio_de_pago":"EFECTIVO",
        "formato_de_pdf": "A4",
        "items": "items"
    }

def buscarComprobante():
    pass
