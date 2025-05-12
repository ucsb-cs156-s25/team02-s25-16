import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import ArticlesForm from "main/components/Articles/ArticlesForm";
import { articlesFixtures } from "fixtures/articlesFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("ArticlesForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>
    );
    await screen.findByText(/Title/);
    await screen.findByText(/Create/);
  });

  test("renders correctly when passing in an Article", async () => {
    render(
      <Router>
        <ArticlesForm initialContents={articlesFixtures.oneArticle} />
      </Router>
    );
    await screen.findByTestId("ArticlesForm-id");
    expect(screen.getByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId("ArticlesForm-id")).toHaveValue("1");
  });

  test("Correct error message on bad input", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>
    );

    const dateAddedField = await screen.findByTestId("ArticlesForm-dateAdded");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    fireEvent.change(dateAddedField, { target: { value: "bad-input" } });
    fireEvent.click(submitButton);

    await screen.findByText(/LocalDateTime is required./);
  });

  test("Correct error messages on missing input", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>
    );

    const submitButton = await screen.findByTestId("ArticlesForm-submit");
    fireEvent.click(submitButton);

    await screen.findByText(/Title is required./);
    expect(screen.getByText(/URL is required./)).toBeInTheDocument();
    expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
    expect(screen.getByText(/Email is required./)).toBeInTheDocument();
    expect(screen.getByText(/LocalDateTime is required./)).toBeInTheDocument();
  });

  test("No error messages on good input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <Router>
        <ArticlesForm submitAction={mockSubmitAction} />
      </Router>
    );

    const titleField = await screen.findByTestId("ArticlesForm-title");
    const urlField = screen.getByTestId("ArticlesForm-url");
    const explanationField = screen.getByTestId("ArticlesForm-explanation");
    const emailField = screen.getByTestId("ArticlesForm-email");
    const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    fireEvent.change(titleField, { target: { value: "title" } });
    fireEvent.change(urlField, { target: { value: "url" } });
    fireEvent.change(explanationField, { target: { value: "explanation" } });
    fireEvent.change(emailField, { target: { value: "email" } });
    fireEvent.change(dateAddedField, { target: { value: "2022-01-02T12:00" } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(screen.queryByText(/Title is required./)).not.toBeInTheDocument();
    expect(screen.queryByText(/URL is required./)).not.toBeInTheDocument();
    expect(screen.queryByText(/Explanation is required./)).not.toBeInTheDocument();
    expect(screen.queryByText(/Email is required./)).not.toBeInTheDocument();
    expect(screen.queryByText(/LocalDateTime is required./)).not.toBeInTheDocument();
    expect(screen.queryByText(/localDateTime must be in ISO format/)).not.toBeInTheDocument();
  });

  test("navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>
    );

    const cancelButton = await screen.findByTestId("ArticlesForm-cancel");
    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
