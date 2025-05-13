package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.microsoft.playwright.Page;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class RecommendationRequestWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_recommendation_request() throws Exception {
        // Setup admin user and navigate to page
        setupUser(true);

        // Important: Use waitForSelector to ensure the NavBar is fully loaded
        page.waitForSelector("nav");

        // Click on the recommendation requests link - use full exact text as seen in AppNavbar.js
        page.getByText("Recommendation Requests", new Page.GetByTextOptions().setExact(true)).click();

        // Click the create button
        page.getByText("Create RecommendationRequest").click();

        // Fill out the form
        page.getByTestId("RecommendationRequestForm-requesterEmail").fill("req@test.com");
        page.getByTestId("RecommendationRequestForm-professorEmail").fill("prof@test.com");
        page.getByTestId("RecommendationRequestForm-explanation").fill("test");
        page.getByTestId("RecommendationRequestForm-dateRequested").fill("2024-03-02T12:00");
        page.getByTestId("RecommendationRequestForm-dateNeeded").fill("2024-03-03T12:00");

        // For the dropdown, use selectOption instead of click
        page.getByTestId("RecommendationRequestForm-done").selectOption("false");

        // Submit the form
        page.getByTestId("RecommendationRequestForm-submit").click();

        // Verify the record was created
        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-requesterEmail"))
                .hasText("req@test.com");

        // Edit the record
        page.getByTestId("RecommendationRequestTable-cell-row-0-col-Edit-button").click();
        page.getByTestId("RecommendationRequestForm-explanation").fill("Seems like a cool chap!");
        page.getByTestId("RecommendationRequestForm-submit").click();

        // Verify the edit worked
        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-explanation"))
                .hasText("Seems like a cool chap!");

        // Delete the record
        page.getByTestId("RecommendationRequestTable-cell-row-0-col-Delete-button").click();

        // Verify it was deleted
        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-requesterEmail"))
                .not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_recommendation_request() throws Exception {
        setupUser(false);

        // Wait for nav to load
        page.waitForSelector("nav");

        // Click on recommendation requests link
        page.getByText("Recommendation Request").click();

        // Verify the create button is not present
        assertThat(page.getByText("Create RecommendationRequest")).not().isVisible();
    }
}