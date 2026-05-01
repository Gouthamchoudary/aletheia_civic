export const LEARNING_TRACKS = [
  {
    id: "basics",
    title: "Voting Basics",
    duration: "15-20 min",
    summary: "Eligibility, registration, deadlines, and how elections work.",
    topics: [
      "Who can vote in federal elections",
      "How registration works in every state",
      "Key dates and deadlines to watch",
      "What is on a ballot",
    ],
    actions: [
      { label: "Check eligibility", url: "https://vote.gov" },
      { label: "Register to vote", url: "https://vote.gov/register/" },
    ],
  },
  {
    id: "research",
    title: "Ballot Research",
    duration: "20-30 min",
    summary: "Learn how to research candidates, measures, and judges.",
    topics: [
      "Compare candidates side by side",
      "Understand local offices and impact",
      "Read official voter guides",
      "Evaluate ballot measures",
    ],
    actions: [
      {
        label: "Find your sample ballot",
        url: "https://ballotpedia.org/Sample_Ballot_Lookup",
      },
      { label: "Voter guide", url: "https://www.vote411.org" },
    ],
  },
  {
    id: "methods",
    title: "Voting Methods",
    duration: "15-25 min",
    summary: "In-person, early voting, mail ballots, and drop-off options.",
    topics: [
      "How early voting works",
      "Mail-in and absentee rules by state",
      "Ballot tracking and signature curing",
      "What to bring on Election Day",
    ],
    actions: [
      {
        label: "Absentee voting info",
        url: "https://vote.gov/absentee-voting/",
      },
    ],
  },
  {
    id: "security",
    title: "Election Security",
    duration: "10-15 min",
    summary: "How ballots are protected, counted, and audited.",
    topics: [
      "Paper records and audit trails",
      "Chain of custody for ballots",
      "Post-election audits",
      "How results are certified",
    ],
    actions: [
      {
        label: "Learn about counting",
        url: "https://www.usa.gov/election-results",
      },
    ],
  },
  {
    id: "rights",
    title: "Voter Rights",
    duration: "10-15 min",
    summary: "Know your rights and what to do if problems occur.",
    topics: [
      "Voting rights and protections",
      "Provisional ballots",
      "Language assistance and accessibility",
      "Where to report issues",
    ],
    actions: [{ label: "Voter rights", url: "https://www.eac.gov/voters" }],
  },
  {
    id: "local",
    title: "Local Government 101",
    duration: "15-20 min",
    summary: "Understand local offices and why they matter.",
    topics: [
      "Mayor, city council, and county roles",
      "School boards and special districts",
      "Sheriffs, DAs, and judges",
      "Budget and policy impact",
    ],
    actions: [
      {
        label: "Learn about local offices",
        url: "https://www.usa.gov/state-election-office",
      },
    ],
  },
];

export const USER_GUIDES = [
  {
    title: "First-Time Voter",
    summary: "Start with eligibility, register early, and preview your ballot.",
    steps: [
      "Confirm your eligibility and registration status",
      "Set reminders for registration and ballot deadlines",
      "Research candidates and measures before Election Day",
      "Bring required ID or documents if your state requires it",
    ],
  },
  {
    title: "Student or Campus Voter",
    summary: "Decide whether to vote at school or in your home state.",
    steps: [
      "Pick one voting residence and register there",
      "Request a mail ballot if voting from another state",
      "Check ID rules for student IDs in your state",
      "Know campus polling locations and hours",
    ],
  },
  {
    title: "Overseas or Military (UOCAVA)",
    summary: "Use the federal postcard application and track your ballot.",
    steps: [
      "Submit the FPCA as early as possible",
      "Use email or fax options if allowed in your state",
      "Track ballot delivery and return deadlines",
      "Keep a copy of your materials for reference",
    ],
  },
  {
    title: "Accessibility Needs",
    summary: "Request accommodations and plan ahead for a smoother experience.",
    steps: [
      "Contact your local election office for options",
      "Ask about accessible equipment or curbside voting",
      "Bring a helper if your state allows assistance",
      "Confirm transportation and location accessibility",
    ],
  },
  {
    title: "Moving to a New State",
    summary: "Update registration and confirm your new polling location.",
    steps: [
      "Register in your new state before the deadline",
      "Check whether your old registration is canceled",
      "Verify your new polling place or vote-by-mail rules",
      "Update your address with the DMV if required",
    ],
  },
];

export const BALLOT_TOOLKIT = [
  {
    title: "Preview your sample ballot",
    detail:
      "Use official or non-partisan tools to see what will appear on your ballot.",
  },
  {
    title: "Research each race",
    detail: "Read about candidates for local, state, and federal positions.",
  },
  {
    title: "Evaluate ballot measures",
    detail:
      "Review fiscal impacts, endorsements, and arguments for and against.",
  },
  {
    title: "Make a voting plan",
    detail: "Decide when, where, and how you will vote.",
  },
  {
    title: "Track your ballot",
    detail:
      "If you vote by mail, track your ballot and resolve issues quickly.",
  },
];

