import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import UCSBDiningCommonsMenuItemIndexPage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";
import { UCSBDiningCommonsMenuItemFixtures } from "fixtures/UCSBDiningCommonsMenuItemFixtures";

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

describe("USCBDiningCommonsMenuItemIndexPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  const testId = "UCSBDiningCommonsMenuItemTable";

  const setupUserOnly = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  const setupAdminUser = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.adminUser);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  const queryClient = new QueryClient();

  test("Renders with Create Button for admin user", async () => {
    setupAdminUser();
    axiosMock.onGet("/api/ucsbdiningcommonsmenuitems/all").reply(200, []);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Create Menu Item/)).toBeInTheDocument();
    });
    const button = screen.getByText(/Create Menu Item/);
    expect(button).toHaveAttribute("href", "/ucsbdiningcommonsmenuitem/create");
    expect(button).toHaveAttribute("style", "float: right;");
  });

  test("renders three menu items correctly for regular user", async () => {
    setupUserOnly();
    axiosMock
      .onGet("/api/ucsbdiningcommonsmenuitems/all")
      .reply(200, UCSBDiningCommonsMenuItemFixtures.threeMenuItems);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-id`),
      ).toHaveTextContent("4");
    });
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      "5",
    );
    expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent(
      "6",
    );

    const createMenuItemButton = screen.queryByText("Create Menu Item");
    expect(createMenuItemButton).not.toBeInTheDocument();

    const code = screen.getByText("Portola");
    expect(code).toBeInTheDocument();

    const name = screen.getByText("Chicken");
    expect(name).toBeInTheDocument();

    // for non-admin users, details button is visible, but the edit and delete buttons should not be visible
    expect(
      screen.queryByTestId(
        "UCSBDiningCommonsMenuItemTable-cell-row-0-col-Delete-button",
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId(
        "UCSBDiningCommonsMenuItemTable-cell-row-0-col-Edit-button",
      ),
    ).not.toBeInTheDocument();
  });

  test("renders empty table when backend unavailable, user only", async () => {
    setupUserOnly();

    axiosMock.onGet("/api/ucsbdiningcommonsmenuitems/all").timeout();

    const restoreConsole = mockConsole();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
    });

    const errorMessage = console.error.mock.calls[0][0];
    expect(errorMessage).toMatch(
      "Error communicating with backend via GET on /api/ucsbdiningcommonsmenuitems/all",
    );
    restoreConsole();
  });

  test("what happens when you click delete, admin", async () => {
    setupAdminUser();

    axiosMock
      .onGet("/api/ucsbdiningcommonsmenuitems/all")
      .reply(200, UCSBDiningCommonsMenuItemFixtures.threeMenuItems);
    axiosMock
      .onDelete("/api/ucsbdiningcommonsmenuitems")
      .reply(200, "Menu Item with id 4 was deleted");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-id`),
      ).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "4",
    );

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith("Menu Item with id 4 was deleted");
    });

    await waitFor(() => {
      expect(axiosMock.history.delete.length).toBe(1);
    });
    expect(axiosMock.history.delete[0].url).toBe(
      "/api/ucsbdiningcommonsmenuitems",
    );
    expect(axiosMock.history.delete[0].params).toEqual({ id: 4 });
  });
});
