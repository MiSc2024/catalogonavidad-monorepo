import type { Product } from '../types';

export function loadProducts(): Product[] {
    // @ts-ignore: Propiedad específica de Vite no tipada genéricamente
    const markdownFiles = import.meta.glob('../content/productos/*.md', { query: '?raw', eager: true });
    
    const products: Product[] = [];
    
    for (const path in markdownFiles) {
        const fileContent = markdownFiles[path] as { default: string };
        const rawContent = fileContent.default || (fileContent as unknown as string);
        
        const frontmatterMatch = rawContent.match(/^---\n([\s\S]*?)\n---/);
        const frontmatter = frontmatterMatch ? frontmatterMatch[1] : '';
        
        const metadata: Record<string, any> = {};
        
        const lines = frontmatter.split('\n');
        for (const line of lines) {
            const match = line.match(/^(\w+):\s*(.*)$/);
            if (match) {
                const key = match[1];
                let value = match[2].trim();
                // Eliminar comillas iniciales y finales si existen
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                if (key === 'price') {
                    metadata[key] = parseFloat(value);
                } else if (key === 'isMultiSpeaker') {
                    metadata[key] = value === 'true';
                } else {
                    metadata[key] = value;
                }
            }
        }
        
        products.push({
            id: metadata.slug || path.replace('.md', '').split('/').pop()!,
            title: metadata.title || 'Producto sin título',
            name: metadata.title || 'Producto sin título', 
            description: metadata.description || '',
            price: metadata.price,
            subtitle: metadata.subtitle || '',
            aiPromptDescription: metadata.aiPromptDescription || '',
            images: [],
            features: [],
            specs: []
        });
    }
    
    return products;
}
