/**
 * The neighbourhood tier — /services/<service>/<city>/<neighbourhood>.
 *
 * WHAT THIS IS FOR. Searches like "plumber Changamwe" or "electrician Githurai"
 * are real, specific and badly served. A page can win them honestly when it
 * says something about the work in that neighbourhood that is not true of the
 * city as a whole. That is the only kind of page this file can create.
 *
 * WHAT THIS IS NOT. The registry holds about 130 neighbourhoods across the six
 * city pages, and roughly 18 services are local-intent. Multiplying them gives
 * about 2,400 URLs that differ only in a place name. That is the textbook case
 * of scaled content abuse in Google's spam policies, and the penalty lands on
 * the whole domain, including every page that was fine. docs/seo-architecture.md
 * §4 has the full reasoning, and this file applies the same gate one level
 * further down.
 *
 * THE RULE. A neighbourhood page exists IF AND ONLY IF:
 *
 *   1. somebody has written a NEIGHBOURHOOD_NOTES entry for that exact
 *      service + city + neighbourhood,
 *   2. the neighbourhood is in the app's location registry under that city, and
 *   3. the parent /services/<service>/<city> page exists, so the trail above the
 *      page is never a 404.
 *
 * `generateStaticParams` reads SERVICE_NEIGHBOURHOOD_PAGES and nothing else.
 * Nothing in this file multiplies two lists, and nothing should.
 *
 * WHAT THESE PAGES NEVER CLAIM. "Best", "top-rated", "cheapest", "affordable",
 * "24/7" and "emergency" all promise something about providers or prices that
 * Help24 cannot yet show to be true. tests/neighbourhoods.test.ts rejects them
 * in the generated titles and descriptions.
 */

import type { Place } from "./generated/places";
import { cityById, isCityPage, localNote } from "./places";
import { serviceBySlug, withArticle } from "./services";

export interface Neighbourhood {
  /** URL segment, derived from the registry name. Never edit by hand. */
  slug: string;
  /** The registry name, exactly as the app shows it. */
  name: string;
  city: Place;
}

/**
 * "Nairobi CBD" → "nairobi-cbd", "Section 58" → "section-58".
 *
 * The slug is derived, not stored, so it can never drift from the registry
 * name. Renaming a neighbourhood in the registry therefore changes a URL, so it
 * needs a 301 in next.config.mjs, the same as renaming a city.
 */
export function neighbourhoodSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Every neighbourhood the registry knows for a city, in registry order. */
export function neighbourhoodsOf(cityId: string): Neighbourhood[] {
  const city = cityById(cityId);
  if (!city) return [];
  return (city.neighbourhoods ?? []).map((name) => ({
    slug: neighbourhoodSlug(name),
    name,
    city,
  }));
}

export function neighbourhoodBySlug(
  cityId: string,
  slug: string,
): Neighbourhood | undefined {
  return neighbourhoodsOf(cityId).find((n) => n.slug === slug);
}

/**
 * The gate.
 *
 * Key is `<service-slug>:<city-id>:<neighbourhood-slug>`. A key here is the
 * ONLY thing that creates a neighbourhood page.
 *
 * THE BAR IS HIGHER THAN FOR A CITY NOTE. A city note has to be true of the
 * trade in that city. A neighbourhood note has to be true of the trade in that
 * neighbourhood and NOT simply true of the whole city. If the paragraph would
 * fit as well on the parent city page, it belongs there, or nowhere. The tests
 * check that the note names its neighbourhood and does not read like any other
 * note with the place names swapped. Whether it is true is up to the person
 * writing it.
 *
 * Good material: the housing stock (estate flats, towers, colonial plots,
 * conservation buildings), how water and power actually reach the buildings,
 * access (causeways, ferries, lanes a lorry cannot enter, building rules), and
 * which county or utility an area falls under.
 *
 * Bad material: anything about providers ("many skilled plumbers in…"), prices,
 * response times, or adjectives that would fit any neighbourhood in Kenya.
 */
