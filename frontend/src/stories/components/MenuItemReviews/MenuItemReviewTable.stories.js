import React from "react";
import MenuItemReviewTable from "main/components/MenuItemReviews/MenuItemReviewTable";
import { menuItemReviewsFixtures } from "fixtures/menuItemReviewsFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { http, HttpResponse } from "msw";

export default {
  title: "components/MenuItemReviews/MenuItemReviewTable",
  component: MenuItemReviewTable,
};

const Template = (args) => {
  return <MenuItemReviewTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  menuItemReviews: [],
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
  menuItemReviews: menuItemReviewsFixtures.threeMenuItemReviews,
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
  menuItemReviews: menuItemReviewsFixtures.threeMenuItemReviews,
  currentUser: currentUserFixtures.adminUser,
};

ThreeItemsAdminUser.parameters = {
  msw: [
    http.delete("/api/menuItemReviews", () => {
      return HttpResponse.json(
        { message: "Menu Item Review deleted successfully" },
        { status: 200 },
      );
    }),
  ],
};
