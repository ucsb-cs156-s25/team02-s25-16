import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import ArticlesForm from "main/components/Articles/ArticlesForm";
import { articlesFixtures } from "fixtures/articlesFixtures";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("ArticlesForm tests", () => {
  const queryClient = new QueryClient();
  const testId = "ArticlesForm";

  test("renders correctly with no initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <ArticlesForm />
        </Router>
      </QueryClientProvider>
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Title/)).toBeInTheDocument();
    expect(screen.getByLabelText(/URL/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Explanation/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date Added/)).toBeInTheDocument();
  });

  test("renders correctly with initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <ArticlesForm initialContents={articlesFixtures.oneArticle[0]} />
        </Router>
      </QueryClientProvider>
    );

    expect(await screen.findByDisplayValue("How to Build a Spring Boot App")).toBeInTheDocument();
    expect(await screen.findByDisplayValue("https://example.com/spring-boot-article")).toBeInTheDocument();
    expect(await screen.findByDisplayValue("This article explains how to set up a Spring Boot application step by step.")).toBeInTheDocument();
    expect(await screen.findByDisplayValue("author1@example.com")).toBeInTheDocument();
    expect(await screen.findByDisplayValue("2024-05-01T10:00")).toBeInTheDocument(); 
    
  });

  test("validation errors on blank submit", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <ArticlesForm />
        </Router>
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByTestId(`${testId}-submit`));

    expect(await screen.findByText(/Title is required/)).toBeInTheDocument();
    expect(screen.getByText(/URL is required/)).toBeInTheDocument();
    expect(screen.getByText(/Explanation is required/)).toBeInTheDocument();
    expect(screen.getByText(/Email is required/)).toBeInTheDocument();
    expect(screen.getByText(/Date Added is required/)).toBeInTheDocument();
  });

  test("validation error on bad input", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <ArticlesForm />
        </Router>
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByTestId(`${testId}-url`), {
      target: { value: "bad-url" },
    });
    fireEvent.change(screen.getByTestId(`${testId}-email`), {
      target: { value: "bad-email" },
    });

    fireEvent.click(screen.getByTestId(`${testId}-submit`));

    expect(await screen.findByText(/Must be a valid URL/)).toBeInTheDocument();
    expect(screen.getByText(/Must be a valid email address/)).toBeInTheDocument();
  });

  test("calls submitAction on good input", async () => {
    const mockSubmit = jest.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <ArticlesForm submitAction={mockSubmit} />
        </Router>
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByTestId(`${testId}-title`), {
      target: { value: "Test Article" },
    });
    fireEvent.change(screen.getByTestId(`${testId}-url`), {
      target: { value: "https://example.com" },
    });
    fireEvent.change(screen.getByTestId(`${testId}-explanation`), {
      target: { value: "Explains everything" },
    });
    fireEvent.change(screen.getByTestId(`${testId}-email`), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId(`${testId}-dateAdded`), {
      target: { value: "2024-01-02T12:00" },
    });

    fireEvent.click(screen.getByTestId(`${testId}-submit`));

    await waitFor(() => expect(mockSubmit).toHaveBeenCalled());
  });

  test("navigate(-1) is called on cancel", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <ArticlesForm />
        </Router>
      </QueryClientProvider>
    );

    const cancelButton = screen.getByTestId(`${testId}-cancel`);
    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
