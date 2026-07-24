/**
 * Help Centre content. This is the single source of truth for both the
 * interactive /help page and its FAQPage structured data, and it is the web
 * home for the guidance that used to live hardcoded in the Flutter app.
 *
 * Keep answers accurate to how Help24 actually works (M-Pesa payments, payment
 * protection/escrow, in-app messaging, reporting). When behaviour changes, edit
 * here — the app links to this page, so there is nothing to re-release.
 */

export type Accent = "primary" | "secondary" | "success" | "warning" | "error";

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqCategory {
  id: string;
  icon: string;
  title: string;
  blurb: string;
  accent: Accent;
  items: FaqItem[];
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "getting-started",
    icon: "rocket",
    title: "Getting Started",
    blurb: "Create an account and find your way around Help24.",
    accent: "primary",
    items: [
      {
        q: "What is Help24?",
        a: "Help24 is a marketplace that connects people who need a service with trusted local providers across Kenya. You can post what you need, browse offers from providers, agree a price, and pay securely through the app.",
      },
      {
        q: "How do I create an account?",
        a: "Open the app and sign in with your phone number or email. After signing in, complete your profile with your name and an optional photo. A complete profile helps others trust you when you post or respond.",
      },
      {
        q: "Do I need to pay to join?",
        a: "No. Creating an account and browsing Help24 is free. You only pay when you hire a provider for a job, and any applicable fees are shown to you in the app before you confirm.",
      },
      {
        q: "What can I use Help24 for?",
        a: "Everything from urgent repairs and cleaning to deliveries, tutoring, events and professional services. If it is a legitimate local service, you can likely find or offer it on Help24.",
      },
      {
        q: "Which areas does Help24 cover?",
        a: "Help24 is built for Kenya first and is expanding across the country. Availability of providers varies by area and grows as more people join.",
      },
    ],
  },
  {
    id: "payments",
    icon: "wallet",
    title: "Payments",
    blurb: "M-Pesa, fees, receipts and refunds.",
    accent: "success",
    items: [
      {
        q: "How do I pay on Help24?",
        a: "Help24 supports M-Pesa and other methods. Once you agree a price with a provider, you can pay securely through the app — there is no need to handle cash.",
      },
      {
        q: "Is it safe to pay through the app?",
        a: "Yes. Paying in-app lets Help24 protect your money with payment protection (escrow) and keeps a record of the transaction. Never send money outside the app for a job arranged on Help24 — you lose that protection.",
      },
      {
        q: "Where do I set my M-Pesa number?",
        a: "Go to Profile → Payment Settings. Your number is used for payments and payouts. For your security, viewing or changing a saved number is protected behind your device lock or biometrics.",
      },
      {
        q: "Are there any fees?",
        a: "Any fees are shown clearly in the app before you confirm a payment. You will always see the total before you pay.",
      },
      {
        q: "How do refunds work?",
        a: "Refunds depend on the situation and our refund policy. Because eligible payments are held with payment protection, funds can be returned before they are released if something goes wrong. Contact support if you need help with a refund.",
      },
    ],
  },
  {
    id: "escrow",
    icon: "shield",
    title: "Escrow & Payment Protection",
    blurb: "How Help24 holds funds until the job is done.",
    accent: "secondary",
    items: [
      {
        q: "What is payment protection?",
        a: "When you pay through Help24, we can hold your money securely (in escrow) instead of sending it straight to the provider. The funds are only released when the work is completed or when you release them according to your agreement.",
      },
      {
        q: "When is money released to the provider?",
        a: "Funds are released when the agreed work is done, or at milestones you both agreed to. This protects you as the customer and assures the provider that the money is set aside and ready.",
      },
      {
        q: "What if the work is not completed?",
        a: "If the job is not completed as agreed, the held funds can be paused while the issue is resolved. Report the problem through the app and, if needed, open a dispute so our team can help.",
      },
      {
        q: "Why should I keep payments inside Help24?",
        a: "Payment protection only applies to payments made through the app. If you pay a provider directly or in cash, Help24 cannot hold or recover those funds for you.",
      },
    ],
  },
  {
    id: "jobs",
    icon: "briefcase",
    title: "Jobs & Services",
    blurb: "Posting requests, making offers and applying to jobs.",
    accent: "warning",
    items: [
      {
        q: "What is the difference between a request, an offer and a job?",
        a: "A request is posted by someone looking for help. An offer is posted by a provider advertising a service. A job is a specific piece of work you can apply to with a message and a proposed price.",
      },
      {
        q: "How do I post a request, offer or job?",
        a: "Tap the + button on the home screen, choose the type, and fill in the details. Adding clear photos and a good description gets you far better responses.",
      },
      {
        q: "How do I apply to a job?",
        a: "Open the job and apply with a short message and your proposed price. If the poster accepts your application, a chat opens so you can arrange the details.",
      },
      {
        q: "How do I find the right work or provider?",
        a: "Use Discover to browse requests and offers, and filters to narrow by what you need. Provider profiles show ratings and completed jobs to help you choose with confidence.",
      },
      {
        q: "Can I manage my posts?",
        a: "Yes. Go to Profile → My Posts to see and manage your active requests, offers and jobs.",
      },
    ],
  },
  {
    id: "accounts",
    icon: "user",
    title: "Accounts & Profile",
    blurb: "Managing your profile, details and account.",
    accent: "primary",
    items: [
      {
        q: "How do I edit my profile?",
        a: "Go to Profile → Professional Profile to update your name, photo, profession, bio and other details. Your profile is visible to others when you post or respond.",
      },
      {
        q: "Why should I complete my profile?",
        a: "A complete, verified-looking profile builds trust and gets better responses. The app shows your completion progress and the next step to finish.",
      },
      {
        q: "How do I verify my email?",
        a: "If you signed up with email, you may see a prompt to confirm your address. Verifying your email keeps your account-recovery options open if you ever get locked out.",
      },
      {
        q: "How do I change my language or theme?",
        a: "Go to Profile → Preferences to switch theme (light, dark or device default) and language. More languages are on the way.",
      },
      {
        q: "How do I delete my account?",
        a: "You can request account deletion by contacting support@help24.co.ke. Note that some content shared with others, such as messages, may remain as described in our Privacy Policy.",
      },
    ],
  },
  {
    id: "providers",
    icon: "badge",
    title: "For Providers",
    blurb: "Growing your business and getting hired on Help24.",
    accent: "success",
    items: [
      {
        q: "How do I become a provider?",
        a: "Anyone can offer services. Complete your professional profile with your profession, skills and a clear bio, then post an offer or apply to open jobs.",
      },
      {
        q: "How do I get more jobs?",
        a: "Respond quickly, keep your profile complete, add photos of your work, and build a strong track record. Ratings and completed-job counts on your profile help customers choose you.",
      },
      {
        q: "How and when do I get paid?",
        a: "When a customer pays through the app, the money is held with payment protection and released to your M-Pesa number when the work is completed or at agreed milestones. Set your payout number in Profile → Payment Settings.",
      },
      {
        q: "Can I promote my services?",
        a: "Yes. Go to Profile → Promote Business to feature a listing and reach more customers with campaigns you can track.",
      },
    ],
  },
  {
    id: "safety",
    icon: "safety",
    title: "Safety & Trust",
    blurb: "Staying safe and keeping the community trustworthy.",
    accent: "error",
    items: [
      {
        q: "How does Help24 keep me safe?",
        a: "Keep conversations, agreements and payments inside the app. In-app payment protection, records of your chats, and community reporting all work together to keep both sides accountable.",
      },
      {
        q: "What are the warning signs of a scam?",
        a: "Be cautious of anyone who asks you to pay in advance outside the app, pushes you to move to another platform, or refuses to use in-app payment. Never send money outside Help24 for a job arranged here.",
      },
      {
        q: "How do I report a suspicious user or post?",
        a: "Use the report option on the post or user. Our team reviews reports and takes action — including removing content or suspending accounts — to keep the community safe.",
      },
      {
        q: "How do I share my location safely?",
        a: "You can share your location in chat when it is needed to get a job done. Only share it when you are comfortable, and control location access any time in Profile → Location Access.",
      },
    ],
  },
  {
    id: "disputes",
    icon: "scale",
    title: "Disputes",
    blurb: "When something goes wrong with a job or payment.",
    accent: "warning",
    items: [
      {
        q: "What should I do first if there is a problem?",
        a: "Try to resolve it directly with the other person in chat — most issues are simple misunderstandings. Keep everything in the app so there is a clear record.",
      },
      {
        q: "How do I open a dispute?",
        a: "If you cannot agree, report the job and open a dispute so the Help24 team can review what happened. Because eligible payments are held with payment protection, funds can be paused while the dispute is reviewed.",
      },
      {
        q: "How are disputes decided?",
        a: "We review the messages, the agreement and any evidence both sides provide. Keeping your conversations and payments inside the app gives us what we need to help fairly.",
      },
      {
        q: "How long does a dispute take?",
        a: "It depends on the complexity, but we aim to review disputes as quickly as possible. You will be kept informed through the app.",
      },
    ],
  },
  {
    id: "technical",
    icon: "wrench",
    title: "Technical Issues",
    blurb: "App problems, notifications and troubleshooting.",
    accent: "secondary",
    items: [
      {
        q: "I'm not receiving notifications. What do I do?",
        a: "Check that notifications are enabled in Profile → Preferences and in your device settings for Help24. Toggling them off and on again often helps.",
      },
      {
        q: "The app is slow or won't load.",
        a: "Check your internet connection, then close and reopen the app. If it persists, make sure you are on the latest version from the store and restart your device.",
      },
      {
        q: "I can't sign in.",
        a: "Confirm you are using the correct phone number or email. Use the recovery options on the sign-in screen, and if you signed up with email, check that it is verified. Still stuck? Contact support.",
      },
      {
        q: "How do I update the app?",
        a: "Update Help24 from the app store on your device. Running the latest version ensures you have the newest features and fixes.",
      },
    ],
  },
];

/** Flat list of every Q&A — used for the FAQPage structured data. */
export const ALL_FAQS: FaqItem[] = FAQ_CATEGORIES.flatMap((c) => c.items);
