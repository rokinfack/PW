# Test info

- Name: Editing >> should hide other controls when editing
- Location: /Users/rostandkinfack/playwright/poc-playwright/tests/dashboard.spec.ts:205:7

# Error details

```
Error: locator.fill: Test ended.
Call log:
  - waiting for getByPlaceholder('What needs to be done?')

    at createDefaultTodos (/Users/rostandkinfack/playwright/poc-playwright/tests/dashboard.spec.ts:421:19)
    at /Users/rostandkinfack/playwright/poc-playwright/tests/dashboard.spec.ts:201:11
```

# Test source

```ts
  321 |     await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);
  322 |     await expect(firstTodoCheck).toBeChecked();
  323 |     await expect(todoItems).toHaveClass(['completed', '']);
  324 |
  325 |     // Ensure there is 1 completed item.
  326 |     await checkNumberOfCompletedTodosInLocalStorage(page, 1);
  327 |
  328 |     // Now reload.
  329 |     await page.reload();
  330 |     await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);
  331 |     await expect(firstTodoCheck).toBeChecked();
  332 |     await expect(todoItems).toHaveClass(['completed', '']);
  333 |   });
  334 | });
  335 |
  336 | test.describe('Routing', () => {
  337 |   test.beforeEach(async ({ page }) => {
  338 |     await createDefaultTodos(page);
  339 |     // make sure the app had a chance to save updated todos in storage
  340 |     // before navigating to a new view, otherwise the items can get lost :(
  341 |     // in some frameworks like Durandal
  342 |     await checkTodosInLocalStorage(page, TODO_ITEMS[0]);
  343 |   });
  344 |
  345 |   test('should allow me to display active items', async ({ page }) => {
  346 |     const todoItem = page.getByTestId('todo-item');
  347 |     await page.getByTestId('todo-item').nth(1).getByRole('checkbox').check();
  348 |
  349 |     await checkNumberOfCompletedTodosInLocalStorage(page, 1);
  350 |     await page.getByRole('link', { name: 'Active' }).click();
  351 |     await expect(todoItem).toHaveCount(2);
  352 |     await expect(todoItem).toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
  353 |   });
  354 |
  355 |   test('should respect the back button', async ({ page }) => {
  356 |     const todoItem = page.getByTestId('todo-item'); 
  357 |     await page.getByTestId('todo-item').nth(1).getByRole('checkbox').check();
  358 |
  359 |     await checkNumberOfCompletedTodosInLocalStorage(page, 1);
  360 |
  361 |     await test.step('Showing all items', async () => {
  362 |       await page.getByRole('link', { name: 'All' }).click();
  363 |       await expect(todoItem).toHaveCount(3);
  364 |     });
  365 |
  366 |     await test.step('Showing active items', async () => {
  367 |       await page.getByRole('link', { name: 'Active' }).click();
  368 |     });
  369 |
  370 |     await test.step('Showing completed items', async () => {
  371 |       await page.getByRole('link', { name: 'Completed' }).click();
  372 |     });
  373 |
  374 |     await expect(todoItem).toHaveCount(1);
  375 |     await page.goBack();
  376 |     await expect(todoItem).toHaveCount(2);
  377 |     await page.goBack();
  378 |     await expect(todoItem).toHaveCount(3);
  379 |   });
  380 |
  381 |   test('should allow me to display completed items', async ({ page }) => {
  382 |     await page.getByTestId('todo-item').nth(1).getByRole('checkbox').check();
  383 |     await checkNumberOfCompletedTodosInLocalStorage(page, 1);
  384 |     await page.getByRole('link', { name: 'Completed' }).click();
  385 |     await expect(page.getByTestId('todo-item')).toHaveCount(1);
  386 |   });
  387 |
  388 |   test('should allow me to display all items', async ({ page }) => {
  389 |     await page.getByTestId('todo-item').nth(1).getByRole('checkbox').check();
  390 |     await checkNumberOfCompletedTodosInLocalStorage(page, 1);
  391 |     await page.getByRole('link', { name: 'Active' }).click();
  392 |     await page.getByRole('link', { name: 'Completed' }).click();
  393 |     await page.getByRole('link', { name: 'All' }).click();
  394 |     await expect(page.getByTestId('todo-item')).toHaveCount(3);
  395 |   });
  396 |
  397 |   test('should highlight the currently applied filter', async ({ page }) => {
  398 |     await expect(page.getByRole('link', { name: 'All' })).toHaveClass('selected');
  399 |     
  400 |     //create locators for active and completed links
  401 |     const activeLink = page.getByRole('link', { name: 'Active' });
  402 |     const completedLink = page.getByRole('link', { name: 'Completed' });
  403 |     await activeLink.click();
  404 |
  405 |     // Page change - active items.
  406 |     await expect(activeLink).toHaveClass('selected');
  407 |     await completedLink.click();
  408 |
  409 |     // Page change - completed items.
  410 |     await expect(completedLink).toHaveClass('selected');
  411 |   });
  412 | });
  413 |
  414 | async function createDefaultTodos(page: Page) {
  415 |   // create a new todo locator
  416 |   const newTodo = page.getByPlaceholder('What needs to be done?');
  417 |
  418 |   for (const item of TODO_ITEMS) {
  419 |     await newTodo.fill(item);
  420 |     await newTodo.press('Enter');
> 421 |   }
      |    ^ Error: locator.fill: Test ended.
  422 | }
  423 |
  424 | async function checkNumberOfTodosInLocalStorage(page: Page, expected: number) {
  425 |   return await page.waitForFunction(e => {
  426 |     return JSON.parse(localStorage['react-todos']).length === e;
  427 |   }, expected);
  428 | }
  429 |
  430 | async function checkNumberOfCompletedTodosInLocalStorage(page: Page, expected: number) {
  431 |   return await page.waitForFunction(e => {
  432 |     return JSON.parse(localStorage['react-todos']).filter((todo: any) => todo.completed).length === e;
  433 |   }, expected);
  434 | }
  435 |
  436 | async function checkTodosInLocalStorage(page: Page, title: string) {
  437 |   return await page.waitForFunction(t => {
  438 |     return JSON.parse(localStorage['react-todos']).map((todo: any) => todo.title).includes(t);
  439 |   }, title);
  440 | }
  441 |
```