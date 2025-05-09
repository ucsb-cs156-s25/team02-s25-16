import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import HelpRequestsEditPage from "main/pages/HelpRequests/HelpRequestsEditPage";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";

export default {
  title: "pages/HelpRequests/HelpRequestsEditPage",
  component: HelpRequestsEditPage,
};

const Template = () => <HelpRequestsEditPage storybook={true} />;

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
    http.get("/api/helprequests", () => {
      return HttpResponse.json(helpRequestFixtures.threeHelpRequests[0], {
        status: 200,
      });
    }),
    http.put("/api/helprequests", () => {
      return HttpResponse.json(
        {
          id: 1,
          requesterEmail: "bobo@ucsb.edu",
          teamId: "team-2",
          tableOrBreakoutRoom: "17",
          requestTime: "2025-05-05T01:01:06",
          explanation: "big bad bad happen",
          solved: true,
        },
        { status: 200 },
      );
    }),
  ],
};
