// esta promesa se va a ejecutar inmediatamente
const miPromesa = new Promise((resolve, reject) => {
  resolve(5);
  // el reject solamente se va a llamar cuando sucedio algo incorrecto dentro de la promesa
  // reject("Error")
});
console.log(miPromesa);
// El then se va a ejecutar cuando la promesa retorne un valor satisfactorio, osea entra a funcionar su resolve()
// para usar el anidamiento de promesas nosotros podemos retornar dos cosas:
// 1. Otra promesa
// 2. Un valor cualquiera (una variable)
miPromesa
  .then((rpta) => rpta)
  .then((otraRpta) => Promise.reject("Error al ejecutarse la promesa"))
  .then((x) => console.log(x))
  .catch((e) => console.log("El error es:", e));

async function sumar(x1, x2) {
  (await x1) + x2;
}

// si uso un await obligatoriamente tiene que esta capturado en una funcion (normal, arrow, o anonima) y ahi usar la palabra clave async lo que generará que esa funcion se vuelva una promesa.
// let resultado = await sumar(5,4)

const retraso = (x) =>
  new Promise((resolve, reject) => {
    setTimeout(() => reject(x),5000);
  });

retraso(7).then(rpta=>{
    console.log(rpta);
}).catch(error=>{
    console.log("El error es",error);
})