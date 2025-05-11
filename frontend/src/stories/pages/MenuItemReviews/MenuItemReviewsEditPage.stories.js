import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import MenuItemReviewsEditPage from "main/pages/MenuItemReviews/MenuItemReviewsEditPage";
import { menuItemReviewsFixtures } from "fixtures/menuItemReviewsFixtures";

export default {
  title: "pages/MenuItemReviews/MenuItemReviewsEditPage",
  component: MenuItemReviewsEditPage,
};

const Template = () => <MenuItemReviewsEditPage storybook={true} />;

export const Default = Template.bind({});
Default.parameters = {
  msw: [
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.userOnly, {
        status: 200,
      });
    }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither, {
        status: 200,
      });
    }),
    http.get("/api/menuitemreviews", () => {
      return HttpResponse.json(
        menuItemReviewsFixtures.threeMenuItemReviews[0],
        {
          status: 200,
        },
      );
    }),
    http.put("/api/menuitemreviews", () => {
      return HttpResponse.json(
        {
          id: 17,
          itemId: 7,
          reviewerEmail: "james@gmail.com",
          stars: 1,
          comments: "bad",
          dateReviewed: "2025-12-09T10:00:02Z",
        },
        { status: 200 },
      );
    }),
  ],
};
