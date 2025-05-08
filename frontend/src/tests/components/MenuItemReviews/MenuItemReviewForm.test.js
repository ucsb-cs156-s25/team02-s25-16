import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import MenuItemReviewForm from "main/components/MenuItemReviews/MenuItemReviewForm";
import { menuItemReviewsFixtures } from "fixtures/menuItemReviewsFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

import { stripZAndTruncate } from "main/components/MenuItemReviews/MenuItemReviewForm";

const mockedNavigate = jest.fn();

const expectedDate = menuItemReviewsFixtures.oneMenuItemReview.dateReviewed
  .replace("Z", "")
  .slice(0, 16);

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("MenuItemReviewForm tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = [
    "Item Id",
    "Reviewer Email",
    "Stars",
    "Comments",
    "Date Reviewed (in UTC)",
  ];
  const testId = "MenuItemReviewForm";
  

  describe("stripZAndTruncate mutant-killing tests", () => {
    test("returns empty string for null or undefined", () => {
      expect(stripZAndTruncate(null)).toBe("");
      expect(stripZAndTruncate(undefined)).toBe("");
    });
  
    test("removes 'Z' from the string", () => {
      const input = "2024-05-01T12:34:56Z";
      const result = stripZAndTruncate(input);
      expect(result.includes("Z")).toBe(false);
    });
  
    test("returns exactly first 16 characters after removing Z", () => {
      const input = "2024-05-01T12:34:56Z";
      const result = stripZAndTruncate(input);
      expect(result).toBe("2024-05-01T12:34");
      expect(result.length).toBe(16);
    });
  
    test("does not remove characters if 'Z' is not present", () => {
      const input = "2024-05-01T12:34:56";
      const result = stripZAndTruncate(input);
      expect(result).toBe("2024-05-01T12:34");
    });
  
    test("short strings are returned unchanged (except for Z)", () => {
      expect(stripZAndTruncate("Z")).toBe("");             // single Z only
      expect(stripZAndTruncate("2024Z")).toBe("2024");     // Z removed
      expect(stripZAndTruncate("2024")).toBe("2024");       // no Z to remove
    });
  });
  
  
  test("submit button triggers submitAction", async () => {
    const mockSubmitAction = jest.fn();
  
    const initialContents = {
      id: 1,
      itemId: 101,
      reviewerEmail: "test@example.com",
      stars: 5,
      comments: "Great",
      dateReviewed: "2024-05-01T12:34:56Z",
    };
  
    render(
      <QueryClientProvider client={new QueryClient()}>
        <Router>
          <MenuItemReviewForm initialContents={initialContents} submitAction={mockSubmitAction} />
        </Router>
      </QueryClientProvider>
    );
  
    const submitButton = await screen.findByTestId("MenuItemReviewForm-submit");
    fireEvent.click(submitButton);
  
    await waitFor(() => {
      expect(mockSubmitAction).toHaveBeenCalled();
    });
  });
  

  test("renders correctly with no initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });
  });

  test("renders correctly when passing in initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm
            initialContents={menuItemReviewsFixtures.oneMenuItemReview}
          />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
    expect(screen.getByText(`Id`)).toBeInTheDocument();

    expect(screen.getByLabelText("Item Id")).toHaveValue(menuItemReviewsFixtures.oneMenuItemReview.itemId);
    expect(screen.getByLabelText("Reviewer Email")).toHaveValue(menuItemReviewsFixtures.oneMenuItemReview.reviewerEmail);
    expect(screen.getByLabelText("Stars")).toHaveValue(menuItemReviewsFixtures.oneMenuItemReview.stars);
    expect(screen.getByLabelText("Comments")).toHaveValue(menuItemReviewsFixtures.oneMenuItemReview.comments);
    expect(screen.getByLabelText("Date Reviewed (in UTC)")).toHaveValue(expectedDate);
      
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm />
        </Router>
      </QueryClientProvider>,
    );
    expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
    const cancelButton = screen.getByTestId(`${testId}-cancel`);

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("that the correct validations are performed", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    const submitButton = screen.getByText(/Create/);
    fireEvent.click(submitButton);

    await screen.findByText(/Item Id is required/);
    expect(screen.getByText(/Email is required/)).toBeInTheDocument();
    expect(screen.getByText(/Star rating is required/)).toBeInTheDocument();
    expect(screen.getByText(/Comment is required/)).toBeInTheDocument();
    expect(screen.getByText(/Date Reviewed is required/)).toBeInTheDocument();

    const reviewerEmailInput = screen.getByTestId(`${testId}-reviewerEmail`);
    fireEvent.change(reviewerEmailInput, {
      target: { value: "a".repeat(256) },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Max length 255 characters/)).toBeInTheDocument();
    });
  });
});
