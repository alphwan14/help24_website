/**
 * The service catalogue — the website's answer to "do you do X?", and the thing
 * every /services/* URL is built from.
 *
 * THE LIST IS THE APP'S OWN. Every `category` below is a literal from
 * `CATEGORIES` in lib/tokens.ts, which in turn mirrors `Category.all` in the
 * Flutter app's post_model.dart. A category that does not exist in the app must
 * not exist as a page here: the page's whole promise is that you can post this
 * job, and a page for a category the composer cannot select is a promise the
 * product cannot keep. `tests/services.test.ts` fails the build if the two
 * lists drift.
 *
 * WHY EACH ENTRY CARRIES SO MUCH PROSE. A service page whose only distinctive
 * content is its <h1> is a thin page, and thirty of them is scaled content
 * abuse under Google's current spam policies — the same policy that catches
 * doorway pages. The fields here exist so that each page can say something a
 * plumber's customer actually needs and a cleaner's customer does not: what the
 * work involves, what to put in the request, what moves the price, and what to
 * check before you let somebody start. `checks` in particular is trade-specific
 * on purpose (EPRA for electrical work, NCA for contractors, PSRA for security,
 * NITA grades for artisans) because that is the part nobody else writing
 * "plumbers in Kenya" bothers to get right.
 *
 * WHAT IS NOT HERE, DELIBERATELY. No prices, no provider counts, no
 * availability, no ratings. Help24 has 16 accounts and 2 reviews in production
 * as of September 2026; any number this file invented would be a lie that
 * outlives the sprint that invented it. Price GUIDANCE is expressed as the
 * factors that move a quote, which is true today and stays true at scale.
 *
 * `local` gates the /services/<service>/<city> tier. See lib/places.ts — a city
 * page for a service only exists where somebody wrote a genuine local note for
 * that exact pair, so `local: true` is a necessary condition, never a
 * sufficient one.
 */

export interface Service {
  /** URL segment. Lowercase, hyphenated, stable — changing one needs a 301. */
  slug: string;
  /** EXACTLY the app's category name. Checked by tests/services.test.ts. */
  category: string;
  /** CategoryIcon key (components/ds/CategoryIcon.tsx). */
  icon: string;
  /** The app's own grouping, used by the /services hub. */
  group: string;
  /** What you call the person who does this, singular. */
  worker: string;
  /** Plural, for headings and links. */
  workers: string;
  /** Eligible for city pages at all. Necessary, not sufficient — see above. */
  local: boolean;
  /** What Kenyans actually type or say, including Kiswahili where it is real. */
  alsoCalled: string[];
  /** One sentence. Hub cards, related-service links, first line of the page. */
  summary: string;
  /** <title>, intent first, brand last. */
  title: string;
  /** Meta description. Written to be read, not to hold keywords. */
  description: string;
  /** <h1>. */
  h1: string;
  /** Body copy. Two or three paragraphs, specific to this trade. */
  intro: string[];
  /** Jobs people actually post in this category. */
  tasks: string[];
  /** What to put in the request so the offers that come back are usable. */
  detailsToInclude: string[];
  /** What moves a quote up or down. Factors, never figures. */
  priceFactors: string[];
  /** Trade-specific things to verify before work starts. */
  checks: string[];
  /** Slugs of genuinely adjacent services. Two to four. */
  related: string[];
}

/** Trade certification wording reused where it genuinely applies. */
const NITA =
  "A NITA trade test certificate (Grade III is the artisan entry level, Grade I the highest) is the standard Kenyan proof of a trade. Plenty of excellent fundis work without one, so treat it as a bonus rather than a bar.";

