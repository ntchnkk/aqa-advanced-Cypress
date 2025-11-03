describe("Sign up form", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("button.hero-descriptor_btn.btn-primary").click();
  });

  describe("UI and Initial State", () => {
    it("Sign up form opens and is visible", () => {
      cy.get("app-signup-modal").should("be.visible");
    });

    it("All elements on the form are visible", () => {
      cy.contains("h4", "Registration").should("be.visible");
      cy.get("button.close").should("be.visible").and("not.be.disabled");
      cy.get("#signupName").should("be.visible").and("not.be.disabled");
      cy.get("#signupLastName").should("be.visible").and("not.be.disabled");
      cy.get("#signupEmail").should("be.visible").and("not.be.disabled");
      cy.get("#signupPassword").should("be.visible").and("not.be.disabled");
      cy.get("#signupRepeatPassword")
        .should("be.visible")
        .and("not.be.disabled");
    });

    it("Register button is visible and disabled by default", () => {
      cy.contains(".btn.btn-primary", "Register")
        .should("be.visible")
        .and("be.disabled");
    });

    it("All fields are empty when the form opens", () => {
      cy.get("#signupName").should("have.value", "");
      cy.get("#signupLastName").should("have.value", "");
      cy.get("#signupEmail").should("have.value", "");
      cy.get("#signupPassword").should("have.value", "");
      cy.get("#signupRepeatPassword").should("have.value", "");
    });

    it("No errors for input fields by default", () => {
      const fields = [
        "#signupName",
        "#signupLastName",
        "#signupEmail",
        "#signupPassword",
        "#signupRepeatPassword",
      ];
      fields.forEach((field) => {
        cy.get(field)
          .should("not.have.class", "is-invalid")
          .and("not.have.css", "border-color", "rgb(220, 53, 69)");
      });
      cy.get(".invalid-feedback p").should("not.exist");
      cy.contains("p.alert.alert-danger", "User already exists").should(
        "not.exist"
      );
    });
  });

  describe("Behavior and Interaction", () => {
    it("Register button becomes enabled only when all fields are valid", () => {
      cy.get("#signupName").type("Rina");
      cy.get("#signupLastName").type("Tester");
      cy.get("#signupEmail").type(`rina.n.qa+${Date.now()}@gmail.com`);
      cy.get("#signupPassword").type("123Aq!@#$%^&*");
      cy.get("#signupRepeatPassword").type("123Aq!@#$%^&*");
      cy.contains(".btn.btn-primary", "Register").should("not.be.disabled");
    });

    it("Register button is disabled when at least one field is not valid", () => {
      const fields = [
        "#signupName",
        "#signupLastName",
        "#signupEmail",
        "#signupPassword",
        "#signupRepeatPassword",
      ];
      const randomField = fields[Math.floor(Math.random() * fields.length)];

      cy.get("#signupName").type("Aa".repeat(10));
      cy.get("#signupLastName").type("Bb".repeat(10));
      cy.get("#signupEmail").type(`rina.n.qa+${Date.now()}@gmail.com`);
      cy.get("#signupPassword").type("ValidPa1");
      cy.get("#signupRepeatPassword").type("ValidPa1");
      cy.contains(".btn.btn-primary", "Register").should("not.be.disabled");

      cy.get(`${randomField}`).clear();
      cy.contains(".btn.btn-primary", "Register").should("be.disabled");
    });

    it("Error message disappears after correcting invalid input", () => {
      cy.get("#signupName").type("A").blur();
      cy.get(".invalid-feedback p").should("be.visible");
      cy.get("#signupName").clear().type("Kate").blur();
      cy.get(".invalid-feedback p").should("not.exist");
    });

    it("Sign up form is closed by close icon", () => {
      cy.get("button.close").click();
      cy.get("app-signup-modal").should("not.exist");
    });

    it("Sign up form is closed by clicking outside", () => {
      cy.get(".d-block").click("topLeft");
      cy.get("app-signup-modal").should("not.exist");
    });

    it("Sign up form is closed by pressing ESC", () => {
      cy.get("body").type("{esc}");
      cy.get("app-signup-modal").should("not.exist");
    });

    it("Form clears all fields after being closed and reopened", () => {
      let date = Date.now();
      cy.get("#signupName").type("Norah").should("have.value", "Norah");
      cy.get("#signupLastName").type("Leray").should("have.value", "Leray");
      cy.get("#signupEmail")
        .type(`rina.n.qa+${date}@gmail.com`)
        .should("have.value", `rina.n.qa+${date}@gmail.com`);
      cy.get("#signupPassword")
        .type("Password1234567")
        .should("have.value", "Password1234567");
      cy.get("#signupRepeatPassword")
        .type("Password1")
        .should("have.value", "Password1");

      cy.get("button.close").click();
      cy.get("app-signup-modal").should("not.exist");

      cy.get("button.hero-descriptor_btn.btn-primary").click();
      cy.get("app-signup-modal").should("be.visible");
      cy.get("#signupName").should("have.value", "");
      cy.get("#signupLastName").should("have.value", "");
      cy.get("#signupEmail").should("have.value", "");
      cy.get("#signupPassword").should("have.value", "");
      cy.get("#signupRepeatPassword").should("have.value", "");
    });

    it("Spaces are trimmed in 'Name' field", () => {
      cy.get("#signupName").type("  Kate  ").blur();
      cy.get("#signupName").should("have.value", "Kate");
    });

    it("Spaces are trimmed in 'Last name' field", () => {
      cy.get("#signupLastName").type("  Lastname  ").blur();
      cy.get("#signupLastName").should("have.value", "Lastname");
    });
  });

  describe("Positive test cases", () => {
    it("New user is registered with valid data", () => {
      let date = Date.now();
      cy.get("#signupName").type("Li");
      cy.get("#signupLastName").type("Wu");
      cy.get("#signupEmail").type(`rina.n.qa+${date}@gmail.com`);
      cy.get("#signupPassword").type("ValidPassword12");
      cy.get("#signupRepeatPassword").type("ValidPassword12");
      cy.contains(".btn.btn-primary", "Register")
        .should("not.be.disabled")
        .click();

      cy.get("#userNavDropdown").should("be.visible");
      cy.get("h1").should("have.text", "Garage");

      cy.get(".btn.btn-link.text-danger.btn-sidebar.sidebar_btn").click();
    });
  });

  describe("Negative test cases", () => {
    it("User is not registered with already existing email", () => {
      let date = Date.now();
      cy.get("#signupName").type("Anna");
      cy.get("#signupLastName").type("Smith");
      cy.get("#signupEmail").type(`rina.n.qa+${date}@gmail.com`);
      cy.get("#signupPassword").type("123456Vp");
      cy.get("#signupRepeatPassword").type("123456Vp");
      cy.contains(".btn.btn-primary", "Register")
        .and("not.be.disabled")
        .click();
      cy.get(".btn.btn-link.text-danger.btn-sidebar.sidebar_btn").click();
      cy.get("button.hero-descriptor_btn.btn-primary").click();

      cy.get("#signupName").type("Valery");
      cy.get("#signupLastName").type("Frost");
      cy.get("#signupEmail").type(`rina.n.qa+${date}@gmail.com`);
      cy.get("#signupPassword").type("123456Pv");
      cy.get("#signupRepeatPassword").type("123456Pv");
      cy.get(".btn.btn-primary")
        .contains("Register")
        .should("not.be.disabled")
        .click();
      cy.contains("p.alert.alert-danger", "User already exists").should(
        "be.visible"
      );
    });

    context('Field "Name" ', () => {
      it("Error message is shown for empty 'Name' field", () => {
        cy.get("#signupName").focus();
        cy.get("#signupName").blur();
        cy.get("#signupName").should("have.class", "is-invalid");
        cy.get("#signupName").should(
          "have.css",
          "border-color",
          "rgb(220, 53, 69)"
        );
        cy.get("#signupName")
          .parent()
          .find(".invalid-feedback p")
          .should("be.visible")
          .and("have.text", "Name required");
      });

      it("Error message is shown for too short name", () => {
        cy.get("#signupName").type("A").blur();
        cy.get("#signupName").should("have.class", "is-invalid");
        cy.get("#signupName").should(
          "have.css",
          "border-color",
          "rgb(220, 53, 69)"
        );
        cy.get("#signupName")
          .parent()
          .find(".invalid-feedback p")
          .should("be.visible")
          .and("have.text", "Name has to be from 2 to 20 characters long");
      });

      it("Error message is shown for too long name", () => {
        cy.get("#signupName").type("W".repeat(21)).blur();
        cy.get("#signupName").should("have.class", "is-invalid");
        cy.get("#signupName").should(
          "have.css",
          "border-color",
          "rgb(220, 53, 69)"
        );
        cy.get("#signupName")
          .parent()
          .find(".invalid-feedback p")
          .should("be.visible")
          .and("have.text", "Name has to be from 2 to 20 characters long");
      });

      it("Error message is shown for non-English letters in 'Name' field", () => {
        cy.get("#signupName").type("Abigaëlle").blur();
        cy.get("#signupName").should("have.class", "is-invalid");
        cy.get("#signupName").should(
          "have.css",
          "border-color",
          "rgb(220, 53, 69)"
        );
        cy.get("#signupName")
          .parent()
          .find(".invalid-feedback p")
          .should("be.visible")
          .and("have.text", "Name is invalid");
      });

      it("Error message is shown for special characters in 'Name' field", () => {
        cy.get("#signupName").type("Terry-'!#$").blur();
        cy.get("#signupName").should("have.class", "is-invalid");
        cy.get("#signupName").should(
          "have.css",
          "border-color",
          "rgb(220, 53, 69)"
        );
        cy.get("#signupName")
          .parent()
          .find(".invalid-feedback p")
          .should("be.visible")
          .and("have.text", "Name is invalid");
      });

      it("Error message is shown for numbers in 'Name' field", () => {
        cy.get("#signupName").type("666Test").blur();
        cy.get("#signupName").should("have.class", "is-invalid");
        cy.get("#signupName").should(
          "have.css",
          "border-color",
          "rgb(220, 53, 69)"
        );
        cy.get("#signupName")
          .parent()
          .find(".invalid-feedback p")
          .should("be.visible")
          .and("have.text", "Name is invalid");
      });

      it("Two error messages are shown for invalid too long name", () => {
        cy.get("#signupName").type("A                   y").blur();
        cy.get("#signupName").should("have.class", "is-invalid");
        cy.get("#signupName").should(
          "have.css",
          "border-color",
          "rgb(220, 53, 69)"
        );
        cy.get("#signupName")
          .parent()
          .find(".invalid-feedback p")
          .first()
          .should("be.visible")
          .and("have.text", "Name is invalid");
        cy.get("#signupName")
          .parent()
          .find(".invalid-feedback p")
          .last()
          .should("be.visible")
          .and("have.text", "Name has to be from 2 to 20 characters long");
      });
    });

    context('Field "Last name" ', () => {
      it("Error message is shown for empty 'Last name' field", () => {
        cy.get("#signupLastName").focus();
        cy.get("#signupLastName").blur();
        cy.get("#signupLastName").should("have.class", "is-invalid");
        cy.get("#signupLastName").should(
          "have.css",
          "border-color",
          "rgb(220, 53, 69)"
        );
        cy.get("#signupLastName")
          .parent()
          .find(".invalid-feedback p")
          .should("be.visible")
          .and("have.text", "Last name required");
      });

      it("Error message is shown for too short last name", () => {
        cy.get("#signupLastName").type("l").blur();
        cy.get("#signupLastName").should("have.class", "is-invalid");
        cy.get("#signupLastName").should(
          "have.css",
          "border-color",
          "rgb(220, 53, 69)"
        );
        cy.get("#signupLastName")
          .parent()
          .find(".invalid-feedback p")
          .should("be.visible")
          .and("have.text", "Last name has to be from 2 to 20 characters long");
      });

      it("Error message is shown for too long last name", () => {
        cy.get("#signupLastName").type("W".repeat(21)).blur();
        cy.get("#signupLastName").should("have.class", "is-invalid");
        cy.get("#signupLastName").should(
          "have.css",
          "border-color",
          "rgb(220, 53, 69)"
        );
        cy.get("#signupLastName")
          .parent()
          .find(".invalid-feedback p")
          .should("be.visible")
          .and("have.text", "Last name has to be from 2 to 20 characters long");
      });

      it("Error message is shown for non-English letters in last name", () => {
        cy.get("#signupLastName").type("Krüger").blur();
        cy.get("#signupLastName").should("have.class", "is-invalid");
        cy.get("#signupLastName").should(
          "have.css",
          "border-color",
          "rgb(220, 53, 69)"
        );
        cy.get("#signupLastName")
          .parent()
          .find(".invalid-feedback p")
          .should("be.visible")
          .and("have.text", "Last name is invalid");
      });

      it("Error message is shown for special characters in last name", () => {
        cy.get("#signupLastName").type("O'Henry-Kruz").blur();
        cy.get("#signupLastName").should("have.class", "is-invalid");
        cy.get("#signupLastName").should(
          "have.css",
          "border-color",
          "rgb(220, 53, 69)"
        );
        cy.get("#signupLastName")
          .parent()
          .find(".invalid-feedback p")
          .should("be.visible")
          .and("have.text", "Last name is invalid");
      });

      it("Error message is shown for numbers in last name", () => {
        cy.get("#signupLastName").type("Lastname2").blur();
        cy.get("#signupLastName").should("have.class", "is-invalid");
        cy.get("#signupLastName").should(
          "have.css",
          "border-color",
          "rgb(220, 53, 69)"
        );
        cy.get("#signupLastName")
          .parent()
          .find(".invalid-feedback p")
          .should("be.visible")
          .and("have.text", "Last name is invalid");
      });

      it("Two error messages are shown for invalid too long last name", () => {
        cy.get("#signupLastName").type("Spencer-Churchill-Douglas").blur();
        cy.get("#signupLastName").should("have.class", "is-invalid");
        cy.get("#signupLastName").should(
          "have.css",
          "border-color",
          "rgb(220, 53, 69)"
        );
        cy.get("#signupLastName")
          .parent()
          .find(".invalid-feedback p")
          .first()
          .should("be.visible")
          .and("have.text", "Last name is invalid");
        cy.get("#signupLastName")
          .parent()
          .find(".invalid-feedback p")
          .last()
          .should("be.visible")
          .and("have.text", "Last name has to be from 2 to 20 characters long");
      });
    });

    context('Field "Email" ', () => {
      it("Error message is shown for empty 'Email' field", () => {
        cy.get("#signupEmail").focus();
        cy.get("#signupEmail").blur();
        cy.get("#signupEmail").should("have.class", "is-invalid");
        cy.get("#signupEmail").should(
          "have.css",
          "border-color",
          "rgb(220, 53, 69)"
        );
        cy.get("#signupEmail")
          .parent()
          .find(".invalid-feedback p")
          .should("be.visible")
          .and("have.text", "Email required");
      });

      const invalidEmails = [
        "invalidemail",
        "testemail.com",
        "TestUser1@",
        "@gmail.com",
        "user@@gmail.com",
        "user test@gmail.com",
        "usertest.@gmail.com",
        "usertest@gmailcom",
      ];

      invalidEmails.forEach((email) => {
        it(`Error message is shown for invalid email format`, () => {
          cy.get("#signupEmail").type(email).blur();
          cy.get("#signupEmail").should("have.class", "is-invalid");
          cy.get("#signupEmail").should(
            "have.css",
            "border-color",
            "rgb(220, 53, 69)"
          );
          cy.get("#signupEmail")
            .parent()
            .find(".invalid-feedback p")
            .should("be.visible")
            .and("have.text", "Email is incorrect");
        });
      });
    });

    context('Field "Password" ', () => {
      it("Error message is shown for empty 'Password' field", () => {
        cy.get("#signupPassword").focus();
        cy.get("#signupPassword").blur();
        cy.get("#signupPassword").should("have.class", "is-invalid");
        cy.get("#signupPassword").should(
          "have.css",
          "border-color",
          "rgb(220, 53, 69)"
        );
        cy.get("#signupPassword")
          .parent()
          .find(".invalid-feedback p")
          .should("be.visible")
          .and("have.text", "Password required");
      });

      it("Error message is shown for too short password", () => {
        cy.get("#signupPassword").type("12345Pw").blur();
        cy.get("#signupPassword").should("have.class", "is-invalid");
        cy.get("#signupPassword").should(
          "have.css",
          "border-color",
          "rgb(220, 53, 69)"
        );
        cy.get("#signupPassword")
          .parent()
          .find(".invalid-feedback p")
          .should("be.visible")
          .and(
            "have.text",
            "Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter"
          );
      });

      it("Error message is shown for too long password", () => {
        cy.get("#signupPassword").type("Aa92".repeat(4)).blur();
        cy.get("#signupPassword").should("have.class", "is-invalid");
        cy.get("#signupPassword").should(
          "have.css",
          "border-color",
          "rgb(220, 53, 69)"
        );
        cy.get("#signupPassword")
          .parent()
          .find(".invalid-feedback p")
          .should("be.visible")
          .and(
            "have.text",
            "Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter"
          );
      });

      it("Error message is shown for password with no uppercase letter", () => {
        cy.get("#signupPassword").type("password123456").blur();
        cy.get("#signupPassword").should("have.class", "is-invalid");
        cy.get("#signupPassword").should(
          "have.css",
          "border-color",
          "rgb(220, 53, 69)"
        );
        cy.get("#signupPassword")
          .parent()
          .find(".invalid-feedback p")
          .should("be.visible")
          .and(
            "have.text",
            "Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter"
          );
      });

      it("Error message is shown for password with no lowercase letter", () => {
        cy.get("#signupPassword").type("PASSWORD12").blur();
        cy.get("#signupPassword").should("have.class", "is-invalid");
        cy.get("#signupPassword").should(
          "have.css",
          "border-color",
          "rgb(220, 53, 69)"
        );
        cy.get("#signupPassword")
          .parent()
          .find(".invalid-feedback p")
          .should("be.visible")
          .and(
            "have.text",
            "Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter"
          );
      });

      it("Error message is shown for password with no numbers", () => {
        cy.get("#signupPassword").type("Password").blur();
        cy.get("#signupPassword").should("have.class", "is-invalid");
        cy.get("#signupPassword").should(
          "have.css",
          "border-color",
          "rgb(220, 53, 69)"
        );
        cy.get("#signupPassword")
          .parent()
          .find(".invalid-feedback p")
          .should("be.visible")
          .and(
            "have.text",
            "Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter"
          );
      });
    });

    context('Field "Repeat Password" ', () => {
      it("Error message is shown for empty 'Repeat Password' field", () => {
        cy.get("#signupRepeatPassword").focus();
        cy.get("#signupRepeatPassword").blur();
        cy.get("#signupRepeatPassword").should("have.class", "is-invalid");
        cy.get("#signupRepeatPassword").should(
          "have.css",
          "border-color",
          "rgb(220, 53, 69)"
        );
        cy.get("#signupRepeatPassword")
          .parent()
          .find(".invalid-feedback p")
          .should("be.visible")
          .and("have.text", "Re-enter password required");
      });

      it("Error message is shown for not matching password", () => {
        cy.get("#signupPassword").type("Password12");
        cy.get("#signupRepeatPassword").type("Password13").blur();
        cy.get("#signupRepeatPassword").should("have.class", "is-invalid");
        cy.get("#signupRepeatPassword").should(
          "have.css",
          "border-color",
          "rgb(220, 53, 69)"
        );
        cy.get("#signupRepeatPassword")
          .parent()
          .find(".invalid-feedback p")
          .should("be.visible")
          .and("have.text", "Passwords do not match");
      });

      it("Error message is shown for too short re-enter password", () => {
        cy.get("#signupRepeatPassword").type("12345Pw").blur();
        cy.get("#signupRepeatPassword").should("have.class", "is-invalid");
        cy.get("#signupRepeatPassword").should(
          "have.css",
          "border-color",
          "rgb(220, 53, 69)"
        );
        cy.get("#signupRepeatPassword")
          .parent()
          .find(".invalid-feedback p")
          .should("be.visible")
          .and(
            "have.text",
            "Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter"
          );
      });

      it("Error message is shown for too long re-enter password", () => {
        cy.get("#signupRepeatPassword").type("Aa92".repeat(4)).blur();
        cy.get("#signupRepeatPassword").should("have.class", "is-invalid");
        cy.get("#signupRepeatPassword").should(
          "have.css",
          "border-color",
          "rgb(220, 53, 69)"
        );
        cy.get("#signupRepeatPassword")
          .parent()
          .find(".invalid-feedback p")
          .should("be.visible")
          .and(
            "have.text",
            "Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter"
          );
      });
    });
  });
});

describe("Log in", () => {
  it("User Log in via Custom command", () => {
    cy.login("rina.n.q+4@gmail.com", "Password1!");

    cy.get("#userNavDropdown").should("be.visible");
    cy.get("h1").should("have.text", "Garage");
  });
});
