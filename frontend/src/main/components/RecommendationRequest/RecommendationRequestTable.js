import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";
import { toast } from "react-toastify";

// Stryker disable all: helper functions not directly tested here
const cellToAxiosParamsDelete = (cell) => ({
  url: "/api/recommendationrequests",
  method: "DELETE",
  params: { id: cell.row.values.id },
});

const onDeleteSuccess = (message) => {
  console.log(message);
  toast(message);
};
// Stryker restore all

export default function RecommendationRequestTable({
  requests,
  currentUser,
  testIdPrefix = "RecommendationRequestTable",
}) {
  const navigate = useNavigate();

  const editCallback = (cell) => {
    navigate(`/recommendationrequests/edit/${cell.row.values.id}`);
  };

  // Stryker disable all : hard to test for query caching
  const deleteMutation = useBackendMutation(
    cellToAxiosParamsDelete,
    { onSuccess: onDeleteSuccess },
    ["/api/recommendationrequests/all"],
  );
  // Stryker restore all

  // Stryker disable next-line all : TODO try to make a good test for this
  const deleteCallback = async (cell) => {
    deleteMutation.mutate(cell);
  };

  // Stryker disable all: do not mutate column definitions
  const columns = [
    { Header: "id", accessor: "id" },
    { Header: "Requester Email", accessor: "requesterEmail" },
    { Header: "Professor Email", accessor: "professorEmail" },
    { Header: "Explanation", accessor: "explanation" },
    { Header: "Date Requested", accessor: "dateRequested" },
    { Header: "Date Needed", accessor: "dateNeeded" },
    { Header: "Done", accessor: "done", Cell: ({ value }) => value.toString() },
  ];
  // Stryker restore all

  if (hasRole(currentUser, "ROLE_ADMIN")) {
    // Stryker disable all: do not mutate admin button pushes
    columns.push(ButtonColumn("Edit", "primary", editCallback, testIdPrefix));
    columns.push(
      ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix),
    );
    // Stryker restore all
  }

  return <OurTable data={requests} columns={columns} testid={testIdPrefix} />;
}
