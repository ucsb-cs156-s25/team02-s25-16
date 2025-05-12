import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import UCSBOrganizationForm from "main/components/UCSBOrganizations/UCSBOrganizationForm";
import { Navigate } from "react-router-dom";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBOrganizationEditPage({ storybook = false }) {
  let { orgCode } = useParams();
  
  // First, we need to get the organization by orgCode
  const {
    data: ucsborganization,
    error,
    status
  } = useBackend(
    [`/api/ucsborganization?orgCode=${orgCode}`],
    {
      method: "GET",
      url: "/api/ucsborganization",
      params: {
        orgCode: orgCode
      }
    }
  );
  
  // Once we have the organization, including its ID, we can update it
  const objectToAxiosPutParams = (ucsborganization) => ({
    url: "/api/ucsborganization",
    method: "PUT",
    params: {
      id: ucsborganization.id  // Use the numeric ID from the fetched data
    },
    data: ucsborganization  // Send the complete object
  });
  
  const onSuccess = (ucsborganization) => {
    toast(`UCSBOrganization Updated - orgCode: ${ucsborganization.orgCode}`);
  };
  
  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    ["/api/ucsborganization/all"]  // Make this key stale to trigger a reload
  );
  
  const { isSuccess } = mutation;
  
  const onSubmit = async (data) => {
    mutation.mutate(data);
  };
  
  if (isSuccess && !storybook) {
    return <Navigate to="/ucsborganizations" />;
  }
  
  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit UCSBOrganization</h1>
        {ucsborganization && (
          <UCSBOrganizationForm
            submitAction={onSubmit}
            buttonLabel={"Update"}
            initialContents={ucsborganization}
          />
        )}
      </div>
    </BasicLayout>
  );
}