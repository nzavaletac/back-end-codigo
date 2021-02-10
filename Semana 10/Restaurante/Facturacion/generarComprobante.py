import requests
from datetime import datetime
from .models import CabeceraComandaModel, ComprobanteModel
def emitirComprobante(  tipo_comprobante, 
                        cliente_tipo_documento, 
                        cliente_documento, 
                        cliente_email,
                        cabecera_id,
                        observaciones
                        ):
    # sunat_transaction sirve para indicar que tipo de transaccion estas realizando, generalmente es el 1 "VENTA INTERNA"
    # moneda => 1: SOLES , 2: DOLARES, 3: EUROS
    # formato_de_pdf => A4, A5, TICKET
    # buscar el cliente segun su documento
    cliente_denominacion = ""
    documento = 0
    comanda = CabeceraComandaModel.objects.get(cabeceraId = cabecera_id)
    # el total de la comanda ya es un precio que incluye igv
    # el monto total gravada es el monto sin el igv
    total = float(comanda.cabeceraTotal)
    total_gravada = total / 1.18
    total_igv = total - total_gravada

    if len(cliente_documento) > 0:
        base_url_apiperu = "https://apiperu.dev/api/"
        if cliente_tipo_documento == "RUC":
            base_url_apiperu = base_url_apiperu+"ruc/{}".format(cliente_documento)
        elif cliente_documento == "DNI":
            base_url_apiperu = base_url_apiperu+"dni/{}".format(cliente_documento)

        headers = {
            "Authorization": "Bearer 6287da8da77342f7e4aab59b670dbe153f0e803c2553e7a7dcbcc7d2510ba793",
            "Content-Type": "application/json"
        }
        respuestaApiPeru = requests.get(url=base_url_apiperu, headers=headers)
    
        if cliente_tipo_documento == "RUC":
            documento = 6
            cliente_denominacion = respuestaApiPeru.json()['data']['nombre_o_razon_social']
        elif cliente_tipo_documento == "DNI":
            documento = 1
            cliente_denominacion = respuestaApiPeru.json()['data']['nombre_completo']
    else:
        # en caso que me quiera mandar sin cliente_documento PERO el valor de venta sea mayor que 700 soles no va a ser posible realizar la operacion
        if total > 700:
            return {'errors':'Para un monto mayor a 700 es necesario una identificacion'}
        documento = "-"
        cliente_denominacion="VARIOS"
        cliente_documento="VARIOS"    

    # items
    # codigo => codigo interno que manejamos nosotros
    # tipo de igv es para ver que declaracion tiene ese item si es gravado inafecto o exonerado
    # unidad de medida es NIU para productos y ZZ para servicios 
    # valor unitario es SIN IGV
    # precio unitario es CON IGV
    # subtotal => valor_unitario * cantidad 
    
    # NOTA: Para registrar un producto en la SUNAT no puede haber un producto con precio 0.00
    items = []
    for detalle in comanda.cabeceraDetalles.all():
        precio_unitario = float(detalle.inventario.inventarioPrecio)
        valor_unitario = precio_unitario / 1.18
        cantidad = detalle.detalleCantidad
        items.append({
            "unidad_de_medida":"NIU",
            "codigo": detalle.detalleId,
            "descripcion": detalle.inventario.inventarioPlato,
            "cantidad": cantidad,
            "valor_unitario": valor_unitario,
            "precio_unitario": precio_unitario,
            "subtotal": valor_unitario * cantidad,
            "tipo_de_igv": 1,
            "igv": (valor_unitario * cantidad) * 0.18,
            "total": precio_unitario * cantidad,
            "anticipo_regularizacion": False
        })
    # La serie:
    # Las facturas y notas asociadas empiezan con F
    # Las boletas y notas asociadas empiezan con B
    serie = ""
    if tipo_comprobante == 1:
        serie = "FFF1"
        # SELECT TOP(1) * FROM T_COMPROBANTE WHERE COMPROBANTESERIE = SERIE ORDER BY COMPROBANTENUMERO DESC
        ultimoComprobante = ComprobanteModel.objects.filter(comprobanteSerie=serie).order_by('-comprobanteNumero').first()
    elif tipo_comprobante == 2:
        serie = "BBB1"
        ultimoComprobante = ComprobanteModel.objects.filter(comprobanteSerie=serie).order_by('-comprobanteNumero').first()
    # tipo_comprobante => 1: Factura, 2: Boleta, 3: Nota credito, 4: Nota debito
    numero = ultimoComprobante.comprobanteNumero + 1
    comprobante_body={
        "operacion": "generar_comprobante",
        "tipo_de_comprobante": tipo_comprobante,
        "serie": serie,
        "numero": numero,
        "sunat_transaction": 1,
        "cliente_tipo_de_documento": documento,
        "cliente_numero_de_documento": cliente_documento,
        "cliente_denominacion" : cliente_denominacion,
        "cliente_direccion": "",
        "cliente_email": cliente_email,
        "fecha_de_emision": datetime.now().strftime("%d-%m-%Y"),
        "moneda": 1,
        "porcentaje_de_igv": 18.00,
        "total_gravada":total_gravada,
        "total_igv": total_igv,
        "total": total,
        "detraccion": False,
        "observaciones":observaciones,
        "enviar_automaticamente_a_la_sunat": True,
        "enviar_automaticamente_al_cliente": True,
        "medio_de_pago":"EFECTIVO",
        "formato_de_pdf": "A4",
        "items": items
    }
    url_nubefact = "https://api.nubefact.com/api/v1/db267c95-40d8-4757-9731-588481167020"
    headers_nubefact = {
        "Authorization": "3b643f32df9d40f089ff1685774d41206f8b633d814646969d29da362afa527b",
        "Content-Type": "application/json"
    }
    respuesta_nubefact = requests.post(url=url_nubefact, json=comprobante_body, headers= headers_nubefact)
    return respuesta_nubefact.json()

def buscarComprobante():
    pass
