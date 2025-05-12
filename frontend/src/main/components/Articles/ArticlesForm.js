import { Button, Form, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function ArticlesForm({
  initialContents,
  submitAction,
  buttonLabel = "Create",
}) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const navigate = useNavigate();
  const testIdPrefix = "ArticlesForm";

  useEffect(() => {
    if (initialContents) {
      reset(initialContents);
    }
  }, [initialContents, reset]);

  return (
    <Form onSubmit={handleSubmit(submitAction)}>
      <Row>
        {initialContents ? (
          <Col>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="id">Id</Form.Label>
              <Form.Control
                data-testid={`${testIdPrefix}-id`}
                id="id"
                type="text"
                {...register("id")}
                disabled
              />
            </Form.Group>
          </Col>
        ) : null}
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="title">Title</Form.Label>
            <Form.Control
              data-testid={`${testIdPrefix}-title`}
              id="title"
              type="text"
              isInvalid={Boolean(errors.title)}
              {...register("title", {
                required: "Title is required.",
                maxLength: {
                  value: 100,
                  message: "Max length is 100 characters.",
                },
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.title?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="url">URL</Form.Label>
            <Form.Control
              data-testid={`${testIdPrefix}-url`}
              id="url"
              type="text"
              isInvalid={Boolean(errors.url)}
              {...register("url", {
                required: "URL is required.",
                pattern: {
                  value: /^https?:\/\/[\w\-]+(\.[\w\-]+)+([^\s]+)?$/,
                  message: "Must be a valid URL (http:// or https://)",
                },
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.url?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="explanation">Explanation</Form.Label>
            <Form.Control
              data-testid={`${testIdPrefix}-explanation`}
              id="explanation"
              type="text"
              isInvalid={Boolean(errors.explanation)}
              {...register("explanation", {
                required: "Explanation is required.",
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.explanation?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="email">Email</Form.Label>
            <Form.Control
              data-testid={`${testIdPrefix}-email`}
              id="email"
              type="email"
              isInvalid={Boolean(errors.email)}
              {...register("email", {
                required: "Email is required.",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Must be a valid email address",
                },
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="dateAdded">Date Added</Form.Label>
            <Form.Control
              data-testid={`${testIdPrefix}-dateAdded`}
              id="dateAdded"
              type="datetime-local"
              isInvalid={Boolean(errors.dateAdded)}
              {...register("dateAdded", {
                required: "Date Added is required.",
                pattern: {
                  value: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
                  message: "Must be a valid date/time in YYYY-MM-DDTHH:MM format",
                },
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.dateAdded?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Button type="submit" data-testid={`${testIdPrefix}-submit`}>
            {buttonLabel}
          </Button>
          <Button
            variant="Secondary"
            onClick={() => navigate(-1)}
            data-testid={`${testIdPrefix}-cancel`}
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default ArticlesForm;
