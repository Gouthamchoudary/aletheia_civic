// Election data and utilities

export const NEXT_ELECTION = {
  name: "US Midterm Elections",
  date: new Date("2026-11-03T00:00:00"),
  description: "All 435 House seats and 34 Senate seats up for election",
  type: "Midterm",
};

export const getCountdown = () => {
  const now = new Date();
  const diff = NEXT_ELECTION.date - now;
  if (diff < 0)
    return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds, passed: false };
};

export const US_STATES = [
  {
    code: "AL",
    name: "Alabama",
    regDeadline: "15 days before election",
    earlyVoting: true,
    mailIn: "Excuse required",
  },
  {
    code: "AK",
    name: "Alaska",
    regDeadline: "30 days before election",
    earlyVoting: true,
    mailIn: "No excuse required",
  },
  {
    code: "AZ",
    name: "Arizona",
    regDeadline: "29 days before election",
    earlyVoting: true,
    mailIn: "No excuse required",
  },
  {
    code: "AR",
    name: "Arkansas",
    regDeadline: "30 days before election",
    earlyVoting: true,
    mailIn: "Excuse required",
  },
  {
    code: "CA",
    name: "California",
    regDeadline: "15 days before election",
    earlyVoting: true,
    mailIn: "All voters receive mail ballot",
  },
  {
    code: "CO",
    name: "Colorado",
    regDeadline: "Election Day",
    earlyVoting: true,
    mailIn: "All voters receive mail ballot",
  },
  {
    code: "CT",
    name: "Connecticut",
    regDeadline: "Election Day",
    earlyVoting: true,
    mailIn: "No excuse required",
  },
  {
    code: "DE",
    name: "Delaware",
    regDeadline: "24 days before election",
    earlyVoting: true,
    mailIn: "No excuse required",
  },
  {
    code: "FL",
    name: "Florida",
    regDeadline: "29 days before election",
    earlyVoting: true,
    mailIn: "No excuse required",
  },
  {
    code: "GA",
    name: "Georgia",
    regDeadline: "29 days before election",
    earlyVoting: true,
    mailIn: "No excuse required",
  },
  {
    code: "HI",
    name: "Hawaii",
    regDeadline: "Election Day",
    earlyVoting: true,
    mailIn: "All voters receive mail ballot",
  },
  {
    code: "ID",
    name: "Idaho",
    regDeadline: "Election Day",
    earlyVoting: true,
    mailIn: "No excuse required",
  },
  {
    code: "IL",
    name: "Illinois",
    regDeadline: "Election Day",
    earlyVoting: true,
    mailIn: "No excuse required",
  },
  {
    code: "IN",
    name: "Indiana",
    regDeadline: "29 days before election",
    earlyVoting: true,
    mailIn: "Excuse required",
  },
  {
    code: "IA",
    name: "Iowa",
    regDeadline: "Election Day",
    earlyVoting: true,
    mailIn: "No excuse required",
  },
  {
    code: "KS",
    name: "Kansas",
    regDeadline: "21 days before election",
    earlyVoting: true,
    mailIn: "No excuse required",
  },
  {
    code: "KY",
    name: "Kentucky",
    regDeadline: "29 days before election",
    earlyVoting: true,
    mailIn: "No excuse required",
  },
  {
    code: "LA",
    name: "Louisiana",
    regDeadline: "30 days before election",
    earlyVoting: true,
    mailIn: "Excuse required",
  },
  {
    code: "ME",
    name: "Maine",
    regDeadline: "Election Day",
    earlyVoting: true,
    mailIn: "No excuse required",
  },
  {
    code: "MD",
    name: "Maryland",
    regDeadline: "21 days before election",
    earlyVoting: true,
    mailIn: "No excuse required",
  },
  {
    code: "MA",
    name: "Massachusetts",
    regDeadline: "10 days before election",
    earlyVoting: true,
    mailIn: "No excuse required",
  },
  {
    code: "MI",
    name: "Michigan",
    regDeadline: "Election Day",
    earlyVoting: true,
    mailIn: "No excuse required",
  },
  {
    code: "MN",
    name: "Minnesota",
    regDeadline: "Election Day",
    earlyVoting: true,
    mailIn: "No excuse required",
  },
  {
    code: "MS",
    name: "Mississippi",
    regDeadline: "30 days before election",
    earlyVoting: false,
    mailIn: "Excuse required",
  },
  {
    code: "MO",
    name: "Missouri",
    regDeadline: "28 days before election",
    earlyVoting: false,
    mailIn: "No excuse required",
  },
  {
    code: "MT",
    name: "Montana",
    regDeadline: "Election Day",
    earlyVoting: true,
    mailIn: "All voters receive mail ballot",
  },
  {
    code: "NE",
    name: "Nebraska",
    regDeadline: "15 days before election",
    earlyVoting: true,
    mailIn: "No excuse required",
  },
  {
    code: "NV",
    name: "Nevada",
    regDeadline: "Election Day",
    earlyVoting: true,
    mailIn: "All voters receive mail ballot",
  },
  {
    code: "NH",
    name: "New Hampshire",
    regDeadline: "Election Day",
    earlyVoting: false,
    mailIn: "Excuse required",
  },
  {
    code: "NJ",
    name: "New Jersey",
    regDeadline: "21 days before election",
    earlyVoting: true,
    mailIn: "No excuse required",
  },
  {
    code: "NM",
    name: "New Mexico",
    regDeadline: "28 days before election",
    earlyVoting: true,
    mailIn: "No excuse required",
  },
  {
    code: "NY",
    name: "New York",
    regDeadline: "25 days before election",
    earlyVoting: true,
    mailIn: "No excuse required",
  },
  {
    code: "NC",
    name: "North Carolina",
    regDeadline: "25 days before election",
    earlyVoting: true,
    mailIn: "No excuse required",
  },
  {
    code: "ND",
    name: "North Dakota",
    regDeadline: "No registration required",
    earlyVoting: true,
    mailIn: "No excuse required",
  },
  {
    code: "OH",
    name: "Ohio",
    regDeadline: "30 days before election",
    earlyVoting: true,
    mailIn: "No excuse required",
  },
  {
    code: "OK",
    name: "Oklahoma",
    regDeadline: "25 days before election",
    earlyVoting: true,
    mailIn: "Excuse required",
  },
  {
    code: "OR",
    name: "Oregon",
    regDeadline: "Election Day",
    earlyVoting: true,
    mailIn: "All voters receive mail ballot",
  },
  {
    code: "PA",
    name: "Pennsylvania",
    regDeadline: "15 days before election",
    earlyVoting: false,
    mailIn: "No excuse required",
  },
  {
    code: "RI",
    name: "Rhode Island",
    regDeadline: "30 days before election",
    earlyVoting: true,
    mailIn: "No excuse required",
  },
  {
    code: "SC",
    name: "South Carolina",
    regDeadline: "30 days before election",
    earlyVoting: true,
    mailIn: "Excuse required",
  },
  {
    code: "SD",
    name: "South Dakota",
    regDeadline: "15 days before election",
    earlyVoting: true,
    mailIn: "No excuse required",
  },
  {
    code: "TN",
    name: "Tennessee",
    regDeadline: "30 days before election",
    earlyVoting: true,
    mailIn: "Excuse required",
  },
  {
    code: "TX",
    name: "Texas",
    regDeadline: "30 days before election",
    earlyVoting: true,
    mailIn: "Excuse required",
  },
  {
    code: "UT",
    name: "Utah",
    regDeadline: "Election Day",
    earlyVoting: true,
    mailIn: "All voters receive mail ballot",
  },
  {
    code: "VT",
    name: "Vermont",
    regDeadline: "Election Day",
    earlyVoting: true,
    mailIn: "No excuse required",
  },
  {
    code: "VA",
    name: "Virginia",
    regDeadline: "22 days before election",
    earlyVoting: true,
    mailIn: "No excuse required",
  },
  {
    code: "WA",
    name: "Washington",
    regDeadline: "Election Day",
    earlyVoting: true,
    mailIn: "All voters receive mail ballot",
  },
  {
    code: "WV",
    name: "West Virginia",
    regDeadline: "21 days before election",
    earlyVoting: true,
    mailIn: "No excuse required",
  },
  {
    code: "WI",
    name: "Wisconsin",
    regDeadline: "Election Day",
    earlyVoting: true,
    mailIn: "No excuse required",
  },
  {
    code: "WY",
    name: "Wyoming",
    regDeadline: "Election Day",
    earlyVoting: true,
    mailIn: "No excuse required",
  },
  {
    code: "DC",
    name: "Washington D.C.",
    regDeadline: "Election Day",
    earlyVoting: true,
    mailIn: "All voters receive mail ballot",
  },
];

