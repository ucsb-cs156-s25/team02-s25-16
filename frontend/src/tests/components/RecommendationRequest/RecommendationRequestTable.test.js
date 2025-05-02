import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import RecommendationRequestTable from "main/components/RecommendationRequest/RecommendationRequestTable";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));

describe("RecommendationRequestTable tests", () => {
  test("renders empty table correctly", () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act
    render(
      <Router>
        <RecommendationRequestTable requests={[]} currentUser={currentUser} />
      </Router>
    );

    // assert
    expect(screen.getByTestId("RecommendationRequestTable-header-id")).toBeInTheDocument();
    expect(screen.getByTestId("RecommendationRequestTable-header-requesterEmail")).toBeInTheDocument();
    expect(screen.getByTestId("RecommendationRequestTable-header-professorEmail")).toBeInTheDocument();
    expect(screen.getByTestId("RecommendationRequestTable-header-explanation")).toBeInTheDocument();
    expect(screen.getByTestId("RecommendationRequestTable-header-dateRequested")).toBeInTheDocument();
    expect(screen.getByTestId("RecommendationRequestTable-header-dateNeeded")).toBeInTheDocument();
    expect(screen.getByTestId("RecommendationRequestTable-header-done")).toBeInTheDocument();
  });

  test("Has the expected column headers, content and buttons for admin user", () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act
    render(
      <Router>
        <RecommendationRequestTable requests={recommendationRequestFixtures.threeRequests} currentUser={currentUser} />
      </Router>
    );

    // assert
    expect(screen.getByTestId("RecommendationRequestTable-header-id")).toBeInTheDocument();
    expect(screen.getByTestId("RecommendationRequestTable-header-requesterEmail")).toBeInTheDocument();
    expect(screen.getByTestId("RecommendationRequestTable-header-professorEmail")).toBeInTheDocument();
    expect(screen.getByTestId("RecommendationRequestTable-header-explanation")).toBeInTheDocument();
    expect(screen.getByTestId("RecommendationRequestTable-header-dateRequested")).toBeInTheDocument();
    expect(screen.getByTestId("RecommendationRequestTable-header-dateNeeded")).toBeInTheDocument();
    expect(screen.getByTestId("RecommendationRequestTable-header-done")).toBeInTheDocument();

    // Checking content
    expect(screen.getByTestId(`RecommendationRequestTable-cell-row-0-col-id`)).toHaveTextContent("1");
    expect(screen.getByTestId(`RecommendationRequestTable-cell-row-0-col-requesterEmail`)).toHaveTextContent("1@email.com");
    expect(screen.getByTestId(`RecommendationRequestTable-cell-row-0-col-professorEmail`)).toHaveTextContent("1@email.com");
    expect(screen.getByTestId(`RecommendationRequestTable-cell-row-0-col-explanation`)).toHaveTextContent("explanation 1");
    expect(screen.getByTestId(`RecommendationRequestTable-cell-row-0-col-dateRequested`)).toHaveTextContent("2022-01-02T12:00:00");
    expect(screen.getByTestId(`RecommendationRequestTable-cell-row-0-col-dateNeeded`)).toHaveTextContent("2022-01-02T12:00:00");
    expect(screen.getByTestId(`RecommendationRequestTable-cell-row-0-col-done`)).toHaveTextContent("false");

    // Check for presence of edit and delete buttons
    expect(screen.getByTestId(`RecommendationRequestTable-cell-row-0-col-Edit-button`)).toBeInTheDocument();
    expect(screen.getByTestId(`RecommendationRequestTable-cell-row-0-col-Delete-button`)).toBeInTheDocument();
  });

  test("Has the expected column headers, content for ordinary user", () => {
    // arrange
    const currentUser = currentUserFixtures.userOnly;

    // act
    render(
      <Router>
        <RecommendationRequestTable requests={recommendationRequestFixtures.threeRequests} currentUser={currentUser} />
      </Router>
    );

    // assert - check that the expected content is rendered
    expect(screen.getByTestId(`RecommendationRequestTable-cell-row-0-col-id`)).toHaveTextContent("1");
    expect(screen.getByTestId(`RecommendationRequestTable-cell-row-0-col-requesterEmail`)).toHaveTextContent("1@email.com");
    expect(screen.getByTestId(`RecommendationRequestTable-cell-row-0-col-professorEmail`)).toHaveTextContent("1@email.com");
    expect(screen.getByTestId(`RecommendationRequestTable-cell-row-0-col-explanation`)).toHaveTextContent("explanation 1");
    expect(screen.getByTestId(`RecommendationRequestTable-cell-row-0-col-dateRequested`)).toHaveTextContent("2022-01-02T12:00:00");
    expect(screen.getByTestId(`RecommendationRequestTable-cell-row-0-col-dateNeeded`)).toHaveTextContent("2022-01-02T12:00:00");
    expect(screen.getByTestId(`RecommendationRequestTable-cell-row-0-col-done`)).toHaveTextContent("false");

    // assert - check that the edit and delete buttons are NOT rendered
    expect(screen.queryByTestId(`RecommendationRequestTable-cell-row-0-col-Edit-button`)).not.toBeInTheDocument();
    expect(screen.queryByTestId(`RecommendationRequestTable-cell-row-0-col-Delete-button`)).not.toBeInTheDocument();
  });

  test("Edit button navigates to the edit page", () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act
    render(
      <Router>
        <RecommendationRequestTable requests={recommendationRequestFixtures.threeRequests} currentUser={currentUser} />
      </Router>
    );

    // assert - check that the expected content is rendered
    expect(screen.getByTestId(`RecommendationRequestTable-cell-row-0-col-id`)).toHaveTextContent("1");
    expect(screen.getByTestId(`RecommendationRequestTable-cell-row-0-col-requesterEmail`)).toHaveTextContent("1@email.com");

    // act - click the edit button
    fireEvent.click(screen.getByTestId(`RecommendationRequestTable-cell-row-0-col-Edit-button`));

    // assert - check that we navigate to the expected path
    expect(mockedNavigate).toHaveBeenCalledWith('/recommendationrequests/edit/1');
  });

  test("Delete button calls delete callback", () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;
    
    // act
    render(
      <Router>
        <RecommendationRequestTable requests={recommendationRequestFixtures.threeRequests} currentUser={currentUser} />
      </Router>
    );

    // assert - check that the expected content is rendered
    expect(screen.getByTestId(`RecommendationRequestTable-cell-row-0-col-id`)).toHaveTextContent("1");
    expect(screen.getByTestId(`RecommendationRequestTable-cell-row-0-col-requesterEmail`)).toHaveTextContent("1@email.com");

    // act - click the delete button
    fireEvent.click(screen.getByTestId(`RecommendationRequestTable-cell-row-0-col-Delete-button`));
    
    // assert - check that the navigate() was called with the expected path
    expect(mockedNavigate).not.toHaveBeenCalled();
  });
});