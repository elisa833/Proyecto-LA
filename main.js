// convertir código JS a PHP
const convertirJsaPhp = () => {
    const inputJs = document.getElementById("texto").value.trim();

    // condicion para validar si hay código en el input
    if (!inputJs) {
        Swal.fire({
            icon: "warning",
            title: "Error",
            text: "Por favor, introduce código en el campo de entrada."
        });
        return;
    }

    // Validar sintaxis básica de JS
    try {
        new Function(inputJs); // Intenta compilar el código JS
    } catch (e) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "El código JS tiene errores de sintaxis."
        });
        return;
    }
    let nombresVariables = [];
    // Convertir el código JS a PHP 
    let phpCodigo = inputJs
        // Variables
        .replace(/\blet\s+(\w+)\s*=\s*(.*?);/g,  (match, variable,valor) => { 
            nombresVariables.push(variable);
            return `${variable} = ${valor};`;
        }) // let -> $
        .replace(/\bconst\s+(\w+)\s*=\s*(.*?);/g, "define('$1',$2);") // const -> const
        .replace(/\bvar\s+(\w+)\s*=\s*(.*?);/g, "$$$1 = $2;") // var -> $
        // Arreglos
        .replace(/\[(.*?)\]/g, "array($1)") // Arreglos simples
        .replace(/console\.log\((.*?)\);/g, "echo $1;") // console.log -> echo
        // Funciones
        .replace(/function\s+(\w+)\((.*?)\)\s*{/g, "function $1($2) {") // Funciones tradicionales
        // Clases y Objetos
        .replace(/class\s+(\w+)\s*{/g, "class $1 {") // Clase
        .replace(/constructor\((.*?)\)\s*{/g, "public function __construct($1) {") // Constructor
        .replace(/this\.(\w+)/g, "$this->$1") // Referencias a this
        .replace(/new\s+(\w+)\((.*?)\)/g, "$$1 = new $1($2);") // Crear objetos
        .replace(/console\.log\(`(.*?)\${(.*?)}(.*?)`\);/g, "echo \"$1$2$3\";") // Template strings
        // Funciones flecha
        .replace(/const\s+(\w+)\s*=\s*\(\)\s*=>\s*/g, "function $1 "); // Función flecha

    // Mostrar el resultado en el área de salidaPhp
    nombresVariables.map(e => phpCodigo = phpCodigo.replaceAll(e,`$${e}`));
    document.getElementById("salidaPhp").value = phpCodigo;
    console.log(nombresVariables);
    Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Código convertido correctamente."
    });
};

// Función flecha para copiar el resultado PHP al portapapeles
const copiarPHP = () => {
    const salidaPhp = document.getElementById("salidaPhp");

    // Validar si hay código en el área de salida
    if (!salidaPhp.value.trim()) {
        Swal.fire({
            icon: "warning",
            title: "Error",
            text: "No hay código PHP para copiar."
        });
        return;
    }

    // Copiar al portapapeles
    navigator.clipboard.writeText(salidaPhp.value).then(() => {
        Swal.fire({
            icon: "success",
            title: "Correcto",
            text: "Código PHP copiado al portapapeles."
        });
    }).catch(() => {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo copiar el código PHP."
        });
    });
};

// Función flecha para limpiar el textarea de salida del codigo PHP
const limpiarPHP = () => {
    document.getElementById("salidaPhp").value = "";
    Swal.fire({
        icon: "info",
        title: "Borrado",
        text: "El área de salida se ha borrado."
    });
};

// Asignar funciones a los botones
document.getElementById("convertiraPhp").addEventListener("click", convertirJsaPhp);
document.getElementById("copiarPHP").addEventListener("click", copiarPHP);
document.getElementById("limpiarPHP").addEventListener("click", limpiarPHP);
