# https://flask-sqlalchemy.palletsprojects.com/en/2.x/
# https://docs.sqlalchemy.org/en/13/core/type_basics.html
from base_de_datos import bd

class LibroModel(bd.Model):
    __tablename__="t_libro"
    id_libro= bd.Column('lib_id', bd.Integer, primary_key=True, autoincrement=True, nullable=False)
    nombre_libro = bd.Column('lib_nom', bd.String(45), nullable=False)
    edicion_libro = bd.Column('lib_edicion', bd.Date(), nullable=False)
    autor_libro = bd.Column('lib_autor', bd.Text)
    cantidad_libro = bd.Column('lib_cant', bd.Integer, nullable=False)
    prestamosLibro = bd.relationship('PrestamoModel', backref='libroPrestamo')

    def __init__(self, nombre, edicion, cantidad, autor):
        self.nombre_libro = nombre
        self.edicion_libro = edicion
        self.autor_libro = autor
        self.cantidad_libro = cantidad
    
    def save(self):
        # crea la instanciacion en la base de datos (ingresa todos sus datos pero aun no se guardan)
        bd.session.add(self)
        # hace que los cambios ingresados sean permanentes (aca ya se guarda en la base de datos)
        bd.session.commit()
    
    def __str__(self):
        # este metodo magico permite sobreescribir la forma en la cual se lee el objeto en consola
        return self.nombre_libro
    
    def devolverJson(self):
        return {
            'id': self.id_libro,
            'nombre': self.nombre_libro,
            'autor': self.autor_libro,
            'edicion': str(self.edicion_libro),
            'cantidad': self.cantidad_libro
        }