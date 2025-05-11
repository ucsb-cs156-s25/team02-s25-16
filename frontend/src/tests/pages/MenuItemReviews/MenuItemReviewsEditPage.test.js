import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import MenuItemReviewsEditPage from "main/pages/MenuItemReviews/MenuItemReviewsEditPage";

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
      id: 17,
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("MenuItemReviewsEditPage tests", () => {
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
      axiosMock.onGet("/api/menuItemReviews", { params: { id: 17 } }).timeout();
    });

    const queryClient = new QueryClient();

    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Menu Item Review");
      expect(
        screen.queryByTestId("MenuItemReview-comments"),
      ).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
    const axiosMock = new AxiosMockAdapter(axios);
    const queryClient = new QueryClient();
    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      // Fixing the URL to match your component's useBackend URL
      axiosMock
        .onGet("/api/menuitemreviews", { params: { id: 17 } })
        .reply(200, {
          id: 17,
          itemId: 6,
          reviewerEmail: "christianjlee@gmail.com",
          stars: 3,
          comments: "really average",
          dateReviewed: "2025-01-10T10:34:00Z",
        });
      axiosMock.onPut("/api/menuitemreviews").reply(200, {
        id: 17,
        itemId: 7,
        reviewerEmail: "james@gmail.com",
        stars: 1,
        comments: "bad",
        dateReviewed: "2025-12-09T10:00:02Z",
      });
    });

    test("Is populated with the data provided", async () => {
      let capturedPutConfig = null; // capture the PUT request config

      // Override the PUT mock to capture config
      axiosMock.onPut("/api/menuitemreviews").reply((config) => {
        capturedPutConfig = config;
        return [
          200,
          {
            id: 17,
            itemId: 7,
            reviewerEmail: "james@gmail.com",
            stars: 1,
            comments: "bad",
            dateReviewed: "2025-12-09T10:00:02Z",
          },
        ];
      });

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("MenuItemReviewForm-id");

      const idField = screen.getByTestId("MenuItemReviewForm-id");
      const itemIdField = screen.getByLabelText("Item Id");
      const reviewerEmailField = screen.getByLabelText("Reviewer Email");
      const starsField = screen.getByLabelText("Stars");
      const commentsField = screen.getByLabelText("Comments");
      const dateReviewedField = screen.getByLabelText("Date Reviewed (in UTC)");

      const submitButton = screen.getByText("Update");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue(17);
      expect(itemIdField).toHaveValue(6);
      expect(reviewerEmailField).toHaveValue("christianjlee@gmail.com");
      expect(starsField).toHaveValue(3);
      expect(commentsField).toHaveValue("really average");
      expect(dateReviewedField).toHaveValue("2025-01-10T10:34");

      fireEvent.change(itemIdField, { target: { value: "7" } });
      fireEvent.change(reviewerEmailField, {
        target: { value: "james@gmail.com" },
      });
      fireEvent.change(starsField, { target: { value: "1" } });
      fireEvent.change(commentsField, { target: { value: "bad" } });
      fireEvent.change(dateReviewedField, {
        target: { value: "2025-12-09T10:00:02" },
      });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toHaveBeenCalled());

      expect(mockToast).toHaveBeenCalledWith(
        "Menu Item Review Updated - id: 17 comments: bad",
      );
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/menuItemReviews" });

      // Verify the PUT body
      const parsedConfig = JSON.parse(capturedPutConfig.data);
      expect(parsedConfig).toEqual({
        itemId: "7",
        reviewerEmail: "james@gmail.com",
        stars: "1",
        comments: "bad",
        dateReviewed: "2025-12-09T10:00:02.000Z",
      });

      // ✅ Mutation-killing line
      expect(capturedPutConfig.params).toEqual({ id: 17 });
    });
  });
});
