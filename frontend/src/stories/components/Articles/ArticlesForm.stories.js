import React from "react";
import ArticlesForm from "main/components/Articles/ArticlesForm";
import { articlesFixtures } from "fixtures/articlesFixtures";

export default {
  title: "components/Articles/ArticlesForm",
  component: ArticlesForm,
};

const Template = (args) => <ArticlesForm {...args} />;

export const Create = Template.bind({});
Create.args = {
  buttonLabel: "Create",
  submitAction: (data) => {
    console.log("Create Submit clicked with data:", data);
    window.alert("Create Submit clicked with data: " + JSON.stringify(data));
  },
};

export const Update = Template.bind({});
Update.args = {
  initialContents: articlesFixtures.oneArticle[0],
  buttonLabel: "Update",
  submitAction: (data) => {
    console.log("Update Submit clicked with data:", data);
    window.alert("Update Submit clicked with data: " + JSON.stringify(data));
  },
};
