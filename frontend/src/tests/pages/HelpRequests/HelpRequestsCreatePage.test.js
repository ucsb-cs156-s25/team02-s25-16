import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HelpRequestsCreatePage from "main/pages/HelpRequests/HelpRequestsCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

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
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("HelpRequestsCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    jest.clearAllMocks();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  const queryClient = new QueryClient();
  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestsCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Requester Email")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /helprequests", async () => {
    
    const queryClient = new QueryClient();
    const helprequest = {
      id: 1,
      requesterEmail: "cgaucho@ucsb.edu",
      teamId: "team-1",
      tableOrBreakoutRoom: "16",
      requestTime: "2025-05-05T01:01:05",
      explanation: "the screen is broken",
      solved: false,
    };

    axiosMock.onPost("/api/helprequests/post").reply(202, helprequest);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestsCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Requester Email")).toBeInTheDocument();
    });

    const emailInput = screen.getByLabelText("Requester Email");
    expect(emailInput).toBeInTheDocument();

    const teamidInput = screen.getByLabelText("Team ID");
    expect(teamidInput).toBeInTheDocument();

    const tableInput = screen.getByLabelText("Table Or Breakout Room");
    expect(tableInput).toBeInTheDocument();

    const requestTimeInput = screen.getByLabelText("Request Time");
    expect(requestTimeInput).toBeInTheDocument();

    const explanationInput = screen.getByLabelText("Explanation");
    expect(explanationInput).toBeInTheDocument();

    const solvedInput = screen.getByLabelText("Solved");
    expect(solvedInput).toBeInTheDocument();

    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();

    fireEvent.change(emailInput, { target: { value: "cgaucho@ucsb.edu" } });
    fireEvent.change(teamidInput, { target: { value: "team-1" } });
    fireEvent.change(tableInput, { target: { value: "16" } });
    fireEvent.change(requestTimeInput, {
      target: { value: "2025-05-05T01:01:05" },
    });
    fireEvent.change(explanationInput, {
      target: { value: "the screen is broken" },
    });
    fireEvent.change(solvedInput, { target: { value: "false" } });

    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      requesterEmail: "cgaucho@ucsb.edu",
      teamId: "team-1",
      tableOrBreakoutRoom: "16",
      requestTime: "2025-05-05T01:01:05",
      explanation: "the screen is broken",
      solved: "false",
    });

    // assert - check that the toast was called with the expected message
    expect(mockToast).toBeCalledWith(
      "New help request Created - id: 1 requesterEmail: cgaucho@ucsb.edu",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/helprequests" });
  });
});