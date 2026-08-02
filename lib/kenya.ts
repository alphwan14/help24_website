/**
 * The Kenya outline, from real boundary data.
 *
 * WHERE IT COMES FROM. The polygon is the country boundary published in
 * georgique/world-geojson (derived from OpenStreetMap, ODbL), simplified with
 * Douglas–Peucker at a 0.008° tolerance. At the size this renders — roughly
 * 360px across 8° of longitude, so 1px ≈ 0.022° — that tolerance is comfortably
 * sub-pixel, which is why the coastline, the Lake Victoria indentation and the
 * north-western border wiggle all survive instead of being smoothed into a
 * lozenge. 235 points, 2.6KB.
 *
 * WHY IT IS NOT DRAWN BY HAND. It was, once, and it was wrong: a 20-point
 * polygon eyeballed from memory. A country outline is a thing people recognise,
 * and an approximation of one reads as carelessness about everything else.
 *
 * PROJECTION. Plate carrée (x = longitude, y = −latitude), linearly scaled.
 * Kenya straddles the equator with a mean latitude near 0°, where the Mercator
 * correction factor cos(lat) is 1.0000 to four decimal places — so the simple
 * projection is exact here to well under a pixel, and city pins can be placed
 * from real coordinates rather than by eye.
 *
 * VERIFIED. Before this file was written, eight Kenyan cities (Nairobi,
 * Mombasa, Kisumu, Nakuru, Eldoret, Lodwar, Garissa, Malindi) were tested as
 * inside the polygon and five non-Kenyan points (Kampala, Dar es Salaam, Addis
 * Ababa, Mogadishu, and a point in the Indian Ocean) as outside — both before
 * and after simplification, so the simplification cannot have moved a border
 * across a city.
 *
 * NOTE ON THE NORTH-WEST. This boundary follows the internationally recognised
 * line and therefore excludes the Ilemi Triangle, which some maps show as
 * Kenyan. That is the standard, uncontroversial rendering.
 */

export const KENYA_VIEWBOX = { width: 100, height: 117.124 } as const;

export const KENYA_BOUNDS = {
  minLon: 33.90998840332031,
  maxLon: 41.90977975316852,
  minLat: -4.736569593761297,
  maxLat: 4.633141665089409,
} as const;

export const KENYA_PATH =
  "M6.29,0L5.84,0.01L0.84,5.09L1.33,5.43L1.84,6.16L1.64,6.4L2.08,6.97L2.15,7.43L1.72,7.6L1.77,7.81L2.66,8.43L2.48,9.17L2.12,9.37L2.1,9.68L3.7,9.43L3.81,10.02L3.24,10.04L2.92,10.42L3.39,10.52L3.11,10.82L4.06,10.67L4.83,11.55L4.87,11.92L5.03,11.31L5.71,11.26L6.06,11.73L6.75,11.99L6.64,14L6.45,14.25L5.91,14.3L6.34,14.92L6.05,15.24L6.1,15.8L6.59,16.62L6.84,18.16L7.37,18.59L7.85,18.64L8.33,19.28L8.63,21.4L9.09,21.54L9.21,22.04L9.93,21.98L10.55,22.55L10.94,23.49L10.82,24.23L11.72,25.55L12.06,25.72L12.3,25.48L12.49,26.39L12.8,26.49L13.09,27.13L12.51,27.81L13.26,31.54L13.43,33.13L13.64,33.41L13.55,37.13L12.9,38.21L11.97,38.74L11.61,39.74L11.1,40.17L11.18,40.63L10.96,40.85L11.48,41.59L11.34,42.36L10.93,42.62L9.52,42.84L9.24,43.24L8.42,43.58L8.32,44.2L7.66,44.06L7.27,44.84L7.12,46.19L6.69,47.1L6.19,47.55L6.31,47.84L5.06,48.41L5.03,49.24L4.61,49.41L4.53,49.95L3.6,50.11L3.49,50.34L2.84,50.62L2.58,51.38L2.69,51.44L2.59,51.91L2.25,52.15L2.51,53.17L2.36,53.54L1.85,53.86L1.67,54.47L1.21,54.85L0,56.59L0.97,59.53L0.4,63.61L0.38,70.42L1.42,70.47L1.48,70.82L1.67,70.99L2.15,70.69L39.15,91.6L43.32,93.83L47.05,96.16L47.49,99.28L46.39,100.33L45.95,101.05L46.48,101.15L46.1,101.9L47.23,101.75L48.01,102.23L48.71,103.99L66.13,116.18L66.2,116.44L67.73,116.42L68.01,116.68L68.09,117.12L69,116.78L68.97,115.45L69.41,115.43L70.08,113.67L70.48,113.69L71.82,109.92L73.46,107.49L74.72,104.32L74.72,103.55L75.92,100.46L77.91,99.13L78.08,97.69L78.61,96.04L79.34,95.42L79.23,95L78.73,95.08L78.41,94.57L78.64,92.28L79.67,90.98L81.58,89.91L82.71,89.7L83.75,89.96L85.42,88.69L85.82,88.65L85.93,88.3L86.43,87.94L86.34,87.18L87.38,86.69L87.63,87L88.13,86.83L88.55,86.27L88.39,85.82L88.56,85.84L88.43,85.66L88.04,85.8L87.71,85.58L87.54,83.66L87.75,83.64L87.74,83.83L87.97,83.99L88.42,83.89L88.38,83.36L88.6,83.57L89.05,83.6L89.35,83.24L90.44,82.67L90.69,82.67L90.65,82.91L91.04,82.89L91.05,83.09L91.37,83.19L91.11,82.76L91.12,82.08L91.34,82.11L91.71,82.58L91.98,82.5L91.96,82.84L91.42,83.46L91.84,83.39L94.3,80.73L94.6,80.57L95.15,79.83L95.14,79.68L94.87,79.81L95.04,79.41L95.64,78.75L95.59,77.9L88.52,68.3L88.45,22.57L92.5,18.61L100,8.12L99.21,8.55L98.18,8.14L97.36,8.1L96.81,8.38L96.33,8.17L94.92,8.38L93.17,8.38L92.69,8.62L91.59,8.45L91.08,8.62L89.98,8.07L88.47,6.49L87.4,5.95L86.99,4.95L85.76,4.3L85.03,4.85L78.61,7.35L74.46,9.51L73.29,12.11L70.86,14.37L70.61,15.47L70.03,15.23L69.89,14.75L67.83,14.58L67.8,14.2L67.22,14.55L65.53,14.2L64.68,13.76L63.3,13.76L62.68,13.96L60.21,13.35L59.63,12.69L59.39,13L58.29,12.83L57.74,12.22L57.57,12.63L56.68,12.87L53.41,12.66L52.66,12.76L51.08,11.26L38.99,3.28L36.66,2.35L25.65,2.26L25.36,1.44L25.66,0.71L25.19,0.59L25.3,0.07L6.11,0.2L6.29,0Z";

/**
 * Longitude/latitude → a point in the viewBox above.
 *
 * Every pin on the map goes through this, so a city sits where it actually is.
 * Adding a city is adding its real coordinates, never an x/y guessed against
 * the artwork.
 */
export function projectKE(lon: number, lat: number): { x: number; y: number } {
  const scale = KENYA_VIEWBOX.width / (KENYA_BOUNDS.maxLon - KENYA_BOUNDS.minLon);
  return {
    x: +((lon - KENYA_BOUNDS.minLon) * scale).toFixed(2),
    y: +((KENYA_BOUNDS.maxLat - lat) * scale).toFixed(2),
  };
}
