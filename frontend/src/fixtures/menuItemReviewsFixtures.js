const menuItemReviewsFixtures = {
  oneMenuItemReview: {
    id: 1,
    itemId: 6,
    reviewerEmail: "christianjlee@gmail.com",
    stars: 3,
    comments: "really average",
    dateReviewed: "2025-01-10T10:00:00Z",
  },
  threeMenuItemReviews: [
    {
      id: 1,
      itemId: 6,
      reviewerEmail: "christianjlee@gmail.com",
      stars: 3,
      comments: "really average",
      dateReviewed: "2025-01-10T10:00:00Z",
    },
    {
      id: 2,
      itemId: 7,
      reviewerEmail: "jamessmith@gmail.com",
      stars: 1,
      comments: "horrible",
      dateReviewed: "2025-03-23T10:15:00Z",
    },
    {
      id: 3,
      itemId: 8,
      reviewerEmail: "johnjones@outlook.com",
      stars: 5,
      comments: "absolutely amazing",
      dateReviewed: "2025-04-13T08:15:00Z",
    },
  ],
};

export { menuItemReviewsFixtures };
