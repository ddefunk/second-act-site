// ---------------------------------------------------------------
// WORKSHOPS
// One entry per event. Copy an entry to create a new workshop.
//
// Each workshop is reachable at  workshop.secondactadvisory.co.uk/<slug>
// The root address (workshop.secondactadvisory.co.uk) shows FEATURED_WORKSHOP.
//
// DATES
//   startsAt: '2026-12-06T19:00'  (UK time, 24-hour clock)
//   Leave startsAt as null while the date is not confirmed. The page then
//   says "Date to be announced" and the form becomes a waitlist.
//   Once the date has passed, the page switches to waitlist mode by itself.
//
// REGISTRATION
//   { type: 'form' }                  → built-in form, saved to your database
//   { type: 'link', url: 'https://…' } → button goes to Zoom, Stan, Eventbrite etc.
// ---------------------------------------------------------------

export const FEATURED_WORKSHOP = 'shape-your-first-offer'

export const workshops = [
  // ===============================================================
  {
    slug: 'from-experience-to-income',
    title: 'From Experience to Income',
    audience: 'For women over 40 who know they have built something valuable',
    headline: 'Find the income opportunities already sitting inside your experience.',
    subheadline:
      "A free live workshop to look properly at what you've built over the years, your skills, knowledge and the problems people already bring to you, and see which of them could become a source of income.",

    startsAt: null, // e.g. '2026-12-06T19:00'
    durationMinutes: 75,
    location: 'Live on Zoom',
    price: 'Free',
    replayNote: 'Registered attendees will receive the replay for a limited time.', // set to '' if there is no replay
    registration: { type: 'form' },
    methodStages: ['see'],

    discover: [
      {
        title: 'How to see the value in what you already know',
        body: 'Look past your job title and CV to the knowledge, skills, relationships and experiences you have quietly accumulated.',
      },
      {
        title: 'Where your experience could solve a problem someone would pay for',
        body: 'The difference between being good at something and having something people are willing to pay to have solved.',
      },
      {
        title: 'How to compare your ideas when you have more than one',
        body: 'A simple way to weigh the options you have been carrying around, so you can stop going round in circles.',
      },
      {
        title: 'What a sensible first step looks like for your life as it is',
        body: 'Something you can start alongside your job, your family and everything else, without adding chaos.',
      },
    ],

    outcomes: [
      'A clearer picture of the skills and knowledge you could build on',
      'Two or three income directions worth exploring, and why',
      'A way to judge which idea has real commercial potential',
      'One practical next step you can take this month',
    ],

    problem: {
      heading: 'Perhaps you have been thinking about this for a while.',
      paragraphs: [
        'People come to you for advice. They ask for your help, rely on you to sort things out, and tell you that you should really be charging for it.',
        "You might enjoy your job and simply want another source of income. Or retirement is getting closer and you'd like to be more intentional about what comes next.",
        "You may even have several ideas already. The hard part is knowing which one is worth pursuing, and how to begin without making an already full life more complicated.",
      ],
      closing: 'That is exactly what this workshop is for.',
    },

    forYou: [
      "You're over 40 and wondering what else your experience could make possible",
      "You've built a career or valuable skills but never considered earning independently from them",
      'You have several ideas and want help working out which are realistic',
      'You want another source of income without necessarily leaving your job',
      "You're thinking about retirement or a change and want to prepare thoughtfully",
    ],

    notNeeded: [
      'A business idea',
      'A website',
      'A social media following',
      'Any business experience',
      'Confidence with technology',
    ],

    gifts: [
      {
        title: 'Experience Inventory Worksheet',
        body: 'A guided worksheet to capture the skills, knowledge and problems you have solved, so nothing valuable gets overlooked.',
      },
      {
        title: 'The Free Second Act Income Audit',
        body: 'Ten questions that suggest the income paths that suit you best, with a personalised result you can bring to the session.',
      },
    ],

    faqs: [
      {
        q: 'Is it really free?',
        a: 'Yes. There is no cost to register or attend. Just add your name and email and your place is saved.',
      },
      {
        q: "I don't have a business idea. Should I still come?",
        a: 'Yes. Most women start without one. Working out what is worth exploring is the whole point of the session.',
      },
      {
        q: 'Will I need to speak or turn my camera on?',
        a: 'Only if you want to. You are welcome to listen and work through the exercises quietly.',
      },
    ],

    finalCta: {
      heading: "You've spent years building your experience. Let's explore what it could become.",
      body: 'Bring a notebook and an open mind. We will start with what you already have.',
    },
  },

  // ===============================================================
  {
    slug: 'shape-your-first-offer',
    title: 'Shape Your First Offer',
    audience: 'For women over 40 with an idea, or several, that needs shaping',
    headline: 'Turn the idea you keep coming back to into one clear offer.',
    subheadline:
      'A free live workshop to decide who your offer is for, what it includes, what it helps someone achieve and how you might sensibly price it.',

    startsAt: '2027-01-09T16:00',
    durationMinutes: 90,
    location: 'Live on Zoom',
    price: 'Free',
    replayNote: 'Registered attendees will receive the replay for a limited time.',
    registration: { type: 'form' },
    methodStages: ['shape'],

    discover: [
      {
        title: 'How to choose one direction from several good ideas',
        body: 'A practical way to narrow your options so you can commit to one and test it properly.',
      },
      {
        title: 'Who your offer is really for',
        body: 'Describing a specific person with a specific problem, so the right people recognise themselves straight away.',
      },
      {
        title: 'What goes in, and what stays out',
        body: 'Structuring an offer around an outcome rather than everything you know, so it is simple to explain and deliver.',
      },
      {
        title: 'How to arrive at a sensible starting price',
        body: 'Thinking about value, time and confidence so your first price is one you can say out loud.',
      },
    ],

    outcomes: [
      'One chosen idea, and the reasons it beat the others',
      'A one-sentence description of who you help and how',
      'A simple outline of what your offer includes',
      'A starting price and a plan to test it with real people',
    ],

    problem: {
      heading: "Having valuable experience and knowing how to offer it are two different things.",
      paragraphs: [
        "You know you're good at something. Friends, colleagues and family have told you so for years.",
        'But when you try to describe what you would actually sell, it comes out vague, or far too big, or as a list of everything you can do.',
        "So the idea stays in your head, because it is not clear enough to put in front of anyone yet.",
      ],
      closing: 'In this session we make it clear enough to share.',
    },

    forYou: [
      'You have an idea, or a few, but not yet a defined offer',
      'You struggle to explain what you would do for someone in a sentence',
      "You're unsure what to charge, or whether anyone would pay",
      'You want something you can start testing in the next few weeks',
    ],

    notNeeded: [
      'A finished product',
      'A website or brand',
      'An audience',
      'A business plan',
    ],

    gifts: [
      {
        title: 'Offer Shaping Canvas',
        body: 'A one-page template to define your offer: who it is for, the problem, the outcome, what is included and the price.',
      },
      {
        title: 'Starting Price Worksheet',
        body: 'A simple way to sense-check a first price against your time, the value of the outcome and what you are comfortable charging.',
      },
    ],

    faqs: [
      {
        q: 'Do I need to have done the earlier workshop?',
        a: 'No. It helps to have an idea in mind, but you can come to this one on its own.',
      },
      {
        q: "What if I'm still choosing between ideas?",
        a: "That's fine. The first part of the session helps you narrow down before you start shaping.",
      },
    ],

    finalCta: {
      heading: 'Your idea deserves to be clear enough to share.',
      body: 'Come with the idea you keep returning to. Leave with an offer you can describe, price and test.',
    },
  },

  // ===============================================================
  {
    slug: 'your-second-act-income-plan',
    title: 'Your Second Act Income Plan',
    audience: 'For women over 40 ready to build income around the life they already have',
    headline: 'Plan an income that fits around your job, your family and your life.',
    subheadline:
      'A free live workshop to turn an offer or direction into a realistic plan: what you want to earn, how many clients or sales that takes, how much time you have and what to do first.',

    startsAt: null,
    durationMinutes: 90,
    location: 'Live on Zoom',
    price: 'Free',
    replayNote: 'Registered attendees will receive the replay for a limited time.',
    registration: { type: 'form' },
    methodStages: ['build', 'move'],

    discover: [
      {
        title: 'How to set an income goal you can actually plan around',
        body: 'Moving from a vague hope to a number, and working backwards to what it means in clients, sales and hours.',
      },
      {
        title: 'How much time you really have',
        body: 'An honest look at your week so the plan works with your commitments rather than against them.',
      },
      {
        title: 'What you need in place, and what can wait',
        body: 'The few practical foundations that matter at the start, without unnecessary complexity.',
      },
      {
        title: 'Where your first clients are likely to come from',
        body: 'Starting conversations with the right people so you can learn whether there is real demand.',
      },
    ],

    outcomes: [
      'A realistic income goal and what it takes to reach it',
      'A weekly time plan that fits your actual life',
      'A short list of the essentials to put in place first',
      'Your first 90 days, written down',
    ],

    problem: {
      heading: 'An idea without a plan has a way of staying an idea.',
      paragraphs: [
        "You may already know what you'd like to offer. What is missing is a sense of how it fits into a week that is already full.",
        "Without a plan, every next step feels like it could be the wrong one, so it's easier to wait for a quieter month that never quite arrives.",
      ],
      closing: 'This workshop gives you a plan sized to the life you have now.',
    },

    forYou: [
      'You have a direction or offer in mind and want to make it real',
      "You're working, caring for others or both, and time is limited",
      'You want to build a second income steadily rather than all at once',
      "You're preparing for retirement or a change and want a timeline",
    ],

    notNeeded: [
      'A finished offer',
      'Lots of spare time',
      'A large budget',
      'Technical skills',
    ],

    gifts: [
      {
        title: 'Income Planning Calculator',
        body: 'Work out how many clients or sales you need at your price to reach the income you want.',
      },
      {
        title: '90-Day Second Act Planner',
        body: 'A simple planner to map your first three months around the time you really have.',
      },
    ],

    faqs: [
      {
        q: "I don't have an offer yet. Is this for me?",
        a: "You'll get most from it with at least a direction in mind. If you're earlier than that, the From Experience to Income workshop or the free Income Audit is a better starting point.",
      },
    ],

    finalCta: {
      heading: 'Your second act can begin while you are still thriving in your first.',
      body: 'Join me to build a plan that respects the life you already have.',
    },
  },
]

export function getWorkshop(slug) {
  return workshops.find((w) => w.slug === slug) || null
}
