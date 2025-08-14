
import type { Product } from './types';

export const productData: Product[] = [
    {
        id: 'elevator',
        name: 'Magic Elevator',
        subtitle: 'Christmas Edition',
        description: 'Prepárate para un viaje inmersivo a través de maravillosos mundos submarinos y montañas nevadas. Una aventura directa a la Fábrica de Juguetes, sin necesidad de visores de realidad virtual.',
        images: [
            'https://MiSc2024.github.io/catalogomagicnavidad/magic-elevator-1.png',
            'https://MiSc2024.github.io/catalogomagicnavidad/magic-elevator-2.png',
        ],
        imageAlts: [
            'Exterior del Magic Elevator decorado para Navidad',
            'Interior del Magic Elevator con pantallas de alta definición'
        ],
        features: [
            'Ascensor animatrónico con efecto vibración',
            'Efecto ventisca para inmersión total',
            'Pantallas TV 55" de alta definición',
            'Sistema de audio integrado',
            'Panel de activadores para apertura de puertas',
        ],
        specs: [
            { label: 'Ancho', value: '210 cm' },
            { label: 'Fondo', value: '280 cm' },
            { label: 'Alto', value: '290 cm' },
            { label: 'Aforo', value: '6 personas' },
        ],
        aiPromptDescription: 'Un simulador de ascensor con pantallas gigantes en las paredes y suelo, con efectos de vibración y viento. No requiere visores VR.',
    },
    {
        id: 'sleigh',
        name: 'Trineo VR Exclusivo',
        subtitle: 'Con Animatrónico Santa Claus',
        description: 'No es un adorno, es una herramienta de marketing vivo. Una inversión estratégica que combina la emoción de la VR con un Santa Claus hiperrealista para atraer tráfico, prolongar visitas y generar un recuerdo viral.',
        images: [
            'https://MiSc2024.github.io/catalogomagicnavidad/trineo-vr-1.png',
            'https://MiSc2024.github.io/catalogomagicnavidad/trineo-vr-2.png',
            'https://MiSc2024.github.io/catalogomagicnavidad/trineo-vr-3.png',
        ],
        imageAlts: [
            'Trineo VR con Santa Claus animatrónico y renos',
            'Detalle de los renos animatrónicos del Trineo VR',
            'Personas disfrutando de la experiencia del Trineo VR'
        ],
        features: [
            'Trineo mecanizado animatrónico',
            'Santa Claus animatrónico de alta precisión',
            'Renos Rudolf y Flecha animatrónicos',
            '5 visores de realidad virtual',
            'Sistema de audio y tótem de control',
        ],
        specs: [
            { label: 'Longitud', value: '250 cm' },
            { label: 'Anchura', value: '160 cm' },
            { label: 'Aforo', value: '6 Plazas' },
        ],
        aiPromptDescription: 'Un trineo que se mueve sobre una plataforma, con visores de Realidad Virtual para los participantes y un Santa Claus animatrónico al lado.',
    },
    {
        id: 'reindeer',
        name: 'Flecha y Bailarina',
        subtitle: 'Animatrónico',
        description: 'Una atracción compacta y encantadora. Flecha y Bailarina compiten en un simpático duelo musical para decidir quién será la voz principal del coro de Navidad, cautivando a grandes y pequeños.',
        images: ['https://MiSc2024.github.io/catalogomagicnavidad/flecha-bailarina.png'],
        imageAlts: ['Los renos animatrónicos Flecha y Bailarina en su escenario'],
        features: [
            'Los Renos Flecha y bailarina animatrónicos',
            'Sistema de audio integrado',
            'Panel de control y botones de activación',
        ],
        specs: [
            { label: 'Largo', value: '50 cm' },
            { label: 'Ancho', value: '80 cm' },
            { label: 'Alto', value: '160 cm' },
        ],
        aiPromptDescription: 'Dos bustos de renos animatrónicos que cantan y dialogan entre sí. Es una atracción estática y compacta.',
        isMultiSpeaker: true,
    },
];
