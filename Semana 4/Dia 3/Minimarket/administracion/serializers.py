from rest_framework import serializers
from .models import ProductoModel, AlmacenModel

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