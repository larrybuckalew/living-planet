import type { Ambience } from '@/lib/ambient'

export type Place = {
  id: string
  name: string
  lat: number
  lon: number
  ambience: Ambience
  blurb: string
  description: string[]
  stats: { label: string; value: string }[]
}

export const places: Place[] = [
  {
    id: 'amazon-rainforest',
    name: 'Amazon Rainforest',
    lat: -3.47,
    lon: -62.22,
    ambience: 'rainforest',
    blurb: "The planet's largest rainforest, breathing out a fifth of its oxygen.",
    description: [
      'Nine countries share the Amazon basin, but the forest behaves like a single organism. Its canopy recycles the same rain up to seven times before it reaches the sea.',
      'At sunset the surface dimples with heat haze, and fungal spores seed the clouds themselves. This is one of the few places on Earth where biology makes its own weather.',
    ],
    stats: [
      { label: 'Canopy area', value: '5.5M km²' },
      { label: 'Share of Earth’s oxygen', value: '~20%' },
      { label: 'Known species', value: '3M+' },
      { label: 'Age of the forest', value: '55M years' },
    ],
  },
  {
    id: 'andes',
    name: 'Andes Mountains',
    lat: -13.53,
    lon: -71.97,
    ambience: 'mountain',
    blurb: 'A 7,000 km spine of stone, the longest continental mountain range on Earth.',
    description: [
      'The Andes run the full length of a continent, from Caribbean mangroves to subpolar fjords. Their high plateaus hold a quarter of the planet’s tropical glaciers.',
      'Altitude here is a kind of time travel: each thousand metres climbed is a shift in climate, from cloud forest to puna grassland to permanent ice.',
    ],
    stats: [
      { label: 'Length', value: '7,000 km' },
      { label: 'Highest peak', value: '6,961 m' },
      { label: 'Tropical glaciers', value: '99% here' },
      { label: 'Uplift began', value: '25M years ago' },
    ],
  },
  {
    id: 'galapagos',
    name: 'Galápagos Islands',
    lat: -0.75,
    lon: -90.32,
    ambience: 'ocean',
    blurb: 'A volcanic archipelago where evolution keeps its most famous laboratory.',
    description: [
      'Straddling the equator, the Galápagos are born from a hotspot beneath the moving crust — islands drift southeast and die as new ones surface.',
      'Isolation did the rest: marine iguanas that swim, penguins at the equator, and finches whose beaks redraw the tree of life with every drought.',
    ],
    stats: [
      { label: 'Islands & islets', value: '127' },
      { label: 'Endemic species', value: '2,900+' },
      { label: 'Distance to mainland', value: '900 km' },
      { label: 'Oldest island', value: '4M years' },
    ],
  },
  {
    id: 'amazon-delta',
    name: 'Amazon River Delta',
    lat: -0.64,
    lon: -51.19,
    ambience: 'ocean',
    blurb: 'Where a fifth of all river water on Earth empties into the Atlantic.',
    description: [
      'The Amazon’s mouth is so wide that its freshwater current can be sailed 160 km offshore, staining the ocean brown from orbit.',
      'Twice a day a tidal bore up to four metres high runs hundreds of kilometres upriver, and the forest floods — a drowned world fish navigate by scent.',
    ],
    stats: [
      { label: 'Discharge', value: '209,000 m³/s' },
      { label: 'Mouth width', value: '330 km' },
      { label: 'River length', value: '6,400 km' },
      { label: 'Annual flood rise', value: '12 m' },
    ],
  },
  {
    id: 'sahara',
    name: 'Sahara Desert',
    lat: 23.42,
    lon: 12.53,
    ambience: 'desert',
    blurb: 'An ocean of sand and stone almost the size of the United States.',
    description: [
      'The Sahara was green within human memory — rock art shows lakes, hippos, and fishermen from only 6,000 years ago.',
      'Its dust fertilises the Amazon: every year, winds carry 27 million tonnes of Saharan phosphorus across the Atlantic to feed the rainforest.',
    ],
    stats: [
      { label: 'Area', value: '9.2M km²' },
      { label: 'Daytime peak', value: '50°C' },
      { label: 'Dust to Amazon', value: '27M t/yr' },
      { label: 'Green collapse', value: '6,000 yrs ago' },
    ],
  },
  {
    id: 'himalayas',
    name: 'The Himalayas',
    lat: 27.99,
    lon: 86.93,
    ambience: 'mountain',
    blurb: 'The roof of the world, still growing as India drives into Asia.',
    description: [
      'The collision that raised the Himalayas is not finished — the range gains roughly five millimetres of height every year.',
      'Its glaciers feed ten of the planet’s largest rivers, and two billion people drink from their meltwater every morning.',
    ],
    stats: [
      { label: 'Highest point', value: '8,849 m' },
      { label: 'Rivers fed', value: '10 major' },
      { label: 'People downstream', value: '2 billion' },
      { label: 'Growth per year', value: '~5 mm' },
    ],
  },
  {
    id: 'great-barrier-reef',
    name: 'Great Barrier Reef',
    lat: -18.29,
    lon: 147.7,
    ambience: 'ocean',
    blurb: 'The largest living structure on Earth, visible from space.',
    description: [
      'Built by animals the size of a fingernail, the reef runs 2,300 km along Queensland — longer than the Great Wall of China.',
      'It is a nursery for a quarter of all marine species, and at full moon in summer the entire reef releases eggs and sperm in one synchronized night.',
    ],
    stats: [
      { label: 'Length', value: '2,300 km' },
      { label: 'Individual reefs', value: '2,900' },
      { label: 'Marine species', value: '9,000+' },
      { label: 'Age of structure', value: '~600k yrs' },
    ],
  },
  {
    id: 'iceland',
    name: 'Iceland Highlands',
    lat: 64.9,
    lon: -18.6,
    ambience: 'ice',
    blurb: 'A young island split by the seam between two tectonic plates.',
    description: [
      'Iceland is being pulled apart at two centimetres a year along the Mid-Atlantic Ridge — you can walk between the North American and Eurasian plates.',
      'Volcanic black deserts, moss-covered lava fields, and glacier-fed rivers braided across the interior make it the closest thing to another planet within Earth’s atmosphere.',
    ],
    stats: [
      { label: 'Plates diverge', value: '2 cm/yr' },
      { label: 'Active volcanoes', value: '32' },
      { label: 'Glacier cover', value: '11% of island' },
      { label: 'Island age', value: '20M yrs' },
    ],
  },
  {
    id: 'patagonia',
    name: 'Patagonian Ice Fields',
    lat: -49.3,
    lon: -73.2,
    ambience: 'ice',
    blurb: 'The third-largest reserve of freshwater on the planet, locked in ice.',
    description: [
      'The Southern Patagonian Ice Field stretches 350 km along the Andes — a white plateau the size of Rwanda sitting on black rock.',
      'Its glaciers calve into milky lakes in violent spectacle; Perito Moreno’s wall of ice is as tall as a twenty-storey building above the waterline.',
    ],
    stats: [
      { label: 'Ice field area', value: '16,800 km²' },
      { label: 'Freshwater rank', value: '3rd largest' },
      { label: 'Longest glacier', value: 'Pío XI, 64 km' },
      { label: 'Ice thickness', value: 'up to 1,400 m' },
    ],
  },
]

