/**
 * Predefined allowlist of 36 Pokémon with curated visual style profiles.
 * Used for both Gemini prompt grounding and response validation.
 */
export const POKEMON_CATALOG = [
  {
    id: 25,
    name: 'pikachu',
    displayName: 'Pikachu',
    types: ['electric'],
    palette: ['yellow', 'red', 'black'],
    visualVibe: 'Energetic, cheerful, high-voltage smile, vibrant bright tones',
    features: ['Beaming open smile', 'Bright electric yellow palette', 'Perky spiky accents']
  },
  {
    id: 133,
    name: 'eevee',
    displayName: 'Eevee',
    types: ['normal'],
    palette: ['brown', 'cream', 'tan'],
    visualVibe: 'Warm, adaptable, fluffy collar hair, welcoming friendly gaze',
    features: ['Warm friendly expression', 'Voluminous fluffy hair/collar', 'Earthy brown and cream tones']
  },
  {
    id: 143,
    name: 'snorlax',
    displayName: 'Snorlax',
    types: ['normal'],
    palette: ['teal', 'cream', 'navy'],
    visualVibe: 'Ultra-relaxed, cozy, peaceful closed-eye smile, serene chill energy',
    features: ['Peaceful closed-eye contentment', 'Deep teal and cream color styling', 'Cozy, laid-back vibe']
  },
  {
    id: 94,
    name: 'gengar',
    displayName: 'Gengar',
    types: ['ghost', 'poison'],
    palette: ['purple', 'violet', 'red'],
    visualVibe: 'Mischievous wide grin, spiky tufts, playful prankster shadow energy',
    features: ['Cheeky wide-mouth grin', 'Deep purple and violet styling', 'Spiky hair or silhouette contours']
  },
  {
    id: 39,
    name: 'jigglypuff',
    displayName: 'Jigglypuff',
    types: ['normal', 'fairy'],
    palette: ['pink', 'blue', 'white'],
    visualVibe: 'Expressive wide round eyes, soft pink pastel tones, curled bangs',
    features: ['Sweet rounded eye contact', 'Pastel pink palette', 'Curled frontal hair or bangs']
  },
  {
    id: 54,
    name: 'psyduck',
    displayName: 'Psyduck',
    types: ['water'],
    palette: ['yellow', 'tan'],
    visualVibe: 'Quirky bewildered stare, hands-on-head humor, endearing comic presence',
    features: ['Puzzled or surprised wide stare', 'Sunny yellow color accents', 'Playful candid comic posture']
  },
  {
    id: 7,
    name: 'squirtle',
    displayName: 'Squirtle',
    types: ['water'],
    palette: ['light-blue', 'tan', 'brown'],
    visualVibe: 'Cool confident smirk, sleek squad shades vibe, upbeat charm',
    features: ['Confident sideways smirk', 'Cool aquatic light-blue tones', 'Smooth sleek hair or sunglasses look']
  },
  {
    id: 4,
    name: 'charmander',
    displayName: 'Charmander',
    types: ['fire'],
    palette: ['orange', 'cream', 'red'],
    visualVibe: 'Warm energetic grin, fiery spirited optimism, sunny warmth',
    features: ['Warm spirited smile', 'Vibrant orange and cream styling', 'Curious and friendly gaze']
  },
  {
    id: 1,
    name: 'bulbasaur',
    displayName: 'Bulbasaur',
    types: ['grass', 'poison'],
    palette: ['teal', 'green', 'cyan'],
    visualVibe: 'Grounded sturdy calm, wide natural smile, earthy botanical tones',
    features: ['Grounded calm smile', 'Teal, turquoise, and foliage green palette', 'Sturdy dependable presence']
  },
  {
    id: 448,
    name: 'lucario',
    displayName: 'Lucario',
    types: ['fighting', 'steel'],
    palette: ['blue', 'black', 'yellow'],
    visualVibe: 'Focused athletic gaze, disciplined poise, sleek headband/aura sensor look',
    features: ['Sharp focused determined stare', 'Sporty cobalt blue and black styling', 'Headband, cap or sleek hair lines']
  },
  {
    id: 52,
    name: 'meowth',
    displayName: 'Meowth',
    types: ['normal'],
    palette: ['cream', 'gold', 'brown'],
    visualVibe: 'Witty clever smirk, gold accessory charm, alert expressive presence',
    features: ['Clever knowing smirk', 'Gold jewelry or prominent accessory', 'Warm cream and tan clothing tones']
  },
  {
    id: 79,
    name: 'slowpoke',
    displayName: 'Slowpoke',
    types: ['water', 'psychic'],
    palette: ['pink', 'tan'],
    visualVibe: 'Completely carefree, blissful dopey smile, zero stress tranquility',
    features: ['Blissfully peaceful unfazed smile', 'Soft coral pink styling', 'Serene unhurried aura']
  },
  {
    id: 65,
    name: 'alakazam',
    displayName: 'Alakazam',
    types: ['psychic'],
    palette: ['gold', 'brown', 'silver'],
    visualVibe: 'Distinguished mustache/beard styling, intellectual focus, sharp gaze',
    features: ['Distinguished facial hair or sharp jawline', 'Rich golden brown palette', 'Thoughtful analytical expression']
  },
  {
    id: 68,
    name: 'machamp',
    displayName: 'Machamp',
    types: ['fighting'],
    palette: ['grey', 'gold', 'slate'],
    visualVibe: 'Broad powerful championship grin, athletic fitness aesthetic',
    features: ['Beaming powerful confident grin', 'Athletic or sporty styling', 'Clean slate grey and golden accents']
  },
  {
    id: 175,
    name: 'togepi',
    displayName: 'Togepi',
    types: ['fairy'],
    palette: ['white', 'red', 'blue'],
    visualVibe: 'Pure joyful baby smile, spiked crown silhouette, patterned geometry',
    features: ['Radiant pure joy expression', 'Patterned or multi-colored accents', 'Spiky crown-like hair texture']
  },
  {
    id: 149,
    name: 'dragonite',
    displayName: 'Dragonite',
    types: ['dragon', 'flying'],
    palette: ['orange', 'cream', 'teal'],
    visualVibe: 'Gentle friendly giant smile, warm hospitable reassurance',
    features: ['Gentle reassuring friendly smile', 'Warm apricot orange palette', 'Soft approachable facial features']
  },
  {
    id: 135,
    name: 'jolteon',
    displayName: 'Jolteon',
    types: ['electric'],
    palette: ['yellow', 'white', 'black'],
    visualVibe: 'Sharp spiky hair, electrified intense focus, high contrast angles',
    features: ['Sharp spiky hair texture', 'Electric yellow and crisp white styling', 'Piercing alert gaze']
  },
  {
    id: 134,
    name: 'vaporeon',
    displayName: 'Vaporeon',
    types: ['water'],
    palette: ['cerulean', 'navy', 'white'],
    visualVibe: 'Flowing aquatic elegance, cool aquatic collar, refreshing serenity',
    features: ['Refreshing serene expression', 'Cool cerulean blue color theme', 'Flowing sleek hair or collar styling']
  },
  {
    id: 136,
    name: 'flareon',
    displayName: 'Flareon',
    types: ['fire'],
    palette: ['orange', 'gold', 'yellow'],
    visualVibe: 'Ultra-plush voluminous hair/mane, cozy winter warmth, rich warmth',
    features: ['Voluminous bushy wavy hair', 'Rich warm flame-orange and gold palette', 'Cozy comfortable visual style']
  },
  {
    id: 196,
    name: 'espeon',
    displayName: 'Espeon',
    types: ['psychic'],
    palette: ['lilac', 'lavender', 'crimson'],
    visualVibe: 'Sleek poised elegance, forehead accessory gem, tranquil intuitive grace',
    features: ['Poised elegant expression', 'Soft lavender or lilac tones', 'Forehead accessory, bindi, or sleek parting']
  },
  {
    id: 197,
    name: 'umbreon',
    displayName: 'Umbreon',
    types: ['dark'],
    palette: ['black', 'yellow', 'charcoal'],
    visualVibe: 'Nocturnal cool, mysterious calm gaze, dark attire with glowing accents',
    features: ['Mysterious calm composed gaze', 'Sleek black or dark clothing', 'Vibrant yellow or gold trim accents']
  },
  {
    id: 123,
    name: 'scyther',
    displayName: 'Scyther',
    types: ['bug', 'flying'],
    palette: ['green', 'cream', 'white'],
    visualVibe: 'Sharp dynamic angles, fierce competitive gaze, vibrant botanical green',
    features: ['Intense focused competitive look', 'Vibrant lime or forest green palette', 'Sharp angled posture or haircut']
  },
  {
    id: 130,
    name: 'gyarados',
    displayName: 'Gyarados',
    types: ['water', 'flying'],
    palette: ['blue', 'yellow', 'white'],
    visualVibe: 'Dramatic powerful expression, roaring energy, crested head presence',
    features: ['Dramatic high-energy expression', 'Bold cobalt blue and yellow accents', 'High-volume crested hair']
  },
  {
    id: 132,
    name: 'ditto',
    displayName: 'Ditto',
    types: ['normal'],
    palette: ['purple', 'magenta'],
    visualVibe: 'Minimalist relaxed smile, gentle adaptable presence, soft violet tones',
    features: ['Minimalist subtle calm smile', 'Soft magenta or lilac colors', 'Unfussy, casual relaxed styling']
  },
  {
    id: 194,
    name: 'wooper',
    displayName: 'Wooper',
    types: ['water', 'ground'],
    palette: ['cyan', 'pink', 'blue'],
    visualVibe: 'Wide open toothless grin, whimsical antenna-like hair, pure wholesome joy',
    features: ['Delightfully wide cheerful mouth', 'Light cyan or baby blue clothing', 'Playful antennae-like curls or hair tufts']
  },
  {
    id: 202,
    name: 'wobbuffet',
    displayName: 'Wobbuffet',
    types: ['psychic'],
    palette: ['sky-blue', 'black', 'white'],
    visualVibe: 'Patient squinting smile, humorous salute posture, cheerful resilience',
    features: ['Humorous squinting happy face', 'Bright sky blue styling', 'Quirky salute or expressive gesture']
  },
  {
    id: 282,
    name: 'gardevoir',
    displayName: 'Gardevoir',
    types: ['psychic', 'fairy'],
    palette: ['emerald', 'white', 'red'],
    visualVibe: 'Sculpted stylish bob haircut, graceful poised elegance, flowing white',
    features: ['Immaculate bob or sleek sculpted haircut', 'Crisp white and emerald green styling', 'Graceful poised demeanor']
  },
  {
    id: 257,
    name: 'blaziken',
    displayName: 'Blaziken',
    types: ['fire', 'fighting'],
    palette: ['crimson', 'beige', 'gold'],
    visualVibe: 'Sweeping feathered crest hair, athletic discipline, passionate fiery gaze',
    features: ['Sweeping dynamic hair crest', 'Fiery crimson and cream color scheme', 'Confident focused athlete gaze']
  },
  {
    id: 258,
    name: 'mudkip',
    displayName: 'Mudkip',
    types: ['water'],
    palette: ['orange', 'blue', 'cyan'],
    visualVibe: 'Cheery orange cheek highlights, fin crest hair, spirited enthusiasm',
    features: ['Bright cheek accents or blush', 'Contrasting blue and orange tones', 'Enthusiastic spirited eyes']
  },
  {
    id: 445,
    name: 'garchomp',
    displayName: 'Garchomp',
    types: ['dragon', 'ground'],
    palette: ['navy', 'red', 'gold'],
    visualVibe: 'Aerodynamic sharp silhouette, bold confident determination, jet-set vibe',
    features: ['Bold confident determined gaze', 'Deep navy jacket with red/gold highlights', 'Sharp aerodynamic styled hair']
  },
  {
    id: 722,
    name: 'rowlet',
    displayName: 'Rowlet',
    types: ['grass', 'flying'],
    palette: ['tan', 'white', 'green'],
    visualVibe: 'Dapper bowtie accessory, tidy round haircut, quiet observing charm',
    features: ['Neat tidy rounded hair styling', 'Bowtie, collar, or scarf accessory', 'Observant composed calm expression']
  },
  {
    id: 658,
    name: 'greninja',
    displayName: 'Greninja',
    types: ['water', 'dark'],
    palette: ['blue', 'pink', 'white'],
    visualVibe: 'Stealthy focused stare, stylish scarf accessory wrap, athletic agility',
    features: ['Sharp stealthy focused gaze', 'Prominent scarf, high-collar, or wrap accessory', 'Deep midnight blue tones']
  },
  {
    id: 778,
    name: 'mimikyu',
    displayName: 'Mimikyu',
    types: ['ghost', 'fairy'],
    palette: ['beige', 'charcoal', 'yellow'],
    visualVibe: 'Vintage hand-crafted aesthetic, quirky DIY charm, endearing mystery',
    features: ['Quirky charming DIY styling', 'Vintage beige, cream or textured fabric', 'Intriguing mysterious shy smile']
  },
  {
    id: 832,
    name: 'wooloo',
    displayName: 'Wooloo',
    types: ['normal'],
    palette: ['white', 'black', 'grey'],
    visualVibe: 'Ultra-fluffy voluminous curls, braided side hair, sweet gentle aura',
    features: ['Voluminous curly or textured hair', 'Braided side strands or neat locks', 'Warm cuddly knitwear or cozy fleece']
  },
  {
    id: 959,
    name: 'tinkaton',
    displayName: 'Tinkaton',
    types: ['fairy', 'steel'],
    palette: ['pink', 'silver', 'white'],
    visualVibe: 'Cheeky mischievous grin, twin pigtails, holding bold accessories',
    features: ['Playful mischievous smirk', 'Pink tones or twin pigtails hairstyle', 'Expressive bold accessory presence']
  },
  {
    id: 912,
    name: 'quaxly',
    displayName: 'Quaxly',
    types: ['water'],
    palette: ['blue', 'white', 'teal'],
    visualVibe: 'Immaculate styled pompadour hair, pristine tidy grooming, polished style',
    features: ['Impeccably styled pompadour or parted hair', 'Crisp clean white and teal styling', 'Polished poised expression']
  }
];

export const POKEMON_MAP = new Map(
  POKEMON_CATALOG.map((p) => [p.name.toLowerCase(), p])
);

export const POKEMON_DISPLAY_MAP = new Map(
  POKEMON_CATALOG.map((p) => [p.displayName.toLowerCase(), p])
);
