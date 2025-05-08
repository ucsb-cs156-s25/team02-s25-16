import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import UCSBOrganizationsCreatePage from "main/pages/UCSBOrganizations/UCSBOrganizationsCreatePage";

import { ucsborganizationFixtures } from "fixtures/ucsborganizationFixtures";

export default {
  title: "pages/UCSBOrganizations/UCSBOrganizationsCreatePage",
  component: UCSBOrganizationsCreatePage,
};

const Template = () => <UCSBOrganizationsCreatePage storybook={true} />;

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
    http.post("/api/ucsborganizations/post", () => {
      return HttpResponse.json(ucsborganizationFixtures.oneOrganization[0], {
        status: 200,
      });
    }),
  ],
};
