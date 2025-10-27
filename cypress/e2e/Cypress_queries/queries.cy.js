describe("Buttons", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  context("Header buttons", () => {
    it("Find all header buttons", () => {
      cy.get("header button, a.btn")
        .should("have.length", 5)
        .should("be.visible");
    });

    it("Find 'About' button", () => {
      cy.get("header")
        .find("button[appscrollto='aboutSection']")
        .should("be.visible");
    });

    it('Find "Contacts" button', () => {
      cy.get('header button[appscrollto="contactsSection"]').should(
        "be.visible"
      );
    });

    it('Find "Guest log in" button', () => {
      cy.get("header").within(() => {
        cy.get("button.header-link.-guest").should("be.visible");
      });
    });

    it('Find "Sign in" button', () => {
      cy.get("header .btn.btn-outline-white.header_signin").should(
        "be.visible"
      );
    });

    it('Find "Home" button', () => {
      cy.get("header a.btn.header-link.-active[href='/']").should("be.visible");
    });
  });

  context("Footer buttons", () => {
    it("Find all footer buttons", () => {
      cy.get("a.socials_link, a.contacts_link")
        .should("have.length", 7)
        .should("be.visible");
    });

    it("Find FB button", () => {
      cy.get(".socials_icon.icon-facebook").parent("a").should("be.visible");
    });

    it("Find Telegram button", () => {
      cy.get(".socials_icon.icon-telegram").parent("a").should("be.visible");
    });

    it("Find Youtube button", () => {
      cy.get(".socials_icon.icon-youtube").parent("a").should("be.visible");
    });

    it("Find Instagram button", () => {
      cy.get(".socials_icon.icon-instagram").parent("a").should("be.visible");
    });

    it("Find Linkedin button", () => {
        cy.get(".socials_icon.icon-linkedin")
            .parent("a")
            .should("be.visible");
    });
      
      it("Find ITHillel button", () => {
          cy.get("a.contacts_link.display-4")
              .should("be.visible");
      });

      it("Find Support button", () => {
        cy.get("a.contacts_link.h4").contains('support').should("be.visible");
      });
  });
});
