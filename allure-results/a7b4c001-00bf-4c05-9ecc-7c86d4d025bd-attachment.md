# Test info

- Name: New Todo >> should clear text input field when an item is added
- Location: /Users/rostandkinfack/playwright/poc-playwright/tests/dashboard.spec.ts:41:7

# Error details

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByPlaceholder('What needs to be done?')

    at /Users/rostandkinfack/playwright/poc-playwright/tests/dashboard.spec.ts:46:19
```

# Test source

```ts
   1 |
   2 | import { Page } from '@playwright/test';
   3 | import { test, expect} from '../fixtures/fixtures'; // ou '@hooks' si tu configures un alias
   4 | import  '../fixtures/hooks'; // ou '@hooks' si tu configures un alias
   5 |
   6 | test.beforeEach(async ({ page }) => {
   7 |   await page.goto('https://demo.playwright.dev/todomvc');
   8 | });
   9 |
   10 | const TODO_ITEMS = [
   11 |   'buy some cheese',
   12 |   'feed the cat',
   13 |   'book a doctors appointment'
   14 | ] as const;
   15 |
   16 | test.describe('New Todo', () => {
   17 |   test('should allow me to add todo items', async ({ page }) => {
   18 |     // create a new todo locator
   19 |     const newTodo = page.getByPlaceholder('What needs to be done?');
   20 |
   21 |     // Create 1st todo.
   22 |     await newTodo.fill(TODO_ITEMS[0]);
   23 |     await newTodo.press('Enter');
   24 |
   25 |     // Make sure the list only has one todo item.
   26 |     await expect(page.getByTestId('todo-title')).toHaveText([
   27 |       TODO_ITEMS[0]
   28 |     ]);
   29 |
   30 |     // Create 2nd todo.
   31 |     await newTodo.fill(TODO_ITEMS[1]);
   32 |     await newTodo.press('Enter');
   33 |
   34 |     // Make sure the list now has two todo items.
   35 |     await expect(page.getByTestId('todo-title')).toHaveText([
   36 |       TODO_ITEMS[0],
   37 |       TODO_ITEMS[1]
   38 |     ]);
   39 |
   40 |     await checkNumberOfTodosInLocalStorage(page, 2);
   41 |   });
   42 |
   43 |   test('should clear text input field when an item is added', async ({ page }) => {
   44 |     // create a new todo locator
   45 |     const newTodo = page.getByPlaceholder('What needs to be done?');
>  46 |
      | ^ Error: locator.fill: Test timeout of 30000ms exceeded.
   47 |     // Create one todo item.
   48 |     await newTodo.fill(TODO_ITEMS[0]);
   49 |     await newTodo.press('Enter');
   50 |
   51 |     // Check that input is empty.
   52 |     await expect(newTodo).toBeEmpty();
   53 |     await checkNumberOfTodosInLocalStorage(page, 1);
   54 |   });
   55 |
   56 |   test('should append new items to the bottom of the list', async ({ page }) => {
   57 |     // Create 3 items.
   58 |     await createDefaultTodos(page);
   59 |
   60 |     // create a todo count locator
   61 |     const todoCount = page.getByTestId('todo-count')
   62 |   
   63 |     // Check test using different methods.
   64 |     await expect(page.getByText('3 items left')).toBeVisible();
   65 |     await expect(todoCount).toHaveText('3 items left');
   66 |     await expect(todoCount).toContainText('3');
   67 |     await expect(todoCount).toHaveText(/3/);
   68 |
   69 |     // Check all items in one call.
   70 |     await expect(page.getByTestId('todo-title')).toHaveText(TODO_ITEMS);
   71 |     await checkNumberOfTodosInLocalStorage(page, 3);
   72 |   });
   73 | });
   74 |
   75 | test.describe('Mark all as completed', () => {
   76 |   test.beforeEach(async ({ page }) => {
   77 |     await createDefaultTodos(page);
   78 |     await checkNumberOfTodosInLocalStorage(page, 3);
   79 |   });
   80 |
   81 |   test.afterEach(async ({ page }) => {
   82 |     await checkNumberOfTodosInLocalStorage(page, 3);
   83 |   });
   84 |
   85 |   test('should allow me to mark all items as completed', async ({ page }) => {
   86 |     // Complete all todos.
   87 |     await page.getByLabel('Mark all as complete').check();
   88 |
   89 |     // Ensure all todos have 'completed' class.
   90 |     await expect(page.getByTestId('todo-item')).toHaveClass(['completed', 'completed', 'completed']);
   91 |     await checkNumberOfCompletedTodosInLocalStorage(page, 3);
   92 |   });
   93 |
   94 |   test('should allow me to clear the complete state of all items', async ({ page }) => {
   95 |     const toggleAll = page.getByLabel('Mark all as complete');
   96 |     // Check and then immediately uncheck.
   97 |     await toggleAll.check();
   98 |     await toggleAll.uncheck();
   99 |
  100 |     // Should be no completed classes.
  101 |     await expect(page.getByTestId('todo-item')).toHaveClass(['', '', '']);
  102 |   });
  103 |
  104 |   test('complete all checkbox should update state when items are completed / cleared', async ({ page }) => {
  105 |     const toggleAll = page.getByLabel('Mark all as complete');
  106 |     await toggleAll.check();
  107 |     await expect(toggleAll).toBeChecked();
  108 |     await checkNumberOfCompletedTodosInLocalStorage(page, 3);
  109 |
  110 |     // Uncheck first todo.
  111 |     const firstTodo = page.getByTestId('todo-item').nth(0);
  112 |     await firstTodo.getByRole('checkbox').uncheck();
  113 |
  114 |     // Reuse toggleAll locator and make sure its not checked.
  115 |     await expect(toggleAll).not.toBeChecked();
  116 |
  117 |     await firstTodo.getByRole('checkbox').check();
  118 |     await checkNumberOfCompletedTodosInLocalStorage(page, 3);
  119 |
  120 |     // Assert the toggle all is checked again.
  121 |     await expect(toggleAll).toBeChecked();
  122 |   });
  123 | });
  124 |
  125 | test.describe('Item', () => {
  126 |
  127 |   test('should allow me to mark items as complete', async ({ page }) => {
  128 |     // create a new todo locator
  129 |     const newTodo = page.getByPlaceholder('What needs to be done?');
  130 |
  131 |     // Create two items.
  132 |     for (const item of TODO_ITEMS.slice(0, 2)) {
  133 |       await newTodo.fill(item);
  134 |       await newTodo.press('Enter');
  135 |     }
  136 |
  137 |     // Check first item.
  138 |     const firstTodo = page.getByTestId('todo-item').nth(0);
  139 |     await firstTodo.getByRole('checkbox').check();
  140 |     await expect(firstTodo).toHaveClass('completed');
  141 |
  142 |     // Check second item.
  143 |     const secondTodo = page.getByTestId('todo-item').nth(1);
  144 |     await expect(secondTodo).not.toHaveClass('completed');
  145 |     await secondTodo.getByRole('checkbox').check();
  146 |
```