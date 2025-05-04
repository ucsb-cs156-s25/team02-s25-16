import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import HelpRequestsEditPage from "main/pages/HelpRequests/HelpRequestsEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    useParams: () => ({
      id: 1,
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("HelpRequestsEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/helprequests", { params: { id: 1 } }).timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Help Request");
      expect(screen.queryByTestId("HelpRequestForm-requesterEmail")).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/helprequests", { params: { id: 1 } }).reply(200, {
        id: 1,
        requesterEmail: "cgaucho@ucsb.edu",
        teamId: "team-1",
        tableOrBreakoutRoom: "16",
        requestTime: "2025-05-05T01:01:05",
        explanation: "the screen is broken",
        solved: false,
      });
      axiosMock.onPut("/api/helprequests").reply(200, {
        id: 1,
        requesterEmail: "bobo@ucsb.edu",
        teamId: "team-2",
        tableOrBreakoutRoom: "17",
        requestTime: "2025-05-05T01:01:06",
        explanation: "big bad bad happen",
        solved: true,
      });
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("HelpRequestForm-id");

      const idField = screen.getByTestId("HelpRequestForm-id");
      const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
      const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
      const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
      const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
      const explanationField = screen.getByTestId("HelpRequestForm-explanation");
      const solvedField = screen.getByTestId("HelpRequestForm-solved");
      const submitButton = screen.getByTestId("HelpRequestForm-submit");
      
      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("1");
      expect(requesterEmailField).toBeInTheDocument();
      expect(requesterEmailField).toHaveValue("cgaucho@ucsb.edu");
      expect(teamIdField).toBeInTheDocument();
      expect(teamIdField).toHaveValue("team-1");
      expect(tableOrBreakoutRoomField).toBeInTheDocument();
      expect(tableOrBreakoutRoomField).toHaveValue("16");
      expect(requestTimeField).toBeInTheDocument();
      expect(requestTimeField.value.slice(0, 19)).toBe("2025-05-05T01:01:05");
      expect(explanationField).toBeInTheDocument();
      expect(explanationField).toHaveValue("the screen is broken");
      expect(solvedField).toBeInTheDocument();
      expect(solvedField).toHaveValue("false");
      expect(submitButton).toBeInTheDocument();

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(requesterEmailField, {
        target: { value: "bobo@ucsb.edu" },
      });
      fireEvent.change(explanationField, {
        target: { value: "big bad bad happen" },
      });
      fireEvent.change(solvedField, {
        target: { value: "true" },
      });
      fireEvent.change(tableOrBreakoutRoomField, {
        target: { value: "17" },
      });
      fireEvent.change(requestTimeField, {
        target: { value: "2025-05-05T01:01:06" },
      });
      fireEvent.change(teamIdField, {
        target: { value: "team-2" },
      });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toHaveBeenCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "Help Request Updated - id: 1 requester email: bobo@ucsb.edu",
      );

      expect(mockNavigate).toBeCalledWith({ to: "/helprequests" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 1 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          requesterEmail: "bobo@ucsb.edu",
          teamId: "team-2",
          tableOrBreakoutRoom: "17",
          requestTime: "2025-05-05T01:01:06.000",
          explanation: "big bad bad happen",
          solved: "true",
        }),
      ); // posted object
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/helprequests" });
    });
  });
});