export const SERVICES: Service[] = [
  // ─────────────────────────────── Home & Property
  {
    slug: "plumbing",
    category: "Plumbing",
    icon: "plumbing",
    group: "Home & Property",
    worker: "plumber",
    workers: "plumbers",
    local: true,
    alsoCalled: ["fundi wa maji", "pipe fitter", "drainage fundi"],
    summary:
      "Leaks, blocked drains, taps, toilets, water tanks and pipework — the jobs that cannot wait until the weekend.",
    title: "Plumbers in Kenya — Find a Plumber Near You",
    description:
      "Post a plumbing job on Help24 and get offers from plumbers near you. Leaking taps, blocked drains, burst pipes, toilets and water tanks. Agree the price first and pay securely by M-Pesa.",
    h1: "Find a plumber near you",
    intro: [
      "Plumbing is the category people reach for in a hurry. A kitchen sink that will not drain, a toilet cistern running all night, a burst pipe behind a wall — none of these improve with waiting, and all of them get more expensive the longer they run.",
      "On Help24 you describe the problem, say where you are, and plumbers nearby send you their own price. Nobody is assigned to you and nobody starts before you have picked an offer and agreed a number. You pay through M-Pesa, Help24 holds the money, and it is released when you say the job is done.",
      "Most plumbing posts are small: a tap, a trap, a cistern, a shower mixer. Those are worth posting precisely because they are small — they are the ones people put off for months because finding somebody for a one-hour job is more effort than the job itself.",
    ],
    tasks: [
      "Leaking taps, mixers and shower heads",
      "Blocked kitchen sinks, basins, showers and toilets",
      "Burst or leaking pipes, including pipework inside walls",
      "Running or non-flushing toilet cisterns",
      "Water tank installation, cleaning and float valve repairs",
      "Booster pumps that have stopped priming",
      "Sink, basin, bathtub and shower installation",
      "Water heater and instant shower plumbing connections",
      "New pipework for a kitchen or bathroom refit",
    ],
    detailsToInclude: [
      "Where the water is coming from, and whether it is still running now",
      "Whether you have been able to shut the water off at the mains",
      "A photo of the fitting or the wet patch — this is the single biggest thing that improves the offers you get",
      "Whether you are on mains supply, a borehole, a tank, or a mix",
      "Whether the property is a house, a flat, or a rental you do not own",
    ],
    priceFactors: [
      "Whether it is a repair, a replacement, or new pipework",
      "Whether parts are needed and who is buying them — say if you already have the tap or the cistern",
      "How accessible the pipework is: exposed under a sink, or chased into a wall or slab",
      "Whether it is urgent enough to need someone the same evening",
      "How far the plumber has to travel to reach you",
    ],
    checks: [
      "Ask what they think is wrong before they start, and whether the quote covers parts",
      "For anything involving digging up a slab or re-routing pipework, ask who makes good the tiling or plaster afterwards",
      NITA,
      "Agree the price on Help24 before work begins — that is the number the escrow holds, and it is the number that protects you if the job changes halfway",
    ],
    related: ["masonry", "appliance-repair", "general-labour", "construction"],
  },
  {
    slug: "electrical",
    category: "Electrical",
    icon: "electrical",
    group: "Home & Property",
    worker: "electrician",
    workers: "electricians",
    local: true,
    alsoCalled: ["fundi wa stima", "electrical fundi", "wiring fundi"],
    summary:
      "Sockets, lights, wiring, consumer units and the faults that trip your whole house.",
    title: "Electricians in Kenya — Find an Electrician Near You",
    description:
      "Post an electrical job on Help24 and get offers from electricians near you. Faulty sockets, lighting, wiring, tripping breakers and consumer units. Agree the price first and pay securely by M-Pesa.",
    h1: "Find an electrician near you",
    intro: [
      "Electrical work is the category where the difference between a good fundi and a cheap one shows up later — in a breaker that keeps tripping, a socket that runs warm, or a joint in a ceiling void that nobody can find.",
      "Post what is happening and electricians near you send their own quotes. Describe the symptom rather than the fix you think you need: \"the kitchen sockets die when the kettle goes on\" tells an electrician far more than \"I need a new socket\", and gets you a quote for the actual problem.",
      "Kenya licenses electrical workers and electrical contractors through EPRA, in classes that correspond to the scale of work they may legally carry out. For changing a socket this is not the thing to agonise over; for a rewire, a new consumer unit, or anything touching the meter or the supply side, it matters a great deal.",
    ],
    tasks: [
      "Sockets and switches that have stopped working, spark, or run warm",
      "Breakers that trip repeatedly, and tracing what is causing it",
      "Lighting: new fittings, downlights, security lights, replacing failed drivers",
      "Consumer unit repairs, replacement and additional circuits",
      "House and flat rewiring, in full or room by room",
      "Wiring in a cooker, water heater, instant shower or borehole pump",
      "Earthing problems and the shocks people describe as \"tingling\" taps or casings",
      "Backup power: inverter, battery and generator changeover wiring",
      "TV, CCTV and network cable runs",
    ],
    detailsToInclude: [
      "What exactly stops working, and what else is on at the time",
      "Whether the main breaker trips or only one circuit",
      "A photo of the consumer unit with the cover on — the layout tells an electrician a lot before they arrive",
      "The age of the building, if you know it, and whether it has been rewired",
      "Whether you rent, and whether the landlord needs to approve the work",
    ],
    priceFactors: [
      "Whether it is a fault to be traced or a fitting to be replaced — tracing is the part that takes time",
      "How much of the work involves chasing walls and making good afterwards",
      "The number of points, circuits or fittings involved",
      "Whether cable, conduit and fittings are on your account or theirs",
      "Whether the work needs to happen with the power off to the whole building",
    ],
    checks: [
      "For a rewire, a consumer unit, or anything on the supply side, ask whether they hold an EPRA electrical worker licence and which class",
      "For a contractor doing a whole building, EPRA licensing and NCA registration are both relevant",
      "Ask whether the quote includes making good the plaster and paint after chasing",
      "Never let anybody work on a live consumer unit because it is quicker",
      NITA,
    ],
    related: ["appliance-repair", "ac-repair", "construction", "plumbing"],
  },
  {
    slug: "masonry",
    category: "Masonry",
    icon: "masonry",
    group: "Home & Property",
    worker: "mason",
    workers: "masons",
    local: true,
    alsoCalled: ["fundi wa mawe", "bricklayer", "plasterer"],
    summary:
      "Blockwork, plastering, screeds, paving, boundary walls and the repairs that follow a leak.",
    title: "Masons in Kenya — Blockwork, Plastering and Paving",
    description:
      "Post a masonry job on Help24 and get offers from masons near you. Boundary walls, plastering, screeds, paving, foundations and repairs. Agree the price before work starts and pay securely.",
    h1: "Find a mason near you",
    intro: [
      "Masonry covers the heavy, structural end of home work: laying blocks, plastering walls, casting screeds, building boundary walls, and putting right the damage a long-running leak leaves behind.",
      "It is also the category where a clear description saves the most money. A mason quoting to plaster \"a room\" is guessing; a mason quoting to plaster a 4m by 3m bedroom with one window, walls currently bare block, is quoting.",
      "Measure what you can before you post, even roughly. Length and height of a wall, or the rough floor area of a room, moves a quote from an estimate to a price.",
    ],
    tasks: [
      "Boundary and perimeter walls, with or without a gate opening",
      "Plastering new blockwork, and re-plastering where it has blown or cracked",
      "Floor screeds and levelling before tiling",
      "Paving, cabro laying and driveway repairs",
      "Blocking up or opening a doorway or window",
      "Foundations and footings for an extension or an outbuilding",
      "Making good after plumbing or electrical chasing",
      "Repairing water-damaged plaster and rising damp",
      "Septic tanks, soak pits and manholes",
    ],
    detailsToInclude: [
      "Rough measurements — wall length and height, or floor area",
      "Photos of the area, ideally from far enough back to show the whole wall",
      "Whether materials are on your account or theirs",
      "Whether there is water and power on site",
      "How the site is reached — a lorry-accessible plot and a hand-carry plot are different jobs",
    ],
    priceFactors: [
      "Area to be covered, and the height it has to be worked at",
      "Whether scaffolding is needed",
      "Who supplies cement, sand, ballast and blocks",
      "Whether old plaster or an old slab has to be broken out and carried away first",
      "Site access for delivering materials",
    ],
    checks: [
      "Agree in writing who buys materials, and whether the price you see includes them",
      "For any structural work — removing a wall, cutting an opening in a load-bearing wall, adding a floor — get a qualified engineer's opinion, not a quote",
      "Contractors taking on building works in Kenya are required to be registered with the NCA; ask for the registration for anything at that scale",
      NITA,
    ],
    related: ["construction", "painting", "plumbing", "general-labour"],
  },
  {
    slug: "carpentry",
    category: "Carpentry",
    icon: "carpentry",
    group: "Home & Property",
    worker: "carpenter",
    workers: "carpenters",
    local: true,
    alsoCalled: ["fundi wa mbao", "joiner", "furniture fundi"],
    summary:
      "Doors, wardrobes, kitchen units, shelving, furniture repairs and fitted joinery.",
    title: "Carpenters in Kenya — Doors, Wardrobes and Fitted Joinery",
    description:
      "Post a carpentry job on Help24 and get offers from carpenters near you. Doors, wardrobes, kitchen units, shelving and furniture repair. Agree the price before work starts.",
    h1: "Find a carpenter near you",
    intro: [
      "Carpentry on Help24 runs from a door that will not close to a full fitted kitchen. The small repairs are the ones most worth posting: a sagging hinge, a swollen door, a drawer that has dropped, a wobbly table — all an hour's work for somebody with the right tools and a whole weekend for somebody without them.",
      "For fitted work — wardrobes, kitchen units, shelving, a TV wall — the useful thing to post is the space, not the product. Give the width, height and depth available, and say what has to fit inside it.",
      "Finish is where carpentry quotes separate. Melamine board, blockboard, MDF and solid mahogany are four very different prices for the same drawing, so say what you want or ask the carpenter to quote options.",
    ],
    tasks: [
      "Doors: hanging, adjusting, replacing, fitting locks and handles",
      "Fitted wardrobes and built-in storage",
      "Kitchen cabinets, worktops and open shelving",
      "Beds, tables, desks and benches made to a size",
      "Repairing furniture — joints, drawers, legs, hinges",
      "Skirting, architrave, cornices and trims",
      "Ceilings in gypsum, timber or PVC",
      "Window frames, burglar-proofing frames and grille surrounds",
      "Decking, pergolas and garden furniture",
    ],
    detailsToInclude: [
      "Measurements of the space, in centimetres if you can",
      "Photos, including one wide enough to show the surrounding wall",
      "The material and finish you have in mind, or say you want options",
      "Whether existing units have to be removed and taken away",
      "Whether the work happens at your place or in the carpenter's workshop",
    ],
    priceFactors: [
      "Material and finish, which usually dominates the quote",
      "Whether it is made on site or built in a workshop and delivered",
      "How square and true the existing walls and floor are",
      "Ironmongery — hinges, runners, handles and locks add up quickly",
      "Delivery and the number of people needed to carry it in",
    ],
    checks: [
      "Ask to see photographs of work they have finished, not work in progress",
      "For fitted joinery, agree whether the quote is for supply and fit or fit only",
      "Confirm who measures — and that whoever measures is responsible if it does not fit",
      NITA,
    ],
    related: ["painting", "interior-design", "welding", "masonry"],
  },
  {
    slug: "painting",
    category: "Painting",
    icon: "painting",
    group: "Home & Property",
    worker: "painter",
    workers: "painters",
    local: true,
    alsoCalled: ["fundi wa rangi", "decorator", "spray painter"],
    summary:
      "Interior and exterior painting, preparation, filling, and the repaint between tenancies.",
    title: "Painters in Kenya — Interior and Exterior Painting",
    description:
      "Post a painting job on Help24 and get offers from painters near you. Interior rooms, exterior walls, preparation and repaints between tenancies. Agree the price before work starts.",
    h1: "Find a painter near you",
    intro: [
      "Painting is mostly preparation. The visible part — rolling colour onto a wall — is the last and quickest stage, and a quote that seems cheap is usually one that has skipped the filling, sanding and priming that makes the finish last.",
      "When you post, say the number of rooms or the rough wall area, whether the surface is bare plaster, previously painted, or flaking, and whether you want the ceilings done too. Ceilings are frequently left out of a quote and then argued about afterwards.",
      "Say whether paint is on your account or the painter's. Both are normal. What is not normal is finding out on the day.",
    ],
    tasks: [
      "Repainting rooms, whole flats and whole houses",
      "Exterior walls, boundary walls and gates",
      "Preparation: filling cracks, sanding, priming, sealing",
      "Repainting between tenants, at the end of a lease",
      "Painting new plaster for the first time",
      "Wood and metal: doors, frames, grilles, railings",
      "Ceilings, cornices and skirting",
      "Damp-affected walls, once the cause has been fixed",
      "Feature walls, stencilling and decorative finishes",
    ],
    detailsToInclude: [
      "Number of rooms, or rough wall area",
      "Whether ceilings, doors and skirting are included",
      "The current state of the surface — bare, sound, flaking, or damp",
      "Photos of the worst area, not the best",
      "Whether the space will be empty or furnished and occupied",
    ],
    priceFactors: [
      "Area, and how many coats the colour change needs",
      "How much preparation the surface needs before anything is painted",
      "Whether paint is on your account or included in theirs",
      "Working height — a stairwell or a two-storey exterior needs scaffolding",
      "Whether furniture has to be moved and covered",
    ],
    checks: [
      "Ask what preparation is included, specifically — filling, sanding, priming",
      "Agree the exact paint: brand, type, finish, and how many coats",
      "If there is damp, fix the source before painting, or you will pay twice",
      "Ask who covers floors and furniture and who cleans up",
    ],
    related: ["masonry", "carpentry", "interior-design", "house-cleaning"],
  },
  {
    slug: "welding",
    category: "Welding",
    icon: "welding",
    group: "Home & Property",
    worker: "welder",
    workers: "welders",
    local: true,
    alsoCalled: ["fundi wa chuma", "metal fabricator", "grill fundi"],
    summary:
      "Gates, grilles, railings, staircases, water tank stands and steel repairs.",
    title: "Welders in Kenya — Gates, Grilles and Metal Fabrication",
    description:
      "Post a welding or metal fabrication job on Help24 and get offers from welders near you. Gates, window grilles, railings, tank stands and repairs. Agree the price before work starts.",
    h1: "Find a welder near you",
    intro: [
      "Welding covers the steel around a Kenyan home: window grilles, a gate that has dropped on its hinges, a staircase railing, a stand for a water tank, a carport frame.",
      "Fabrication work is quoted from sizes, so measure the opening before you post — width and height of the window, gate or gap. A photo taken square-on, with something for scale, does most of the rest.",
      "Ask about the finish as well as the steel. Bare metal primed and painted is one price; galvanised or powder-coated is another and lasts considerably longer outdoors.",
    ],
    tasks: [
      "Window grilles and burglar-proofing",
      "Gates: new, plus dropped hinges, broken latches and realignment",
      "Staircase railings, balcony rails and balustrades",
      "Water tank stands and platform frames",
      "Carports, shade frames and canopies",
      "Steel doors, security doors and door frames",
      "Repairs to trailers, frames, brackets and machinery",
      "Steel roofing trusses and purlins",
      "Fences, posts and razor-wire frames",
    ],
    detailsToInclude: [
      "Measurements of the opening or the span",
      "A photo taken square-on to the opening",
      "The finish you want: primed and painted, galvanised, or powder-coated",
      "Whether it is made on site or fabricated and delivered",
      "Whether an old item has to be cut out and removed first",
    ],
    priceFactors: [
      "Size, and the section and gauge of steel it needs",
      "Design — plain bars against a pattern with scrollwork or laser-cut panels",
      "Finish, which is often the difference between a five-year and a fifteen-year life",
      "Whether there is power on site for the welder",
      "Delivery, and getting something heavy up stairs",
    ],
    checks: [
      "Confirm whether the price includes fitting, or only fabrication",
      "For anything that people lean on — a balcony rail, a staircase — ask how it is fixed into the wall, not just how it is welded",
      "Agree the finish in writing; \"painted\" and \"powder-coated\" are not the same promise",
      NITA,
    ],
    related: ["carpentry", "masonry", "construction", "general-labour"],
  },

  // ─────────────────────────── Cleaning & Household
  {
    slug: "house-cleaning",
    category: "House Cleaning",
    icon: "cleaning",
    group: "Cleaning & Household",
    worker: "cleaner",
    workers: "cleaners",
    local: true,
    alsoCalled: ["deep cleaning", "mama fua", "domestic cleaning", "house help"],
    summary:
      "Deep cleans, move-out cleans, regular visits, sofas, carpets and post-construction clean-ups.",
    title: "House Cleaning Services in Kenya — Hire a Cleaner",
    description:
      "Post a cleaning job on Help24 and get offers from cleaners near you. Deep cleans, move-in and move-out cleans, sofa and carpet cleaning, and regular visits. Agree the price before work starts.",
    h1: "Hire a cleaner near you",
    intro: [
      "Cleaning is the category people most often post more than once. A deep clean is a one-off; a fortnightly visit is a relationship, and the second is usually what people want once the first has gone well.",
      "The single most useful thing you can put in a cleaning post is the size of the place and what state it is in. \"Two-bedroom flat, nobody has lived in it for six months\" and \"two-bedroom flat, cleaned last month\" are the same square metres and a very different day's work.",
      "Say who is providing the cleaning products and equipment. Some cleaners bring everything, some expect to use yours, and a vacuum cleaner is the item this most often turns on.",
    ],
    tasks: [
      "Deep cleaning a house, flat or single room",
      "Move-in and move-out cleans, including end of tenancy",
      "Regular weekly or fortnightly visits",
      "Sofa, mattress and carpet cleaning",
      "Post-construction and post-renovation clean-ups",
      "Kitchen deep cleans: cooker, extractor, cupboards, fridge",
      "Bathroom descaling and tile and grout cleaning",
      "Windows, including interior glass and frames",
      "Office and shop cleaning",
    ],
    detailsToInclude: [
      "Number of bedrooms and bathrooms, or rough floor area",
      "Whether it is a one-off or you want somebody regular",
      "Whether the place is furnished and occupied, or empty",
      "Who supplies detergents, mops and a vacuum",
      "Anything that needs special handling: a stained sofa, a greasy extractor, a pet",
    ],
    priceFactors: [
      "Size of the property and the number of bathrooms",
      "How long since it was last cleaned properly",
      "One-off deep clean against a regular visit — regular work is usually cheaper per visit",
      "Whether products and equipment are included",
      "Extras like sofas, carpets, curtains and windows",
    ],
    checks: [
      "Agree exactly what is included: a deep clean that excludes the oven and the windows should say so",
      "Be clear about hours — some cleaners quote a job, others quote a day",
      "For somebody who will come regularly, meet them on the first visit and check identification",
      "For a move-out clean, agree what standard the landlord is expecting before, not after",
    ],
    related: ["laundry", "gardening", "painting", "moving-services"],
  },
  {
    slug: "laundry",
    category: "Laundry",
    icon: "laundry",
    group: "Cleaning & Household",
    worker: "laundry service",
    workers: "laundry services",
    local: true,
    alsoCalled: ["mama fua", "dobi", "ironing service", "dry cleaning"],
    summary:
      "Washing, ironing, duvets, curtains and the backlog that builds up when the machine breaks.",
    title: "Laundry and Ironing Services in Kenya",
    description:
      "Post a laundry job on Help24 and get offers from laundry services near you. Washing, ironing, duvets, curtains and bulk loads. Agree the price before anyone starts.",
    h1: "Find a laundry service near you",
    intro: [
      "Laundry on Help24 covers two different things: somebody who comes to you and works through the backlog, and a service that collects, washes and returns.",
      "Say which you want. It changes who answers, and it changes the price — collection and delivery are real costs and are usually quoted separately.",
      "Bulky items are the ones worth naming specifically. Duvets, blankets, curtains and rugs do not fit a domestic machine, and a service with the capacity for them is not the same service as the person who irons shirts.",
    ],
    tasks: [
      "Washing and ironing a household backlog",
      "Regular weekly laundry visits",
      "Duvets, blankets and heavy bedding",
      "Curtains, including taking down and rehanging",
      "Rugs and floor mats",
      "Ironing only, where the washing is already done",
      "Collection, wash and return",
      "Uniforms and workwear in bulk",
    ],
    detailsToInclude: [
      "Roughly how much there is — loads, baskets, or number of items",
      "Whether you want somebody at your place or a collection service",
      "Whether ironing is included",
      "Any bulky items: duvets, curtains, rugs",
      "Whether you have a working machine, and whether detergent is provided",
    ],
    priceFactors: [
      "Volume, usually by load, by kilo or by the piece",
      "Whether ironing is included or priced separately",
      "Bulky items, which are almost always priced on their own",
      "Collection and delivery",
      "How quickly you need it back",
    ],
    checks: [
      "Agree how the price is counted — per kilo, per load and per item give very different totals",
      "Point out anything delicate or likely to run before it goes in",
      "For a collection service, agree the return day in writing",
    ],
    related: ["house-cleaning", "gardening", "caregiving", "delivery-rider"],
  },
  {
    slug: "gardening",
    category: "Gardening",
    icon: "gardening",
    group: "Cleaning & Household",
    worker: "gardener",
    workers: "gardeners",
    local: true,
    alsoCalled: ["shamba boy", "landscaper", "lawn care", "fundi wa bustani"],
    summary:
      "Lawns, hedges, tree cutting, clearing an overgrown plot and regular garden upkeep.",
    title: "Gardeners in Kenya — Lawn, Hedge and Garden Care",
    description:
      "Post a gardening job on Help24 and get offers from gardeners near you. Lawn mowing, hedge trimming, tree cutting, clearing overgrown plots and regular upkeep.",
    h1: "Find a gardener near you",
    intro: [
      "Gardening posts split fairly cleanly into two: getting a garden back under control, and keeping it that way. The first is a hard day or two of work, the second is a few hours every couple of weeks, and they are quoted differently.",
      "If a plot has been left for a season, say so. Clearing overgrowth is heavier work than mowing and usually needs a way to take the cuttings away, which is the part people forget to budget for.",
      "For tree work, be specific about size and what is underneath. Cutting a branch that overhangs a neighbour's roof or a power line is a different job, and not one for a general gardener.",
    ],
    tasks: [
      "Lawn mowing, edging and regular upkeep",
      "Hedge trimming and shaping",
      "Clearing an overgrown plot or compound",
      "Tree pruning, cutting back and removal",
      "Planting: grass, hedges, shrubs, trees",
      "Flower bed preparation and weeding",
      "Compound sweeping and general grounds work",
      "Drip irrigation and sprinkler installation",
      "Removing cuttings and garden waste",
    ],
    detailsToInclude: [
      "Rough plot size, and how much of it is lawn",
      "How long it has been since it was last cut",
      "Photos — overgrowth is very hard to judge from a description",
      "Whether cuttings have to be taken away",
      "Whether there is a water point and power on site",
    ],
    priceFactors: [
      "Plot size and how overgrown it is",
      "Whether it is a one-off rescue or a regular visit",
      "Removing and disposing of cuttings",
      "Whether tools and a mower are provided or brought",
      "Tree work, which is priced on its own",
    ],
    checks: [
      "For tree cutting near a roof, a wall or power lines, ask specifically how they plan to drop it",
      "Agree whether cuttings are taken away or left in a heap",
      "For regular work, agree the visit frequency and what a visit includes",
    ],
    related: ["house-cleaning", "general-labour", "masonry", "construction"],
  },

  // ─────────────────────────── Security & Transport
  {
    slug: "security-guard",
    category: "Security Guard",
    icon: "security",
    group: "Security & Transport",
    worker: "security guard",
    workers: "security guards",
    local: true,
    alsoCalled: ["watchman", "askari", "night guard", "site security"],
    summary:
      "Day and night guarding for homes, sites, shops and events.",
    title: "Security Guards in Kenya — Hire a Guard",
    description:
      "Post a security job on Help24 and get offers from guards near you. Day and night cover for homes, construction sites, shops and events. Agree the terms before anyone starts.",
    h1: "Hire a security guard",
    intro: [
      "Security posts on Help24 are usually one of three things: cover for a construction site while materials are on it, a night guard for a home or business, or guards for a single event.",
      "Be specific about hours and what the guard is actually there to do. A gate that has to be opened and closed for residents all night is a different job from watching an empty site.",
      "Private security in Kenya is regulated. The Private Security Regulatory Authority registers private security providers, and there are statutory requirements around guard wages. If you are engaging cover for anything ongoing, this is the category where it is worth asking questions up front.",
    ],
    tasks: [
      "Night guarding for a home or compound",
      "Construction site security while materials are on site",
      "Shop, warehouse and business premises cover",
      "Event security for a wedding, function or gathering",
      "Gate control and visitor screening",
      "Relief cover for a regular guard",
      "Escort for a valuable delivery or a cash run",
    ],
    detailsToInclude: [
      "Exact hours and days, and whether it is one night or ongoing",
      "What is being guarded, and whether it is occupied",
      "Whether there is a gate, a guard house, lighting and a toilet",
      "Whether the guard needs to control access or only observe and report",
      "Who they call if something happens",
    ],
    priceFactors: [
      "Hours, and whether they are night hours",
      "One-off cover against an ongoing arrangement",
      "Whether the site is occupied or empty",
      "Whether a uniform, torch, radio or dog is expected",
      "How remote the site is",
    ],
    checks: [
      "Ask whether the guard or their company is registered with the PSRA",
      "Check identification and take a copy before the first shift",
      "Be aware that Kenya sets statutory minimum wages for security guards; a quote far below the going rate is a warning, not a bargain",
      "Agree in writing what happens if a shift is missed, and who provides relief",
    ],
    related: ["driver", "general-labour", "construction", "event-planning"],
  },
  {
    slug: "driver",
    category: "Driver",
    icon: "driver",
    group: "Security & Transport",
    worker: "driver",
    workers: "drivers",
    local: true,
    alsoCalled: ["personal driver", "chauffeur", "dereva", "standby driver"],
    summary:
      "Personal drivers, airport runs, long-distance trips and standby cover.",
    title: "Drivers in Kenya — Hire a Driver",
    description:
      "Post a driving job on Help24 and get offers from drivers near you. Airport runs, long-distance trips, personal drivers and standby cover. Agree the terms before the trip.",
    h1: "Hire a driver",
    intro: [
      "Most driver posts on Help24 are for a specific trip: an airport run, a journey upcountry, a day of errands, or somebody to drive the family car while you are away.",
      "The first thing to settle is whose vehicle it is. A driver for your car and a driver with their own vehicle are two different services at two different prices, and it is worth saying which you need in the first line.",
      "For long trips, be explicit about who pays for fuel, tolls and the driver's overnight stay. That is the single most common source of a disagreement at the end of a journey.",
    ],
    tasks: [
      "Airport pick-ups and drop-offs",
      "Long-distance and upcountry trips",
      "A driver for your own car, by the day or the week",
      "Standby and relief driving cover",
      "School runs and regular scheduled trips",
      "Errands, deliveries and shopping runs",
      "Event and wedding driving",
      "Moving a vehicle from one town to another",
    ],
    detailsToInclude: [
      "Whose vehicle, and what type it is — saloon, SUV, pickup, manual or automatic",
      "Pick-up point, destination and times",
      "Whether it is one trip, a full day, or ongoing",
      "Who pays fuel, tolls, parking and any overnight stay",
      "Whether the driver needs to wait, and roughly how long",
    ],
    priceFactors: [
      "Distance and hours, including waiting time",
      "Whether the driver provides the vehicle",
      "Night driving and very early starts",
      "Overnight trips, which need accommodation",
      "Whether fuel is on your account or theirs",
    ],
    checks: [
      "See the driving licence before the trip and check it has not expired",
      "For a driver using your vehicle, confirm your insurance covers other drivers",
      "For anything carrying paying passengers, a PSV licence is the relevant one",
      "Agree the fuel and expenses arrangement in writing before setting off",
    ],
    related: ["delivery-rider", "moving-services", "mechanic", "security-guard"],
  },
  {
    slug: "delivery-rider",
    category: "Delivery Rider",
    icon: "delivery",
    group: "Security & Transport",
    worker: "delivery rider",
    workers: "delivery riders",
    local: true,
    alsoCalled: ["boda rider", "courier", "same day delivery", "dispatch rider"],
    summary:
      "Same-day deliveries, parcel runs, collections and regular dispatch for a small business.",
    title: "Delivery Riders in Kenya — Same-Day Delivery",
    description:
      "Post a delivery job on Help24 and get offers from riders near you. Same-day parcels, collections, document runs and regular dispatch for small businesses.",
    h1: "Find a delivery rider near you",
    intro: [
      "Delivery posts are usually urgent and usually simple: something needs to get from one side of town to the other today.",
      "Say what the item is, not just where it is going. Size and fragility decide whether it goes on a motorcycle at all, and a rider who arrives to find a 20kg box has wasted both your afternoons.",
      "For a small business, the more valuable post is the standing one — a rider available on certain days each week. That relationship is worth building with somebody who has already done a single run for you well.",
    ],
    tasks: [
      "Same-day parcel delivery across town",
      "Collecting something on your behalf",
      "Documents, keys and small urgent items",
      "Regular dispatch for a shop or small business",
      "Food and grocery runs",
      "Multi-stop delivery rounds",
      "Returning an item to a shop or supplier",
    ],
    detailsToInclude: [
      "What the item is, roughly how big and how heavy",
      "Pick-up and drop-off areas, and the time window",
      "Whether anything has to be paid for at collection",
      "Whether it is fragile, or needs to stay upright or cold",
      "Who the rider asks for at each end, and a phone number for both",
    ],
    priceFactors: [
      "Distance and the number of stops",
      "Size and weight, and whether a motorcycle can carry it at all",
      "How urgent it is",
      "Waiting time at either end",
      "Whether the rider has to pay for anything and be reimbursed",
    ],
    checks: [
      "Agree what happens if nobody is there to receive it",
      "For anything valuable, agree how it is handed over and who confirms receipt",
      "Give the rider a working phone number for the person at the other end",
    ],
    related: ["driver", "moving-services", "general-labour", "laundry"],
  },

  // ─────────────────────────────────── Automotive
  {
    slug: "mechanic",
    category: "Mechanic",
    icon: "mechanic",
    group: "Automotive",
    worker: "mechanic",
    workers: "mechanics",
    local: true,
    alsoCalled: ["fundi wa gari", "car repair", "auto electrician", "mobile mechanic"],
    summary:
      "Diagnostics, servicing, brakes, suspension, batteries and the car that will not start.",
    title: "Mechanics in Kenya — Car Repair and Servicing",
    description:
      "Post a car problem on Help24 and get offers from mechanics near you. Diagnostics, servicing, brakes, suspension, batteries and breakdowns. Agree the price before work starts.",
    h1: "Find a mechanic near you",
    intro: [
      "Car posts on Help24 come in two shapes: something has failed and you need it looked at, or a service is due and you want a price.",
      "For a fault, describe what the car is doing rather than what you think is broken. When it happens, what it sounds like, whether a warning light is on, whether it is worse cold or hot — those details are what a good mechanic diagnoses from, and they narrow a quote enormously.",
      "Say whether the car can be driven to a garage or whether somebody has to come to it. Mobile mechanics and workshop mechanics are different answers, and a car that will not start needs the first one.",
    ],
    tasks: [
      "A car that will not start, or keeps cutting out",
      "Routine service: oil, filters, plugs, fluids",
      "Brakes: pads, discs, handbrake, and the noises that precede them",
      "Suspension, shocks, bushes and steering",
      "Batteries, alternators, starters and auto-electrical faults",
      "Clutch, gearbox and transmission work",
      "Overheating and cooling system repairs",
      "Diagnostic scanning for warning lights",
      "Pre-purchase inspection before buying a used car",
      "Exhaust, tyres and wheel alignment",
    ],
    detailsToInclude: [
      "Make, model and year, and whether it is petrol, diesel or hybrid",
      "What the car is doing, when it does it, and any noise it makes",
      "Any warning lights that are on",
      "Whether the car can be driven, or is stuck where it is",
      "Where the car is — and whether there is room to work on it there",
    ],
    priceFactors: [
      "Diagnosis time, which for an intermittent fault can exceed the repair",
      "Parts, and whether you want genuine, aftermarket or used",
      "Whether the mechanic comes to you or you bring the car in",
      "How much has to come apart to reach the part that failed",
      "Towing, if the car cannot move",
    ],
    checks: [
      "Ask for the diagnosis and the quote before any parts are bought",
      "Say clearly whether you want genuine or aftermarket parts — the price gap is large",
      "Ask for the old parts back; it is the simplest way to confirm what was replaced",
      "For a pre-purchase inspection, use a mechanic with no connection to the seller",
    ],
    related: ["car-wash", "driver", "welding", "appliance-repair"],
  },
  {
    slug: "car-wash",
    category: "Car Wash",
    icon: "carwash",
    group: "Automotive",
    worker: "car wash",
    workers: "car wash services",
    local: true,
    alsoCalled: ["mobile car wash", "valeting", "interior detailing", "car cleaning"],
    summary:
      "Mobile washes, interior valeting, engine cleaning and detailing at home or work.",
    title: "Car Wash and Valeting Services in Kenya",
    description:
      "Post a car wash job on Help24 and get offers from mobile car wash and valeting services near you. Exterior washes, interior cleaning, detailing and fleet work.",
    h1: "Find a car wash near you",
    intro: [
      "The car wash posts that work best on Help24 are the mobile ones — somebody who comes to your compound or your office car park while the car is parked anyway.",
      "Interior work is where the price varies most. A wash is a wash; shampooing seats, cleaning a headliner, or getting a smell out of a car are separate jobs and should be asked for by name.",
      "For a fleet — a few company vehicles, or a matatu — say how many and where they will be. That is a standing arrangement, and it is quoted differently from a single car.",
    ],
    tasks: [
      "Mobile exterior wash at home or the office",
      "Interior vacuuming and wipe-down",
      "Seat and carpet shampooing",
      "Engine bay cleaning",
      "Polishing, waxing and paint detailing",
      "Headlight restoration",
      "Underbody and chassis washing",
      "Fleet and multi-vehicle washing",
    ],
    detailsToInclude: [
      "Vehicle type and size",
      "Whether you want exterior only, interior only, or both",
      "Whether there is a water point and power where the car is parked",
      "Any specific problem: mud, pet hair, a spill, a smell",
      "How many vehicles",
    ],
    priceFactors: [
      "Vehicle size",
      "Interior work, especially shampooing",
      "Whether water and power are available on site",
      "Polishing and detailing, which are time rather than product",
      "Number of vehicles",
    ],
    checks: [
      "If there is no water point, confirm they bring their own supply",
      "For shampooing, ask how long the car needs to dry before you use it",
      "Point out any loose trim or existing damage before they start",
    ],
    related: ["mechanic", "house-cleaning", "driver", "delivery-rider"],
  },

  // ───────────────────── Appliance & Tech Repair
  {
    slug: "appliance-repair",
    category: "Appliance Repair",
    icon: "appliance",
    group: "Appliance & Tech Repair",
    worker: "appliance technician",
    workers: "appliance technicians",
    local: true,
    alsoCalled: ["fridge repair", "washing machine repair", "cooker repair", "fundi wa friji"],
    summary:
      "Fridges, washing machines, cookers, microwaves, water heaters and the appliance that just stopped.",
    title: "Appliance Repair in Kenya — Fridges, Washers and Cookers",
    description:
      "Post an appliance repair on Help24 and get offers from technicians near you. Fridges, washing machines, cookers, microwaves and water heaters. Agree the price before work starts.",
    h1: "Find an appliance technician near you",
    intro: [
      "Appliance repair is worth posting before you assume something is finished. A fridge that has stopped cooling is frequently a relay, a fan or a thermostat rather than a compressor, and the difference between those two diagnoses is the difference between a repair and a replacement.",
      "Put the brand and model in the post. It is usually on a sticker inside the door, behind the drawer, or on the back panel. Technicians quote far more accurately when they know whether the part is one they can get today.",
      "Ask how a call-out fee is handled. Many technicians charge to come and diagnose, and most will set that against the repair if you go ahead — but that is a question for before they arrive, not after.",
    ],
    tasks: [
      "Fridges and freezers that have stopped cooling, or are icing up",
      "Washing machines that will not drain, spin, fill or finish a cycle",
      "Cookers, ovens and hobs — electric and gas",
      "Microwaves",
      "Water heaters and instant showers",
      "Dishwashers and tumble dryers",
      "Blenders, kettles and small kitchen appliances",
      "Appliance installation and connection",
    ],
    detailsToInclude: [
      "Brand, model and rough age",
      "Exactly what it does and does not do now",
      "Any error code on the display",
      "Any noise, smell or leak",
      "Whether it has been repaired before, and what was done",
    ],
    priceFactors: [
      "Whether the fault is diagnosed or still to be found",
      "The part itself, and whether it is available locally",
      "Whether a call-out fee applies and whether it is set against the repair",
      "Whether the appliance must be taken away to a workshop",
      "Gas work on a fridge or freezer, which is specialist",
    ],
    checks: [
      "Ask what the diagnosis is and what the part costs before you agree to a repair",
      "Ask whether the repair carries any warranty, and for how long",
      "If the appliance is still under manufacturer warranty, an independent repair will usually void it",
      "For gas cookers, ask about the gas connection specifically",
    ],
    related: ["ac-repair", "electrical", "plumbing", "computer-repair"],
  },
  {
    slug: "ac-repair",
    category: "AC Repair",
    icon: "ac",
    group: "Appliance & Tech Repair",
    worker: "AC technician",
    workers: "AC technicians",
    local: true,
    alsoCalled: ["air conditioning repair", "aircon service", "HVAC", "gas refill"],
    summary:
      "Air conditioner servicing, gas refills, installation and units that run but do not cool.",
    title: "Air Conditioning Repair and Servicing in Kenya",
    description:
      "Post an AC job on Help24 and get offers from air conditioning technicians near you. Servicing, gas refills, installation and units that stop cooling. Agree the price before work starts.",
    h1: "Find an AC technician near you",
    intro: [
      "An air conditioner that runs but does not cool is the most common post in this category, and it is rarely one thing. A blocked filter, a dirty outdoor coil, a failed capacitor and a genuine gas leak all present the same way from the inside.",
      "Be wary of a diagnosis of \"needs gas\" over the phone. A sealed system does not consume refrigerant; if it is low, it has leaked, and a refill without finding the leak buys a few months at most. A good technician will say that themselves.",
      "Servicing matters more here than in most categories. Coastal and lakeside installations in particular take a beating from salt and humidity, and an outdoor unit that is cleaned twice a year lasts substantially longer than one that is not.",
    ],
    tasks: [
      "Units that run but do not cool",
      "Routine servicing and coil cleaning",
      "Refrigerant leak detection and repair",
      "Gas top-ups after a leak has been fixed",
      "New split-unit supply and installation",
      "Relocating an existing unit",
      "Water dripping from an indoor unit",
      "Noisy or vibrating outdoor units",
      "Ducted and multi-room systems",
    ],
    detailsToInclude: [
      "Type of unit — split, window or portable — and the brand",
      "Roughly how old it is and when it was last serviced",
      "Whether it runs at all, and whether the outdoor unit is turning",
      "Whether it is cooling weakly or not at all",
      "Room size, for a new installation, and where the outdoor unit can go",
    ],
    priceFactors: [
      "Servicing against diagnosis and repair",
      "Whether refrigerant is needed and which type the system uses",
      "Working height and access to the outdoor unit",
      "For installation, the pipe run between indoor and outdoor units",
      "Whether electrical work is needed for the supply",
    ],
    checks: [
      "If you are told it needs gas, ask where the leak is",
      "Ask what a service includes — filters, indoor coil, outdoor coil, drain line",
      "For installation, confirm who does the electrical connection and the wall core drilling",
      "Ask about warranty on both the unit and the installation",
    ],
    related: ["appliance-repair", "electrical", "plumbing", "construction"],
  },
  {
    slug: "phone-repair",
    category: "Phone Repair",
    icon: "phone",
    group: "Appliance & Tech Repair",
    worker: "phone technician",
    workers: "phone technicians",
    local: true,
    alsoCalled: ["screen replacement", "mobile repair", "battery replacement", "fundi wa simu"],
    summary:
      "Cracked screens, batteries, charging ports, water damage and software problems.",
    title: "Phone Repair in Kenya — Screens, Batteries and Charging Ports",
    description:
      "Post a phone repair on Help24 and get offers from technicians near you. Cracked screens, batteries, charging ports, water damage and software faults.",
    h1: "Find a phone technician near you",
    intro: [
      "Screens and batteries are the bulk of this category, and both are jobs where the part matters more than the labour. An original screen, a good aftermarket one and a cheap copy are three different prices and three different results — brightness, touch response and how long it survives the next drop.",
      "Ask which is being quoted. A technician who tells you plainly that they are fitting an aftermarket screen and what that means is the one to use.",
      "For water damage, time is the thing. Do not charge it, do not switch it on repeatedly, and get it to somebody quickly — corrosion does the real damage in the days afterwards, not in the moment it went in.",
    ],
    tasks: [
      "Cracked and broken screen replacement",
      "Battery replacement",
      "Charging ports that have gone loose or stopped charging",
      "Water damage assessment and cleaning",
      "Cameras, speakers, microphones and buttons",
      "Software problems, boot loops and factory resets",
      "Data recovery from a phone that will not start",
      "Tablet repairs",
    ],
    detailsToInclude: [
      "Make and exact model",
      "What is wrong and how it happened",
      "Whether it powers on at all",
      "Whether you need original or aftermarket parts",
      "Whether there is data on it you need kept",
    ],
    priceFactors: [
      "The model — parts for current flagships cost considerably more",
      "Original against aftermarket parts",
      "Whether the fault is on the screen alone or the assembly beneath it",
      "Water damage, which is diagnosis-heavy and never certain",
      "Data recovery, which is priced separately",
    ],
    checks: [
      "Ask explicitly whether the part is original or aftermarket",
      "Ask what warranty the repair carries",
      "Back up anything you can before handing the phone over",
      "Sign out of accounts, or be present while the work is done, if the phone holds anything sensitive",
    ],
    related: ["computer-repair", "appliance-repair", "electrical", "software-development"],
  },
  {
    slug: "computer-repair",
    category: "Computer Repair",
    icon: "computer",
    group: "Appliance & Tech Repair",
    worker: "computer technician",
    workers: "computer technicians",
    local: false,
    alsoCalled: ["laptop repair", "PC repair", "IT support", "data recovery"],
    summary:
      "Laptops and desktops: slow machines, failed drives, screens, keyboards, viruses and setup.",
    title: "Computer and Laptop Repair in Kenya",
    description:
      "Post a computer problem on Help24 and get offers from technicians near you. Laptop screens, hard drives, slow machines, viruses, data recovery and setup.",
    h1: "Find a computer technician near you",
    intro: [
      "Most computer posts are one of four things: it is slow, it will not start, something is physically broken, or something has to be set up.",
      "Say which, and say what changed just before. A laptop that has been slow for a year and a laptop that became slow last Tuesday are usually different problems with different fixes.",
      "If there is data on the machine you cannot lose, put that in the first line. It changes the order a technician works in — and a repair that would have been routine becomes a recovery job that has to be handled carefully first.",
    ],
    tasks: [
      "Slow machines, and working out whether it is worth upgrading",
      "Laptops that will not power on or boot",
      "Screen, keyboard, hinge and charging port replacement",
      "Hard drive and SSD replacement, and upgrades",
      "Data recovery from a failed drive",
      "Virus and malware removal",
      "Operating system reinstall and setup",
      "RAM and storage upgrades",
      "Network, printer and office setup",
    ],
    detailsToInclude: [
      "Make, model and rough age",
      "What it does now, and what changed just before",
      "Any error message, word for word",
      "Whether there is data on it that must be kept",
      "Whether you need it back by a particular day",
    ],
    priceFactors: [
      "Diagnosis, particularly for a machine that will not start at all",
      "Parts, which for laptop screens and batteries are model-specific",
      "Data recovery, which is priced on its own and never guaranteed",
      "Whether the work is on site or the machine goes to a workshop",
      "Software reinstall and setting everything up again afterwards",
    ],
    checks: [
      "Back up first if the machine still starts — do not assume a repair preserves anything",
      "For data recovery, ask what happens to the price if nothing is recovered",
      "Ask about warranty on replacement parts",
      "Remove or note anything confidential before handing the machine over",
    ],
    related: ["phone-repair", "software-development", "graphic-design", "electrical"],
  },

  // ─────────────────────────── Creative & Digital
  {
    slug: "graphic-design",
    category: "Graphic Design",
    icon: "design",
    group: "Creative & Digital",
    worker: "graphic designer",
    workers: "graphic designers",
    local: false,
    alsoCalled: ["logo design", "branding", "flyer design", "artwork"],
    summary:
      "Logos, flyers, packaging, social media artwork and print-ready files.",
    title: "Graphic Designers in Kenya — Logos, Flyers and Branding",
    description:
      "Post a design job on Help24 and get offers from graphic designers near you. Logos, flyers, packaging, social media artwork and print-ready files.",
    h1: "Find a graphic designer",
    intro: [
      "Design jobs go wrong at the brief, not at the execution. A post that says \"I need a logo\" gets you quotes with wildly different numbers of revisions, deliverables and rights, all of which look the same until you are three rounds in.",
      "Say what it is for, what it has to work on, and how many rounds of changes you expect. Say if you need print-ready files, because a design that only exists as a small image cannot be printed and that is discovered at the printer.",
      "For anything that will be printed, agree the file formats up front: vector source files for a logo, and CMYK at print resolution for anything going to press.",
    ],
    tasks: [
      "Logo design and visual identity",
      "Business cards, letterheads and stationery",
      "Flyers, posters and banners",
      "Social media artwork and templates",
      "Product packaging and labels",
      "Menus, price lists and signage",
      "Presentation and pitch decks",
      "Book and report layout",
      "Redrawing an existing logo as a proper vector file",
    ],
    detailsToInclude: [
      "What the business does and who it is for",
      "Where the design will be used: print, screen, signage, or all three",
      "Exact sizes, if you already know them",
      "Examples of work you like, and work you do not",
      "The file formats you need at the end",
    ],
    priceFactors: [
      "Number of deliverables and the sizes they are needed in",
      "How many rounds of revisions are included",
      "Whether source files and full rights transfer to you",
      "Whether photography or illustration is needed as well",
      "Turnaround time",
    ],
    checks: [
      "Agree revisions and what counts as one before you start",
      "Agree in writing that the source files and the rights come to you at the end",
      "Ask for a portfolio of finished, published work",
      "For a logo, insist on vector files — not just a PNG",
    ],
    related: ["photography", "videography", "software-development", "event-planning"],
  },
  {
    slug: "software-development",
    category: "Software Development",
    icon: "code",
    group: "Creative & Digital",
    worker: "developer",
    workers: "developers",
    local: false,
    alsoCalled: ["web design", "app development", "website", "programmer"],
    summary:
      "Websites, web apps, mobile apps, integrations and fixing what somebody else built.",
    title: "Software Developers in Kenya — Websites and Apps",
    description:
      "Post a development job on Help24 and get offers from developers near you. Websites, web and mobile apps, integrations, M-Pesa payments and maintenance.",
    h1: "Find a developer",
    intro: [
      "Software posts need more detail than any other category, because the same sentence can describe a week of work or a year of it. \"I need an app\" is not a brief.",
      "Describe what the thing has to do, who uses it, and what already exists. If somebody has built part of it already, say so — inheriting a half-finished codebase is a real factor in a quote and developers will price the risk if you do not explain it.",
      "For anything taking payments in Kenya, say so explicitly. M-Pesa integration through Daraja is its own piece of work with its own approval process, and it is not something to leave as a detail at the end.",
    ],
    tasks: [
      "Business websites and landing pages",
      "E-commerce and online ordering",
      "Web applications and internal tools",
      "Android and iOS applications",
      "M-Pesa and payment gateway integration",
      "APIs and integrations between systems",
      "Fixing, finishing or taking over an existing project",
      "Hosting, deployment and domain setup",
      "Ongoing maintenance and support",
    ],
    detailsToInclude: [
      "What it has to do, in plain language, screen by screen if you can",
      "Who uses it and roughly how many people",
      "What already exists, and who built it",
      "Whether it needs to take payments, and how",
      "Your budget range and your deadline — both of them",
    ],
    priceFactors: [
      "Scope, which is almost entirely within your control at the brief stage",
      "Whether design is included or you are supplying it",
      "Integrations, especially payments and anything with an approval process",
      "Whether you need the source code and full ownership",
      "Ongoing hosting and maintenance, which is a running cost, not a one-off",
    ],
    checks: [
      "Agree that the source code and all accounts belong to you, in writing, before starting",
      "Break the work into stages with something to look at at the end of each",
      "Ask for links to things they have actually shipped",
      "Agree who holds the domain and hosting accounts — it should be you",
    ],
    related: ["graphic-design", "computer-repair", "videography", "photography"],
  },
  {
    slug: "photography",
    category: "Photography",
    icon: "photography",
    group: "Creative & Digital",
    worker: "photographer",
    workers: "photographers",
    local: false,
    alsoCalled: ["event photographer", "wedding photographer", "product photography", "portraits"],
    summary:
      "Events, weddings, portraits, products and property photography.",
    title: "Photographers in Kenya — Events, Portraits and Products",
    description:
      "Post a photography job on Help24 and get offers from photographers near you. Weddings, events, portraits, product and property photography.",
    h1: "Find a photographer near you",
    intro: [
      "Photography quotes vary on two things people forget to ask about: hours of coverage, and what you actually receive afterwards.",
      "Edited images take far longer than the shoot. A photographer quoting a day's coverage with 40 edited images and one quoting the same day with 400 unedited files are doing different amounts of work, and the second is not the bargain it looks like.",
      "Say what the pictures are for. Product shots for a website, portraits for a profile, and coverage of a wedding need different equipment, different lighting and, quite often, different photographers.",
    ],
    tasks: [
      "Weddings and traditional ceremonies",
      "Corporate events, conferences and launches",
      "Portraits, headshots and profile pictures",
      "Product photography for online selling",
      "Property and interior photography",
      "Family, maternity and newborn sessions",
      "Graduations and school events",
      "Food photography for menus",
      "Drone and aerial photography",
    ],
    detailsToInclude: [
      "Date, time, venue and how many hours of coverage you need",
      "What the images are for",
      "Roughly how many final edited images you expect",
      "Whether you need prints, an album, or digital files only",
      "Whether a second photographer or specific equipment is needed",
    ],
    priceFactors: [
      "Hours of coverage",
      "Number of edited images delivered, and how quickly",
      "Travel to the venue, and whether it is out of town",
      "Prints, albums and framing",
      "A second shooter, lighting, or drone work",
    ],
    checks: [
      "Ask to see a full gallery from one event, not a highlights reel from twenty",
      "Agree the delivery date for edited images in writing",
      "Agree how the images may be used by both sides",
      "For a wedding or any one-off, ask what their backup plan is if they fall ill",
    ],
    related: ["videography", "event-planning", "graphic-design", "catering"],
  },
  {
    slug: "videography",
    category: "Videography",
    icon: "videography",
    group: "Creative & Digital",
    worker: "videographer",
    workers: "videographers",
    local: false,
    alsoCalled: ["video production", "wedding video", "content creation", "video editing"],
    summary:
      "Event coverage, adverts, social content, corporate video and editing.",
    title: "Videographers in Kenya — Events, Adverts and Content",
    description:
      "Post a video job on Help24 and get offers from videographers near you. Event coverage, adverts, social media content, corporate video and editing.",
    h1: "Find a videographer near you",
    intro: [
      "Filming is the short part of a video job. Editing is the long one, and it is where the difference between quotes usually lives.",
      "Say what the finished thing should be: how long, where it will be posted, whether it needs subtitles, graphics, music, or a voiceover. A 60-second advert and 20 minutes of ceremony coverage are not comparable jobs even if both took a day to shoot.",
      "If you only need editing — you have the footage already — say so in the first line. It is a completely different service and different people answer.",
    ],
    tasks: [
      "Wedding and ceremony films",
      "Corporate videos and company profiles",
      "Adverts and promotional films",
      "Social media content and short-form video",
      "Event and conference coverage",
      "Music videos",
      "Editing footage you already have",
      "Drone and aerial filming",
      "Livestreaming an event",
    ],
    detailsToInclude: [
      "Date, location and hours of filming",
      "How long the finished video should be, and where it will be published",
      "Whether you need graphics, subtitles, music or a voiceover",
      "Whether you need raw footage as well as the edit",
      "How many rounds of edit changes you expect",
    ],
    priceFactors: [
      "Filming hours, and how many people and cameras are needed",
      "Edit length and complexity, which usually dominate",
      "Graphics, subtitles, colour grading and licensed music",
      "Drone work and specialist equipment",
      "Turnaround, and how many revisions are included",
    ],
    checks: [
      "Watch a full finished video, not a showreel of the best three seconds of each",
      "Agree revisions and the delivery date before starting",
      "Agree whether you receive the raw footage and the project files",
      "For licensed music, confirm it is actually licensed for how you will use it",
    ],
    related: ["photography", "event-planning", "graphic-design", "software-development"],
  },

  // ────────────────────── Events & Hospitality
  {
    slug: "event-planning",
    category: "Event Planning",
    icon: "events",
    group: "Events & Hospitality",
    worker: "event planner",
    workers: "event planners",
    local: false,
    alsoCalled: ["wedding planner", "event coordinator", "decor", "MC"],
    summary:
      "Weddings, parties, corporate functions, decor, coordination and suppliers.",
    title: "Event Planners in Kenya — Weddings and Functions",
    description:
      "Post an event on Help24 and get offers from planners near you. Weddings, parties, corporate functions, decor, coordination and supplier management.",
    h1: "Find an event planner",
    intro: [
      "Event planning covers everything from somebody who runs the whole thing for six months to somebody who coordinates on the day so you are not the one chasing the chairs.",
      "Say which you want, because they are priced completely differently. Full planning, partial planning and day-of coordination are three distinct services.",
      "Give the date, the guest count and the venue status even if the venue is not booked. Whether the venue is settled is the single biggest factor in what a planner can actually do for you.",
    ],
    tasks: [
      "Full wedding planning",
      "Day-of coordination",
      "Corporate events, launches and conferences",
      "Birthday parties and family celebrations",
      "Decor, staging and floral arrangements",
      "Tents, chairs, tables and equipment hire",
      "Supplier sourcing and management",
      "Venue sourcing",
      "Sound, lighting and MC services",
    ],
    detailsToInclude: [
      "Date, guest count and venue — or that the venue is not booked yet",
      "Whether you need full planning, partial planning, or day-of coordination",
      "Your budget range, which planners need in order to be useful",
      "What is already booked",
      "The style or feel you want, with pictures if you have them",
    ],
    priceFactors: [
      "Guest numbers",
      "Level of service, from coordination to full planning",
      "Decor, which is usually the largest single line",
      "Whether hire items come through the planner or direct",
      "Whether the venue is local or needs travel and accommodation",
    ],
    checks: [
      "Be clear about which costs are the planner's fee and which are passed-through supplier costs",
      "Ask for references from two events in the last year",
      "Agree what happens if the date moves",
      "Keep deposits to suppliers documented — all of them",
    ],
    related: ["catering", "photography", "videography", "security-guard"],
  },
  {
    slug: "catering",
    category: "Catering",
    icon: "catering",
    group: "Events & Hospitality",
    worker: "caterer",
    workers: "caterers",
    local: false,
    alsoCalled: ["outside catering", "event food", "private chef", "bites"],
    summary:
      "Outside catering, private chefs, event menus, service staff and equipment.",
    title: "Catering Services in Kenya — Outside Catering and Private Chefs",
    description:
      "Post a catering job on Help24 and get offers from caterers near you. Outside catering, event menus, private chefs, service staff and equipment.",
    h1: "Find a caterer near you",
    intro: [
      "Catering quotes are built on headcount, menu and what else is included. Two caterers quoting the same price per head can be offering very different things once serving staff, crockery, chafing dishes, tents and a service captain are counted.",
      "Ask for the quote broken down. It is the only way to compare like with like, and a caterer who will not break it down is telling you something.",
      "Say if anybody has dietary requirements, and say it early. It affects the menu design, not just a plate on the day.",
    ],
    tasks: [
      "Outside catering for weddings and functions",
      "Corporate lunches, conferences and meetings",
      "Private chefs for a dinner at home",
      "Bites, canapés and cocktail service",
      "Nyama choma and grill service",
      "Breakfast and tea service",
      "Cakes and desserts",
      "Service staff, waiters and bar staff",
      "Crockery, cutlery and equipment hire",
    ],
    detailsToInclude: [
      "Date, time, venue and guest count",
      "The kind of menu you want, and any dishes that must be on it",
      "Dietary requirements, allergies and any religious requirements",
      "Whether serving staff, crockery and equipment are needed",
      "Whether there is a kitchen, power and water at the venue",
    ],
    priceFactors: [
      "Guest count and the menu itself",
      "Serving staff and how many are needed",
      "Crockery, cutlery, chafing dishes and hire equipment",
      "Whether the venue has a kitchen, or everything must be brought",
      "Distance to the venue",
    ],
    checks: [
      "Ask for the quote itemised: food, staff, equipment, transport",
      "Ask about food handler certificates and county health requirements for the staff attending",
      "Arrange a tasting for anything large enough to justify one",
      "Agree the final headcount deadline and what happens if numbers change",
    ],
    related: ["event-planning", "photography", "house-cleaning", "general-labour"],
  },

  // ────────────────────────── Education & Care
  {
    slug: "tutoring",
    category: "Tutoring",
    icon: "tutoring",
    group: "Education & Care",
    worker: "tutor",
    workers: "tutors",
    local: false,
    alsoCalled: ["home tuition", "private teacher", "CBC tutor", "exam prep"],
    summary:
      "Home and online tuition across CBC, 8-4-4, IGCSE, university subjects and skills.",
    title: "Private Tutors in Kenya — Home and Online Tuition",
    description:
      "Post a tutoring request on Help24 and get offers from tutors near you. CBC, 8-4-4, IGCSE, university subjects, languages and exam preparation.",
    h1: "Find a tutor near you",
    intro: [
      "The most useful tutoring posts name the curriculum, the grade and the specific problem. \"Maths help\" attracts everyone; \"Grade 7 CBC, struggling with fractions and losing confidence\" attracts the right person.",
      "Kenya runs several curricula side by side, and they are not interchangeable. Say whether it is CBC, 8-4-4, IGCSE, IB or a university course, because a tutor strong in one may not know the other's syllabus or how it is assessed.",
      "Say whether you want the tutor at your home or online. Online opens up tutors anywhere in the country, which matters a great deal for specialist subjects.",
    ],
    tasks: [
      "Primary and CBC subject support",
      "Secondary subjects and KCSE preparation",
      "IGCSE, A-level and IB tuition",
      "University coursework and revision",
      "Mathematics and sciences",
      "English, Kiswahili and languages",
      "Computer skills and coding for children",
      "Music, instruments and voice",
      "Adult learning and professional exams",
    ],
    detailsToInclude: [
      "Curriculum, grade or year, and the subject",
      "What specifically is difficult, and what the school has said",
      "How many sessions a week, and how long each one should be",
      "At home or online",
      "Whether there is an exam date to work towards",
    ],
    priceFactors: [
      "Level — university and exam-year tuition costs more than primary support",
      "Session length and how many a week",
      "Travel to your home, against online",
      "One-to-one against a small group",
      "Specialist subjects where few tutors are available",
    ],
    checks: [
      "Ask about qualifications and experience with that specific curriculum",
      "For a tutor coming to your home to teach a child, check identification and be present for the first sessions",
      "Agree a trial period — a few sessions before committing to a term",
      "Ask how they will report progress to you",
    ],
    related: ["babysitting", "caregiving", "computer-repair", "software-development"],
  },
  {
    slug: "babysitting",
    category: "Babysitting",
    icon: "babysitting",
    group: "Education & Care",
    worker: "babysitter",
    workers: "babysitters",
    local: false,
    alsoCalled: ["nanny", "childminder", "house help", "child care"],
    summary:
      "Occasional sitting, school holiday cover, evening care and regular childcare help.",
    title: "Babysitters and Nannies in Kenya",
    description:
      "Post a childcare request on Help24 and get offers from babysitters near you. Evening sitting, school holiday cover, regular care and emergency help.",
    h1: "Find a babysitter near you",
    intro: [
      "This is the category where the checks matter more than the price, and it is worth saying so plainly: you are inviting somebody into your home to look after your children.",
      "Meet them before the first booking. Ask for identification, take a copy, and ask for references from families they have actually worked for — then call those families. A good sitter expects all of this and will not be offended by it.",
      "In the post, give ages and numbers of children, the hours, and anything a sitter genuinely needs to know: allergies, medication, a routine that matters, or a child who does not settle easily.",
    ],
    tasks: [
      "Evening and occasional babysitting",
      "School holiday cover",
      "Regular weekday childcare",
      "After-school pick-up and supervision",
      "Care for a child who is unwell and home from school",
      "Newborn and infant care support",
      "Help with homework and routines",
      "Care during an event at home",
    ],
    detailsToInclude: [
      "Ages and number of children",
      "Exact days and hours, and whether it is one-off or ongoing",
      "Allergies, medication and anything about the routine that matters",
      "What you expect beyond supervision — meals, homework, bath, bedtime",
      "Whether your home has pets",
    ],
    priceFactors: [
      "Hours, and whether they are evening or overnight",
      "Number and ages of the children",
      "One-off against regular work",
      "Anything beyond supervision — cooking, school runs, housework",
      "How far they travel, particularly late at night",
    ],
    checks: [
      "Meet first, at your home, before any booking",
      "Ask for identification and keep a copy",
      "Ask for references from previous families, and actually call them",
      "Start with a short booking while you are nearby",
      "Leave written emergency contacts and make sure they have a charged phone",
    ],
    related: ["caregiving", "tutoring", "house-cleaning", "laundry"],
  },
  {
    slug: "caregiving",
    category: "Caregiving",
    icon: "caregiving",
    group: "Education & Care",
    worker: "caregiver",
    workers: "caregivers",
    local: false,
    alsoCalled: ["home nurse", "elderly care", "patient care", "home based care"],
    summary:
      "Home care for elderly relatives, recovery after hospital, and support for people living with illness.",
    title: "Home Caregivers in Kenya — Elderly and Patient Care",
    description:
      "Post a caregiving request on Help24 and get offers from caregivers near you. Elderly care, post-hospital recovery, live-in support and respite cover.",
    h1: "Find a caregiver near you",
    intro: [
      "Caregiving posts need to be honest about the level of care required, because it determines who is qualified to answer. Companionship and help around the house is one thing; wound care, catheters, injections, oxygen or a patient who cannot move unaided is clinical work.",
      "If any nursing task is involved, say so and ask for the caregiver's training and registration. A trained nurse or a certified community health worker is a different professional from a companion carer, and the difference is not something to discover during a crisis.",
      "Be clear about hours, and whether it is live-in. Live-in care raises real questions about accommodation, rest days and time off that are much better settled at the start.",
    ],
    tasks: [
      "Daily support for an elderly relative at home",
      "Care after a hospital discharge or an operation",
      "Live-in care",
      "Respite cover so a family carer can rest",
      "Support with mobility, washing, dressing and meals",
      "Medication reminders and appointment escorts",
      "Companionship for somebody living alone",
      "Palliative and end-of-life support at home",
      "Care for a person living with a long-term condition",
    ],
    detailsToInclude: [
      "What help is needed, day to day, in practical terms",
      "Any medical or nursing tasks involved",
      "Mobility — can the person walk, transfer, or neither",
      "Hours, days, and whether it is live-in",
      "Any language the caregiver needs to speak with the person being cared for",
    ],
    priceFactors: [
      "Level of care, particularly whether nursing tasks are involved",
      "Hours, and whether nights are included",
      "Live-in against daily visits",
      "The caregiver's training and qualifications",
      "How physically demanding the care is",
    ],
    checks: [
      "For any nursing task, ask for training and registration and verify it",
      "Ask for references from previous families and call them",
      "Check identification and keep a copy",
      "Start with a short trial period while family are around",
      "Write down the routine, the medication and the emergency contacts, and keep it where the caregiver can see it",
    ],
    related: ["babysitting", "house-cleaning", "tutoring", "driver"],
  },

  // ─────────────────── Moving & Construction
  {
    slug: "moving-services",
    category: "Moving Services",
    icon: "moving",
    group: "Moving & Construction",
    worker: "mover",
    workers: "movers",
    local: true,
    alsoCalled: ["house moving", "relocation", "pickup hire", "removals"],
    summary:
      "House and office moves, single items, packing, loading and pickup or lorry hire.",
    title: "Movers in Kenya — House and Office Moving Services",
    description:
      "Post a moving job on Help24 and get offers from movers near you. House and office moves, single heavy items, packing, loading and vehicle hire.",
    h1: "Find movers near you",
    intro: [
      "Moving quotes turn on three things: how much there is, how far it is going, and how many stairs are at each end. Movers ask about stairs because it is often the largest single factor in how long a move takes.",
      "List the big items — beds, sofas, fridge, cooker, washing machine, wardrobe — and roughly how many boxes. A three-bedroom house with barely any furniture and a one-bedroom flat packed to the ceiling can be the same load.",
      "Say whether you want packing included. Packing is usually a separate service, and it is the one people underestimate most.",
    ],
    tasks: [
      "Full house moves",
      "Single room and bedsitter moves",
      "Office and business relocations",
      "One heavy item: a fridge, a sofa, a piano",
      "Packing services and materials",
      "Loading and offloading only, where you have the vehicle",
      "Pickup and lorry hire with a driver",
      "Moving between towns",
      "Short-term storage between moves",
    ],
    detailsToInclude: [
      "Where you are moving from and to",
      "The floor at each end, and whether there is a working lift",
      "A list of the big items and a rough box count",
      "The date, and whether it can shift by a day",
      "Whether you need packing, or only moving",
    ],
    priceFactors: [
      "Volume, and the vehicle size it needs",
      "Distance, particularly between towns",
      "Stairs and the floor at both ends",
      "Packing, and whether materials are included",
      "How many people are needed to load and carry",
    ],
    checks: [
      "Agree what happens if something is damaged, before the van is loaded",
      "Photograph anything valuable or already marked before it goes on",
      "Confirm the vehicle can actually reach both addresses and park",
      "Confirm whether the price is a fixed job price or by the hour",
    ],
    related: ["house-cleaning", "general-labour", "driver", "carpentry"],
  },
  {
    slug: "interior-design",
    category: "Interior Design",
    icon: "interior",
    group: "Moving & Construction",
    worker: "interior designer",
    workers: "interior designers",
    local: false,
    alsoCalled: ["home styling", "space planning", "fit out", "decor"],
    summary:
      "Space planning, finishes, furniture layout and managing a fit-out from drawing to done.",
    title: "Interior Designers in Kenya — Homes and Offices",
    description:
      "Post an interior design job on Help24 and get offers from designers near you. Space planning, finishes, furniture, curtains and complete fit-outs.",
    h1: "Find an interior designer",
    intro: [
      "Interior design on Help24 spans advice and execution. Some posts want a plan and a shopping list; others want somebody to take a bare apartment and hand it back finished.",
      "Say which, and say your budget honestly. A designer's first real job is to make the budget and the wish list meet, and they cannot do that if the budget is a secret.",
      "For a fit-out, be clear about who is managing the fundis. A designer who draws and a designer who runs the site are two different engagements with two different prices.",
    ],
    tasks: [
      "Space planning and layout for a room or a whole home",
      "Choosing finishes: floors, tiles, paint, fittings",
      "Furniture selection and sourcing",
      "Curtains, blinds and soft furnishings",
      "Lighting design",
      "Kitchen and bathroom design",
      "Office and retail fit-outs",
      "Styling a property for rent or sale",
      "Managing fundis through a fit-out",
    ],
    detailsToInclude: [
      "Which rooms, and their rough dimensions",
      "Photos of the space as it is now",
      "Your budget range for the whole project",
      "Whether you want design only, or design and management",
      "What must stay — furniture you are keeping, or a fitting you cannot change",
    ],
    priceFactors: [
      "Design only against design and project management",
      "Number of rooms and the level of finish",
      "Whether furniture and materials are procured through the designer",
      "Whether drawings are needed for fundis to work from",
      "How long the site management runs",
    ],
    checks: [
      "Establish whether the fee is fixed, a percentage, or hourly, and what it covers",
      "Agree whether any supplier commission comes back to you or the designer",
      "Ask to see completed projects, photographed on handover",
      "Agree who is responsible when a fundi's work has to be redone",
    ],
    related: ["carpentry", "painting", "construction", "graphic-design"],
  },
  {
    slug: "construction",
    category: "Construction",
    icon: "construction",
    group: "Moving & Construction",
    worker: "contractor",
    workers: "contractors",
    local: true,
    alsoCalled: ["builder", "renovation", "extension", "fundi wa ujenzi"],
    summary:
      "Extensions, renovations, roofing, new builds and the trades that have to be run together.",
    title: "Building Contractors in Kenya — Renovations and Extensions",
    description:
      "Post a building job on Help24 and get offers from contractors near you. Renovations, extensions, roofing, and projects that need several trades coordinated.",
    h1: "Find a building contractor",
    intro: [
      "Construction is the category where the stakes are highest and the checks matter most. A bathroom renovation runs several trades in sequence, and the value a contractor adds over hiring each fundi yourself is the sequencing — and the accountability when one stage is wrong.",
      "Contractors undertaking construction works in Kenya are required to register with the National Construction Authority, in classes tied to the value of work they may undertake. For anything structural, ask for the NCA registration and check the class covers your project.",
      "Get the scope written down before anybody starts. Not a price — a scope: what is included, what is excluded, what happens to the debris, and who buys materials. Nearly every construction dispute traces back to that document not existing.",
    ],
    tasks: [
      "Home extensions and additional rooms",
      "Full renovations and refurbishments",
      "Kitchen and bathroom renovations",
      "Roofing: new roofs, re-roofing and leak repairs",
      "New builds on a plot you own",
      "Boundary walls, gates and external works",
      "Structural repairs to cracks and settlement",
      "Waterproofing and damp-proofing",
      "Shop and office fit-outs",
      "Demolition and site clearance",
    ],
    detailsToInclude: [
      "What you want done, room by room or element by element",
      "Photos and any drawings or approvals you already have",
      "Whether you have county approvals, if the work needs them",
      "Whether materials are on your account or theirs",
      "Your timeframe, and whether you will be living there during the work",
    ],
    priceFactors: [
      "Scale, and how many trades have to be coordinated",
      "Materials, and who is buying them",
      "Whether structural work or engineering input is involved",
      "Site access and whether a lorry can reach it",
      "County approvals, where they are needed",
    ],
    checks: [
      "Ask for the NCA registration number and confirm the class covers the value of your project",
      "For structural work, get a qualified engineer's design — not a contractor's opinion",
      "Confirm what county approvals your project needs before it starts",
      "Agree a written scope and a payment schedule tied to stages, never a large payment up front",
      "Agree who removes debris, and whether that is in the price",
    ],
    related: ["masonry", "electrical", "plumbing", "welding"],
  },
  {
    slug: "general-labour",
    category: "General Labour",
    icon: "labour",
    group: "Moving & Construction",
    worker: "labourer",
    workers: "labourers",
    local: true,
    alsoCalled: ["casual labour", "manual work", "mkono", "helper"],
    summary:
      "Loading, digging, clearing, carrying and the jobs that need hands rather than a trade.",
    title: "Casual Labour in Kenya — Hire Help by the Day",
    description:
      "Post a labouring job on Help24 and get offers from workers near you. Loading, digging, clearing, carrying and general manual work, by the day or the job.",
    h1: "Find casual labour near you",
    intro: [
      "This is the category for work that needs hands and effort rather than a particular trade: clearing a compound, offloading a delivery, digging a trench, carrying furniture up four floors, breaking out old concrete.",
      "Say how many people you need and for how long. \"Two people for half a day\" is a post somebody can price immediately; \"some help moving stuff\" is not.",
      "Be specific about the physical work. Manual labour quotes are honest quotes when everybody knows what is actually involved, and a nasty surprise on arrival helps nobody.",
    ],
    tasks: [
      "Loading and offloading deliveries",
      "Clearing a compound, a plot or a store",
      "Digging trenches, pits and foundations by hand",
      "Carrying furniture, materials or stock",
      "Breaking out old concrete, tiles or plaster",
      "Site clean-up after building work",
      "Moving rubble and debris",
      "Helping a fundi as an assistant",
      "Stock moves and warehouse work",
    ],
    detailsToInclude: [
      "How many people, and for how long",
      "What the work physically involves",
      "Whether tools are provided or they should bring their own",
      "Where it is, and how they get there",
      "Start time, and whether it is one day or several",
    ],
    priceFactors: [
      "Number of people and days",
      "How heavy and how demanding the work is",
      "Whether tools are provided",
      "How far they travel",
      "Whether the work is urgent or can wait for a convenient day",
    ],
    checks: [
      "Agree the hours a day covers before the day starts",
      "Provide water and somewhere to rest — and expect to",
      "Make sure anybody digging or breaking concrete has proper footwear and gloves",
      "Agree what happens if the work runs past the day",
    ],
    related: ["moving-services", "masonry", "construction", "gardening"],
  },
];

