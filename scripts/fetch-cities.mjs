#!/usr/bin/env node
/**
 * Fetch ~5000 communes > 2000 habitants from the French government API
 * API: https://geo.api.gouv.fr/communes
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Department → Region mapping
const DEPT_REGIONS = {
  "01":"Auvergne-Rhône-Alpes","02":"Hauts-de-France","03":"Auvergne-Rhône-Alpes","04":"PACA","05":"PACA",
  "06":"PACA","07":"Auvergne-Rhône-Alpes","08":"Grand Est","09":"Occitanie","10":"Grand Est",
  "11":"Occitanie","12":"Occitanie","13":"PACA","14":"Normandie","15":"Auvergne-Rhône-Alpes",
  "16":"Nouvelle-Aquitaine","17":"Nouvelle-Aquitaine","18":"Centre-Val de Loire","19":"Nouvelle-Aquitaine",
  "2A":"Corse","2B":"Corse","21":"Bourgogne-Franche-Comté","22":"Bretagne","23":"Nouvelle-Aquitaine",
  "24":"Nouvelle-Aquitaine","25":"Bourgogne-Franche-Comté","26":"Auvergne-Rhône-Alpes","27":"Normandie",
  "28":"Centre-Val de Loire","29":"Bretagne","30":"Occitanie","31":"Occitanie","32":"Occitanie",
  "33":"Nouvelle-Aquitaine","34":"Occitanie","35":"Bretagne","36":"Centre-Val de Loire","37":"Centre-Val de Loire",
  "38":"Auvergne-Rhône-Alpes","39":"Bourgogne-Franche-Comté","40":"Nouvelle-Aquitaine","41":"Centre-Val de Loire",
  "42":"Auvergne-Rhône-Alpes","43":"Auvergne-Rhône-Alpes","44":"Pays de la Loire","45":"Centre-Val de Loire",
  "46":"Occitanie","47":"Nouvelle-Aquitaine","48":"Occitanie","49":"Pays de la Loire","50":"Normandie",
  "51":"Grand Est","52":"Grand Est","53":"Pays de la Loire","54":"Grand Est","55":"Grand Est",
  "56":"Bretagne","57":"Grand Est","58":"Bourgogne-Franche-Comté","59":"Hauts-de-France","60":"Hauts-de-France",
  "61":"Normandie","62":"Hauts-de-France","63":"Auvergne-Rhône-Alpes","64":"Nouvelle-Aquitaine",
  "65":"Occitanie","66":"Occitanie","67":"Grand Est","68":"Grand Est","69":"Auvergne-Rhône-Alpes",
  "70":"Bourgogne-Franche-Comté","71":"Bourgogne-Franche-Comté","72":"Pays de la Loire","73":"Auvergne-Rhône-Alpes",
  "74":"Auvergne-Rhône-Alpes","75":"Île-de-France","76":"Normandie","77":"Île-de-France","78":"Île-de-France",
  "79":"Nouvelle-Aquitaine","80":"Hauts-de-France","81":"Occitanie","82":"Occitanie","83":"PACA",
  "84":"PACA","85":"Pays de la Loire","86":"Nouvelle-Aquitaine","87":"Nouvelle-Aquitaine","88":"Grand Est",
  "89":"Bourgogne-Franche-Comté","90":"Bourgogne-Franche-Comté","91":"Île-de-France","92":"Île-de-France",
  "93":"Île-de-France","94":"Île-de-France","95":"Île-de-France","971":"Guadeloupe","972":"Martinique",
  "973":"Guyane","974":"La Réunion","976":"Mayotte"
};

const DEPT_NAMES = {
  "01":"Ain","02":"Aisne","03":"Allier","04":"Alpes-de-Haute-Provence","05":"Hautes-Alpes",
  "06":"Alpes-Maritimes","07":"Ardèche","08":"Ardennes","09":"Ariège","10":"Aube",
  "11":"Aude","12":"Aveyron","13":"Bouches-du-Rhône","14":"Calvados","15":"Cantal",
  "16":"Charente","17":"Charente-Maritime","18":"Cher","19":"Corrèze","2A":"Corse-du-Sud",
  "2B":"Haute-Corse","21":"Côte-d'Or","22":"Côtes-d'Armor","23":"Creuse","24":"Dordogne",
  "25":"Doubs","26":"Drôme","27":"Eure","28":"Eure-et-Loir","29":"Finistère",
  "30":"Gard","31":"Haute-Garonne","32":"Gers","33":"Gironde","34":"Hérault",
  "35":"Ille-et-Vilaine","36":"Indre","37":"Indre-et-Loire","38":"Isère","39":"Jura",
  "40":"Landes","41":"Loir-et-Cher","42":"Loire","43":"Haute-Loire","44":"Loire-Atlantique",
  "45":"Loiret","46":"Lot","47":"Lot-et-Garonne","48":"Lozère","49":"Maine-et-Loire",
  "50":"Manche","51":"Marne","52":"Haute-Marne","53":"Mayenne","54":"Meurthe-et-Moselle",
  "55":"Meuse","56":"Morbihan","57":"Moselle","58":"Nièvre","59":"Nord",
  "60":"Oise","61":"Orne","62":"Pas-de-Calais","63":"Puy-de-Dôme","64":"Pyrénées-Atlantiques",
  "65":"Hautes-Pyrénées","66":"Pyrénées-Orientales","67":"Bas-Rhin","68":"Haut-Rhin",
  "69":"Rhône","70":"Haute-Saône","71":"Saône-et-Loire","72":"Sarthe","73":"Savoie",
  "74":"Haute-Savoie","75":"Paris","76":"Seine-Maritime","77":"Seine-et-Marne","78":"Yvelines",
  "79":"Deux-Sèvres","80":"Somme","81":"Tarn","82":"Tarn-et-Garonne","83":"Var",
  "84":"Vaucluse","85":"Vendée","86":"Vienne","87":"Haute-Vienne","88":"Vosges",
  "89":"Yonne","90":"Territoire de Belfort","91":"Essonne","92":"Hauts-de-Seine",
  "93":"Seine-Saint-Denis","94":"Val-de-Marne","95":"Val-d'Oise"
};

function slugify(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function fetchCities() {
  console.log('📡 Fetching cities from geo.api.gouv.fr...');
  
  const url = 'https://geo.api.gouv.fr/communes?fields=nom,code,codesPostaux,codeDepartement,population,centre&format=json';
  const res = await fetch(url);
  const data = await res.json();
  
  console.log(`📊 Total communes received: ${data.length}`);
  
  // Filter > 2000 hab, metropolitan France only
  const filtered = data.filter(c => {
    if (!c.population || c.population < 2000) return false;
    if (!c.codeDepartement) return false;
    // Exclude DOM-TOM
    const dept = c.codeDepartement;
    if (['971','972','973','974','976'].includes(dept)) return false;
    if (!DEPT_REGIONS[dept]) return false;
    return true;
  });
  
  console.log(`✅ Cities > 2000 hab (metropolitan): ${filtered.length}`);
  
  const cities = filtered.map(c => {
    const dept = c.codeDepartement;
    const zip = c.codesPostaux?.[0] || `${dept}000`;
    const lat = c.centre?.coordinates?.[1] || 46.5;
    const lng = c.centre?.coordinates?.[0] || 2.5;
    
    return {
      slug: slugify(c.nom),
      name: c.nom,
      zip,
      deptCode: dept,
      deptName: DEPT_NAMES[dept] || dept,
      region: DEPT_REGIONS[dept] || 'France',
      pop: c.population,
      lat: Math.round(lat * 10000) / 10000,
      lng: Math.round(lng * 10000) / 10000,
    };
  })
  // Deduplicate by slug
  .filter((city, idx, arr) => arr.findIndex(c => c.slug === city.slug) === idx)
  // Sort by population desc
  .sort((a, b) => b.pop - a.pop);
  
  console.log(`🏙️ Unique cities after dedup: ${cities.length}`);
  
  // Generate TypeScript file
  const tsContent = `export interface City {
  slug: string;
  name: string;
  zip: string;
  deptCode: string;
  deptName: string;
  region: string;
  pop: number;
  lat: number;
  lng: number;
}

/**
 * ${cities.length} villes françaises > 2 000 habitants
 * Généré automatiquement le ${new Date().toISOString().split('T')[0]}
 */
export const cities: City[] = ${JSON.stringify(cities, null, 0)
  .replace(/\},\{/g, '},\n  {')
  .replace('[{', '[\n  {')
  .replace('}]', '}\n]')};
`;
  
  const outPath = join(__dirname, '..', 'src', 'data', 'cities-fr.ts');
  writeFileSync(outPath, tsContent, 'utf-8');
  console.log(`💾 Written to ${outPath}`);
  console.log(`📈 Top 10: ${cities.slice(0, 10).map(c => c.name).join(', ')}`);
}

fetchCities().catch(console.error);
