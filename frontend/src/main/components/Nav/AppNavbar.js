import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";
import AppNavbarLocalhost from "main/components/Nav/AppNavbarLocalhost";

export default function AppNavbar({
  currentUser,
  systemInfo,
  doLogout,
  currentUrl = window.location.href,
}) {
  const oauthLogin = systemInfo?.oauthLogin || "/oauth2/authorization/google";

  return (
    <>
      {(currentUrl.startsWith("http://localhost:3000") ||
        currentUrl.startsWith("http://127.0.0.1:3000")) && (
        <AppNavbarLocalhost url={currentUrl} />
      )}

      <Navbar
        expand="xl"
        variant="dark"
        bg="dark"
        sticky="top"
        data-testid="AppNavbar"
      >
        <Container>
          <Navbar.Brand as={Link} to="/">
            Example
          </Navbar.Brand>

          <Navbar.Toggle />

          {/* Left-side utility links */}
          <Nav className="me-auto">
            {systemInfo?.springH2ConsoleEnabled && (
              <Nav.Link href="/h2-console">H2Console</Nav.Link>
            )}
            {systemInfo?.showSwaggerUILink && (
              <Nav.Link href="/swagger-ui/index.html">Swagger</Nav.Link>
            )}
          </Nav>

          <Navbar.Collapse className="justify-content-between">
            {/* Main navigation */}
            <Nav className="mr-auto">
              {hasRole(currentUser, "ROLE_ADMIN") && (
                <NavDropdown
                  title="Admin"
                  id="appnavbar-admin-dropdown"
                  data-testid="appnavbar-admin-dropdown"
                >
                  <NavDropdown.Item href="/admin/users">Users</NavDropdown.Item>
                </NavDropdown>
              )}

              {currentUser?.loggedIn && (
                <>
                  <Nav.Link as={Link} to="/articles">Articles</Nav.Link>
                  <Nav.Link as={Link} to="/diningcommonsmenuitem">Dining Commons Menu Item</Nav.Link>
                  <Nav.Link as={Link} to="/helprequest">Help Request</Nav.Link>
                  <Nav.Link as={Link} to="/helprequests">Help Requests</Nav.Link>
                  <Nav.Link as={Link} to="/menuitemreview">MenuItemReview</Nav.Link>
                  <Nav.Link as={Link} to="/menuitemreviews">Menu Item Reviews</Nav.Link>
                  <Nav.Link as={Link} to="/placeholder">Placeholder</Nav.Link>
                  <Nav.Link as={Link} to="/recommendationRequest">Recommendation Request</Nav.Link>
                  <Nav.Link as={Link} to="/recommendationrequests">Recommendation Requests</Nav.Link>
                  <Nav.Link as={Link} to="/restaurants">Restaurants</Nav.Link>
                  <Nav.Link as={Link} to="/ucsbdates">UCSB Dates</Nav.Link>
                  <Nav.Link as={Link} to="/ucsborganization">UCSB Organization</Nav.Link>
                  <Nav.Link as={Link} to="/ucsbdiningcommonsmenuitem">UCSB Dining Commons Menu Items</Nav.Link>
                </>
              )}
            </Nav>

            {/* Right-side auth */}
            <Nav className="ml-auto">
              {currentUser?.loggedIn ? (
                <>
                  <Navbar.Text className="me-3" as={Link} to="/profile">
                    Welcome,&nbsp;{currentUser.root.user.email}
                  </Navbar.Text>
                  <Button onClick={doLogout}>Log&nbsp;Out</Button>
                </>
              ) : (
                <Button href={oauthLogin}>Log&nbsp;In</Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
