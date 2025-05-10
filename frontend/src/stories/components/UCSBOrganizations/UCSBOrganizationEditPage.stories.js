import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import UCSBOrganizationEditPage from "main/pages/UCSBOrganizations/UCSBOrganizationsEditPage";
import { ucsborganizationFixtures } from "fixtures/ucsborganizationFixtures";

export default {
  title: "pages/UCSBOrganizations/UCSBOrganizationsEditPage",
  component: UCSBOrganizationEditPage,
};

const Template = () => <UCSBOrganizationEditPage storybook={true} />;

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
    http.get("/api/ucsborganization", () => {
      return HttpResponse.json(
        ucsborganizationFixtures.threeUCSBOrganization[0],
        {
          status: 200,
        },
      );
    }),
    http.put("/api/ucsborganization", () => {
      return HttpResponse.json(ucsborganizationFixtures.oneOrganization[0], {
        status: 200,
      });
    }),
  ],
};
