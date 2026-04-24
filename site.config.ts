/**
 * ⭐ SITE CONFIGURATION — prix-allee-jardin.fr
 * Allée de jardin — Guide, Prix & Devis Locaux 2026
 */
export const siteConfig = {
  // === IDENTITÉ ===
  domain: "prix-allee-jardin.fr",
  name: "Prix Allée Jardin",
  tagline: "Comparez les prix pour créer votre allée de jardin près de chez vous",
  description: "Obtenez jusqu'à 3 devis gratuits pour votre allée de jardin. Comparez les prix d'artisans paysagistes qualifiés : graviers, pavés, béton, dalles. Service gratuit 2026.",

  // === NICHE ===
  niche: {
    slug: "allee-de-jardin",
    name: "Allée de Jardin",
    nameShort: "Allée de Jardin",
    emoji: "🌳",
    icon: "tree",
    seoTitleTemplate: "Allée de Jardin à {city} ({zip}) — Prix & Devis Gratuit 2026",
    metaDescTemplate: "Comparez les prix d'allée de jardin à {city} ({zip}). Jusqu'à 3 devis gratuits d'artisans paysagistes. Graviers, pavés, béton, dalles. Réponse sous 48h.",
    heroTitle: "Allée de Jardin : Prix, Matériaux & Devis Gratuit 2026",
    heroSubtitle: "Comparez jusqu'à 3 devis de paysagistes qualifiés près de chez vous. Service 100% gratuit et sans engagement.",
  },

  // === PRIX ===
  pricing: [
    { service: "Allée en gravier stabilisé", price: "30 – 60€/m²", details: "Gravier concassé, géotextile, bordures incluses" },
    { service: "Allée en pavés autobloquants", price: "50 – 90€/m²", details: "Pose sur lit de sable, joints sable polymère" },
    { service: "Allée en béton désactivé", price: "60 – 100€/m²", details: "Coloris au choix, finition antidérapante" },
    { service: "Allée en dalles naturelles", price: "80 – 150€/m²", details: "Pierre naturelle (granit, ardoise, grès), pose sur chape" },
    { service: "Allée en béton imprimé", price: "70 – 120€/m²", details: "Motifs bois, pierre ou pavé, coloris personnalisé" },
    { service: "Allée en résine drainante", price: "50 – 90€/m²", details: "Granulats de marbre liés, perméable, esthétique" },
  ],
  pricingNote: "Prix TTC moyens constatés en 2026, pose et terrassement compris. Les tarifs varient selon la surface, le matériau, l'accessibilité et votre localisation.",

  // === AIDES ===
  aids: [
    { name: "TVA réduite 10%", amount: "~100 – 500€ d'économie", condition: "Logement > 2 ans, travaux par un professionnel" },
    { name: "Aides locales", amount: "Variable", condition: "Certaines communes subventionnent la perméabilité des sols" },
    { name: "Crédit d'impôt", amount: "Variable", condition: "Si aménagement lié à l'accessibilité PMR" },
    { name: "Éco-chèque régional", amount: "Jusqu'à 1 000€", condition: "Selon la région, pour désimperméabilisation des sols" },
  ],

  // === MONÉTISATION ===
  viteundevis: {
    partnerId: '2353',
    boxId: '2b19bb9920', // ViteUnDevis Box ID
    categoryId: '138', // Category ID for allée de jardin
  },

  // === COULEURS ===
  colors: {
    primary: "65A30D",    // lime-600
    primaryDark: "4D7C0F", // lime-700
    accent: "EA580C",     // orange-600
    dark: "365314",       // green-900
  },

  // === PROCESSUS ===
  process: [
    { title: "Décrivez votre projet", desc: "Type d'allée, surface, matériau souhaité, accès véhicule ou piéton.", icon: "📋", duration: "2 min" },
    { title: "Recevez 3 devis", desc: "Des paysagistes qualifiés de votre département vous contactent sous 48h.", icon: "📨", duration: "24-48h" },
    { title: "Comparez & choisissez", desc: "Comparez prix, matériaux, garanties et réalisations des artisans.", icon: "⚖️" },
    { title: "Lancez les travaux", desc: "Votre paysagiste réalise votre allée avec garantie décennale.", icon: "🏗️", duration: "2-5 jours" },
  ],

  // === FAQ ===
  faq: [
    {
      q: "Quel est le prix moyen d'une allée de jardin en 2026 ?",
      a: "Le prix d'une allée de jardin varie entre 30€/m² et 150€/m² TTC pose comprise en 2026, selon le matériau choisi. Le gravier stabilisé est le plus économique (30-60€/m²), tandis que la pierre naturelle est la plus haut de gamme (80-150€/m²). Pour une allée standard de 20 m², comptez entre 600€ et 3 000€."
    },
    {
      q: "Quel matériau choisir pour une allée de jardin ?",
      a: "Le choix dépend de l'usage : le gravier convient aux allées piétonnes et aux budgets serrés. Les pavés autobloquants offrent un excellent rapport durabilité/prix. Le béton désactivé est idéal pour les accès voiture. La pierre naturelle apporte une touche haut de gamme. La résine drainante est parfaite pour les terrains en pente ou les obligations de perméabilité."
    },
    {
      q: "Faut-il un permis pour créer une allée de jardin ?",
      a: "En général, aucune autorisation n'est nécessaire pour une allée dans votre jardin. Toutefois, si les travaux modifient l'aspect extérieur visible depuis la voie publique, ou si vous êtes en zone protégée (ABF), une déclaration préalable peut être requise. Consultez le PLU de votre commune avant de commencer."
    },
    {
      q: "Combien de temps durent les travaux d'une allée de jardin ?",
      a: "Pour une allée standard de 15-30 m², comptez 2 à 5 jours de travaux selon le matériau. Le gravier est le plus rapide (1-2 jours). Les pavés et le béton nécessitent 3-5 jours (terrassement, fondation, pose, joints). Un temps de séchage supplémentaire de 48h est requis pour le béton."
    },
    {
      q: "Comment entretenir une allée de jardin ?",
      a: "L'entretien varie selon le matériau : le gravier nécessite un ratissage régulier et un réapprovisionnement annuel. Les pavés et dalles se nettoient au nettoyeur haute pression 1-2 fois par an. Le béton peut être traité avec un hydrofuge tous les 3-5 ans. La résine drainante nécessite un simple balayage régulier."
    },
    {
      q: "Quelle épaisseur de fondation pour une allée carrossable ?",
      a: "Pour une allée carrossable (voiture), prévoyez 20 à 30 cm de fondation (grave 0/31,5 compactée) + 5 cm de lit de pose. Pour une allée piétonne, 15 cm de fondation suffisent. Un géotextile est indispensable sous la fondation pour éviter la remontée de terre et les mauvaises herbes."
    },
  ],

  // === TRUST ===
  trustBadges: ["Artisans Locaux", "Devis 100% gratuit", "Sans engagement", "Garantie décennale"],

  // === CONTENT BLOCKS ===
  introText: `L'allée de jardin est un élément essentiel de votre aménagement extérieur : elle structure votre espace, facilite la circulation et valorise votre propriété. Qu'il s'agisse d'un chemin piéton vers votre terrasse, d'une entrée carrossable ou d'un sentier décoratif, le choix du matériau et de la pose conditionne la durabilité et l'esthétique de votre allée.

Les prix varient de 30€/m² pour un simple gravier stabilisé à plus de 150€/m² pour de la pierre naturelle posée sur chape. La clé d'un projet réussi ? Comparer au moins 3 devis d'artisans paysagistes locaux et vérifier que le professionnel maîtrise les contraintes de drainage, le PLU de votre commune et les techniques de fondation adaptées à votre sol.`,

  whyChooseUs: [
    "Jusqu'à 3 devis de paysagistes qualifiés de votre département",
    "Service 100% gratuit et sans aucun engagement",
    "Artisans vérifiés avec assurance décennale à jour",
    "Réponse sous 24h à 48h maximum",
    "Conseil sur le choix des matériaux et le drainage",
  ],
} as const;

export type SiteConfig = typeof siteConfig;