export type Collection = {
  id: string
  title: string
  blurb: string
  placeIds: string[]
}

export const collections: Collection[] = [
  {
    id: 'shaped-by-water',
    title: 'Shaped by water',
    blurb:
      'Rivers that stain the ocean, reefs built by animals, and ice holding a third of the planet’s fresh water.',
    placeIds: ['amazon-delta', 'galapagos', 'great-barrier-reef', 'patagonia'],
  },
  {
    id: 'fire-and-ice',
    title: 'Fire and ice',
    blurb:
      'Where the planet builds and breaks itself: mid-ocean ridges, young volcanoes, and ranges still rising.',
    placeIds: ['iceland', 'himalayas', 'patagonia', 'andes'],
  },
  {
    id: 'the-green-lung',
    title: 'The green lung',
    blurb:
      'The living machinery that keeps the atmosphere breathable — canopy, current, and coral.',
    placeIds: ['amazon-rainforest', 'amazon-delta', 'great-barrier-reef', 'galapagos'],
  },
  {
    id: 'earth-extremes',
    title: 'Earth, at its extremes',
    blurb:
      'The highest, driest, coldest, most alive corners of the map — the edges of what Earth can be.',
    placeIds: ['sahara', 'himalayas', 'iceland', 'patagonia'],
  },
]

export const featuredPlace = places[0]

export function getPlace(id: string | undefined): Place | undefined {
  return places.find((p) => p.id === id)
}

export function getCollection(id: string | undefined): Collection | undefined {
  return collections.find((c) => c.id === id)
}