export const QUICK_PROMPTS = [
  {
    label: "🗳️ Am I registered?",
    prompt: "How do I check if I am registered to vote?",
  },
  {
    label: "📅 Deadlines",
    prompt:
      "What are the key voter registration and voting deadlines I should know about?",
  },
  {
    label: "📬 Vote by Mail",
    prompt:
      "How does voting by mail work and how do I request an absentee ballot?",
  },
  {
    label: "🏛️ Find Polling Place",
    prompt: "How do I find my polling place or voting location?",
  },
  {
    label: "🆔 ID Requirements",
    prompt: "What ID do I need to bring to vote? Does it depend on my state?",
  },
  {
    label: "✅ First Time Voter",
    prompt:
      "I am a first-time voter. Walk me step-by-step through the entire voting process.",
  },
  {
    label: "📜 My Ballot",
    prompt:
      "What will be on my ballot and how do I research candidates and measures?",
  },
  {
    label: "♿ Accessibility",
    prompt:
      "What accessibility accommodations are available for voters with disabilities?",
  },
];

export const CIVIC_FACTS = [
  "Over 240 million Americans are eligible to vote, but only about 60% typically do in presidential elections.",
  "The 19th Amendment, granting women the right to vote, was ratified in 1920 — over 100 years ago.",
  "North Dakota is the only state that doesn't require voter registration.",
  "Election Day is always the first Tuesday after the first Monday in November.",
  "The Electoral College has 538 electors — a candidate needs 270 to win the presidency.",
  "18 states plus DC allow same-day voter registration at the polls.",
  "Oregon was the first state to conduct all elections entirely by mail, starting in 1998.",
  "The Help America Vote Act (HAVA) of 2002 modernized voting systems nationwide.",
  "You can vote if you've been convicted of a felony in many states — laws vary by state.",
  "Puerto Rico, Guam, and other US territories cannot vote in presidential elections.",
  "Most states offer early voting, but dates and locations vary by state.",
  "Local offices like school boards and city councils often have the most direct impact on daily life.",
  "Many states allow voters to track their mail ballot online.",
  "A provisional ballot is counted after election officials verify eligibility.",
  "Election results are not official until they are certified by state authorities.",
  "Mail ballots typically require a signature that is verified by election officials.",
  "You have the right to vote if you are in line when the polls close.",
  "Some states require ID while others accept a range of documents or no ID at all.",
  "Primary elections decide which candidates appear on the general election ballot.",
  "The Federal Voting Assistance Program supports overseas and military voters.",
  "Ballot measures let voters decide specific policies directly.",
  "Redistricting redraws district lines to reflect population changes after the census.",
];

export const getRandomFact = () =>
  CIVIC_FACTS[Math.floor(Math.random() * CIVIC_FACTS.length)];
