package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.beans.factory.annotation.Autowired;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import java.time.LocalDateTime;

import edu.ucsb.cs156.example.WebTestCase;
import edu.ucsb.cs156.example.entities.HelpRequest;
import edu.ucsb.cs156.example.repositories.HelpRequestRepository;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class HelpRequestWebIT extends WebTestCase {
    @Autowired
    HelpRequestRepository helpRequestRepository;

    @Test
    public void admin_user_can_create_edit_delete_help_request() throws Exception {
        LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

        HelpRequest helprequest = HelpRequest.builder()
                        .requesterEmail("cgaucho@ucsb.edu")
                        .teamId("team2")
                        .tableOrBreakoutRoom("table2")
                        .requestTime(ldt1)
                        .explanation("need help")
                        .solved(true)
                        .build();
                        
        helpRequestRepository.save(helprequest);

        setupUser(true);

        page.getByText("Help Requests").click();

        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail"))
                .hasText("cgaucho@ucsb.edu");
        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-teamId")).hasText("team2");
        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-tableOrBreakoutRoom")).hasText("table2");
        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requestTime")).hasText("2022-01-03T00:00:00");
        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-explanation")).hasText("need help");
        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-solved")).hasText("true");

        page.getByTestId("HelpRequestTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit Help Request")).isVisible();
        page.getByTestId("HelpRequestForm-explanation").fill("screen turned purple");
        page.getByTestId("HelpRequestForm-submit").click();

        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-explanation")).hasText("screen turned purple");

        page.getByTestId("HelpRequestTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_help_request() throws Exception {
        setupUser(false);

        page.getByText("Help Requests").click();

        assertThat(page.getByText("Create Help Request")).not().isVisible();
    }

    @Test
    public void regular_user_can_create_help_request() throws Exception {
        setupUser(true);

        page.getByText("Help Requests").click();

        assertThat(page.getByText("Create Help Request")).isVisible();
    }
}