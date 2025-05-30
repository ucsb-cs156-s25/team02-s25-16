import React from "react";
import UCSBOrganizationTable from "main/components/UCSBOrganizations/UCSBOrganizationTable";
import { ucsbOrganizationFixtures } from "fixtures/ucsborganizationFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { http, HttpResponse } from "msw";

export default {
  title: "components/UCSBOrganizations/UCSBOrganizationTable",
  component: UCSBOrganizationTable,
};

const Template = (args) => {
  return <UCSBOrganizationTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  ucsborganizations: [],
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
  ucsborganizations: ucsbOrganizationFixtures.threeOrganization,
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
  ucsborganizations: ucsbOrganizationFixtures.threeOrganization,
  currentUser: currentUserFixtures.adminUser,
};

ThreeItemsAdminUser.parameters = {
  msw: [
    http.delete("/api/ucsborganizations", () => {
      return HttpResponse.json(
        { message: "Organization deleted successfully" },
        { status: 200 },
      );
    }),
  ],
};
