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
    http.get("/api/menuItemReviews", () => {
      return HttpResponse.json(
        menuItemReviewsFixtures.threeMenuItemReviews[0],
        {
          status: 200,
        },
      );
    }),
    http.put("/api/menuItemReviews", () => {
      return HttpResponse.json({}, { status: 200 });
    }),
    http.put("/api/menuItemReviews", (req) => {
      window.alert("PUT: " + req.url + " and body: " + req.body);
      return HttpResponse.json({}, { status: 200 });
    }),
  ],
};
