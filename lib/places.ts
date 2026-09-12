/**
 * The location tier — and the rule that stops it becoming a page farm.
 *
 * THE PROBLEM THIS FILE SOLVES. The registry holds 34 cities and 31 services,
 * which multiply out to 1,054 possible /services/<service>/<city> URLs. Every
 * one of them could be generated from a template in an afternoon, and Google's
 * current spam policies describe exactly that as scaled content abuse: "many
 * pages are generated for the primary purpose of manipulating search rankings
 * and not helping users." A thousand pages differing only in a place name is
 * the textbook case, and the penalty lands on the whole domain, not the pages.
 *
 * THE RULE. A city page for a service exists IF AND ONLY IF somebody has
 * written a `LOCAL_NOTES` entry for that exact pair. Not a flag, not a
 * threshold, not a template with a variable in it — a paragraph a person wrote
 * about doing that work in that place. `generateStaticParams` reads the keys of
 * that map and nothing else, so there is no way to add a page without adding
 * the content that justifies it, and no way to fabricate the content without
 * noticing you are doing it.
 *
 * WHY NOT GATE ON PROVIDER COUNTS INSTEAD. Because there are none. Production
 * held 16 accounts, 4 with a profession set and 0 verified, in September 2026.
 * A page built around "12 plumbers in Nyali" would have to invent the 12, and
 * the honest version — "0 plumbers" — is not a page anybody should land on from
 * a search. So these pages are built on what IS true: which neighbourhoods the
 * app covers, what the work is like in that place, and how posting a job works.
 * When real supply exists, live counts become an ADDITION to these pages rather
 * than the thing holding them up.
 *
 * NEIGHBOURHOODS GET NO PAGES AT ALL. Nairobi alone has 69 in the registry.
 * They appear as real names in the copy of their city's page, which is how they
 * earn their semantic coverage without 2,000 near-identical URLs.
 */

import { CITIES, type Place } from "./generated/places";
import { serviceBySlug } from "./services";

export type { Place };

/**
 * Cities that get their own page.
 *
 * The test is the registry's own: a city gets a page when the registry knows
 * its neighbourhoods. That is not an arbitrary cut — it is the same six places
 * the product team bothered to map at street level, which is the same six where
 * the app can actually place a post precisely, which is the same six where a
 * page can say something specific instead of something generic.
 */
export const CITY_PAGES: Place[] = CITIES.filter(
  (c) => (c.neighbourhoods?.length ?? 0) > 0,
);

/** The three the launch effort is going into. Kept in step with Coverage.tsx. */
export const LAUNCH_CITY_IDS = ["mombasa", "nairobi", "kisumu"] as const;

const BY_ID = new Map(CITIES.map((c) => [c.id, c]));

export function cityById(id: string): Place | undefined {
  return BY_ID.get(id);
}

export function isCityPage(id: string): boolean {
  return CITY_PAGES.some((c) => c.id === id);
}

/** Per-city editorial. Written, not generated. */
export interface CityContent {
  /** How people refer to somebody from here, for natural copy. */
  demonym?: string;
  /** Meta description for /areas/<id>. */
  description: string;
  /** Two or three paragraphs about getting work done in this city. */
  intro: string[];
  /** What tends to get posted here, and why. Specific to the place. */
  common: string[];
}

