import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import UCSBOrganizationsIndexPage from "main/pages/UCSBOrganizations/UCSBOrganizationsIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import mockConsole from "jest-mock-console";
import { ucsborganizationFixtures } from "fixtures/ucsborganizationFixtures";

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

describe("UCSBOrganizationsIndexPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);
  const testId = "UCSBOrganizationTable";

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
    axiosMock.onGet("/api/ucsborganization/all").reply(200, []);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Create ucsborganizations/)).toBeInTheDocument();
    });
    const button = screen.getByText(/Create ucsborganizations/);
    expect(button).toHaveAttribute("href", "/ucsborganizations/create");
    expect(button).toHaveAttribute("style", "float: right;");
  });

  test("renders threeUCSBOrganizations correctly for regular user", async () => {
    setupUserOnly();
    axiosMock
      .onGet("/api/ucsborganization/all")
      .reply(200, ucsborganizationFixtures.threeUCSBOrganization);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-orgCode`),
      ).toHaveTextContent("ZBT");
    });
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-orgCode`),
    ).toHaveTextContent("LOS");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-orgCode`),
    ).toHaveTextContent("DTD");

    const createUCSBOrganizationButton = screen.queryByText(
      "Create ucsborganizations",
    );
    expect(createUCSBOrganizationButton).not.toBeInTheDocument();

    const orgCode = screen.getByTestId(
      "UCSBOrganizationTable-cell-row-0-col-orgCode",
    );
    expect(orgCode).toHaveTextContent("ZBT");

    const orgTranslationShort = screen.getByTestId(
      "UCSBOrganizationTable-cell-row-0-col-orgTranslationShort",
    );
    expect(orgTranslationShort).toHaveTextContent("ZBT");

    const orgTranslation = screen.getByTestId(
      "UCSBOrganizationTable-cell-row-0-col-orgTranslation",
    );
    expect(orgTranslation).toHaveTextContent("Zeta Beta Tau");

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-inactive`),
    ).toHaveTextContent("false");

    expect(
      screen.queryByTestId(
        "UCSBOrganizationTable-cell-row-0-col-Delete-button",
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("UCSBOrganizationTable-cell-row-0-col-Edit-button"),
    ).not.toBeInTheDocument();
  });

  test("renders empty table when backend unavailable, user only", async () => {
    setupUserOnly();

    axiosMock.onGet("/api/ucsborganization/all").timeout();
    const restoreConsole = mockConsole();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
    });

    const errorMessage = console.error.mock.calls[0][0];
    expect(errorMessage).toMatch(
      "Error communicating with backend via GET on /api/ucsborganization/all",
    );
    restoreConsole();
  });

  test("what happens when you click delete, admin", async () => {
    setupAdminUser();

    axiosMock
      .onGet("/api/ucsborganization/all")
      .reply(200, ucsborganizationFixtures.threeUCSBOrganization);
    axiosMock
      .onDelete("/api/ucsborganization")
      .reply(200, "UCSBOrganization with orgCode ZBT was deleted");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-orgCode`),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-orgCode`),
    ).toHaveTextContent("ZBT");

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);

    // await waitFor(() => {
    //   expect(mockToast).toBeCalledWith(
    //     "UCSBOrganization with orgCode ZBT was deleted",
    //   );
    // });

    await waitFor(() => {
      expect(axiosMock.history.delete.length).toBe(1);
    });
    expect(axiosMock.history.delete[0].url).toBe("/api/ucsborganization");
    expect(axiosMock.history.delete[0].params).toEqual({ orgCode: "ZBT" });
  });
});
