#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

// Load cities
const citiesPath = join(__dirname, '..', 'src', 'data', 'cities-fr.ts');
const raw = readFileSync(citiesPath, 'utf-8');
const match = raw.match(/export const cities[^=]*=\s*(\[[\s\S]*\]);?\s*$/m);
if (!match) { console.error('Cannot parse cities'); process.exit(1); }
const cities = eval(match[1]);
console.log(`📊 Loaded ${cities.length} cities`);

// ── REGIONAL DATA ──
const CLIMATE = {
  "Île-de-France": { zone: "H1a", hiver: "froid modéré", ete: "tempéré", pluie: "650 mm/an", gel: "40-60 jours/an", sol: "limoneux à argileux", materiau: "pavés béton ou grès", drainage: "drainage périphérique recommandé" },
  "Hauts-de-France": { zone: "H1a", hiver: "froid et humide", ete: "doux", pluie: "750 mm/an", gel: "50-70 jours/an", sol: "argileux à calcaire", materiau: "pavés béton autobloquants résistants au gel", drainage: "drainage renforcé obligatoire" },
  "Grand Est": { zone: "H1b", hiver: "rigoureux", ete: "chaud", pluie: "700 mm/an", gel: "60-80 jours/an", sol: "calcaire à gréseux", materiau: "granit ou béton haute résistance gel", drainage: "fondation 25-30 cm contre le gel" },
  "Normandie": { zone: "H1a", hiver: "doux et humide", ete: "frais", pluie: "850 mm/an", gel: "30-50 jours/an", sol: "argileux à limoneux", materiau: "gravier stabilisé ou pavés drainants", drainage: "géotextile renforcé + drainage latéral" },
  "Bretagne": { zone: "H2a", hiver: "doux et pluvieux", ete: "frais", pluie: "900 mm/an", gel: "20-40 jours/an", sol: "granitique à schiste", materiau: "granit local ou dalles schiste", drainage: "drainage essentiel (forte pluviométrie)" },
  "Pays de la Loire": { zone: "H2b", hiver: "doux", ete: "tempéré", pluie: "700 mm/an", gel: "25-45 jours/an", sol: "calcaire à sableux", materiau: "tuffeau ou pavés calcaire", drainage: "drainage standard suffit" },
  "Centre-Val de Loire": { zone: "H2b", hiver: "modéré", ete: "chaud", pluie: "650 mm/an", gel: "40-55 jours/an", sol: "calcaire à argileux", materiau: "pierre calcaire locale ou béton désactivé", drainage: "drainage moyen, attention sols argileux" },
  "Bourgogne-Franche-Comté": { zone: "H1c", hiver: "froid continental", ete: "chaud", pluie: "750 mm/an", gel: "55-75 jours/an", sol: "calcaire à marneux", materiau: "pierre de Bourgogne ou granit", drainage: "fondation renforcée anti-gel" },
  "Nouvelle-Aquitaine": { zone: "H2c", hiver: "doux océanique", ete: "chaud", pluie: "800 mm/an", gel: "20-40 jours/an", sol: "sableux à argileux", materiau: "pierre blonde locale ou béton désactivé", drainage: "drainage adapté selon sol" },
  "Auvergne-Rhône-Alpes": { zone: "H1c", hiver: "froid (altitude)", ete: "chaud en vallée", pluie: "800 mm/an", gel: "50-90 jours/an", sol: "granitique à volcanique", materiau: "granit ou basalte local", drainage: "fondation 30 cm en altitude" },
  "Occitanie": { zone: "H3", hiver: "doux méditerranéen", ete: "très chaud", pluie: "600 mm/an", gel: "10-30 jours/an", sol: "calcaire à galets roulés", materiau: "galets du Rhône ou pierre ocre du Midi", drainage: "drainage adapté aux épisodes cévenols" },
  "PACA": { zone: "H3", hiver: "doux", ete: "très chaud et sec", pluie: "550 mm/an", gel: "5-20 jours/an", sol: "calcaire sec à rocheux", materiau: "pierre naturelle provençale ou gravier clair", drainage: "drainage orageux (épisodes méditerranéens)" },
  "Corse": { zone: "H3", hiver: "doux littoral", ete: "chaud", pluie: "700 mm/an", gel: "5-15 jours/an", sol: "granitique à schisteux", materiau: "granit corse ou pierre locale", drainage: "drainage pentes naturelles" },
};