export const NEIGHBOURHOOD_NOTES: Record<string, string[]> = {
  // ───────────────────────────────────────────── Mombasa
  "plumbing:mombasa:changamwe": [
    "Changamwe sits on the mainland west of the island, beside the port, the refinery and the industrial area, and a lot of its housing is older estate stock: blocks of flats and maisonettes built for the workforce around them and maintained a repair at a time ever since. Supply pipework of that age is often galvanised steel that is rusting from the inside, which is why a Changamwe tap that runs brown for a few seconds is usually describing the pipe rather than the water.",
    "Distance is the other half of a plumbing job here. A fundi coming from the island or the north coast reaches Changamwe over the Makupa Causeway and through junctions shared with the port's container trucks, and that journey can take longer than the repair. Posting to Changamwe rather than to Mombasa as a whole puts the job in front of people on the mainland side, around Changamwe, Chaani, Magongo and Miritini, who do not have to make that crossing.",
  ],
  "masonry:mombasa:old-town": [
    "Old Town's buildings are mostly coral stone laid in lime mortar and finished with lime plaster, and they have to be repaired in the same materials. Coral and lime let moisture pass through a wall and dry out again. Patch them with cement and that moisture is sealed in, and the salts it carries push the plaster off from behind, and eventually the face of the stone with it. Much of the decay visible on Old Town's walls is earlier cement repairs doing exactly that.",
    "Old Town is also a gazetted conservation area. Changes to a building's exterior need approval through the Mombasa Old Town Conservation Office before work starts, and a mason who has worked here will bring that up without being asked. The lanes shape the quote as well: most are too narrow for a lorry, so sand, lime and stone are carried in by hand or handcart from the nearest road.",
  ],
  "carpentry:mombasa:old-town": [
    "Carpentry in Old Town is often the repair of things that cannot be bought new: carved Swahili doors, timber balconies and screens that overhang the lanes, and ceilings laid on mangrove poles. Matching the timber and the joinery is the job, and it rewards a carpenter willing to repair a carved panel or a door frame rather than replace it with something plain.",
    "Termites and damp are the problems everywhere on the coast, but in Old Town they get into the structure as well as the furniture. A balcony that has started to sag, or a pole ceiling with fine dust collecting on the floor beneath it, needs someone who will open it up and look before anybody quotes for a cosmetic repair. Say which of the two it is when you post, and whether the building is one you own or rent.",
  ],
  "ac-repair:mombasa:nyali": [
    "Nyali's beachfront apartments are about as close to the sea as residential air conditioning gets in Kenya, and the outdoor units show it. A condenser on a sea-facing balcony takes salt spray directly, and its aluminium fins can corrode until they crumble at the touch, far sooner than the same model a kilometre inland.",
    "Two questions are worth putting to anyone quoting for a Nyali installation. Does the outdoor coil have an anti-corrosion coating, or can it be given one? And could the unit go on a sheltered wall instead of the sea-facing side? In an apartment block the second question usually needs the management's agreement, so ask them before the technician arrives rather than during the visit.",
  ],

  // ───────────────────────────────────────────── Nairobi
  "electrical:nairobi:githurai": [
    "Githurai is mostly rental flats: walk-up blocks of four, five and six storeys packed along Thika Road, some of them extended upwards a floor at a time as demand grew. The wiring was often extended the same way, so a breaker that trips in one Githurai flat can be the symptom of a circuit now feeding more units than it was ever laid for, rather than a fault in that flat.",
    "Metering is the other recurring question. Plenty of Githurai buildings run sub-meters or token meters that the landlord or caretaker manages, which puts some faults on the landlord's side of the meter rather than the tenant's. Say in your post whether you rent, and whether you have your own Kenya Power meter, because that decides who pays for the repair and who needs to be there for it.",
  ],
  "plumbing:nairobi:githurai": [
    "Githurai straddles the Nairobi–Kiambu county line, with Githurai 45 on the Kiambu side, so neighbouring blocks can be on different water utilities with different rationing schedules. Most buildings have their own way of coping: rooftop tanks, a borehole shared by the block, or water bought from vendors. A Githurai plumbing problem usually starts with working out which of those the flat actually depends on.",
    "In the taller walk-ups, upper floors only get water while the pump is running, and a pump sized for the original three or four storeys struggles once the block has grown to six. If the top floors run dry while the ground floor has water, the pump and the rising main are the place to start, and that is a job for the landlord or caretaker to arrange as much as the tenant.",
  ],
  "plumbing:nairobi:karen": [
    "Most of Karen is not connected to Nairobi's sewer network. Nearly every property drains to its own septic tank and soakaway, so slow drains, a gurgling toilet or a smell in the garden in Karen usually mean a tank that needs emptying or a soakaway that has stopped absorbing, not a blocked pipe. An exhauster service empties the tank; the plumber deals with the drainage on either side of it.",
    "Water tends to be just as self-contained. Many Karen homes run on a borehole, with a pump, a pressure tank and sometimes treatment, and on a big plot the house can be a long pipe run from the source. If pressure drops across the whole house, check the borehole pump and its pressure switch first. If it drops at a single tap, the problem is the tap.",
  ],
  "electrical:nairobi:karen": [
    "Karen's plots are large, and electrical work there often means distance: power run out to a gate, a staff house, a borehole pump or garden lighting tens of metres from the main board. A run that long needs cable sized for the length and laid in conduit at a proper depth, and a lot of Karen faults turn out to be buried cable that was laid too shallow and has since met a jembe or a tree root.",
    "Most Karen compounds also have an electric fence and a gate motor, both outdoors in the weather and both first in line when a storm sends a surge down the supply. When a fence energiser or a gate controller dies after a storm, ask the electrician to check the earthing and surge protection on that circuit as well as replacing the part, or the new one will go the same way.",
  ],
  "moving-services:nairobi:kilimani": [
    "Over the past decade much of Kilimani has been rebuilt upwards, with bungalow plots replaced by apartment towers of ten storeys and more, and a move into or out of one of them runs on the lift. Most Kilimani blocks expect a move to be booked with management in advance. Some allow only the service lift, and some limit moves to weekdays or set hours. Check with the building before booking movers.",
    "The towers also tend to fill their plots, with basement parking whose ramps a lorry cannot use. Loading then happens from the road outside, and the distance from the truck to the lift, plus the time spent holding the lift, matters to the quote as much as the furniture does. Say in the post whether a truck can get into the compound at all.",
  ],
  "house-cleaning:nairobi:kilimani": [
    "A large share of Kilimani's apartments are let furnished, many of them as short stays, so much of the cleaning there is turnover between bookings: linen changed, kitchen reset, bathrooms done and the unit ready for the next arrival, often within a fixed check-out to check-in window.",
    "Hosts running several Kilimani units usually want the same cleaner every time, working from a checklist they can hand over, and getting into the building is part of the job. Cleaners often have to be registered with the gate or the front desk, and keys or access cards have to change hands somehow. Put both in the post: how many units there are, and how the cleaner gets in.",
  ],
};

