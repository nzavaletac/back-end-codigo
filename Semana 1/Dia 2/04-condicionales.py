# CONDICIONAL IF ELSE ELIF
# edad = 25
# restriccion = 18
# if edad >= restriccion and edad<65:
#     print("eres mayor de edad")
# elif edad >= 65:
#     print("estas jubilado")
# else:
#     print("eres menor de edad")

# ELIF sirve para usarse en casos de case switch (PYTHON no existe el SWITCH CASE)

# Ingresar un numero por el teclado y que me diga si es mayor que 0, igual a 0 o menor que 0
# numero = int(input("ingrese un numero"))
# if numero < 0:
#     print("El numero es menor a cero")
# elif numero == 0:
#     print("El numero es igual a cero")
# else:
#     print("El numero es mayor a cero")

# FOR => es para hacer un bucle repetitivo
texto = "GOL DE ARGENTINA"
for letra in texto:
    print(letra)
print()
# for (let i=0; i<10; i++){}
for i in range(1,10,3):
    print(i)
# el metodo range recibe de 1 a 3 valores
# 1 : es el tope para la iteracion
# 2 : el primero es el inicio y el segundo es el tope
# 3 : el primero es el inicio y el segundo es el tope y el tercero es de cuanto en cuanto se va a incrementar o decrementar en cada ciclo
for i in range(len(texto)):
    print("posicion {}: {}".format(i, texto[i]))
    # posicion 0: G
    # posicion 1: O

# break => para parar el bucle
for i in range(10):
    print(i)
    if i == 5:
        break

# continue => salta la iteracion actual
for i in range(10):
    if i == 5:
        continue
    print(i)