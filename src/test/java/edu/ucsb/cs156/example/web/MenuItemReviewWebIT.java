package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;

import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;
import org.springframework.beans.factory.annotation.Autowired;
import edu.ucsb.cs156.example.entities.MenuItemReview;
import java.time.ZonedDateTime;
import edu.ucsb.cs156.example.repositories.MenuItemReviewRepository;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class MenuItemReviewWebIT extends WebTestCase {

    @Autowired
    MenuItemReviewRepository menuItemReviewRepository;

    @Test
    public void admin_user_can_create_edit_delete_reviews() throws Exception {
        ZonedDateTime zdt1 = ZonedDateTime.parse("2022-01-03T00:00:00Z");

        String comment1 = "This is a test review";
        MenuItemReview menuItemReview1 = MenuItemReview.builder()
                .itemId(1)
                .reviewerEmail("christianjlee@ucsb.edu")
                .stars(4)
                .comments(comment1)
                .dateReviewed(zdt1)
                .build();   
                        
        menuItemReviewRepository.save(menuItemReview1);

        setupUser(true);


        page.getByText("Menu Item Reviews").click();

        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-comments")).hasText(comment1);

        page.getByTestId("MenuItemReviewTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-comments")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_reviews() throws Exception {
        setupUser(false);

        page.getByText("Menu Item Reviews").click();

        assertThat(page.getByText("Create Menu Item Review")).not().isVisible();
    }

    @Test
    public void admin_user_can_see_create_review_button() throws Exception {
        setupUser(true);

        page.getByText("Menu Item Reviews").click();

        assertThat(page.getByText("Create Menu Item Review")).isVisible();
    }
}