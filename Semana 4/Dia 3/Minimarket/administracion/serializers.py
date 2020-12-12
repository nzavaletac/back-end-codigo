from rest_framework import serializers
from .models import ProductoModel

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductoModel
        fields = "__all__"
        # si quisiese todos los campos menos uno u otro
        # exclude = ["campo1","campo2"...]
        # o uso el fields o uso el exclude, mas no se pueden usar los dos al mismo tiempo