/** Pages that exist. Derived from the notes and checked against the registry. */
export const SERVICE_NEIGHBOURHOOD_PAGES: {
  service: string;
  city: string;
  neighbourhood: string;
}[] = Object.keys(NEIGHBOURHOOD_NOTES)
  .map((key) => {
    const [service, city, neighbourhood] = key.split(":");
    return { service, city, neighbourhood };
  })
  .filter(({ service, city, neighbourhood }) => {
    // Every condition of the gate. A note that fails one is a bug, not a page,
    // and tests/neighbourhoods.test.ts says which condition it failed.
    return (
      Boolean(serviceBySlug(service)?.local) &&
      isCityPage(city) &&
      Boolean(neighbourhoodBySlug(city, neighbourhood)) &&
      Boolean(localNote(service, city))
    );
  });

export function neighbourhoodNote(
  service: string,
  city: string,
  neighbourhood: string,
): string[] | undefined {
  return NEIGHBOURHOOD_NOTES[`${service}:${city}:${neighbourhood}`];
}

function hasPage(service: string, city: string, neighbourhood: string): boolean {
  return SERVICE_NEIGHBOURHOOD_PAGES.some(
    (p) => p.service === service && p.city === city && p.neighbourhood === neighbourhood,
  );
}

/** Neighbourhoods with a page for this service in this city, registry order. */
export function neighbourhoodsForService(service: string, city: string): Neighbourhood[] {
  return neighbourhoodsOf(city).filter((n) => hasPage(service, city, n.slug));
}

/** Services with a page in this neighbourhood, in catalogue order of the notes. */
export function servicesForNeighbourhood(city: string, neighbourhood: string): string[] {
  return SERVICE_NEIGHBOURHOOD_PAGES.filter(
    (p) => p.city === city && p.neighbourhood === neighbourhood,
  ).map((p) => p.service);
}

/** Every neighbourhood page in a city, for the city's hub. */
export function neighbourhoodPagesInCity(city: string) {
  return SERVICE_NEIGHBOURHOOD_PAGES.filter((p) => p.city === city);
}

/**
 * Title and description, built here rather than in the page so the honesty
 * test can read exactly what ships.
 */
export function neighbourhoodPageCopy(
  serviceSlug: string,
  cityId: string,
  neighbourhoodSlugValue: string,
  paymentMethods: string,
): { title: string; description: string; h1: string } | undefined {
  const service = serviceBySlug(serviceSlug);
  const n = neighbourhoodBySlug(cityId, neighbourhoodSlugValue);
  if (!service || !n) return undefined;
  const Workers = service.workers.charAt(0).toUpperCase() + service.workers.slice(1);
  return {
    h1: `${Workers} in ${n.name}`,
    title: `${Workers} in ${n.name}, ${n.city.name}`,
    description: `Post ${withArticle(service.category.toLowerCase())} job in ${n.name}, ${n.city.name} on Help24 and get offers from ${service.workers} close enough to reach you. Agree the price before work starts and pay by ${paymentMethods}.`,
  };
}
