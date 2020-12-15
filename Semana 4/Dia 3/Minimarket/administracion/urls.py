from django.urls import path
from .views import ProductosView, ProductoView, AlmacenesView

urlpatterns = [
    path('productos', ProductosView.as_view(), name="Productos"),
    path('producto/<int:id>', ProductoView.as_view()),
    path('almacenes', AlmacenesView.as_view()),
]