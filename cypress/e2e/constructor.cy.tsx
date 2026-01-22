const INGREDIENT = '[data-cy="ingredient-item"]';
const CONSTRUCTOR_ELEMENT = '[data-cy="burger-constructor"]';
const MODAL = '[data-cy="modal"]';
const MODAL_CLOSE = '[data-cy="modal-close-button"]';
const MODAL_OVERLAY = '[data-cy="modal-overlay"]';
const ORDER_BUTTON = '[data-cy="order-submit-button"]';

describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.intercept('POST', '**/api/orders', { fixture: 'orders.json' }).as(
      'createOrder'
    );

    cy.setCookie('accessToken', 'test-access-token');
    window.localStorage.setItem('refreshToken', 'test-refresh-token');

    cy.visit('/');

    cy.wait('@getIngredients', { timeout: 10000 }); // ждём ответ API
    cy.get(INGREDIENT, { timeout: 10000 }).should('have.length.at.least', 5);
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    window.localStorage.removeItem('refreshToken');
  });

  it('Ингредиенты видны', () => {
    cy.get(INGREDIENT)
      .should('have.length.at.least', 5)
      .each(($el, index) => {
        cy.wrap($el)
          .invoke('text')
          .then((text) => {
            console.log(`Ingredient ${index}:`, text.trim());
          });
      });
  });

  it('Добавление ингредиентов в конструктор', () => {
    cy.get(CONSTRUCTOR_ELEMENT).should('exist');

    cy.get(INGREDIENT)
      .contains('Краторная булка N-200i')
      .parents(INGREDIENT)
      .find('button')
      .click();

    cy.get(INGREDIENT)
      .contains(/Биокотлета/)
      .parents(INGREDIENT)
      .find('button')
      .click();

    cy.get(CONSTRUCTOR_ELEMENT)
      .contains('Краторная булка N-200i')
      .should('exist');
    cy.get(CONSTRUCTOR_ELEMENT)
      .contains(/Биокотлета/)
      .should('exist');
  });

  it('Работа модального окна ингредиента', () => {
    cy.get(INGREDIENT).contains('Краторная булка N-200i').click();
    cy.get(MODAL).should('exist').contains('Детали ингредиента');

    cy.get(MODAL).find(MODAL_CLOSE).click();
    cy.get(MODAL).should('not.exist');

    cy.get(INGREDIENT)
      .contains(/Биокотлета/)
      .click();

    cy.get(MODAL_OVERLAY).click({ force: true });
    cy.get(MODAL).should('not.exist');
  });

  it('Создание заказа и проверка модалки', () => {
    cy.get(INGREDIENT)
      .contains('Краторная булка N-200i')
      .parents(INGREDIENT)
      .find('button')
      .click();
    cy.get(INGREDIENT)
      .contains(/Биокотлета/)
      .parents(INGREDIENT)
      .find('button')
      .click();

    cy.get(ORDER_BUTTON).should('be.enabled').click();

    cy.wait('@createOrder');
    cy.get(MODAL).contains('123').should('exist'); // номер заказа из fixture
    cy.get(MODAL).find(MODAL_CLOSE).click();
    cy.get(MODAL).should('not.exist');

    cy.get(CONSTRUCTOR_ELEMENT)
      .should('not.contain.text', 'Краторная булка N-200i')
      .and('not.contain.text', /Биокотлета/);
  });
});
