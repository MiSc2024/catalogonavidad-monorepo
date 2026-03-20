import { defineStackbitConfig } from '@stackbit/types';

export default defineStackbitConfig({
    stackbitVersion: '~0.6.0',
    ssgName: 'custom',
    nodeVersion: '20',
    
    // Comando para arrancar el entorno de desarrollo del monorepo (Vite + Netlify local)
    devCommand: 'npm run dev',
    
    // Directorio de páginas en base a la carpeta "packages/frontend" indicada en netlify.toml
    pagesDir: 'packages/frontend/content/pages',
    
    // Definición de los modelos visuales
    models: {
        page: {
            type: 'page',
            label: 'Página Genérica',
            // REQUISITO CUMPLIDO: urlPath y filePath definidos explícitamente y apuntando al subpaquete correcto
            urlPath: '/{slug}',
            filePath: 'packages/frontend/content/pages/{slug}.md',
            fields: [
                { name: 'title', type: 'string', required: true, label: 'Título de la Página' },
                { name: 'slug', type: 'string', required: true, label: 'Slug (URL)' },
                { name: 'content', type: 'markdown', label: 'Contenido Markdown' }
            ]
        },
        product: {
            type: 'page',
            label: 'Página de Producto',
            // REQUISITO CUMPLIDO: urlPath y filePath definidos
            urlPath: '/productos/{slug}',
            filePath: 'packages/frontend/content/productos/{slug}.md',
            fields: [
                { name: 'title', type: 'string', required: true, label: 'Nombre del Producto' },
                { name: 'slug', type: 'string', required: true, label: 'Slug (URL)' },
                { name: 'description', type: 'string', label: 'Descripción' },
                { name: 'price', type: 'number', label: 'Precio' }
            ]
        }
    }
});
