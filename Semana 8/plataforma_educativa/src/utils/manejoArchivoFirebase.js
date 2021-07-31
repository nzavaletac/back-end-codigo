const {Storage} = require("@google-cloud/storage");
// Inicializo mi objeto de Firebase para poner conectarme con mi Bucket
const credenciales = {
  projectId: "codigo-backend-eduardo",
  keyFilename: "./credenciales_firebase.json",
};
const storage = new Storage(credenciales);
// se crea la variable bucket que se usa como referencia al link del storage
// ! No se copia con el protocolo, solamente despues del doble //
const bucket = storage.bucket("codigo-backend-eduardo.appspot.com");

const subirArchivo = (archivo) => {
  return new Promise((resolve, reject) => {
    if (!archivo) {
      // es lo mismo que poner archivo === null | undefined
      reject("No se encontro el archivo");
    }
    // Modificamos el nombre original para prevenir que el usuario pueda sobreescribir un archivo con el mismo nombre
    const nuevoNombre = `${archivo.originalname}_${Date.now()}`;
    // comenzamos a cargar nuestro archivo con el nuevo nombre pero aun no se sube a Firebase
    const fileUpload = bucket.file(nuevoNombre);
    // agregamos configuracion adicional de nuestro archivo a subir como su metadata
    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: archivo.mimetype,
      },
    });
    // si hay un error al momento de subir el archivo ingresaremos a su estado "error"
    blobStream.on("error", (error) => {
      reject(`Hubo un error al subir el archivo: ${error}`);
    });
    // si el archivo termino de subirse satisfactoriamente ingresaremos a su estado "finish"
    blobStream.on("finish", () => {
      fileUpload
        .getSignedUrl({
          action: "read",
          expires: "01-26-2021", // MM-DD-YYYY
        })
        .then((link) => resolve(link))
        .catch((error) => reject(`Error al devolver el link: ${error}`));
    });
    // aca es donde se sube el archivo
    blobStream.end(archivo.buffer);
  });
};

const eliminarArchivoFirebase = async (url) => {
  let subimagen = url.split(".com/")[2];
  let imagen = subimagen.split("?")[0];
  // al momento de eliminar un archivo que no existe ya en firebase storage me indica por consola que no existe, como se podría controlar para indicar al cliente que se elimino de la bd pero no se encontro el archivo en el storage
  try {
    let rpta = await bucket.file(imagen).delete();
    console.log(rpta);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  subirArchivo,
  eliminarArchivoFirebase,
};
