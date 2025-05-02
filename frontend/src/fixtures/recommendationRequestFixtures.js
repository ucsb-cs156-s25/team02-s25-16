const recommendationRequestFixtures = {
  oneRequest: {
    id: 1,
    requesterEmail: "test@email.com",
    professorEmail: "test@email.com",
    explanation: "test explanation",
    dateRequested: "2022-01-02T12:00:00",
    dateNeeded: "2022-01-02T12:00:00",
    done: false,
  },
  threeRequests: [
    {
      id: 1,
      requesterEmail: "1@email.com",
      professorEmail: "1@email.com",
      explanation: "explanation 1",
      dateRequested: "2022-01-02T12:00:00",
      dateNeeded: "2022-01-02T12:00:00",
      done: false,
    },
    {
      id: 2,
      requesterEmail: "2@email.com",
      professorEmail: "2@email.com",
      explanation: "explanation 2",
      dateRequested: "2022-01-02T12:00:00",
      dateNeeded: "2022-01-02T12:00:00",
      done: true,
    },
    {
      id: 3,
      requesterEmail: "3@email.com",
      professorEmail: "3@email.com",
      explanation: "explanation 3",
      dateRequested: "2022-01-02T12:00:00",
      dateNeeded: "2022-01-02T12:00:00",
      done: false,
    },
  ],
};

export { recommendationRequestFixtures };