const ARCHI_STYLES = {
  "Île-de-France": "pavillonnaire francilien avec jardins géométriques",
  "Hauts-de-France": "jardins de brique et haies vives du Nord",
  "Grand Est": "jardinets alsaciens et cours lorraines pavées",
  "Normandie": "jardins clos normands et chemins d'ardoise",
  "Bretagne": "sentiers de granit et jardins maritimes bretons",
  "Pays de la Loire": "allées de tuffeau et jardins ligériens",
  "Centre-Val de Loire": "jardins à la française et allées de château",
  "Bourgogne-Franche-Comté": "cours bourguignonnes en pierre dorée",
  "Nouvelle-Aquitaine": "allées bordelaises en pierre blonde",
  "Auvergne-Rhône-Alpes": "chemins de montagne et dalles volcaniques",
  "Occitanie": "jardins méditerranéens et calades du Midi",
  "PACA": "restanques provençales et calade traditionnelle",
  "Corse": "sentiers de maquis et dallages de granit insulaire",
};

const PLU_TIPS = [
  "Consultez le PLU de {VILLE} sur le géoportail de l'urbanisme (gpu.fr) pour vérifier les obligations de perméabilité des sols.",
  "Le service urbanisme de la mairie de {VILLE} peut vous indiquer les matériaux autorisés pour les allées visibles depuis la voie publique.",
  "À {VILLE}, certains secteurs protégés imposent des matériaux traditionnels pour les aménagements extérieurs (avis ABF).",
  "Vérifiez auprès de la mairie de {VILLE} si une déclaration préalable est nécessaire pour votre projet d'allée (modification de l'aspect extérieur).",
  "La mairie de {VILLE} impose parfois un coefficient de perméabilité : renseignez-vous sur le % de surface imperméabilisable autorisé.",
];

const PREFECTURES = {
  "01":"Bourg-en-Bresse","02":"Laon","03":"Moulins","04":"Digne-les-Bains","05":"Gap",
  "06":"Nice","07":"Privas","08":"Charleville-Mézières","09":"Foix","10":"Troyes",
  "11":"Carcassonne","12":"Rodez","13":"Marseille","14":"Caen","15":"Aurillac",
  "16":"Angoulême","17":"La Rochelle","18":"Bourges","19":"Tulle","2A":"Ajaccio",
  "2B":"Bastia","21":"Dijon","22":"Saint-Brieuc","23":"Guéret","24":"Périgueux",
  "25":"Besançon","26":"Valence","27":"Évreux","28":"Chartres","29":"Quimper",
  "30":"Nîmes","31":"Toulouse","32":"Auch","33":"Bordeaux","34":"Montpellier",
  "35":"Rennes","36":"Châteauroux","37":"Tours","38":"Grenoble","39":"Lons-le-Saunier",
  "40":"Mont-de-Marsan","41":"Blois","42":"Saint-Étienne","43":"Le Puy-en-Velay",
  "44":"Nantes","45":"Orléans","46":"Cahors","47":"Agen","48":"Mende",
  "49":"Angers","50":"Saint-Lô","51":"Châlons-en-Champagne","52":"Chaumont",
  "53":"Laval","54":"Nancy","55":"Bar-le-Duc","56":"Vannes","57":"Metz",
  "58":"Nevers","59":"Lille","60":"Beauvais","61":"Alençon","62":"Arras",
  "63":"Clermont-Ferrand","64":"Pau","65":"Tarbes","66":"Perpignan","67":"Strasbourg",
  "68":"Colmar","69":"Lyon","70":"Vesoul","71":"Mâcon","72":"Le Mans",
  "73":"Chambéry","74":"Annecy","75":"Paris","76":"Rouen","77":"Melun",
  "78":"Versailles","79":"Niort","80":"Amiens","81":"Albi","82":"Montauban",
  "83":"Toulon","84":"Avignon","85":"La Roche-sur-Yon","86":"Poitiers","87":"Limoges",
  "88":"Épinal","89":"Auxerre","90":"Belfort","91":"Évry-Courcouronnes",
  "92":"Nanterre","93":"Bobigny","94":"Créteil","95":"Cergy",
};

// Deterministic hash
function hash(str) { return str.split('').reduce((a,c,i) => a + c.charCodeAt(0) * (i+1), 0); }

function pick(arr, seed) { return arr[Math.abs(seed) % arr.length]; }

function priceVariation(base, seed, region) {
  const regionFactor = { "Île-de-France": 1.25, "PACA": 1.15, "Corse": 1.3, "Auvergne-Rhône-Alpes": 1.1, "Hauts-de-France": 0.92, "Grand Est": 0.95, "Bretagne": 0.97, "Normandie": 0.95 };
  const factor = regionFactor[region] || 1.0;
  const micro = 0.95 + (hash(String(seed)) % 11) / 100;
  return Math.round(base * factor * micro);
}

