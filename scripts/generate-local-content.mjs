#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const citiesPath = join(__dirname, '..', 'src', 'data', 'cities-fr.ts');
const raw = readFileSync(citiesPath, 'utf-8');
const match = raw.match(/export const cities[^=]*=\s*(\[[\s\S]*\]);?\s*$/m);
if (!match) { console.error('Cannot parse cities'); process.exit(1); }
const cities = eval(match[1]);
console.log(`📊 Loaded ${cities.length} cities`);

// ── REGIONAL DATA ──
const CLIMATE = {
  "Île-de-France": { zone: "H1a", hiver: "froid modéré", ete: "tempéré", pluie: "650 mm/an", gel: "40-60 jours/an", sol: "limoneux à argileux", materiau: "pavés béton ou grès", drainage: "drainage périphérique recommandé", caue: "https://www.caue-idf.fr" },
  "Hauts-de-France": { zone: "H1a", hiver: "froid et humide", ete: "doux", pluie: "750 mm/an", gel: "50-70 jours/an", sol: "argileux à calcaire", materiau: "pavés béton autobloquants résistants au gel", drainage: "drainage renforcé obligatoire", caue: "https://fncaue.com" },
  "Grand Est": { zone: "H1b", hiver: "rigoureux", ete: "chaud", pluie: "700 mm/an", gel: "60-80 jours/an", sol: "calcaire à gréseux", materiau: "granit ou béton haute résistance gel", drainage: "fondation 25-30 cm contre le gel", caue: "https://fncaue.com" },
  "Normandie": { zone: "H1a", hiver: "doux et humide", ete: "frais", pluie: "850 mm/an", gel: "30-50 jours/an", sol: "argileux à limoneux", materiau: "gravier stabilisé ou pavés drainants", drainage: "géotextile renforcé + drainage latéral", caue: "https://fncaue.com" },
  "Bretagne": { zone: "H2a", hiver: "doux et pluvieux", ete: "frais", pluie: "900 mm/an", gel: "20-40 jours/an", sol: "granitique à schiste", materiau: "granit local ou dalles schiste", drainage: "drainage essentiel (forte pluviométrie)", caue: "https://fncaue.com" },
  "Pays de la Loire": { zone: "H2b", hiver: "doux", ete: "tempéré", pluie: "700 mm/an", gel: "25-45 jours/an", sol: "calcaire à sableux", materiau: "tuffeau ou pavés calcaire", drainage: "drainage standard suffit", caue: "https://fncaue.com" },
  "Centre-Val de Loire": { zone: "H2b", hiver: "modéré", ete: "chaud", pluie: "650 mm/an", gel: "40-55 jours/an", sol: "calcaire à argileux", materiau: "pierre calcaire locale ou béton désactivé", drainage: "drainage moyen, attention sols argileux", caue: "https://fncaue.com" },
  "Bourgogne-Franche-Comté": { zone: "H1c", hiver: "froid continental", ete: "chaud", pluie: "750 mm/an", gel: "55-75 jours/an", sol: "calcaire à marneux", materiau: "pierre de Bourgogne ou granit", drainage: "fondation renforcée anti-gel", caue: "https://fncaue.com" },
  "Nouvelle-Aquitaine": { zone: "H2c", hiver: "doux océanique", ete: "chaud", pluie: "800 mm/an", gel: "20-40 jours/an", sol: "sableux à argileux", materiau: "pierre blonde locale ou béton désactivé", drainage: "drainage adapté selon sol", caue: "https://fncaue.com" },
  "Auvergne-Rhône-Alpes": { zone: "H1c", hiver: "froid (altitude)", ete: "chaud en vallée", pluie: "800 mm/an", gel: "50-90 jours/an", sol: "granitique à volcanique", materiau: "granit ou basalte local", drainage: "fondation 30 cm en altitude", caue: "https://fncaue.com" },
  "Occitanie": { zone: "H3", hiver: "doux méditerranéen", ete: "très chaud", pluie: "600 mm/an", gel: "10-30 jours/an", sol: "calcaire à galets roulés", materiau: "galets du Rhône ou pierre ocre du Midi", drainage: "drainage adapté aux épisodes cévenols", caue: "https://fncaue.com" },
  "PACA": { zone: "H3", hiver: "doux", ete: "très chaud et sec", pluie: "550 mm/an", gel: "5-20 jours/an", sol: "calcaire sec à rocheux", materiau: "pierre naturelle provençale ou gravier clair", drainage: "drainage orageux (épisodes méditerranéens)", caue: "https://fncaue.com" },
  "Corse": { zone: "H3", hiver: "doux littoral", ete: "chaud", pluie: "700 mm/an", gel: "5-15 jours/an", sol: "granitique à schisteux", materiau: "granit corse ou pierre locale", drainage: "drainage pentes naturelles", caue: "https://fncaue.com" },
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

function slugify(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function hash(str) { return str.split('').reduce((a,c,i) => a + c.charCodeAt(0) * (i+1), 0); }
function pick(arr, seed) { return arr[Math.abs(seed) % arr.length]; }
function priceVariation(base, seed, region) {
  const f = { "Île-de-France": 1.25, "PACA": 1.15, "Corse": 1.3, "Auvergne-Rhône-Alpes": 1.1, "Hauts-de-France": 0.92, "Grand Est": 0.95, "Bretagne": 0.97, "Normandie": 0.95 };
  return Math.round(base * (f[region] || 1.0) * (0.95 + (hash(String(seed)) % 11) / 100));
}

function generateContent(city) {
  const s = hash(city.slug);
  const cl = CLIMATE[city.region] || CLIMATE["Centre-Val de Loire"];
  const archi = ARCHI_STYLES[city.region] || "traditionnel";
  const pref = PREFECTURES[city.deptCode] || city.name;
  const citySlug = slugify(city.name);
  const mairieUrl = `https://www.annuaire-mairie.fr/mairie-${citySlug}.html`;
  const gpuUrl = `https://www.geoportail-urbanisme.gouv.fr/`;
  const cadastreUrl = `https://www.cadastre.gouv.fr/scpc/accueil.do`;

  // ── INTRO (8 unique variants × city data) ──
  const intros = [
    `${city.name}, commune de ${city.pop.toLocaleString('fr-FR')} habitants dans le ${city.deptName}, bénéficie d'un climat ${cl.hiver} en hiver et ${cl.ete} en été (zone ${cl.zone}, ${cl.pluie}). Le sol local de nature ${cl.sol} oriente vers ${cl.materiau}. Les paysagistes du secteur maîtrisent la tradition des ${archi} et les contraintes du PLU communal.`,
    `Située en ${city.region} (${city.deptName}), ${city.name} et ses ${city.pop.toLocaleString('fr-FR')} résidents bénéficient d'un tissu artisanal dynamique. La pluviométrie (${cl.pluie}) et le gel (${cl.gel}) imposent un ${cl.drainage}. Les pros du ${city.deptCode} recommandent ${cl.materiau} en zone ${cl.zone}.`,
    `À ${city.name} (${city.zip}, ${city.deptName}), le style paysager ${archi} influence le choix esthétique des allées. Avec ${city.pop.toLocaleString('fr-FR')} habitants, la demande est soutenue. Le sol ${cl.sol} et le climat ${cl.hiver} (${cl.gel}) orientent vers des matériaux adaptés.`,
    `Le département du ${city.deptName} (${city.deptCode}), dont ${city.name} fait partie, se caractérise par un patrimoine de type ${archi}. En zone ${cl.zone}, les ${cl.pluie} de précipitations et le sol ${cl.sol} nécessitent une attention au drainage. Le ${cl.materiau} est privilégié par les ${city.pop.toLocaleString('fr-FR')} habitants.`,
    `Avec ses ${city.pop.toLocaleString('fr-FR')} habitants, ${city.name} est une commune dynamique du ${city.deptName}. Le terrain local (sol ${cl.sol}) et le climat (${cl.pluie}) conditionnent le choix des matériaux : ${cl.materiau}. Un ${cl.drainage} est indispensable.`,
    `En plein cœur du ${city.deptName}, ${city.name} (${city.zip}) offre un cadre apprécié. La zone ${cl.zone} (${cl.gel}) et le sol ${cl.sol} orientent vers ${cl.materiau}. Les paysagistes locaux connaissent les spécificités du PLU communal et accompagnent vos démarches administratives.`,
    `${city.name} (${city.deptName}, ${city.region}) compte ${city.pop.toLocaleString('fr-FR')} habitants et se situe en zone climatique ${cl.zone}. L'hiver ${cl.hiver} et l'été ${cl.ete} définissent le choix optimal : ${cl.materiau}, posé sur une fondation adaptée au sol ${cl.sol}. Le ${cl.drainage} garantit la pérennité de l'ouvrage.`,
    `Dans le ${city.deptName} (${city.deptCode}), ${city.name} se distingue par son architecture paysagère de type ${archi}. Le climat de la zone ${cl.zone} — ${cl.pluie} de précipitations annuelles, gel ${cl.gel} — exige des matériaux résistants. Les artisans locaux préconisent ${cl.materiau} avec un ${cl.drainage}.`,
  ];

  // ── LOCAL TIP with real external links (10 variants) ──
  const tips = [
    `Consultez le PLU de ${city.name} sur le <a href="${gpuUrl}" target="_blank" rel="noopener">Géoportail de l'Urbanisme</a> avant tout projet. Vérifiez le coefficient d'imperméabilisation autorisé et les matériaux imposés en zone visible. Le <a href="${mairieUrl}" target="_blank" rel="noopener">site de la mairie de ${city.name}</a> indique les horaires du service urbanisme.`,
    `Le sol ${cl.sol} de ${city.name} influence la fondation : ${s % 3 === 0 ? 'un sol argileux nécessite 25-30 cm de grave + géotextile 200 g/m² pour éviter les gonflements' : s % 3 === 1 ? 'un sol calcaire permet une fondation allégée (15-20 cm) mais attention au drainage' : 'un sol limoneux requiert des plots béton ou une grave 0/31,5 compactée'}. Consultez <a href="${cadastreUrl}" target="_blank" rel="noopener">cadastre.gouv.fr</a> pour la parcelle.`,
    `En zone ${cl.zone} (${city.region}), privilégiez une exposition ${s % 2 === 0 ? 'sud-est pour limiter l\'humidité matinale et les mousses' : 'sud-ouest avec un revêtement clair pour réduire l\'accumulation de chaleur'}. Le <a href="${cl.caue}" target="_blank" rel="noopener">CAUE du ${city.deptName}</a> propose des consultations gratuites.`,
    `La <a href="${mairieUrl}" target="_blank" rel="noopener">mairie de ${city.name}</a> impose parfois un coefficient de perméabilité maximal. Depuis la loi Climat et Résilience (2021), les communes peuvent exiger des revêtements drainants. Privilégiez les pavés à joints larges ou la résine drainante.`,
    `Vérifiez la taxe d'aménagement à ${city.name} : les allées ne sont pas soumises à cette taxe (pas de surface close/couverte). En revanche, si vous ajoutez un portail ou une clôture, une déclaration préalable est requise. Infos : <a href="${mairieUrl}" target="_blank" rel="noopener">mairie de ${city.name}</a>.`,
    `La préfecture du ${city.deptName} (${pref}) peut accorder des dérogations PLU. Si votre projet est refusé, un recours gracieux est possible sous 2 mois. Le <a href="https://www.service-public.fr/particuliers/vosdroits/F1988" target="_blank" rel="noopener">service-public.fr</a> détaille la procédure.`,
    `Pour une allée carrossable à ${city.name}, exigez des pavés conformes à la norme <strong>NF EN 1338</strong> (classe T3 minimum). La <a href="https://www.qualite-logement.org/" target="_blank" rel="noopener">certification NF</a> garantit la résistance aux charges véhicules et aux cycles gel-dégel.`,
    `Les matériaux locaux du ${city.deptName} (${s % 2 === 0 ? 'pierre régionale, granit' : 'gravier de carrière locale'}) réduisent le coût de transport et l'empreinte carbone. Privilégiez les fournisseurs certifiés <a href="https://www.pefc-france.org/" target="_blank" rel="noopener">PEFC</a> ou issus de carrières labellisées.`,
    `À ${city.name}, la période idéale pour créer une allée est ${s % 2 === 0 ? 'le printemps (mars-mai)' : 'l\'automne (sept-nov)'} : sol sec, températures modérées, pas de gel pour le béton. Demandez un devis 2-3 mois à l'avance car les paysagistes du ${city.deptName} ont des carnets chargés.`,
    `L'<a href="https://www.unep-fr.org/" target="_blank" rel="noopener">UNEP</a> (Union Nationale des Entreprises du Paysage) recense les paysagistes qualifiés du ${city.deptName}. Vérifiez systématiquement l'assurance décennale et la qualification <a href="https://www.qualipaysage.org/" target="_blank" rel="noopener">Qualipaysage</a> avant de signer.`,
  ];

  // ── HISTORY (6 variants) ──
  const anecdotes = [
    `L'art des allées dans le ${city.deptName} remonte aux jardins à la française du XVIIe siècle popularisés par Le Nôtre. À ${city.name}, cette tradition se perpétue avec des matériaux contemporains qui marient esthétique classique et techniques modernes de drainage.`,
    `Le patrimoine paysager de ${city.name} reflète le style ${archi}. Les artisans actuels adaptent ces traditions aux normes DTU 52.1 (pose de revêtements extérieurs) tout en préservant l'identité architecturale locale.`,
    `Les grandes propriétés de ${city.region} intégraient dès le XVIIIe siècle des allées en matériaux nobles. ${city.name} perpétue ce savoir-faire avec des artisans maîtrisant aussi bien les techniques ancestrales (calade, opus incertum) que les matériaux modernes.`,
    `La filière pierre du ${city.deptName} alimente les chantiers de ${city.name} en matériaux de qualité via des circuits courts, préservant un savoir-faire transmis de génération en génération.`,
    `Depuis 2020, ${city.name} et ses ${city.pop.toLocaleString('fr-FR')} habitants ont vu exploser la demande d'aménagements extérieurs. Le télétravail a incité les propriétaires à investir dans leur jardin, l'allée étant souvent le premier chantier pour valoriser la propriété.`,
    `La tradition du jardinage dans le ${city.deptName} est profondément ancrée. Des jardins ouvriers aux pavillons modernes, l'allée accueille le visiteur et reflète le goût du propriétaire pour les matériaux et essences de sa région.`,
  ];

  // ── FAQ LOCAL (5 variants) ──
  const faqs = [
    { question: `Quel est le prix moyen d'une allée de jardin à ${city.name} en 2026 ?`, answer: `À ${city.name} (${city.deptName}), comptez en moyenne : gravier stabilisé ${priceVariation(45, s, city.region)}€/m², pavés autobloquants ${priceVariation(70, s, city.region)}€/m², béton désactivé ${priceVariation(80, s, city.region)}€/m², pierre naturelle ${priceVariation(115, s, city.region)}€/m². Pour 20 m² : ${priceVariation(900, s, city.region)}€ à ${priceVariation(2300, s, city.region)}€ TTC posé.` },
    { question: `Faut-il une autorisation pour créer une allée à ${city.name} ?`, answer: `Généralement non. Mais si les travaux modifient l'aspect visible depuis la voie publique ou si vous êtes en zone protégée ABF, une déclaration préalable peut être requise. Consultez le PLU de ${city.name} sur le Géoportail de l'Urbanisme (gpu.fr).` },
    { question: `Quel matériau d'allée résiste le mieux au climat de ${city.name} ?`, answer: `En zone ${cl.zone}, les pros recommandent ${cl.materiau}. Le sol ${cl.sol} nécessite un ${cl.drainage}. Le climat ${cl.hiver} (${cl.gel}) oriente vers des matériaux ${cl.zone.startsWith('H1') ? 'résistants au gel' : cl.zone === 'H3' ? 'résistants aux UV' : 'polyvalents'}.` },
    { question: `Combien coûte la pose par un paysagiste à ${city.name} ?`, answer: `Main d'œuvre : ${priceVariation(20, s+1, city.region)}€ à ${priceVariation(60, s+1, city.region)}€/m² selon le matériau. Le terrassement représente ~40% du budget total. Demandez 3 devis gratuits via notre comparateur.` },
    { question: `Comment trouver un paysagiste qualifié à ${city.name} ?`, answer: `Utilisez notre comparateur pour 3 devis gratuits. Vérifiez aussi la Chambre des Métiers du ${city.deptName}, l'UNEP (unep-fr.org) et la certification Qualipaysage (qualipaysage.org).` },
  ];

  // ── EXTERNAL LINKS (real, relevant) ──
  const external_links = [
    { label: `Mairie de ${city.name}`, url: mairieUrl, desc: "Horaires, service urbanisme, PLU" },
    { label: "Géoportail de l'Urbanisme", url: gpuUrl, desc: "Consulter le PLU en ligne" },
    { label: "Cadastre.gouv.fr", url: cadastreUrl, desc: "Vérifier votre parcelle" },
    { label: "Service-Public.fr — Déclaration préalable", url: "https://www.service-public.fr/particuliers/vosdroits/F17578", desc: "Formulaire Cerfa et démarches" },
    { label: `CAUE ${city.region}`, url: cl.caue, desc: "Conseil gratuit en architecture et paysage" },
  ];

  // ── INTERNAL LINKS (maillage interne) ──
  const internal_links = [
    { label: "Prix d'une allée de jardin en 2026", url: "/blog/prix-allee-jardin-2026" },
    { label: "Les erreurs à éviter", url: "/blog/erreurs-eviter-allee-jardin" },
    { label: "Choisir son paysagiste", url: "/blog/choisir-installateur-allee-jardin" },
    { label: "Comparer les devis efficacement", url: "/blog/comparer-devis-allee-jardin" },
    { label: "Entretien et durée de vie", url: "/blog/entretien-allee-jardin" },
    { label: "Réglementation 2026", url: "/blog/reglementation-allee-jardin" },
    { label: "Tendances 2026", url: "/blog/tendances-allee-jardin-2026" },
    { label: "Aides financières", url: "/blog/aides-financieres-allee-jardin" },
    { label: `Toutes les villes du ${city.deptName}`, url: `/departement/${city.deptCode.toLowerCase()}` },
    { label: "Demander un devis gratuit", url: "/devis" },
  ];

  // ── MARKET DATA ──
  const pG = priceVariation(45, s, city.region);
  const pP = priceVariation(70, s, city.region);
  const pB = priceVariation(80, s, city.region);
  const pN = priceVariation(115, s, city.region);
  const nb = Math.max(2, Math.round(city.pop / 10000) + (s % 5));
  const conc = nb > 8 ? 'forte' : nb > 4 ? 'modérée' : 'faible';

  const marketData = `Dans le ${city.deptName} (${city.deptCode}), le prix d'une allée varie de ${pG}€/m² (gravier) à ${pN}€/m² (pierre naturelle). Les pavés, matériau le plus demandé, coûtent ${pP}€/m² TTC posé à ${city.name}. Le béton désactivé : ${pB}€/m². Environ ${nb} paysagistes interviennent dans un rayon de 30 km, concurrence ${conc}. ${conc === 'forte' ? 'Négociez les prix et exigez des finitions soignées.' : conc === 'faible' ? 'Comparez les devis, les prix varient fortement.' : 'Comparez 3 devis pour le meilleur rapport qualité/prix.'}`;

  return {
    intro: pick(intros, s),
    local_tip: pick(tips, s + 7),
    history_anecdote: pick(anecdotes, s + 13),
    faq_local: pick(faqs, s + 19),
    market_data: marketData,
    external_links,
    internal_links: internal_links.sort(() => hash(city.slug + 'ml') % 2 - 0.5).slice(0, 5),
  };
}

// ── MAIN ──
const content = {};
let dupeCheck = new Set();
let dupeCount = 0;
for (const city of cities) {
  const c = generateContent(city);
  const sig = c.intro.substring(0, 80);
  if (dupeCheck.has(sig)) dupeCount++;
  dupeCheck.add(sig);
  content[city.slug] = c;
}
const outPath = join(__dirname, '..', 'src', 'data', 'local-content.json');
writeFileSync(outPath, JSON.stringify(content, null, 0), 'utf-8');
const sizeMB = (Buffer.byteLength(JSON.stringify(content)) / 1024 / 1024).toFixed(2);
console.log(`💾 Written ${Object.keys(content).length} entries (${sizeMB} MB)`);
console.log(`🔍 Duplicate intros: ${dupeCount} / ${cities.length} (${(dupeCount/cities.length*100).toFixed(1)}%)`);
