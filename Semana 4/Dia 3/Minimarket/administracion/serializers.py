from rest_framework import serializers
from .models import ProductoModel, AlmacenModel, ProductoAlmacenModel

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductoModel
        fields = "__all__"
        # si quisiese todos los campos menos uno u otro
        # exclude = ["campo1","campo2"...]
        # o uso el fields o uso el exclude, mas no se pueden usar los dos al mismo tiempo
    def update(self):
        # print(self.validated_data["productoNombre"])
        self.instance.productoNombre = self.validated_data.get("productoNombre", self.instance.productoNombre)
        self.instance.productoPrecio = self.validated_data.get("productoPrecio", self.instance.productoPrecio)
        self.instance.productoMinimo = self.validated_data.get("productoMinimo", self.instance.productoMinimo)
        self.instance.save()
        return self.instance
    # self.instance retorna la instancia actual que hay en mi clase, esta se logra gracias a la instancia dada al llamar al serializador
    # self.validated_data => esta es la data ya validada luego de llamar al metodo is_valid() en el controlador, si no se llama a este metodo este atributo va a ser None
    def delete(self):
        self.instance.estado = False
        self.instance.save()
        return self.instance

class AlmacenSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlmacenModel
        fields = '__all__'

class ProductoAlmacenSerializer(serializers.ModelSerializer):
    almacen = AlmacenSerializer(source="almacenId", read_only=True)
    # FORMA 1
    producto = ProductoSerializer(source="productoId", read_only=True)
    # FORMA 2
    # cuando yo uso el mismo campo con su nombre que le voy a pasar como recurso al serializador ya no es necesario ponerlo como parametro del serializador
    # productoId = ProductoSerializer(read_only=True)
    class Meta:
        model = ProductoAlmacenModel
        fields = '__all__'
        # FORMA 1
        # para evitar que me muestre de nuevo ese productoId lo quito de la lista
        # exclude = ['productoId', 'almacenId']

# este serializador lo voy a usar para cuando quiera devolver de mis productos sus almacenes
class ProductoAlmacenAlmacenVistaSerializer(serializers.ModelSerializer):
    almacen = AlmacenSerializer(source="almacenId", read_only=True)
    class Meta:
        model = ProductoAlmacenModel
        fields = ['almacen']

# este serializador lo voy a usar para cuando quiera devolver de mis almacenes sus productos
class ProductoAlmacenProductoVistaSerializer(serializers.ModelSerializer):
    producto = ProductoSerializer(source="productoId", read_only=True)
    class Meta:
        model = ProductoAlmacenModel
        fields = ['producto']

class AlmacenSerializerMany(serializers.ModelSerializer):
    # esto es una relacion inversa porque yo a partir del padre estoy devolviendo a todos sus hijos que le pertenecen y necesito para ello el campo related_name definido en la foreign key
    productosAlmacen = ProductoAlmacenProductoVistaSerializer(source="almacenesProductos", many=True, read_only=True)
    class Meta:
        model = AlmacenModel
        fields = '__all__'