/**
 * Editorial guides.
 *
 * THE TEST EVERY GUIDE HAD TO PASS. Does Help24 actually know this? Not "could
 * we write 800 words about it" — every site can write 800 words about anything,
 * and Google's helpful content guidance is largely about telling those apart.
 * The three below are things this company genuinely has a position on: how a
 * job request turns into usable offers, what the Kenyan trade credentials
 * actually are, and what has to be agreed before a fundi starts.
 *
 * WHAT WAS REJECTED, AND WHY IT MATTERS. The obvious content play for a
 * services marketplace is pricing — "how much does it cost to rewire a house in
 * Kenya", repeated thirty times. Those pages rank. Help24 cannot write them
 * honestly: two reviews and no completed-job price data in production means
 * every figure would be invented, and an invented price is worse than no page
 * because somebody budgets against it. That content unlocks when the
 * marketplace has real transaction history, and not before.
 *
 * Authorship is the organisation, not an invented person. Google's guidance on
 * self-assessing content quality asks who wrote it; "the Help24 team" is a true
 * answer, and a fabricated byline with a fabricated headshot is the exact
 * pattern its spam policies describe.
 */

export interface GuideSection {
  heading: string;
  paragraphs: string[];
  /** Optional list under the paragraphs. */
  list?: string[];
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  h1: string;
  /** One line under the h1. */
  standfirst: string;
  /** ISO date. Real — the day the guide was written. */
  published: string;
  modified: string;
  /** Roughly how long it takes to read, for the reader not for a snippet. */
  minutes: number;
  sections: GuideSection[];
  /** Service slugs this guide is genuinely about. Drives internal links. */
  relatedServices: string[];
}

