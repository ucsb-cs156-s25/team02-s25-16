// src/tests/components/RecommendationRequest/RecommendationRequestTable.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import RecommendationRequestTable from "main/components/RecommendationRequest/RecommendationRequestTable";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("RecommendationRequestTable tests", () => {
  const queryClient = new QueryClient();

  test("renders empty table correctly", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <RecommendationRequestTable requests={[]} currentUser={currentUser} />
        </Router>
      </QueryClientProvider>,
    );

    expect(
      screen.getByTestId("RecommendationRequestTable-header-id"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("RecommendationRequestTable-header-requesterEmail"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("RecommendationRequestTable-header-professorEmail"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("RecommendationRequestTable-header-explanation"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("RecommendationRequestTable-header-dateRequested"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("RecommendationRequestTable-header-dateNeeded"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("RecommendationRequestTable-header-done"),
    ).toBeInTheDocument();
  });

  test("Has the expected column headers, content and buttons for admin user", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <RecommendationRequestTable
            requests={recommendationRequestFixtures.threeRequests}
            currentUser={currentUser}
          />
        </Router>
      </QueryClientProvider>,
    );

    // Headers
    expect(
      screen.getByTestId("RecommendationRequestTable-header-id"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("RecommendationRequestTable-header-requesterEmail"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("RecommendationRequestTable-header-professorEmail"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("RecommendationRequestTable-header-explanation"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("RecommendationRequestTable-header-dateRequested"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("RecommendationRequestTable-header-dateNeeded"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("RecommendationRequestTable-header-done"),
    ).toBeInTheDocument();

    // Row 0 content
    expect(
      screen.getByTestId("RecommendationRequestTable-cell-row-0-col-id"),
    ).toHaveTextContent("1");
    expect(
      screen.getByTestId(
        "RecommendationRequestTable-cell-row-0-col-requesterEmail",
      ),
    ).toHaveTextContent("1@email.com");
    expect(
      screen.getByTestId(
        "RecommendationRequestTable-cell-row-0-col-professorEmail",
      ),
    ).toHaveTextContent("1@email.com");
    expect(
      screen.getByTestId(
        "RecommendationRequestTable-cell-row-0-col-explanation",
      ),
    ).toHaveTextContent("explanation 1");
    expect(
      screen.getByTestId(
        "RecommendationRequestTable-cell-row-0-col-dateRequested",
      ),
    ).toHaveTextContent("2022-01-02T12:00:00");
    expect(
      screen.getByTestId(
        "RecommendationRequestTable-cell-row-0-col-dateNeeded",
      ),
    ).toHaveTextContent("2022-01-02T12:00:00");
    expect(
      screen.getByTestId("RecommendationRequestTable-cell-row-0-col-done"),
    ).toHaveTextContent("false");

    // Edit/Delete buttons present for admin
    expect(
      screen.getByTestId(
        "RecommendationRequestTable-cell-row-0-col-Edit-button",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(
        "RecommendationRequestTable-cell-row-0-col-Delete-button",
      ),
    ).toBeInTheDocument();
  });

  test("Has the expected content for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <RecommendationRequestTable
            requests={recommendationRequestFixtures.threeRequests}
            currentUser={currentUser}
          />
        </Router>
      </QueryClientProvider>,
    );

    // Row 0 content only
    expect(
      screen.getByTestId("RecommendationRequestTable-cell-row-0-col-id"),
    ).toHaveTextContent("1");
    expect(
      screen.getByTestId(
        "RecommendationRequestTable-cell-row-0-col-requesterEmail",
      ),
    ).toHaveTextContent("1@email.com");
    expect(
      screen.getByTestId(
        "RecommendationRequestTable-cell-row-0-col-professorEmail",
      ),
    ).toHaveTextContent("1@email.com");
    expect(
      screen.getByTestId(
        "RecommendationRequestTable-cell-row-0-col-explanation",
      ),
    ).toHaveTextContent("explanation 1");
    expect(
      screen.getByTestId(
        "RecommendationRequestTable-cell-row-0-col-dateRequested",
      ),
    ).toHaveTextContent("2022-01-02T12:00:00");
    expect(
      screen.getByTestId(
        "RecommendationRequestTable-cell-row-0-col-dateNeeded",
      ),
    ).toHaveTextContent("2022-01-02T12:00:00");
    expect(
      screen.getByTestId("RecommendationRequestTable-cell-row-0-col-done"),
    ).toHaveTextContent("false");

    // No Edit/Delete buttons
    expect(
      screen.queryByTestId(
        "RecommendationRequestTable-cell-row-0-col-Edit-button",
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId(
        "RecommendationRequestTable-cell-row-0-col-Delete-button",
      ),
    ).not.toBeInTheDocument();
  });

  test("Edit button navigates correctly", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <RecommendationRequestTable
            requests={recommendationRequestFixtures.threeRequests}
            currentUser={currentUser}
          />
        </Router>
      </QueryClientProvider>,
    );

    fireEvent.click(
      screen.getByTestId(
        "RecommendationRequestTable-cell-row-0-col-Edit-button",
      ),
    );
    expect(mockedNavigate).toHaveBeenCalledWith(
      "/recommendationrequests/edit/1",
    );
  });

  test("Delete button calls delete (without navigation)", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <RecommendationRequestTable
            requests={recommendationRequestFixtures.threeRequests}
            currentUser={currentUser}
          />
        </Router>
      </QueryClientProvider>,
    );

    fireEvent.click(
      screen.getByTestId(
        "RecommendationRequestTable-cell-row-0-col-Delete-button",
      ),
    );
    expect(mockedNavigate).not.toHaveBeenCalled();
  });
});
