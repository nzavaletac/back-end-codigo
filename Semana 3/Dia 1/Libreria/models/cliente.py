from base_de_datos import bd

class ClienteModel(bd.Model):
    __tablename__="t_cliente"
    id_cliente = bd.Column("cli_id", bd.Integer, primary_key = True, autoincrement = True, nullable = False)
    dni_cliente = bd.Column("cli_dni", bd.String(8), nullable = False) # unique=True
    nombre_cliente = bd.Column("cli_nomb", bd.String(45), nullable = False)
    apellido_cliente = bd.Column("cli_ape", bd.String(45), nullable = False)
    estado = bd.Column(bd.Boolean, default=True, nullable=False)
    # Sirve para hacer la relacion inversa
    prestamosCliente = bd.relationship('PrestamoModel', backref='clientePrestamo')
    
    def __init__(self, dni, nombre, apellido):
        self.dni_cliente = dni
        self.nombre_cliente = nombre
        self.apellido_cliente = apellido
    
    def devolverJson(self):
        return {
            'id': self.id_cliente,
            'dni': self.dni_cliente,
            'nombre': self.nombre_cliente,
            'apellido': self.apellido_cliente,
            'estado': self.estado
        }
    
    def devolverClientePrestamo(self):
        # modo intermedio-avanzado
        resultado = self.devolverJson()
        # print(self.prestamosCliente)
        prestamos = []
        for prestamo in self.prestamosCliente:
            prestamos.append(prestamo.devolverJson())
        resultado['prestamos']=prestamos
        return resultado

        # modo intermedio
        # prestamos = []
        # for prestamo in self.prestamosCliente:
        #     prestamos.append(prestamo.devolverJson())
        # return {
        #     'id': self.id_cliente,
        #     'dni': self.dni_cliente,
        #     'nombre': self.nombre_cliente,
        #     'apellido': self.apellido_cliente,
        #     'estado': self.estado,
        #     'prestamos': prestamos
        # }

    def save(self):
        bd.session.add(self)
        bd.session.commit()