export const CITY_CONTENT: Record<string, CityContent> = {
  mombasa: {
    description:
      "Find local service providers in Mombasa on Help24 — plumbers, electricians, cleaners, AC technicians and more, across Nyali, Bamburi, Tudor, Likoni, Changamwe and the rest of the county.",
    intro: [
      "Mombasa is where Help24's launch effort is concentrated, and it is the city the app knows in the most detail — the registry carries twenty-two Mombasa neighbourhoods, from Old Town and Kizingo on the island out through Nyali, Bamburi and Shanzu on the north coast, Likoni to the south, and Changamwe, Jomvu and Miritini on the mainland west.",
      "That granularity matters more here than almost anywhere else in Kenya, because Mombasa is not one journey. A fundi in Bamburi and a job in Likoni are separated by the ferry, and a provider who says yes without realising that is a provider who arrives late or not at all. Posting to the neighbourhood rather than to \"Mombasa\" is what keeps the offers you get realistic.",
      "The coast is also hard on buildings in ways the rest of the country is not. Salt air corrodes exposed metalwork and outdoor air conditioning units, humidity moves timber and encourages mould, and the water is hard enough that scale is a recurring plumbing problem rather than an occasional one. Most repeat maintenance work in Mombasa traces back to one of those three.",
    ],
    common: [
      "Air conditioning servicing and repair, which is closer to essential here than anywhere else in Kenya",
      "Plumbing affected by hard water and scale, and by older pipework in Mvita and Old Town",
      "Corrosion repairs to gates, grilles and window frames from salt air",
      "Turnaround cleaning for holiday lets and short-stay flats along the north coast",
      "Exterior repainting, which the sun and salt shorten the life of considerably",
    ],
  },
  nairobi: {
    description:
      "Find local service providers in Nairobi on Help24 — plumbers, electricians, cleaners, carpenters, movers and more, across Westlands, Kilimani, Karen, Embakasi, Kasarani and the rest of the city.",
    intro: [
      "Nairobi is the largest market on Help24 and the most finely mapped: sixty-nine neighbourhoods in the registry, from the CBD and Westlands through Kilimani, Kileleshwa, Lavington and Karen, out to Embakasi, Umoja, Kasarani, Githurai and Dagoretti.",
      "Posting to the right one is the whole game here. Traffic makes distance in Nairobi a measure of time rather than kilometres, and a job posted to \"Nairobi\" reaches people for whom your address is a two-hour round trip. Posted to Kilimani, it reaches the people who can actually be there this afternoon.",
      "Two things shape most of what gets posted in Nairobi. The first is apartment living — fitted storage, landlord-standard repairs, and the deep cleans that happen between tenancies. The second is water: rationing across much of the city means tanks, booster pumps and float valves are routine maintenance rather than occasional repairs.",
    ],
    common: [
      "Water tanks, booster pumps and the plumbing that goes with an intermittent mains supply",
      "Fitted wardrobes, kitchen units and joinery made to an apartment's exact dimensions",
      "End-of-tenancy cleaning and repainting between tenants",
      "Moving jobs complicated by stairs, lifts, estate gate rules and traffic windows",
      "Car repairs from the wear that potholes and stop-start traffic put on suspension and brakes",
    ],
  },
  kisumu: {
    description:
      "Find local service providers in Kisumu on Help24 — plumbers, electricians, cleaners, AC technicians and more, across Milimani, Nyalenda, Kondele, Manyatta and the rest of the lakeside city.",
    intro: [
      "Kisumu is the third city Help24's launch effort is going into, and the registry carries twelve of its neighbourhoods — Milimani, Kondele, Nyalenda, Manyatta, Mamboleo and the areas around them.",
      "It is a compact city by Kenyan standards, which is good news for anybody posting a job: a provider in one part of Kisumu can usually reach another part the same day, which is not reliably true in Nairobi.",
      "The lakeside climate drives a lot of the work. Kisumu is hot and humid for most of the year, which puts air conditioners and refrigeration under sustained load, and heavy seasonal rain makes drainage, roofing and damp recurring themes rather than one-off emergencies.",
    ],
    common: [
      "Air conditioning and refrigeration work, under near-continuous load in the lakeside heat",
      "Roofing and drainage repairs before and after the long rains",
      "Plumbing where borehole and piped supply are mixed, with the scale that comes with it",
      "Damp and mould treatment in humid months",
      "General repairs and maintenance for rental housing",
    ],
  },
  nakuru: {
    description:
      "Find local service providers in Nakuru on Help24 — plumbers, electricians, cleaners, builders and more, across Milimani, Section 58, Shabab, Bondeni, Lanet and the rest of the city.",
    intro: [
      "Nakuru is one of Kenya's fastest-growing cities and now carries city status in its own right. The registry knows thirteen of its neighbourhoods, from Milimani and Section 58 through Shabab, Bondeni, Free Area, Lanet and Bahati.",
      "Growth is what shapes the work here. A lot of what gets posted in Nakuru is new: finishing a house, fitting out a shop, walling a plot, or the first round of repairs on a building that went up recently and quickly.",
      "Help24's launch effort is concentrated on Mombasa, Nairobi and Kisumu, so Nakuru has fewer providers on the platform today. The app covers it fully — posts reach whoever is nearby — but it is honest to say that the response here will be thinner than on the coast until more providers join.",
    ],
    common: [
      "Finishing work on newly built houses — plastering, painting, fitting out",
      "Boundary walls, gates and external works on new plots",
      "Plumbing and electrical repairs on recent construction",
      "Shop and business fit-outs",
      "General household repairs and maintenance",
    ],
  },
  eldoret: {
    description:
      "Find local service providers in Eldoret on Help24 — plumbers, electricians, cleaners, builders and more, across Langas, Kapsoya, Elgon View, Huruma and the rest of the town.",
    intro: [
      "Eldoret is the main urban centre of the North Rift and the registry carries eleven of its neighbourhoods, including Langas, Kapsoya, Huruma, Elgon View, Kimumu and Pioneer.",
      "It sits high — above two thousand metres — and the cold nights that come with the altitude change what people need. Water heating matters here in a way it does not on the coast, and instant showers and geysers are among the more common repair requests.",
      "Help24's launch cities are Mombasa, Nairobi and Kisumu, so provider numbers in Eldoret are lower today. The app works here and posts reach anyone nearby, but expect fewer offers than a coastal or Nairobi post would attract.",
    ],
    common: [
      "Water heater and instant shower repairs, which altitude and cold nights make routine",
      "Roofing and guttering work before the rains",
      "Household plumbing and electrical repairs",
      "Building and finishing work on new housing",
      "Carpentry and fitted joinery",
    ],
  },
  thika: {
    description:
      "Find local service providers in Thika on Help24 — plumbers, electricians, cleaners, builders and more, across Makongeni, Section 9, Ngoingwa, Landless and Kiganjo.",
    intro: [
      "Thika sits in Kiambu County about forty-five kilometres from Nairobi, close enough that many households straddle both. The registry carries six of its areas: Makongeni, Section 9, Ngoingwa, Landless, Kiganjo and Gatuanyaga.",
      "Its proximity to Nairobi cuts both ways on Help24. A job posted in Thika can reach providers who also work in the northern Nairobi suburbs, which widens the pool — but it also means travel time and transport are a real part of what you are quoted, and worth confirming before you accept an offer.",
      "Thika is not one of the three launch cities, so there are fewer providers here today than in Mombasa, Nairobi or Kisumu. The app covers it fully.",
    ],
    common: [
      "Household repairs and maintenance across the residential estates",
      "Building, finishing and boundary wall work",
      "Plumbing and electrical repairs",
      "Moving jobs between Thika and Nairobi",
      "Carpentry and metal fabrication",
    ],
  },
};

