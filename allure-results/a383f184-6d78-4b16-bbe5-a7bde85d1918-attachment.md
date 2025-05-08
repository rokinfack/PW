# Test info

- Name: New Todo >> should append new items to the bottom of the list
- Location: /Users/rostandkinfack/playwright/poc-playwright/tests/dashboard.spec.ts:54:7

# Error details

```
Error: locator.fill: Test ended.
Call log:
  - waiting for getByPlaceholder('What needs to be done?')

    at createDefaultTodos (/Users/rostandkinfack/playwright/poc-playwright/tests/dashboard.spec.ts:417:19)
    at /Users/rostandkinfack/playwright/poc-playwright/tests/dashboard.spec.ts:56:11
```

# Test source

```ts
  317 |     const firstTodoCheck = todoItems.nth(0).getByRole('checkbox');
  318 |     await firstTodoCheck.check();
  319 |     await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);
  320 |     await expect(firstTodoCheck).toBeChecked();
  321 |     await expect(todoItems).toHaveClass(['completed', '']);
  322 |
  323 |     // Ensure there is 1 completed item.
  324 |     await checkNumberOfCompletedTodosInLocalStorage(page, 1);
  325 |
  326 |     // Now reload.
  327 |     await page.reload();
  328 |     await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);
  329 |     await expect(firstTodoCheck).toBeChecked();
  330 |     await expect(todoItems).toHaveClass(['completed', '']);
  331 |   });
  332 | });
  333 |
  334 | test.describe('Routing', () => {
  335 |   test.beforeEach(async ({ page }) => {
  336 |     await createDefaultTodos(page);
  337 |     // make sure the app had a chance to save updated todos in storage
  338 |     // before navigating to a new view, otherwise the items can get lost :(
  339 |     // in some frameworks like Durandal
  340 |     await checkTodosInLocalStorage(page, TODO_ITEMS[0]);
  341 |   });
  342 |
  343 |   test('should allow me to display active items', async ({ page }) => {
  344 |     const todoItem = page.getByTestId('todo-item');
  345 |     await page.getByTestId('todo-item').nth(1).getByRole('checkbox').check();
  346 |
  347 |     await checkNumberOfCompletedTodosInLocalStorage(page, 1);
  348 |     await page.getByRole('link', { name: 'Active' }).click();
  349 |     await expect(todoItem).toHaveCount(2);
  350 |     await expect(todoItem).toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
  351 |   });
  352 |
  353 |   test('should respect the back button', async ({ page }) => {
  354 |     const todoItem = page.getByTestId('todo-item'); 
  355 |     await page.getByTestId('todo-item').nth(1).getByRole('checkbox').check();
  356 |
  357 |     await checkNumberOfCompletedTodosInLocalStorage(page, 1);
  358 |
  359 |     await test.step('Showing all items', async () => {
  360 |       await page.getByRole('link', { name: 'All' }).click();
  361 |       await expect(todoItem).toHaveCount(3);
  362 |     });
  363 |
  364 |     await test.step('Showing active items', async () => {
  365 |       await page.getByRole('link', { name: 'Active' }).click();
  366 |     });
  367 |
  368 |     await test.step('Showing completed items', async () => {
  369 |       await page.getByRole('link', { name: 'Completed' }).click();
  370 |     });
  371 |
  372 |     await expect(todoItem).toHaveCount(1);
  373 |     await page.goBack();
  374 |     await expect(todoItem).toHaveCount(2);
  375 |     await page.goBack();
  376 |     await expect(todoItem).toHaveCount(3);
  377 |   });
  378 |
  379 |   test('should allow me to display completed items', async ({ page }) => {
  380 |     await page.getByTestId('todo-item').nth(1).getByRole('checkbox').check();
  381 |     await checkNumberOfCompletedTodosInLocalStorage(page, 1);
  382 |     await page.getByRole('link', { name: 'Completed' }).click();
  383 |     await expect(page.getByTestId('todo-item')).toHaveCount(1);
  384 |   });
  385 |
  386 |   test('should allow me to display all items', async ({ page }) => {
  387 |     await page.getByTestId('todo-item').nth(1).getByRole('checkbox').check();
  388 |     await checkNumberOfCompletedTodosInLocalStorage(page, 1);
  389 |     await page.getByRole('link', { name: 'Active' }).click();
  390 |     await page.getByRole('link', { name: 'Completed' }).click();
  391 |     await page.getByRole('link', { name: 'All' }).click();
  392 |     await expect(page.getByTestId('todo-item')).toHaveCount(3);
  393 |   });
  394 |
  395 |   test('should highlight the currently applied filter', async ({ page }) => {
  396 |     await expect(page.getByRole('link', { name: 'All' })).toHaveClass('selected');
  397 |     
  398 |     //create locators for active and completed links
  399 |     const activeLink = page.getByRole('link', { name: 'Active' });
  400 |     const completedLink = page.getByRole('link', { name: 'Completed' });
  401 |     await activeLink.click();
  402 |
  403 |     // Page change - active items.
  404 |     await expect(activeLink).toHaveClass('selected');
  405 |     await completedLink.click();
  406 |
  407 |     // Page change - completed items.
  408 |     await expect(completedLink).toHaveClass('selected');
  409 |   });
  410 | });
  411 |
  412 | async function createDefaultTodos(page: Page) {
  413 |   // create a new todo locator
  414 |   const newTodo = page.getByPlaceholder('What needs to be done?');
  415 |
  416 |   for (const item of TODO_ITEMS) {
> 417 |     await newTodo.fill(item);
      |                   ^ Error: locator.fill: Test ended.
  418 |     await newTodo.press('Enter');
  419 |   }
  420 | }
  421 |
  422 | async function checkNumberOfTodosInLocalStorage(page: Page, expected: number) {
  423 |   return await page.waitForFunction(e => {
  424 |     return JSON.parse(localStorage['react-todos']).length === e;
  425 |   }, expected);
  426 | }
  427 |
  428 | async function checkNumberOfCompletedTodosInLocalStorage(page: Page, expected: number) {
  429 |   return await page.waitForFunction(e => {
  430 |     return JSON.parse(localStorage['react-todos']).filter((todo: any) => todo.completed).length === e;
  431 |   }, expected);
  432 | }
  433 |
  434 | async function checkTodosInLocalStorage(page: Page, title: string) {
  435 |   return await page.waitForFunction(t => {
  436 |     return JSON.parse(localStorage['react-todos']).map((todo: any) => todo.title).includes(t);
  437 |   }, title);
  438 | }
  439 |
```