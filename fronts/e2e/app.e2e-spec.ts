import { FrontsPage } from './app.po';

describe('fronts App', () => {
  let page: FrontsPage;

  beforeEach(() => {
    page = new FrontsPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
