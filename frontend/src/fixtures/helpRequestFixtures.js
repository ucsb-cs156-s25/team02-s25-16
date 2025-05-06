const helpRequestFixtures = {
  oneHelpRequest: {
    id: 1,
    requesterEmail: "cgaucho@ucsb.edu",
    teamId: "team-1",
    tableOrBreakoutRoom: "16",
    requestTime: "2025-05-05T01:01:05",
    explanation: "the screen is broken",
    solved: false,
  },
  threeHelpRequests: [
    {
      id: 1,
      requesterEmail: "bob@ucsb.edu",
      teamId: "team-1",
      tableOrBreakoutRoom: "16",
      requestTime: "2025-05-05T01:01:05",
      explanation: "the screen is broken",
      solved: false,
    },
    {
      id: 2,
      requesterEmail: "johnjohn@ucsb.edu",
      teamId: "team-2",
      tableOrBreakoutRoom: "15",
      requestTime: "2025-05-05T01:01:04",
      explanation: "the explanation is broken",
      solved: false,
    },
    {
      id: 3,
      requesterEmail: "chris@ucsb.edu",
      teamId: "team-3",
      tableOrBreakoutRoom: "14",
      requestTime: "2025-05-05T01:01:03",
      explanation: "the table is broken",
      solved: false,
    },
  ],
};

export { helpRequestFixtures };
