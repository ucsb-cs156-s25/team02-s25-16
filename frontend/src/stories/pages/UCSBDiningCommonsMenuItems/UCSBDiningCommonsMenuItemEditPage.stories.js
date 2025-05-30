import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import UCSBDiningCommonsMenuItemEditPage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemEditPage";
import { UCSBDiningCommonsMenuItemFixtures } from "fixtures/UCSBDiningCommonsMenuItemFixtures";

export default {
  title: "pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemEditPage",
  component: UCSBDiningCommonsMenuItemEditPage,
};

const Template = () => <UCSBDiningCommonsMenuItemEditPage storybook={true} />;

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
    http.get("/api/ucsbdiningcommonsmenuitems", () => {
      return HttpResponse.json(
        UCSBDiningCommonsMenuItemFixtures.threeMenuItems[0],
        {
          status: 200,
        },
      );
    }),
    http.put("/api/ucsbdiningcommonsmenuitems", () => {
      return HttpResponse.json(
        UCSBDiningCommonsMenuItemFixtures.threeMenuItems[0],
        { status: 200 },
      );
    }),
    http.put("/api/ucsbdiningcommonsmenuitems", (req) => {
      window.alert("PUT: " + req.url + " and body: " + req.body);
      return HttpResponse.json(
        UCSBDiningCommonsMenuItemFixtures.threeMenuItems[0],
        { status: 200 },
      );
    }),
  ],
};
