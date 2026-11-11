/* ABSTRUCT — content.
   FROM THE FLO STUDIOS CASE STUDY: taglines, palette, service names, stat figures (15+ / 250+ / 98%), quote, process words.
   PLACEHOLDER (invented for this build — replace with real client content): every project below, FAQ answers,
   value descriptions, step descriptions, address and email in core.js. */
(function () {
  'use strict';
  var ABS = window.ABS = window.ABS || {};

  ABS.taglines = [
    'Building stability. Shaping the future.',
    'Spaces that perform.',
    'Precision today. Stronger tomorrow.',
    'We build. You live.',
    'People. Spaces. Progress.',
    'Building with purpose.'
  ];

  ABS.palette = [
    { name: 'Ivory', hex: '#EBE5DC', role: 'Drawing paper. The page every project starts on.', dark: true },
    { name: 'Charcoal', hex: '#111111', role: 'Type, monogram and the site after dark.' },
    { name: 'Signal red', hex: '#C31C18', role: 'The single accent: safety gear and planes of colour.' },
    { name: 'Concrete', hex: '#8C8B87', role: 'The material itself, and the photography around it.' }
  ];

  ABS.services = [
    {
      no: '01', slug: 'residential', name: 'Residential Construction',
      short: 'Homes that hold their value, built so they feel as good in year twenty as on handover day.',
      long: 'From a single extension to a forty-eight-home scheme, we build housing the way we would want to live in it: structure first, junctions detailed on paper before they are poured, and a site that neighbours barely notice.',
      caps: ['New-build houses and apartment blocks', 'Conversions and refurbishment', 'Extensions and structural alterations', 'Retained-facade schemes', 'Handover pack and 12-month defects period'],
      photo: 'building-with-purpose.jpg', pos: '50% 34%', theme: 'light'
    },
    {
      no: '02', slug: 'commercial', name: 'Commercial Construction',
      short: 'Offices, retail and industrial space delivered to a programme that your tenants can plan around.',
      long: 'Commercial work is won on certainty. We price against full drawings, fix the programme in the first month and report against it every week, so the opening date stays a date and not a hope.',
      caps: ['Offices and mixed-use buildings', 'Retail and hospitality fit-out', 'Industrial and logistics sheds', 'Live-building and phased works', 'Category A and B finishes'],
      photo: 'billboard-night.jpg', pos: '50% 50%', theme: 'dark'
    },
    {
      no: '03', slug: 'management', name: 'Project Management',
      short: 'We run your project from your side of the table, whoever ends up holding the trowel.',
      long: 'Independent client-side management for projects that need a firm hand: cost planning, procurement, programme control and site assurance, reported in plain language and one page a week.',
      caps: ['Cost planning and value engineering', 'Tender, procurement and appointment', 'Programme and risk control', 'Site inspection and quality assurance', 'Health and safety coordination'],
      photo: 'poster.jpg', pos: '50% 62%', theme: 'red'
    }
  ];

  ABS.projects = [
    { slug: 'halden-exchange', name: 'Halden Exchange', type: 'commercial', typeLabel: 'Commercial', year: 2023, area: 18200, months: 22, scale: '12 storeys', seed: 11,
      role: 'Main contractor', summary: 'A twelve-storey office building on a plot only forty metres wide. Crane swing, deliveries and a live tram line next door dictated the programme more than the drawings did.',
      stats: [['12', 'storeys'], ['18,200', 'm² net'], ['22', 'months']] },
    { slug: 'tallis-house', name: 'Tallis House', type: 'residential', typeLabel: 'Residential', year: 2024, area: 6400, months: 14, scale: '48 apartments', seed: 27,
      role: 'Main contractor', summary: 'Forty-eight apartments behind a retained 1930s street frontage. Keeping the facade braced and stable through eleven months of demolition behind it was the whole job.',
      stats: [['48', 'apartments'], ['6,400', 'm² gross'], ['14', 'months']] },
    { slug: 'corvin-yard', name: 'Corvin Yard', type: 'commercial', typeLabel: 'Commercial', year: 2022, area: 9800, months: 17, scale: 'Mixed-use', seed: 43,
      role: 'Main contractor', summary: 'Ground-floor retail, two floors of studios and a podium garden built over an active rail cutting. Every lift was planned around the timetable of the trains underneath.',
      stats: [['3', 'uses'], ['9,800', 'm² gross'], ['17', 'months']] },
    { slug: 'ashgrove-residences', name: 'Ashgrove Residences', type: 'residential', typeLabel: 'Residential', year: 2023, area: 5100, months: 12, scale: '22 townhouses', seed: 58,
      role: 'Main contractor', summary: 'Twenty-two townhouses in two terraces, each with a private yard and a party wall rated beyond what the code asked. Built in a single continuous programme.',
      stats: [['22', 'homes'], ['5,100', 'm² gross'], ['12', 'months']] },
    { slug: 'the-ledger-building', name: 'The Ledger Building', type: 'management', typeLabel: 'Project Management', year: 2024, area: 7300, months: 15, scale: 'Refurbishment', seed: 72,
      role: 'Client-side project manager', summary: 'A stripped-back refurbishment of a 1960s office with tenants still inside. We ran cost, programme and procurement for the owner and held the contractor to the plan.',
      stats: [['7,300', 'm² refurbished'], ['15', 'months'], ['4', 'phases']] },
    { slug: 'brannock-works', name: 'Brannock Works', type: 'commercial', typeLabel: 'Commercial', year: 2021, area: 18000, months: 11, scale: 'Logistics hub', seed: 85,
      role: 'Main contractor', summary: 'An eighteen-thousand-square-metre logistics hub, handed over eleven months after the first pour. Cladding and slab were poured in parallel to protect that date.',
      stats: [['18,000', 'm² floor'], ['11', 'months'], ['1', 'handover']] },
    { slug: 'pell-street-lofts', name: 'Pell Street Lofts', type: 'residential', typeLabel: 'Residential', year: 2022, area: 3900, months: 13, scale: '31 lofts', seed: 96,
      role: 'Main contractor', summary: 'A former print works converted into thirty-one lofts. The cast-iron columns stayed, the floors were lifted, and the old press-hall skylights became the stairwell.',
      stats: [['31', 'lofts'], ['3,900', 'm² gross'], ['13', 'months']] },
    { slug: 'north-quay-library', name: 'North Quay Library', type: 'management', typeLabel: 'Project Management', year: 2025, area: 4600, months: 16, scale: 'Civic', seed: 104,
      role: 'Client-side project manager', summary: 'A public library on a flood-risk site. We managed the design team, the tender and the contractor for the council, and kept the cost plan inside its first range.',
      stats: [['4,600', 'm² gross'], ['16', 'months'], ['1', 'council client']] }
  ];

  ABS.values = [
    ['Clarity', 'Drawings, programmes and costs written so that everyone on the project can read them, not only the people who made them.'],
    ['Confidence', 'Decisions made early, on site, with the person who has to live with them standing in the room.'],
    ['Uncompromising quality', 'We re-pour before we explain. A wall that is not right is a wall we have not finished.']
  ];

  ABS.steps = [
    ['Design', 'Brief, survey, drawings and a cost plan, fixed before ground is broken. This is where most overruns are won or lost.'],
    ['Build', 'A named site lead, a weekly look-ahead signed by you, and an open site every Friday afternoon.'],
    ['Deliver', 'Snagging closed with you on site, a handover pack, then a twelve-month defects period with two scheduled walk-rounds.']
  ];

  ABS.faq = [
    ['How does a quote work?', 'Tell us the type, size and timeline using the builder on the contact page. Within two working days we return a scope sheet and a price range, then firm it up against drawings.'],
    ['Do you build to someone else’s design?', 'Yes. We build to architect and engineer drawings, or we manage the design team ourselves. You decide which at the start.'],
    ['Can you take over a stalled site?', 'Often. We survey first, agree what is sound and what is not in writing, then price the recovery. We will say so if starting again is cheaper.'],
    ['How do you keep a programme on time?', 'A weekly look-ahead, signed by the site lead and by you. Late items are named on the page, not folded into the next week.'],
    ['What happens after handover?', 'A twelve-month defects period, with walk-rounds at month six and month eleven, and one phone number that is answered.']
  ];
})();