export const GUIDES: Guide[] = [
  {
    slug: "writing-a-job-request",
    title: "How to Write a Job Request That Gets Good Offers",
    description:
      "The difference between a job post that gets three useful quotes and one that gets silence is usually four or five sentences. What to include, and why photos beat adjectives.",
    h1: "How to write a job request that gets good offers",
    standfirst:
      "The difference between a post that gets three usable quotes and one that gets nothing is usually four or five sentences.",
    published: "2026-09-12",
    modified: "2026-09-12",
    minutes: 6,
    relatedServices: ["plumbing", "electrical", "house-cleaning", "moving-services"],
    sections: [
      {
        heading: "Describe the symptom, not the fix",
        paragraphs: [
          "The most common mistake in a job request is skipping ahead to the solution. \"I need a new tap\" is a decision; \"the kitchen mixer drips constantly and the handle has gone stiff\" is information. The second gets you a provider who can tell you whether it needs a cartridge or a replacement, and price accordingly.",
          "This matters most in the diagnostic trades. An electrician reading \"the kitchen sockets die when the kettle goes on\" already has a shortlist of causes before they arrive. An electrician reading \"I need a socket fixed\" is quoting blind, and will either pad the price to cover the unknown or re-quote on arrival.",
        ],
      },
      {
        heading: "Photographs beat descriptions, almost always",
        paragraphs: [
          "One photo does more for the accuracy of an offer than a paragraph of careful writing. It settles the model, the fitting, the access, the state of the surrounding surfaces and the scale of the job all at once.",
          "Take two if you can: one close enough to show the thing, and one far enough back to show what surrounds it. The wide shot is the one people forget, and it is the one that tells a provider whether they can reach the work.",
          "For anything with a brand on it — an appliance, an air conditioner, a phone — photograph the model sticker. It is usually inside the door, behind the drawer, or on the back.",
        ],
      },
      {
        heading: "Say where you are, precisely",
        paragraphs: [
          "Help24 posts a job to a neighbourhood rather than a city, and that is deliberate. A provider who takes a job two hours away across Nairobi traffic is a provider who arrives late, leaves early, or does not come at all.",
          "In Mombasa this is sharper still, because the water divides the city. A job in Likoni and a fundi in Bamburi are separated by the ferry, and neither of you wants to discover that on the day.",
        ],
      },
      {
        heading: "Put the constraints in the post, not in the conversation",
        paragraphs: [
          "Anything that limits when or how the work can happen belongs in the original post. Providers price around constraints; they do not price around surprises.",
        ],
        list: [
          "The floor you are on, and whether there is a working lift",
          "Estate or building rules — gate sign-in, restricted working hours, a lift that must be booked",
          "Whether you rent, and whether a landlord has to approve the work",
          "Whether there is power and water on site",
          "Days or times that genuinely do not work for you",
        ],
      },
      {
        heading: "Be honest about urgency",
        paragraphs: [
          "Marking everything urgent costs you money and credibility. Urgency is a real price factor — somebody dropping their evening to come out is charging for their evening — and a request marked urgent that then waits three days for a reply teaches providers not to believe the label.",
          "Post the genuinely urgent things as urgent: water running that you cannot stop, no power, a door that will not lock, a car stranded somewhere it cannot stay. Everything else is better posted as flexible, where you will usually get a better price for waiting a day.",
        ],
      },
      {
        heading: "Say who is buying the materials",
        paragraphs: [
          "This is the single most common source of disagreement after a job is done, and it takes one sentence to prevent. Either the provider buys the parts and includes them in the quote, or you buy them and they quote labour only. Both are normal.",
          "If you already have the tap, the paint, the tiles or the part, say so in the post. It changes the number and it changes who answers.",
        ],
      },
      {
        heading: "What not to put in",
        paragraphs: [
          "Leave out your exact house number, your gate code and anything else that identifies your home precisely — the neighbourhood is enough for people to decide whether they can take the job, and the detail can go to the person you actually choose.",
          "Leave out your phone number too. Messaging runs through Help24 until you have agreed a job, which is what keeps a record of what was agreed if anything later goes wrong.",
        ],
      },
      {
        heading: "A worked example",
        paragraphs: [
          "Weak: \"Need a plumber urgently.\"",
          "Better: \"Kitchen sink in a ground-floor flat in Bamburi is not draining — water sits in the basin and drains very slowly over about an hour. Nothing under the sink is leaking. Photo attached of the trap. Mains water, flat is occupied, any time this week works. Happy for you to buy whatever parts are needed.\"",
          "The second one takes forty seconds longer to write and is the difference between guesses and quotes.",
        ],
      },
    ],
  },
  {
    slug: "checking-a-provider",
    title: "Checking a Fundi Before You Hire: Licences and References in Kenya",
    description:
      "Which Kenyan trade credentials actually exist and which are legally required. EPRA, NCA, PSRA and NITA explained, plus the reference checks that matter more than any certificate.",
    h1: "Checking a fundi before you hire",
    standfirst:
      "Which Kenyan trade credentials actually exist, which are legally required, and what to ask when none of them apply.",
    published: "2026-09-12",
    modified: "2026-09-12",
    minutes: 8,
    relatedServices: ["electrical", "construction", "security-guard", "caregiving"],
    sections: [
      {
        heading: "Most trades in Kenya are not licensed, and that is not a scandal",
        paragraphs: [
          "There is no register of plumbers, painters, carpenters, cleaners or mechanics in Kenya, and no licence any of them are required to hold to work in your home. That is also true in most countries for most trades.",
          "What that means practically is that for the majority of jobs, a certificate is not the check that protects you. References, a clear scope, an agreed price and a payment that is not handed over in advance do far more work than any document.",
          "A few trades are genuinely regulated, and for those the check is worth making properly. They are the ones below.",
        ],
      },
      {
        heading: "Electrical work: EPRA",
        paragraphs: [
          "The Energy and Petroleum Regulatory Authority licenses electrical workers and electrical contractors in Kenya, in classes tied to the qualifications held and the scale of work permitted. Class requirements run from basic technical qualifications up to degree-level engineering.",
          "For replacing a socket or hanging a light fitting, this is not the thing to hold a job up over. For a rewire, a new consumer unit, a three-phase supply, or anything touching the meter, ask which class of EPRA licence the person holds — and ask a contractor rather than an individual for anything at building scale.",
        ],
      },
      {
        heading: "Building and construction: NCA",
        paragraphs: [
          "Contractors undertaking construction works in Kenya are required to register with the National Construction Authority. Registration is in classes tied to the value of the works a contractor may undertake, and specialist categories exist for particular kinds of work.",
          "For an extension, a new build, a roof or any structural change, ask for the NCA registration and check that the class covers a project of your value. For a bathroom retile, it does not apply.",
          "Separately: structural work needs a qualified engineer's design, not a contractor's opinion. Removing a wall, cutting a new opening in a load-bearing wall, or adding a floor are the three that most often get done on somebody's confidence and cost far more to put right afterwards.",
        ],
      },
      {
        heading: "Private security: PSRA",
        paragraphs: [
          "Private security in Kenya is regulated by the Private Security Regulatory Authority, which registers private security service providers. If you are engaging guards for a home, a site or a business on any ongoing basis, ask whether the guard or their company is registered.",
          "There is a second thing worth knowing here. Kenya sets statutory minimum wages for security guards, and a quote far below the going rate usually means the guard is not receiving it. That is not a bargain — it is a person who will be looking for other work while they are supposed to be watching your premises.",
        ],
      },
      {
        heading: "Trade certificates: NITA",
        paragraphs: [
          "The National Industrial Training Authority runs Kenya's trade testing, and its certificates are the standard proof of an artisan trade. Grade III is the entry-level artisan certificate and Grade I the highest.",
          "Treat a NITA grade as a genuine positive, not a requirement. Many of the best fundis in Kenya learned through apprenticeship and never sat a trade test, and the certificate says nothing about whether somebody turns up on time or cleans up afterwards.",
        ],
      },
      {
        heading: "Care and childcare: the checks that matter more",
        paragraphs: [
          "For anybody who will be alone with your children or with an elderly or unwell relative, the documents are not the main protection. Meeting them at your home before the first booking is, and so is taking identification and calling the references yourself.",
          "Ask for two families they have worked for and call both. People who are good at this expect to be asked and will offer the numbers before you do. Somebody who is reluctant has told you something.",
          "Where any nursing task is involved — wound care, injections, catheters, oxygen — that is clinical work and the training and registration for it should be checked and verified, not taken on trust.",
        ],
      },
      {
        heading: "What to ask when there is no licence to ask for",
        paragraphs: [
          "For the majority of jobs, these five questions do more than any certificate would.",
        ],
        list: [
          "Can I see photographs of two finished jobs like this one?",
          "Can I speak to the last customer you did this for?",
          "What exactly is included in this price, and what is not?",
          "Who buys the materials?",
          "What happens if it is not right — do you come back?",
        ],
      },
      {
        heading: "And the check that does not depend on anybody's answer",
        paragraphs: [
          "Do not pay in full up front. That is the one rule that holds regardless of trade, credential, references or how well the conversation went.",
          "On Help24 the payment is held rather than handed over: you pay by M-Pesa, the provider can see the money is there, and neither side can move it until the work is confirmed done. That is the same protection a staged payment schedule gives you on a large job, applied to a one-hour one.",
        ],
      },
    ],
  },
  {
    slug: "what-to-agree-before-work-starts",
    title: "What to Agree Before Work Starts",
    description:
      "Nearly every dispute over a job traces back to something that was never agreed. The six things to settle before a fundi starts, from scope and materials to who makes good afterwards.",
    h1: "What to agree before work starts",
    standfirst:
      "Nearly every dispute over a job traces back to something nobody thought to agree.",
    published: "2026-09-12",
    modified: "2026-09-12",
    minutes: 7,
    relatedServices: ["construction", "painting", "carpentry", "masonry"],
    sections: [
      {
        heading: "Scope: what is included, and what is not",
        paragraphs: [
          "Scope is the one that causes the most trouble, because both sides think it is obvious and they are each thinking of something different. \"Paint the bedroom\" — does that include the ceiling? The skirting? The inside of the wardrobe? The door?",
          "Write it down, even as a message. Not a contract, just a list of what is being done. The act of listing it is what surfaces the disagreement while it is still cheap.",
          "Be equally explicit about exclusions. If the quote does not include moving furniture, or taking the old unit away, or working weekends, that belongs in the same message.",
        ],
      },
      {
        heading: "Price: one number, and what it covers",
        paragraphs: [
          "Agree a single number before work starts, and agree whether it is a price for the job or a rate for the time. Those two diverge sharply the moment anything goes wrong, which is exactly when you will find out which one you agreed.",
          "On Help24, the price you accept is the number the payment is held against. That is not just bookkeeping — it means a later request for more money is a conversation rather than a fait accompli with your money already gone.",
        ],
      },
      {
        heading: "Materials: who buys them",
        paragraphs: [
          "Either the provider buys the materials and the quote includes them, or you buy them and the quote is labour only. Both work. What does not work is discovering on the morning that each of you assumed the other.",
          "If the provider is buying, agree roughly what — brand, grade, finish. \"Paint\" covers a range of products with very different lifespans, and so does \"tile\", \"cable\" and \"timber\".",
          "If you are buying, ask for a list before the day. Being one fitting short is what turns a half-day job into two half-days.",
        ],
      },
      {
        heading: "Timing: start, duration, and what happens to your house meanwhile",
        paragraphs: [
          "Agree a start date and a realistic duration. For anything more than a day, agree what the site looks like at the end of each day — whether you have water, whether you have power, whether you can use the kitchen.",
          "For work in an occupied home, that conversation is worth more than the schedule. A bathroom that is unusable for four days is a manageable inconvenience if you knew, and a crisis if you did not.",
        ],
      },
      {
        heading: "Making good: the part that is always someone else's job",
        paragraphs: [
          "Chasing a wall for a cable, lifting tiles to reach a pipe, drilling through render for an air conditioner — all of these leave damage that is a normal part of the work and that somebody has to repair.",
          "Ask directly: does the price include making good the plaster and the paint? Often the answer is no, and that is a reasonable answer — but it is a different total, and it needs a second trade booked.",
          "Debris is the same question. Broken tiles, old units, packaging and rubble do not remove themselves, and \"we will leave it in the compound\" is a real quote that people accept without hearing.",
        ],
      },
      {
        heading: "What happens if it is not right",
        paragraphs: [
          "Ask before work starts, when it is an easy question. Does the provider come back? For how long? Does that cover the workmanship, the parts, or both?",
          "For anything with a part in it — an appliance repair, a phone screen, a car component — ask specifically about warranty on the part as distinct from the labour. They are frequently different lengths.",
        ],
      },
      {
        heading: "Why holding the payment changes the conversation",
        paragraphs: [
          "All of the above is easier to raise when the money has not moved yet. Asking \"does this include making good?\" of somebody you have already paid is a favour you are requesting; asking it before is a term you are agreeing.",
          "That is the practical argument for escrow on small jobs, not just large ones. Help24 holds the payment from the moment you accept an offer until you confirm the work is done, which keeps both of you in the part of the conversation where things can still be settled.",
        ],
      },
    ],
  },
];

const BY_SLUG = new Map(GUIDES.map((g) => [g.slug, g]));

export function guideBySlug(slug: string): Guide | undefined {
  return BY_SLUG.get(slug);
}
