/** Broad muscle families from source prose link to their training-group page. */
export const muscleCategories: Record<string, { name: string; group: string; members: string[] }> =
  {
    pectorals: {
      name: 'Pectorals',
      group: 'chest',
      members: ['chest-clavicular-head', 'chest-sternocostal-head'],
    },
    deltoids: {
      name: 'Deltoids',
      group: 'shoulders',
      members: [
        'shoulders-anterior-deltoid',
        'shoulders-middle-deltoid',
        'shoulders-posterior-deltoid',
      ],
    },
    triceps: {
      name: 'Triceps',
      group: 'arms',
      members: ['triceps-long-head', 'triceps-lateral-head', 'triceps-medial-head'],
    },
    biceps: { name: 'Biceps', group: 'arms', members: ['biceps-long-head', 'biceps-short-head'] },
    trapezius: {
      name: 'Trapezius',
      group: 'back',
      members: ['traps-upper-trapezius', 'traps-middle-trapezius', 'traps-lower-trapezius'],
    },
    glutes: {
      name: 'Glutes',
      group: 'legs',
      members: ['glutes-gluteus-maximus', 'glutes-gluteus-medius', 'glutes-gluteus-minimus'],
    },
    hamstrings: {
      name: 'Hamstrings',
      group: 'legs',
      members: [
        'hamstrings-biceps-femoris',
        'hamstrings-semitendinosus',
        'hamstrings-semimembranosus',
      ],
    },
    quadriceps: {
      name: 'Quadriceps',
      group: 'legs',
      members: [
        'quads-rectus-femoris',
        'quads-vastus-lateralis',
        'quads-vastus-medialis',
        'quads-vastus-intermedius',
      ],
    },
    adductors: {
      name: 'Adductors',
      group: 'legs',
      members: [
        'adductors-adductor-longus',
        'adductors-adductor-brevis',
        'adductors-adductor-magnus',
        'adductors-gracilis',
        'adductors-pectineus',
      ],
    },
    'hip-flexors': {
      name: 'Hip flexors',
      group: 'legs',
      members: [
        'hipflexors-psoas-major',
        'hipflexors-iliacus',
        'hipflexors-tensor-fasciae-latae',
        'hipflexors-sartorius',
      ],
    },
    'hip-rotators': {
      name: 'Hip rotators',
      group: 'legs',
      members: [
        'hiprotators-piriformis',
        'hiprotators-obturator-internus',
        'hiprotators-obturator-externus',
        'hiprotators-superior-gemellus',
        'hiprotators-inferior-gemellus',
        'hiprotators-quadratus-femoris',
      ],
    },
    'rotator-cuff': {
      name: 'Rotator cuff',
      group: 'shoulders',
      members: [
        'cuff-supraspinatus',
        'cuff-infraspinatus',
        'cuff-teres-minor',
        'cuff-subscapularis',
      ],
    },
    neck: {
      name: 'Neck muscles',
      group: 'shoulders',
      members: [
        'neck-sternocleidomastoid',
        'neck-longus-colli-longus-capitis',
        'neck-scalenes',
        'neck-splenius-capitis-cervicis',
        'neck-levator-scapulae',
        'neck-suboccipital-muscles',
      ],
    },
    forearms: { name: 'Forearms', group: 'arms', members: [] },
    'forearm-flexors': { name: 'Forearm flexors', group: 'arms', members: [] },
    'wrist-flexors': {
      name: 'Wrist flexors',
      group: 'arms',
      members: ['forearms-flexor-carpi-radialis', 'forearms-flexor-carpi-ulnaris'],
    },
    'wrist-extensors': {
      name: 'Wrist extensors',
      group: 'arms',
      members: [
        'forearms-extensor-carpi-radialis-longus-brevis',
        'forearms-extensor-carpi-ulnaris',
      ],
    },
    'thumb-flexors': {
      name: 'Thumb flexors',
      group: 'arms',
      members: ['forearms-flexor-pollicis-longus', 'hands-flexor-pollicis-brevis'],
    },
    'finger-flexors': {
      name: 'Finger flexors',
      group: 'arms',
      members: ['forearms-flexor-digitorum-superficialis', 'forearms-flexor-digitorum-profundus'],
    },
    'hand-intrinsics': { name: 'Intrinsic hand muscles', group: 'arms', members: [] },
    abdominals: {
      name: 'Abdominal muscles',
      group: 'core',
      members: [
        'core-rectus-abdominis',
        'core-internal-external-obliques',
        'core-transversus-abdominis',
      ],
    },
    'toe-extensors': {
      name: 'Toe extensors',
      group: 'legs',
      members: [
        'lowerleg-extensor-digitorum-longus',
        'lowerleg-extensor-hallucis-longus',
        'feet-extensor-digitorum-hallucis-brevis',
      ],
    },
    'toe-flexors': {
      name: 'Toe flexors',
      group: 'legs',
      members: [
        'lowerleg-flexor-digitorum-longus',
        'lowerleg-flexor-hallucis-longus',
        'feet-flexor-digitorum-brevis',
        'feet-flexor-hallucis-brevis',
      ],
    },
    'foot-intrinsics': { name: 'Intrinsic foot muscles', group: 'legs', members: [] },
  };

/** These named muscles currently have no individual atlas guide. */
export const extraMuscles: Record<string, { name: string; group: string }> = {
  'teres-major': { name: 'Teres major', group: 'back' },
  semispinalis: { name: 'Semispinalis', group: 'shoulders' },
  intercostals: { name: 'Intercostals', group: 'core' },
  'fibularis-tertius': { name: 'Fibularis tertius', group: 'legs' },
};
