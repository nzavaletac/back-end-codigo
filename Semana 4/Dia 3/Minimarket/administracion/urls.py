from django.urls import path
from .views import (ProductosView, 
                    ProductoView, 
                    AlmacenesView, 
                    ProductosAlmacenesView, 
                    CabeceraVentasView,
                    VentaView)

urlpatterns = [
    path('productos', ProductosView.as_view(), name="Productos"),
    path('producto/<int:id>', ProductoView.as_view()),
    path('almacenes', AlmacenesView.as_view()),
    path('productosalmacenes', ProductosAlmacenesView.as_view()),
    path('cabeceraventas', CabeceraVentasView.as_view()),
    path('venta', VentaView.as_view()),
]