/**
 * "a plumber", but "an electrician".
 *
 * This exists because the naive template produced "Find a AC technician Near
 * You" as a page title, and "What to check with a appliance technician" as a
 * heading — on the pages whose entire job is to look like somebody competent
 * wrote them. Vowel-initial worker names are a fifth of the catalogue, so this
 * was not an edge case.
 *
 * Letter-based rather than phonetic: every worker name in this catalogue is
 * regular, and a pronunciation table would be a lot of machinery for a set of
 * thirty strings that a test already checks.
 */
export function withArticle(word: string): string {
  return `${/^[aeiou]/i.test(word) ? "an" : "a"} ${word}`;
}

/**
 * Title case for a worker name, leaving existing capitals alone so "AC
 * technician" becomes "AC Technician" rather than "Ac Technician".
 */
export function titleCaseWorker(word: string): string {
  return word
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/** Map for fast lookups by URL segment. */
const BY_SLUG = new Map(SERVICES.map((s) => [s.slug, s]));

export function serviceBySlug(slug: string): Service | undefined {
  return BY_SLUG.get(slug);
}

/** Services eligible for a city tier at all. Necessary, not sufficient. */
export const LOCAL_SERVICES = SERVICES.filter((s) => s.local);

/** The app's own grouping, in first-appearance order. */
export function servicesByGroup(): { name: string; items: Service[] }[] {
  return SERVICES.reduce<{ name: string; items: Service[] }[]>((acc, s) => {
    const group = acc.find((g) => g.name === s.group);
    if (group) group.items.push(s);
    else acc.push({ name: s.group, items: [s] });
    return acc;
  }, []);
}
