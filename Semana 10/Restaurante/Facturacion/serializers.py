from rest_framework import serializers
from .models import ComprobanteModel, DetalleComandaModel, MesaModel, UsuarioModel, CabeceraComandaModel
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils import timezone
from Almacen.serializers import PlatoSerializer


class RegistroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    def save(self):
        usuarioCorreo = self.validated_data.get('usuarioCorreo')
        usuarioNombre = self.validated_data.get('usuarioNombre')
        usuarioApellido = self.validated_data.get('usuarioApellido')
        usuarioTipo = self.validated_data.get('usuarioTipo')
        password = self.validated_data.get('password')
        nuevoUsuario = UsuarioModel(
            usuarioCorreo=usuarioCorreo,
            usuarioNombre=usuarioNombre,
            usuarioApellido=usuarioApellido,
            usuarioTipo=usuarioTipo)
        nuevoUsuario.set_password(password)
        nuevoUsuario.save()
        return nuevoUsuario

    class Meta:
        model = UsuarioModel
        # fields = '__all__'
        exclude = ['groups', 'user_permissions']


class MesaSerializer(serializers.ModelSerializer):
    # a un model serializer se le pueden agregar campos extras diferentes del mismo model
    # campoExtra = serializers.CharField(max_length=50)
    class Meta:
        model = MesaModel
        fields = '__all__'


class CustomPayloadSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super(CustomPayloadSerializer, cls).get_token(user)
        # luego que ya tenemos definida la token con el padre podemos agregar nuevos elementos
        token['nombreCompleto'] = user.usuarioNombre + user.usuarioApellido
        token['usuarioTipo'] = user.usuarioTipo
        return token


class InicioConsumidorSerializer(serializers.Serializer):
    mesaId = serializers.IntegerField()
    meseroId = serializers.IntegerField()

    def save(self):
        """Acá se guardará la cabecera"""
        print(self.validated_data)
        # de mi data ya validada gracias al metodo is_valid se crea un diccionario validated_data y otra forma de devolver los resultado de un diccionario es mediante su metodo get('key')
        mesaId = self.validated_data.get('mesaId')
        meseroId = self.validated_data.get('meseroId')
        # PASO 1 cambiar el estado de la mesa segun su id
        # UPDATE t_mesa SET mesa_estado = 0 WHERE mesa_id = mesaID
        # la clausula update me retonará el total de registro actualizados

        # Si deseo trabajar solamente con el filter
        mesa2 = MesaModel.objects.filter(mesaId=mesaId)
        mesa2.update(mesaEstado=False)
        print(mesa2[0])
        # Si uso el metodo first ya no podré usar el metodo update puesto que solo funciona cuando hay un array de instancias
        mesa = MesaModel.objects.filter(mesaId=mesaId).first()
        # el metodo update solo funciona cuando querramos actualizar uno o varios registros
        # mesa.update(mesaEstado=False)
        mesa.mesaEstado = False
        mesa.save()
        print(mesa)
        mesero = UsuarioModel.objects.filter(usuarioId=meseroId).first()
        # PASO 2 crear la cabecera de la comanda con la mesa y el mesero
        nuevaCabecera = CabeceraComandaModel(cabeceraFecha=timezone.now(
        ), cabeceraTotal=0.0, cabeceraCliente="", mesa=mesa, usuario=mesero)
        nuevaCabecera.save()
        return nuevaCabecera


class ComandaDetalleSerializer(serializers.ModelSerializer):
    def save(self):
        # a parte de registrar la comanda hacer el descuento del inventario
        cantidad = self.validated_data.get('detalleCantidad')
        subtotal = self.validated_data.get('detalleSubtotal')
        cabecera = self.validated_data.get('cabecera')
        inventario = self.validated_data.get('inventario')
        detalleComanda = DetalleComandaModel(
            detalleCantidad=cantidad, detalleSubtotal=subtotal, cabecera=cabecera, inventario=inventario)
        detalleComanda.save()
        # cuando usamos un modelSerializer todas las fk internamente el serializador hace la busqueda para validar
        inventario.inventarioCantidad = inventario.inventarioCantidad - cantidad
        inventario.save()
        totalDetalle = subtotal * cantidad

        cabecera.cabeceraTotal = cabecera.cabeceraTotal + totalDetalle
        cabecera.save()

        return detalleComanda

    class Meta:
        model = DetalleComandaModel
        fields = '__all__'


class MeseroSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsuarioModel
        fields = ['usuarioNombre', 'usuarioApellido']


class DevolverNotaDetalleSerializer(serializers.ModelSerializer):
    plato = PlatoSerializer(source='inventario')

    class Meta:
        model = DetalleComandaModel
        # fields = '__all__'
        exclude = ['inventario', 'cabecera', 'detalleId']


class DevolverNotaSerializer(serializers.ModelSerializer):
    detalleComanda = DevolverNotaDetalleSerializer(
        source="cabeceraDetalles", many=True)
    mesero = MeseroSerializer(source="usuario")

    class Meta:
        model = CabeceraComandaModel
        # fields = '__all__'
        exclude = ['usuario']


class GenerarComprobanteSerializer(serializers.Serializer):
    tipo_comprobante = serializers.IntegerField()
    cliente_tipo_documento = serializers.CharField(max_length=3)
    cliente_documento = serializers.CharField(max_length=11)
    cliente_email = serializers.CharField(max_length=50)
    observaciones = serializers.CharField(max_length=255)

class ComprobanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComprobanteModel
        fields = '__all__'