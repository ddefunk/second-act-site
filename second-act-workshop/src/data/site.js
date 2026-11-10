// ---------------------------------------------------------------
// SITE-WIDE SETTINGS
// These stay the same for every workshop. Edit once, applies everywhere.
// Workshop-specific content lives in workshops.js.
// ---------------------------------------------------------------

export const site = {
  brandName: 'Second Act Advisory',
  legalName: 'Second Act Advisory Studio Limited',
  companyNumber: '17261397',
  mainSiteUrl: 'https://secondactadvisory.co.uk',
  auditUrl: 'https://income.secondactadvisory.co.uk/?utm_source=workshop&utm_medium=page&utm_campaign=audit',
  conversationUrl: 'https://systems.secondactadvisory.co.uk/work-with-me?utm_source=workshop&utm_medium=page&utm_campaign=fit_conversation',
  privacyUrl: 'https://systems.secondactadvisory.co.uk/privacy',
  termsUrl: 'https://systems.secondactadvisory.co.uk/terms',
  logo: '/logo-cream-on-burgundy.png',
  contactEmail: 'olufunke.adeyinka@secondactadvisory.co.uk',

  // Where the built-in registration form sends sign-ups.
  // Upload save-registration.php next to save-lead.php on Hostinger.
  registrationEndpoint: 'https://audit.secondactadvisory.co.uk/save-registration.php',

  social: [
    { label: 'Instagram', url: 'https://www.instagram.com/secondactadvisory/' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/company/second-act-advisory/' },
    { label: 'Facebook', url: 'https://www.facebook.com/secondactadvisory' },
  ],

  host: {
    name: 'Olufunke Adeyinka',
    knownAs: 'Funke',
    role: 'Founder, Second Act Advisory',
    photo: '/funke-portrait.webp',
    photoAlt: 'Portrait of Olufunke Adeyinka',
    bio: [
      "I'm Olufunke Adeyinka, although most people call me Funke.",
      "I've spent much of my professional life working across finance, technology, project delivery and business transformation, helping organisations understand complicated problems and turn plans into something practical.",
      "I'm still building my professional career while developing my own business. So when I talk about building a second act, I'm not speaking as someone who abandoned one life to begin another. I'm building mine too.",
      'What I see again and again is how much knowledge and capability women accumulate over the years, often without seeing its value beyond the roles they have held. Helping them see it, and decide what to do with it, is the work I care about.',
    ],
    quote:
      'A salary is not the only way our experience can create value. I had to learn that for myself.',
  },

  // Real client words from secondactadvisory.co.uk. Only add genuine testimonials here.
  testimonials: [
    {
      quote:
        'She has a way of seeing possibilities in your experience that you may not have fully recognised yourself, and then helping you work out what to do with them.',
      name: 'Chioma',
      detail: 'Founder, Impact Practice and Parenting as Leadership',
    },
    {
      quote:
        'Funke has great attention to detail, listens exceptionally well and is dedicated to delivering quality work.',
      name: 'Shola Alabi MBE',
      detail: 'Raising Successful Children',
    },
    {
      quote:
        'What I particularly valued was how she simplified the automation process and brought a clear structure to my workflow.',
      name: 'Neye',
      detail: 'Business Analyst',
    },
  ],

  // The five stages of the Second Act Method. Each workshop says which stages it covers.
  method: [
    { id: 'see', name: 'See', line: 'Recognise your value' },
    { id: 'shape', name: 'Shape', line: 'Decide what you could offer' },
    { id: 'build', name: 'Build', line: 'Put the foundations in place' },
    { id: 'move', name: 'Move', line: 'Take your offer to the right people' },
    { id: 'grow', name: 'Grow', line: 'Learn, refine and build' },
  ],

  // FAQs added to the end of every workshop's own FAQ list.
  sharedFaqs: [
    {
      q: 'Do I have to leave my job?',
      a: "No. I'm still building my own professional career alongside Second Act Advisory. Your second act might be something you develop while employed, prepare for retirement, or a different direction altogether.",
    },
    {
      q: 'Will there be anything to buy?',
      a: "The workshop is free and is designed to be useful on its own. At the end I'll briefly explain how you can work with me if you'd like individual support. There's no pressure either way.",
    },
    {
      q: 'Do I need a website or a social media following?',
      a: 'No. The first step is identifying a credible offer and who might want it. Tools and channels come later, and only the ones that suit you.',
    },
  ],

  disclaimer:
    'This is an educational session. It does not promise or guarantee any particular income or outcome. What you achieve depends on your circumstances, choices and the effort you put in. Nothing shared is financial, legal or tax advice.',
}
