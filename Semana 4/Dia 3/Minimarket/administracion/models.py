from django.db import models
# Para ver todos los tipos de los modelos:
# https://docs.djangoproject.com/en/3.1/ref/models/fields/
# Create your models here.
class ProductoModel(models.Model):
    # si yo no defino la primary key se va a crear automaticamente en mi bd con el nombre Id
    # solamente puede haber un AutoField por modelo
    # si no indico el nombre de la columna en la bd se va a crear con el nombre del atributo
    productoId = models.AutoField(auto_created=True, primary_key=True, unique=True, null=False, db_column='prod_id')
    productoNombre = models.CharField(max_length=45, db_column='prod_nom')
    productoPrecio = models.DecimalField(max_digits=5, decimal_places=2, db_column='prod_prec')
    productoMinimo = models.IntegerField(db_column='prod_minimo')
    estado = models.BooleanField(default=True)
    # para definir algunas opciones extras como el nombre de la tabla, ordenamiento y modificar opciones de visualizacion en el panel administrativo se crea una clase Meta
    class Meta:
        # esta clase sirve para pasar metadatos al padre , es decir como estamos heredando de la clase Model, le vamos a pasar configuracion a ese padre
        db_table = 't_producto'
        # para cambiar algunas opciones del panel administrativo
        verbose_name_plural = "Productos"
        verbose_name = "Producto"

    def __str__(self):
        return self.productoNombre

class AlmacenModel(models.Model):
    almacenId = models.AutoField(primary_key=True, unique=True, null=False, db_column='alma_id')
    almacenDescripcion = models.CharField(max_length=75, db_column='alma_desc', verbose_name='Descripcion del almacen', help_text="aca va la descripcion del almacen")
    estado = models.BooleanField(default=True)
    class Meta:
        db_table='t_almacen'
        verbose_name_plural = "Almacenes"
        verbose_name = "Almacen"
        
    def __str__(self):
        return self.almacenDescripcion

class ProductoAlmacenModel(models.Model):
    productoAlmacenId = models.AutoField(primary_key=True, unique=True, null=False, db_column='prod_alma_id')
    productoAlmacenCantidad = models.IntegerField(db_column='prod_alma_cant')
    # CASCADE => esta opcion va a permitir eliminar el padre y que cuando se elimine, automaticamente todos los hijos se eliminen tambien
    # PROTECT => esta opcion no va a permitir eliminar el padre, y solmanente se va a poder eliminar el padre cuando no tenga ningun hijo relacionado
    # SET_NULL => permite eliminar al padre pero cuando este es eliminado, todos sus hijos quedan sin padre, es decir su campo de fk cambia de valor a null
    # DO_NOTHING => deja eliminar al padre y no elimina su valor del hijo, es decir se queda con esa llave aunque ya no exista, esto genera una mala integridad de los datos y crea errores al momento de devolver segun su padre
    productoId = models.ForeignKey(ProductoModel, on_delete=models.PROTECT, db_column='producto_id', related_name='productosAlmacenes')
    almacenId= models.ForeignKey(AlmacenModel, on_delete=models.PROTECT, db_column='alma_id', related_name='almacenesProductos')
    class Meta:
        db_table='t_prod_alma'

class CabeceraVentaModel(models.Model):
    cabeceraVentaId = models.AutoField(primary_key=True, unique=True, null=False, db_column='cabven_id')
    cabeceraVentaFecha = models.DateTimeField(db_column='cabven_fecha')
    cabeceraVentaTotal = models.DecimalField(max_digits=5, decimal_places=2, db_column='cabven_total')
    cabeceraVentaNombre = models.CharField(max_length=45, db_column='cabven_nomb')
    class Meta:
        db_table='t_cabventa'

class DetalleVentaModel(models.Model):
    detalleVentaId = models.AutoField(primary_key=True, unique=True, null=False, db_column='detven_id')
    detalleVentaCantidad = models.IntegerField(db_column='detven_cant')
    detalleVentaSubTotal = models.DecimalField(max_digits=5, decimal_places=2, db_column='detven_subtotal')
    cabeceraVentaId = models.ForeignKey(CabeceraVentaModel, on_delete=models.PROTECT, db_column='cabven_id', related_name='cabeceraVentas')
    productoAlmacenId = models.ForeignKey(ProductoAlmacenModel, on_delete=models.PROTECT, db_column='prod_alma_id', related_name='productoAlmacenVentas')
    class Meta:
        db_table='t_detventa'