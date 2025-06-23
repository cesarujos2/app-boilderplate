const fs = require('fs');
const path = require('path');

// Leer el package.json para obtener la versión
const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

// Función para actualizar un archivo de environment
function updateEnvironmentFile(filePath) {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');

        // Reemplazar la versión en el archivo usando la nueva estructura
        content = content.replace(
            /VERSION:\s*['"`][^'"`]*['"`]/,
            `VERSION: '${version}'`
        );

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Versión actualizada en ${filePath}: ${version}`);
    } else {
        console.log(`⚠️  Archivo no encontrado: ${filePath}`);
    }
}

// Actualizar archivos de environment
const environmentFiles = [
    path.join(__dirname, '../src/environments/environment.ts'),
    path.join(__dirname, '../src/environments/environment.development.ts')
];

console.log(`🚀 Actualizando versión de la aplicación a: ${version}`);

environmentFiles.forEach(updateEnvironmentFile);

console.log('✅ Proceso completado');