export const COUNTING_FLOW = [
  {
    title: "Check-in and issue ballot",
    detail: "Voter identity is verified and a ballot is issued or activated.",
  },
  {
    title: "Ballot marking",
    detail:
      "The voter marks the ballot either by hand or with assistive devices.",
  },
  {
    title: "Secure ballot storage",
    detail:
      "Ballots are stored in secure containers with chain-of-custody logs.",
  },
  {
    title: "Tabulation",
    detail:
      "Ballots are counted by optical scanners or manually, depending on state rules.",
  },
  {
    title: "Post-election audits",
    detail: "Audits compare paper ballots to reported results.",
  },
  {
    title: "Certification",
    detail:
      "Officials certify results after audits and legal checks are complete.",
  },
];

export const SECURITY_PRACTICES = [
  "Paper ballots or paper backups are the standard in most jurisdictions.",
  "Ballots are stored with signed chain-of-custody procedures.",
  "Post-election audits detect and correct errors.",
  "Results are unofficial until certified by election officials.",
  "Voter rolls are protected and updated regularly.",
];

export const VOTER_RIGHTS = [
  "You have the right to vote if you are in line when polls close.",
  "You can ask for a provisional ballot if there is a registration issue.",
  "You can request language assistance in many jurisdictions.",
  "You can ask a poll worker for help if you have accessibility needs.",
  "You can report problems to your local election office.",
];

export const MYTHS = [
  {
    myth: "I can vote in two states if I live in both places.",
    fact: "You can only vote in one state and one residence at a time.",
  },
  {
    myth: "If I made a mistake, I have to leave the polling place.",
    fact: "You can request a new ballot in most jurisdictions before submitting it.",
  },
  {
    myth: "Mail ballots are not counted if they arrive after Election Day.",
    fact: "Many states count ballots postmarked by Election Day; rules vary by state.",
  },
  {
    myth: "I cannot vote if I missed the registration deadline.",
    fact: "Some states allow same-day registration or conditional ballots.",
  },
];

export const FAQS = [
  {
    q: "How do I check if I am registered?",
    a: "Use your state election website or a trusted tool like vote.gov or Vote411 to verify registration status.",
  },
  {
    q: "What ID do I need to vote?",
    a: "ID requirements vary by state. Some states require photo ID, others accept utility bills or do not require ID at all.",
  },
  {
    q: "What is a provisional ballot?",
    a: "A provisional ballot lets you vote if there is a registration issue. Election officials verify eligibility before counting it.",
  },
  {
    q: "Can I vote early?",
    a: "Most states offer early voting, but dates and locations vary. Check your state election office for details.",
  },
  {
    q: "How does vote-by-mail work?",
    a: "You request or receive a ballot, fill it out, and return it by mail or drop-off. Deadlines and signature rules vary by state.",
  },
  {
    q: "How do I track my ballot?",
    a: "Many states offer online ballot tracking through the election office website.",
  },
  {
    q: "What if I moved recently?",
    a: "Update your registration to your new address before the deadline. Some states allow same-day updates.",
  },
  {
    q: "Are voting machines connected to the internet?",
    a: "Most voting systems are not connected to the internet when tabulating votes, and they use paper records for audits.",
  },
  {
    q: "What if I need language assistance?",
    a: "Many jurisdictions provide translated materials or interpreters. Ask your election office what is available.",
  },
  {
    q: "Can I bring someone to help me vote?",
    a: "In many states you can bring a helper, but certain restrictions may apply. Ask poll workers for guidance.",
  },
];

export const GLOSSARY = [
  {
    term: "Absentee ballot",
    def: "A ballot cast by mail or in advance when you cannot vote in person.",
  },
  {
    term: "Early voting",
    def: "Voting in person before Election Day at designated locations.",
  },
  {
    term: "General election",
    def: "The election that decides which candidates take office.",
  },
  {
    term: "Primary election",
    def: "An election that selects party nominees for the general election.",
  },
  {
    term: "Provisional ballot",
    def: "A ballot that is counted after eligibility is verified.",
  },
  { term: "Sample ballot", def: "A preview of the ballot you will receive." },
  {
    term: "Ballot measure",
    def: "A policy question or law presented directly to voters.",
  },
  { term: "UOCAVA", def: "Law covering overseas and military voters." },
  { term: "Voter roll", def: "The official list of registered voters." },
  {
    term: "Certification",
    def: "The official confirmation of election results after audits.",
  },
];

export const RESOURCE_LINKS = [
  {
    name: "vote.gov",
    desc: "Official voter registration portal",
    url: "https://vote.gov",
  },
  {
    name: "USA.gov Elections",
    desc: "Federal election information",
    url: "https://www.usa.gov/election",
  },
  {
    name: "EAC",
    desc: "Election Assistance Commission resources",
    url: "https://www.eac.gov",
  },
  {
    name: "Vote411",
    desc: "Non-partisan voter guide",
    url: "https://www.vote411.org",
  },
  {
    name: "Ballotpedia",
    desc: "Ballot and candidate research",
    url: "https://ballotpedia.org",
  },
  {
    name: "FVAP",
    desc: "Overseas and military voting",
    url: "https://www.fvap.gov",
  },
];
