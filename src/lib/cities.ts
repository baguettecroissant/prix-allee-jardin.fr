import { cities, type City } from '../data/cities-fr';

export function getAllCities(): City[] {
  return cities.sort((a, b) => b.pop - a.pop);
}

export function getCityBySlug(slug: string): City | undefined {
  return cities.find(c => c.slug === slug);
}

export function getNearbyCities(city: City, limit = 8): City[] {
  return cities
    .filter(c => c.slug !== city.slug)
    .map(c => ({
      ...c,
      distance: Math.sqrt(
        Math.pow(c.lat - city.lat, 2) + Math.pow(c.lng - city.lng, 2)
      ),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}

export function getCitiesByDepartment(deptCode: string): City[] {
  return cities.filter(c => c.deptCode === deptCode).sort((a, b) => b.pop - a.pop);
}

export function getCitiesByRegion(region: string): City[] {
  return cities.filter(c => c.region === region).sort((a, b) => b.pop - a.pop);
}

export function getAllDepartments() {
  const deptMap = new Map<string, { code: string; name: string; region: string; count: number }>();
  for (const city of cities) {
    if (!deptMap.has(city.deptCode)) {
      deptMap.set(city.deptCode, {
        code: city.deptCode,
        name: city.deptName,
        region: city.region,
        count: 0,
      });
    }
    deptMap.get(city.deptCode)!.count++;
  }
  return Array.from(deptMap.values()).sort((a, b) => a.code.localeCompare(b.code));
}