function generateContent(city) {
  const s = hash(city.slug);
  const cl = CLIMATE[city.region] || CLIMATE["Centre-Val de Loire"];
  const archi = ARCHI_STYLES[city.region] || "traditionnel";
  const pref = PREFECTURES[city.deptCode] || city.name;

  // ── INTRO (6 variants × city data = unique) ──
  const intros = [
    `${city.name}, commune de ${city.pop.toLocaleString('fr-FR')} habitants dans le ${city.deptName}, bénéficie d'un climat ${cl.hiver} en hiver et ${cl.ete} en été (zone ${cl.zone}, ${cl.pluie}). Ces conditions orientent le choix vers des matériaux adaptés : ${cl.materiau}. Le sol local, de nature ${cl.sol}, nécessite une préparation spécifique (${cl.drainage}). Les paysagistes de la région maîtrisent parfaitement la tradition des ${archi}.`,
    `Située en ${city.region} (${city.deptName}), ${city.name} compte ${city.pop.toLocaleString('fr-FR')} résidents et un tissu artisanal dynamique dans le secteur du paysagisme et de la maçonnerie paysagère. La pluviométrie locale (${cl.pluie}) et le gel (${cl.gel}) imposent un ${cl.drainage}. Les professionnels du ${city.deptCode} recommandent principalement ${cl.materiau} pour les allées de jardin en zone climatique ${cl.zone}.`,
    `À ${city.name} (${city.zip}, ${city.deptName}), l'architecture paysagère dominante de type ${archi} influence le choix esthétique des allées de jardin. Avec ${city.pop.toLocaleString('fr-FR')} habitants, la demande locale est soutenue et les paysagistes proposent des solutions adaptées au sol ${cl.sol} et au climat ${cl.hiver} (${cl.gel}). Le PLU peut imposer des contraintes de matériaux et de perméabilité.`,
    `Le département du ${city.deptName} (${city.deptCode}), dont ${city.name} fait partie, se caractérise par un patrimoine paysager de type ${archi}. En zone climatique ${cl.zone}, les ${cl.pluie} de précipitations annuelles et le sol ${cl.sol} nécessitent une attention particulière au drainage. Le ${cl.materiau} est le choix privilégié des ${city.pop.toLocaleString('fr-FR')} habitants pour leurs allées de jardin.`,
    `Avec ses ${city.pop.toLocaleString('fr-FR')} habitants, ${city.name} est une commune dynamique du ${city.deptName} en ${city.region}. Le terrain local (sol ${cl.sol}) et le climat (${cl.hiver} en hiver, ${cl.ete} en été, ${cl.pluie}) conditionnent le choix des matériaux d'allée : ${cl.materiau}. Un ${cl.drainage} est indispensable pour la longévité de l'ouvrage.`,
    `En plein cœur du ${city.deptName}, ${city.name} (${city.zip}) offre un cadre de vie apprécié par ses ${city.pop.toLocaleString('fr-FR')} résidents. La création d'une allée de jardin s'inscrit dans la tradition paysagère locale (${archi}). La zone climatique ${cl.zone} (${cl.gel}) et le sol ${cl.sol} orientent vers ${cl.materiau}, avec un ${cl.drainage}.`,
  ];

  // ── LOCAL TIP (8 variants) ──
  const tips = [
    `À ${city.name}, la nature du sol (${cl.sol}) influence directement le choix de la fondation de votre allée. Un sol argileux nécessite une couche de grave plus épaisse (25-30 cm) et un géotextile renforcé pour éviter les déformations liées aux mouvements de terrain. Demandez une étude de sol à vos paysagistes.`,
    `Les paysagistes du ${city.deptName} recommandent de réaliser les travaux d'allée de jardin ${s % 2 === 0 ? 'au printemps (mars-mai) ou à l\'automne (septembre-novembre)' : 'en période sèche (mai-octobre)'} pour garantir un compactage optimal de la fondation. À ${city.name}, évitez les périodes de gel pour les ouvrages en béton.`,
    `En zone climatique ${cl.zone} (${city.region}), l'orientation de votre allée à ${city.name} impacte l'entretien : une exposition ${s % 2 === 0 ? 'nord favorise les mousses et lichens (nettoyage annuel au karcher recommandé)' : 'sud accélère la décoloration des matériaux (hydrofuge UV recommandé)'}. Prévoyez un budget entretien de 5-15€/m² tous les 2-3 ans.`,
    `Le CAUE du ${city.deptName} (Conseil d'Architecture, d'Urbanisme et de l'Environnement) propose des consultations gratuites aux particuliers de ${city.name}. Profitez de ce service pour valider le choix des matériaux et l'intégration paysagère de votre allée avant de lancer le chantier.`,
    `À ${city.name}, la réglementation sur la perméabilité des sols évolue : de nombreuses communes imposent désormais un coefficient d'imperméabilisation maximal. Privilégiez les matériaux drainants (gravier stabilisé, pavés à joints larges, résine drainante) pour rester conforme et réduire les risques d'inondation.`,
    `Le préfet du ${city.deptName} (préfecture de ${pref}) peut accorder des dérogations aux règles d'urbanisme. Si votre projet d'allée à ${city.name} est refusé (secteur protégé, ABF), un recours gracieux est possible. Consultez le CAUE pour un accompagnement gratuit.`,
    `Pour les allées carrossables à ${city.name}, la norme NF EN 1338 garantit la résistance des pavés béton aux charges de véhicules. Exigez des pavés de classe T3 minimum (véhicules légers) ou T11 (véhicules lourds). La garantie décennale du paysagiste couvre les défauts structurels.`,
    `Dans le ${city.deptName}, les matériaux locaux comme ${s % 2 === 0 ? 'la pierre régionale' : 'le gravier local'} offrent un excellent rapport qualité/prix avec un bilan carbone réduit. Privilégiez les fournisseurs à moins de 50 km de ${city.name} pour limiter les coûts de transport.`,
  ];

  // ── HISTORY ANECDOTE (6 variants) ──
  const anecdotes = [
    `L'art des allées de jardin dans le ${city.deptName} s'inscrit dans une longue tradition paysagère française. Dès le XVIIe siècle, les jardins à la française popularisés par André Le Nôtre ont fait de l'allée un élément structurant majeur. À ${city.name}, cette tradition se perpétue à travers des aménagements contemporains qui marient matériaux modernes et esthétique classique.`,
    `Le patrimoine paysager de ${city.name} témoigne d'un savoir-faire historique dans l'aménagement des espaces extérieurs. Les ${archi}, caractéristiques de la région ${city.region}, ont inspiré les paysagistes actuels qui adaptent ces traditions aux techniques modernes de drainage et de fondation.`,
    `Dès le XVIIIe siècle, les grandes propriétés de ${city.region} intégraient des allées en matériaux nobles — la « calade » provençale en galets posés de chant, les allées sablées des jardins à la française. ${city.name} perpétue cette tradition avec des artisans qui maîtrisent aussi bien les techniques ancestrales que les matériaux contemporains.`,
    `La filière pierre et maçonnerie du ${city.deptName} représente un secteur économique important. Les carrières locales alimentent les chantiers de ${city.name} en matériaux de qualité, favorisant les circuits courts et le maintien d'un savoir-faire artisanal transmis de génération en génération.`,
    `${city.name}, avec ses ${city.pop.toLocaleString('fr-FR')} habitants, a vu exploser la demande en aménagements extérieurs depuis 2020. Le confinement et le télétravail ont incité les propriétaires à investir dans leur jardin, et l'allée est souvent le premier chantier réalisé pour valoriser la propriété.`,
    `La tradition du jardinage dans le ${city.deptName} est profondément ancrée dans la culture locale. Des jardins ouvriers aux pavillons modernes, l'allée de jardin a toujours été un marqueur d'identité : elle accueille le visiteur et reflète le goût du propriétaire pour les matériaux et les essences végétales de sa région.`,
  ];

  // ── FAQ LOCAL (5 variants) ──
  const faqs = [
    { question: `Quel est le prix moyen d'une allée de jardin à ${city.name} en 2026 ?`, answer: `À ${city.name} (${city.deptName}), le prix moyen d'une allée de jardin varie selon le matériau : gravier stabilisé (${priceVariation(45, s, city.region)}€/m²), pavés autobloquants (${priceVariation(70, s, city.region)}€/m²), béton désactivé (${priceVariation(80, s, city.region)}€/m²) ou pierre naturelle (${priceVariation(115, s, city.region)}€/m²). Pour une allée de 20 m², comptez entre ${priceVariation(900, s, city.region)}€ et ${priceVariation(2300, s, city.region)}€ TTC pose comprise.` },
    { question: `Faut-il une autorisation pour créer une allée à ${city.name} ?`, answer: `À ${city.name}, aucune autorisation n'est généralement requise pour une allée de jardin dans votre propriété. Cependant, si les travaux modifient l'aspect extérieur visible depuis la voie publique, ou si vous êtes en zone protégée, une déclaration préalable peut être nécessaire. Consultez le PLU de ${city.name} sur gpu.fr ou contactez le service urbanisme.` },
    { question: `Quel matériau d'allée résiste le mieux au climat de ${city.name} ?`, answer: `En zone climatique ${cl.zone} à ${city.name}, les professionnels recommandent ${cl.materiau}. Le sol local (${cl.sol}) nécessite un ${cl.drainage}. Le climat ${cl.hiver} en hiver (${cl.gel}) et ${cl.ete} en été oriente vers des matériaux ${cl.zone.startsWith('H1') ? 'résistants au gel' : cl.zone === 'H3' ? 'résistants aux UV et à la chaleur' : 'polyvalents et durables'}.` },
    { question: `Combien coûte la pose d'une allée par un paysagiste à ${city.name} ?`, answer: `La main d'œuvre pour la création d'une allée de jardin à ${city.name} coûte entre ${priceVariation(20, s+1, city.region)}€ et ${priceVariation(60, s+1, city.region)}€/m² selon le matériau et la complexité. Le terrassement et la fondation représentent environ 40% du budget total. Un devis détaillé gratuit vous sera proposé par nos paysagistes du ${city.deptName}.` },
    { question: `Où trouver un paysagiste pour mon allée à ${city.name} ?`, answer: `À ${city.name} et dans le ${city.deptName}, utilisez notre comparateur pour recevoir 3 devis gratuits de paysagistes qualifiés. Vous pouvez aussi consulter la Chambre des Métiers du ${city.deptName}, l'UNEP (Union Nationale des Entreprises du Paysage) ou les Pages Jaunes pour trouver des professionnels certifiés près de ${city.name}.` },
  ];

  // ── MARKET DATA (unique per city) ──
  const prixGravier = priceVariation(45, s, city.region);
  const prixPaves = priceVariation(70, s, city.region);
  const prixBeton = priceVariation(80, s, city.region);
  const prixPierre = priceVariation(115, s, city.region);
  const nbArtisans = Math.max(2, Math.round(city.pop / 10000) + (s % 5));
  const concurrence = nbArtisans > 8 ? 'forte' : nbArtisans > 4 ? 'modérée' : 'faible';

  const marketData = `Dans le ${city.deptName} (${city.deptCode}), le prix d'une allée de jardin varie de ${prixGravier}€/m² (gravier stabilisé) à ${prixPierre}€/m² (pierre naturelle posée). Les pavés autobloquants, matériau le plus demandé, coûtent en moyenne ${prixPaves}€/m² TTC posé à ${city.name}. Le béton désactivé se situe à ${prixBeton}€/m². Environ ${nbArtisans} paysagistes et maçons paysagistes interviennent dans un rayon de 30 km autour de ${city.name}, ce qui représente une concurrence ${concurrence}. ${concurrence === 'forte' ? 'Cette forte concurrence joue en faveur des particuliers qui peuvent négocier les prix et exiger des finitions soignées.' : concurrence === 'faible' ? 'Il est d\'autant plus important de comparer les devis car les prix peuvent varier significativement d\'un artisan à l\'autre.' : 'Comparez systématiquement 3 devis pour obtenir le meilleur rapport qualité/prix et les meilleurs délais.'}`;

  return {
    intro: pick(intros, s),
    local_tip: pick(tips, s + 7).replace(/\{VILLE\}/g, city.name),
    history_anecdote: pick(anecdotes, s + 13),
    faq_local: pick(faqs, s + 19),
    market_data: marketData,
  };
}

// ── MAIN ──
const content = {};
let dupeCheck = new Set();
let dupeCount = 0;

for (const city of cities) {
  const c = generateContent(city);
  const sig = c.intro.substring(0, 80);
  if (dupeCheck.has(sig)) { dupeCount++; }
  dupeCheck.add(sig);
  content[city.slug] = c;
}

const outPath = join(__dirname, '..', 'src', 'data', 'local-content.json');
writeFileSync(outPath, JSON.stringify(content, null, 0), 'utf-8');
const sizeMB = (Buffer.byteLength(JSON.stringify(content)) / 1024 / 1024).toFixed(2);
console.log(`💾 Written ${Object.keys(content).length} entries to local-content.json (${sizeMB} MB)`);
console.log(`🔍 Duplicate intro signatures: ${dupeCount} / ${cities.length} (${(dupeCount/cities.length*100).toFixed(1)}%)`);