/**
 * The gate.
 *
 * Key is `<service-slug>:<city-id>`. A key here is the ONLY thing that brings a
 * /services/<service>/<city> page into existence. Each value is genuine local
 * knowledge about doing that work in that place — the kind of thing that is
 * true whether or not Help24 exists, and that a reader in that city would
 * recognise as correct.
 *
 * ADDING ONE. Write the note first. If you cannot write two sentences that are
 * specifically true of that trade in that city — not true of the trade
 * everywhere, not true of the city generally — then the page should not exist,
 * and leaving it out costs nothing.
 */
export const LOCAL_NOTES: Record<string, string[]> = {
  // ───────────────────────────────────────────── Mombasa
  "plumbing:mombasa": [
    "Mombasa plumbing has two recurring themes that inland cities do not share. The first is scale: coastal groundwater is hard, and it builds up inside instant showers, mixer cartridges, kettles and pipework far faster than it does in Nairobi. A tap that has lost pressure here has often furred up rather than failed.",
    "The second is age. Much of Mvita and Old Town is built on pipework laid decades ago, in buildings that have been subdivided repeatedly since. Tracing a leak in an older island property frequently takes longer than fixing it, which is worth knowing before you accept a quote that looks unusually quick.",
  ],
  "electrical:mombasa": [
    "Salt air is the electrician's problem on the coast. It corrodes outdoor sockets, security light fittings, distribution boards on exterior walls, and the terminals inside them — often long before anything visibly fails. A circuit that trips in wet weather and behaves in dry weather is usually telling you exactly this.",
    "Fittings rated for outdoor coastal use cost more and last several times longer here. When you compare quotes for exterior work in Mombasa, it is worth asking specifically what is being fitted rather than only what it costs.",
  ],
  "ac-repair:mombasa": [
    "Mombasa is the highest-demand air conditioning market in Kenya, and the one where servicing genuinely pays for itself. Outdoor condenser units on the coast take in salt-laden air continuously; the fins corrode and clog, the unit works harder, and the compressor fails years earlier than it should.",
    "Two cleans a year is the standard advice for a coastal installation, against roughly one inland. If a technician in Mombasa quotes a gas refill without mentioning the condition of the outdoor coil, ask about it before agreeing.",
  ],
  "house-cleaning:mombasa": [
    "A large share of cleaning work along the north coast — Nyali, Bamburi, Shanzu — is turnaround cleaning for holiday lets and short-stay flats. That is a different job from a household deep clean: it is fast, it happens to a deadline between one guest and the next, and it usually includes linen.",
    "Coastal homes also collect a film that inland homes do not. Sand travels a long way indoors, and salt-laden humidity leaves a residue on glass, mirrors and metalwork that ordinary wiping smears rather than removes.",
  ],
  "painting:mombasa": [
    "Exterior paint has a harder life in Mombasa than almost anywhere in Kenya. Salt, humidity and direct sun break down the film faster, and a coastal exterior typically needs redoing well before an inland one of the same age.",
    "Preparation is where coastal repainting is won or lost. Salt deposits left on a wall stop the new coat bonding, so ask specifically whether washing down and sealing are included in the quote, not just how many coats there are.",
  ],
  "welding:mombasa": [
    "Gates, grilles, balcony railings and staircases rust visibly faster in Mombasa, and the corrosion usually starts where it cannot be seen — inside hollow sections, and at welds where the coating is thinnest.",
    "Finish is therefore the question that matters most on coastal fabrication. Galvanised or properly powder-coated steel costs more than primed and painted, and on the coast the gap in how long it lasts is measured in years rather than months.",
  ],
  "carpentry:mombasa": [
    "Coastal humidity moves timber. Doors that shut cleanly in January bind in the wet months, drawers stick, and wardrobe doors stop sitting flush — most of which is the wood responding to moisture rather than anything having broken.",
    "It is also termite country. Before commissioning fitted joinery in Mombasa, it is worth asking the carpenter what the timber has been treated with and how the units sit against the wall and floor.",
  ],
  "appliance-repair:mombasa": [
    "Fridges and freezers work considerably harder in coastal heat and humidity, and the failures that follow are predictable: door seals that stop sealing, condenser coils clogged with dust that has gone sticky in humid air, and fans that give up under continuous running.",
    "Many Mombasa fridge call-outs turn out to be a seal or a clogged coil rather than a compressor. That is worth establishing before replacing an appliance that may have years left in it.",
  ],
  "mechanic:mombasa": [
    "Coastal cars corrode from underneath. Salt air reaches exhaust systems, brake lines, suspension mounts and chassis members, and a vehicle that has spent its life in Mombasa will show wear that an identical Nairobi car does not.",
    "If you are buying a used car on the coast, a pre-purchase inspection that specifically includes the underside is worth considerably more than one that does not.",
  ],
  "moving-services:mombasa": [
    "Two things shape moving quotes in Mombasa. The first is stairs: much of the north coast rental stock is walk-up flats, and the floor you are on is often the largest single factor in what a move costs.",
    "The second is the crossing. A move between the island or the north coast and Likoni or the south coast involves the ferry, with its queues and its timings. Say which side of the water each address is on when you post, because a mover who discovers it on the day will re-quote.",
  ],
  "masonry:mombasa": [
    "Mombasa construction leans heavily on coral blocks and cement render, and both behave differently from the quarry stone used up-country. Render on the coast has to cope with salt coming through from behind as well as weather hitting it from the front.",
    "Where plaster is blowing off a coastal wall in patches, the cause is usually moisture and salts moving through the wall rather than a bad mix. Re-plastering without dealing with that means paying twice.",
  ],
  "gardening:mombasa": [
    "Coastal gardens grow fast and continuously — there is no cold season to slow them down — so the gap between visits matters more here than inland. A compound left for a season in Mombasa is a clearing job, not a mowing job.",
    "Coconut palms are their own specialism. Cutting nuts and fronds down safely from height is not general garden work, and it is worth asking specifically whether a gardener does it before assuming they will.",
  ],

  // ───────────────────────────────────────────── Nairobi
  "plumbing:nairobi": [
    "Most Nairobi plumbing traces back to how water reaches the property. Supply across much of the city is rationed, so households depend on storage tanks, float valves and booster pumps — and those three are what fail. A tap with no pressure in Nairobi is more often an empty tank or a pump that has lost prime than a problem with the tap.",
    "In apartments, the complication is shared infrastructure. A leak in one flat frequently originates in another, and pipework runs through walls and ducts the resident has no access to. Say early in the post if you are in a block, because it changes who needs to be involved before anything can be fixed.",
  ],
  "electrical:nairobi": [
    "Nairobi's apartment stock brings its own electrical pattern: prepaid token meters, compact consumer units with little spare capacity, and circuits added over the years by whoever was available at the time. Breakers that trip when a kettle and a microwave run together are usually a loading problem, not a faulty appliance.",
    "Outages and the surges that follow them take a steady toll on electronics. Where a household has lost more than one device, the useful conversation is about surge protection at the consumer unit rather than replacing equipment again.",
  ],
  "house-cleaning:nairobi": [
    "End-of-tenancy cleaning is the most-posted cleaning job in Nairobi, and it is the one with a standard attached to it: the landlord's, not yours. Find out what is actually being inspected — usually the oven, the extractor, inside cupboards, windows and bathroom grout — and put that in the post, because those are the items that decide a deposit.",
    "In gated estates and apartment blocks, access is a real constraint. Cleaners need to be signed in at the gate, some blocks restrict working hours, and a lift that is booked out changes the day. Mention it up front.",
  ],
  "carpentry:nairobi": [
    "Fitted joinery is the Nairobi carpentry staple, because apartment storage is almost never adequate as built. Wardrobes, kitchen units and TV walls are made to the exact millimetre of a specific alcove, which is why measuring is the part that matters.",
    "Getting finished units into a Nairobi flat is a genuine constraint. A wardrobe built in a workshop still has to come up a staircase or into a lift, and experienced Nairobi carpenters build in sections for that reason. Ask how it arrives, not just what it costs.",
  ],
  "painting:nairobi": [
    "Repainting between tenants is the volume job in Nairobi, and it usually runs to a deadline: the flat has to be ready for the next tenant. That tends to mean working around a fixed handover date rather than around the weather.",
    "Nairobi's dust is the other factor. Walls near an unpaved road or a construction site need washing down before painting, and a quote that skips that step will look cheaper and last less time.",
  ],
  "moving-services:nairobi": [
    "Nairobi moves are quoted on stairs and on traffic, in that order. Fourth-floor walk-ups at both ends can double the hours a move takes, and movers ask about the floor before they ask about the furniture.",
    "Estate and building rules are the thing people forget. Many blocks restrict moving to certain hours, require the gate to be notified in advance, or have a lift that must be booked. Sorting that before the day is what separates a four-hour move from an eight-hour one.",
  ],
  "mechanic:nairobi": [
    "Nairobi driving punishes suspension and brakes above everything else. Potholes, speed bumps and long stretches of stop-start traffic wear out shocks, bushes, control arm joints and brake pads faster than the same car would wear them anywhere else in the country.",
    "Because so much city driving is short and slow, engines also spend a lot of time below proper operating temperature. Oil and filter intervals based on kilometres alone tend to be optimistic for a car that mostly commutes in traffic.",
  ],
  "appliance-repair:nairobi": [
    "Washing machines dominate Nairobi appliance posts, and the most common faults follow the city's water: blocked filters and pumps, and inlet valves that have silted up where supply is intermittent and comes back carrying sediment.",
    "Where a machine is fed from a tank rather than the mains, low inlet pressure is worth mentioning when you post. It produces symptoms that look like a faulty valve and it is not one.",
  ],
  "masonry:nairobi": [
    "Perimeter walls, paving and cabro are the steady masonry work in Nairobi, driven by plots being developed and subdivided. Both are quoted by area, so measuring roughly before posting moves you straight to a real number.",
    "Nairobi's black cotton soil is the local complication. It swells and shrinks with the seasons, and it cracks walls, slabs and paving laid without proper foundations or hardcore. Where a wall has cracked more than once in the same place, the ground is the problem, not the mason.",
  ],
  "welding:nairobi": [
    "Grilles, gates and staircase railings are the bulk of Nairobi fabrication, and most of it is security-driven. What matters as much as the welding is the fixing: a grille is only as strong as its anchors into the wall.",
    "For apartments, measure the opening before posting and check whether the landlord has a specification. Many blocks require grilles in a particular style, and a set made without asking is a set that comes back off.",
  ],
  "gardening:nairobi": [
    "Nairobi's larger-plot suburbs — Karen, Runda, Lavington, Kitisuru, Muthaiga — generate most of the city's regular gardening work: lawns, hedges and mature trees on compounds too big to keep on top of by hand.",
    "The two rainy seasons set the rhythm. Growth accelerates sharply with the rains and slows in the dry months, so a visit schedule that works in January is usually too infrequent by April.",
  ],
  "construction:nairobi": [
    "Nairobi renovation work is dominated by apartments, which brings constraints a standalone house does not have: management approval, restricted working hours, no space for materials, and neighbours on the other side of every wall.",
    "Black cotton soil makes foundations a real question for anything being built from the ground here. For extensions and new structures it is worth an engineer's input before a contractor's quote, not after.",
  ],

  // ───────────────────────────────────────────── Kisumu
  "ac-repair:kisumu": [
    "Kisumu's lakeside climate is hot and humid nearly year-round, which means air conditioners here run under sustained load rather than seasonally. Units in Kisumu accumulate running hours faster than the same unit would in Nairobi, and they need servicing on that basis.",
    "Humidity also means indoor units produce a lot of condensate. Water dripping from an indoor unit in Kisumu is most often a blocked or badly fallen drain line rather than a refrigerant problem.",
  ],
  "plumbing:kisumu": [
    "Kisumu properties draw on a mix of piped supply and boreholes, and borehole water around the lake basin is frequently high in iron. It stains fittings and sanitaryware a rust colour and it scales up shower heads and mixers, which is why filtration comes up more often in Kisumu plumbing conversations than elsewhere.",
    "Drainage is the other recurring theme. Parts of the city sit low and flat, and heavy seasonal rain backs up gullies and soak pits that cope perfectly well the rest of the year.",
  ],
  "electrical:kisumu": [
    "Storm activity around the lake basin is intense, and lightning-related damage to electronics and to distribution boards is a genuinely more common call-out here than in most Kenyan cities.",
    "For a Kisumu household that has lost equipment to a surge more than once, proper earthing and surge protection at the consumer unit is a more useful conversation than replacing the equipment again.",
  ],
  "house-cleaning:kisumu": [
    "Humidity is what makes Kisumu cleaning different. Mould and mildew establish themselves in bathrooms, on window reveals and behind furniture pushed against external walls far more readily than in drier cities.",
    "Treating the surface without improving the ventilation brings it back within weeks. A cleaner who raises airflow and drying time as part of the job is giving you the answer that lasts.",
  ],
  "appliance-repair:kisumu": [
    "Refrigeration runs hard in Kisumu. Ambient heat and humidity mean fridges and freezers rarely get a break, and door seals, condenser fans and defrost systems are the components that give out first.",
    "Where a fridge has started icing up heavily, humidity getting in past a tired seal is the usual explanation, and a seal is a considerably smaller job than the compressor people fear.",
  ],
  "painting:kisumu": [
    "Humidity changes how paint behaves in Kisumu. Coats take longer to dry properly, and painting over a surface that is not fully dry traps moisture and leads to peeling months later.",
    "For exterior work, timing around the long rains matters more here than in drier parts of the country. A painter who suggests waiting for a better window is usually right.",
  ],
  "carpentry:kisumu": [
    "Lakeside humidity swells timber, so doors bind and drawers stick seasonally in Kisumu much as they do on the coast. Sealing all faces of a fitted unit — including the back and the underside, which are frequently skipped — is what keeps that under control.",
    "Termites are active around the lake basin, so how a unit meets the floor and the wall matters as much as how it is built. Fitted furniture that sits flush to a damp external wall in Kisumu is the arrangement that gives them a way in, and a carpenter who leaves a ventilation gap behind a wardrobe is doing it for that reason rather than out of carelessness.",
  ],
  "moving-services:kisumu": [
    "Kisumu is compact, and a move within the city rarely runs into the travel times that make Nairobi moves expensive. Most local moves here are half-day jobs.",
    "The longer-distance move is the common one instead: Kisumu to Nairobi, or out to the surrounding towns. For those, agree whether the price is for the vehicle and the trip or by the hour, because the two diverge sharply over that distance.",
  ],
};

/** Pairs that have a page. Derived from the notes, never from a product. */
export const SERVICE_CITY_PAIRS: { service: string; city: string }[] =
  Object.keys(LOCAL_NOTES)
    .map((key) => {
      const [service, city] = key.split(":");
      return { service, city };
    })
    .filter(({ service, city }) => {
      // A note whose service or city no longer exists is a bug, not a page.
      const s = serviceBySlug(service);
      return Boolean(s?.local) && isCityPage(city);
    });

export function localNote(service: string, city: string): string[] | undefined {
  return LOCAL_NOTES[`${service}:${city}`];
}

/** Cities with a page for this service, in registry order. */
export function citiesForService(service: string): Place[] {
  return CITY_PAGES.filter((c) => Boolean(localNote(service, c.id)));
}

/** Services with a page in this city, in catalogue order. */
export function servicesForCity(city: string): string[] {
  return SERVICE_CITY_PAIRS.filter((p) => p.city === city).map((p) => p.service);
}
