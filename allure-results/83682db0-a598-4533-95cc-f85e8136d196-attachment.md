# Test info

- Name: New Todo >> should allow me to add todo items
- Location: /Users/rostandkinfack/playwright/poc-playwright/tests/dashboard.spec.ts:15:7

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toHaveText(expected)

Locator: getByTestId('todo-title')
- Expected  - 1
+ Received  + 1

  Array [
-   "buy some cheese",
+   "feed the cat",
  ]
Call log:
  - expect.toHaveText with timeout 5000ms
  - waiting for getByTestId('todo-title')
    9 × locator resolved to 1 element

    at /Users/rostandkinfack/playwright/poc-playwright/tests/dashboard.spec.ts:24:50
```

# Page snapshot

```yaml
- text: This is just a demo of TodoMVC for testing, not the
- link "real TodoMVC app.":
  - /url: https://todomvc.com/
- heading "todos" [level=1]
- textbox "What needs to be done?"
- checkbox "❯Mark all as complete"
- text: ❯Mark all as complete
- list:
  - listitem:
    - checkbox "Toggle Todo"
    - text: feed the cat
- strong: "1"
- text: item left
- list:
  - listitem:
    - link "All":
      - /url: "#/"
  - listitem:
    - link "Active":
      - /url: "#/active"
  - listitem:
    - link "Completed":
      - /url: "#/completed"
- contentinfo:
  - paragraph: Double-click to edit a todo
  - paragraph:
    - text: Created by
    - link "Remo H. Jansen":
      - /url: http://github.com/remojansen/
  - paragraph:
    - text: Part of
    - link "TodoMVC":
      - /url: http://todomvc.com
```

# Test source

```ts
   1 |
   2 | import { Page } from '@playwright/test';
   3 | import { test, expect} from '../fixtures/fixtures'; // ou '@hooks' si tu configures un alias
   4 | import  '../fixtures/hooks'; // ou '@hooks' si tu configures un alias
   5 |
   6 |
   7 |
   8 | const TODO_ITEMS = [
   9 |   'buy some cheese',
   10 |   'feed the cat',
   11 |   'book a doctors appointment'
   12 | ] as const;
   13 |
   14 | test.describe('New Todo', () => {
   15 |   test('should allow me to add todo items', async ({ page }) => {
   16 |     // create a new todo locator
   17 |     const newTodo = page.getByPlaceholder('What needs to be done?');
   18 |
   19 |     // Create 1st todo.
   20 |     await newTodo.fill(TODO_ITEMS[1]);
   21 |     await newTodo.press('Enter');
   22 |
   23 |     // Make sure the list only has one todo item.
>  24 |     await expect(page.getByTestId('todo-title')).toHaveText([
      |                                                  ^ Error: Timed out 5000ms waiting for expect(locator).toHaveText(expected)
   25 |       TODO_ITEMS[0]
   26 |     ]);
   27 |
   28 |     // Create 2nd todo.
   29 |     await newTodo.fill(TODO_ITEMS[1]);
   30 |     await newTodo.press('Enter');
   31 |
   32 |     // Make sure the list now has two todo items.
   33 |     await expect(page.getByTestId('todo-title')).toHaveText([
   34 |       TODO_ITEMS[0],
   35 |       TODO_ITEMS[1]
   36 |     ]);
   37 |
   38 |     await checkNumberOfTodosInLocalStorage(page, 2);
   39 |   });
   40 |
   41 |   test('should clear text input field when an item is added', async ({ page }) => {
   42 |     // create a new todo locator
   43 |     const newTodo = page.getByPlaceholder('What needs to be done?');
   44 |
   45 |     // Create one todo item.
   46 |     await newTodo.fill(TODO_ITEMS[0]);
   47 |     await newTodo.press('Enter');
   48 |
   49 |     // Check that input is empty.
   50 |     await expect(newTodo).toBeEmpty();
   51 |     await checkNumberOfTodosInLocalStorage(page, 1);
   52 |   });
   53 |
   54 |   test('should append new items to the bottom of the list', async ({ page }) => {
   55 |     // Create 3 items.
   56 |     await createDefaultTodos(page);
   57 |
   58 |     // create a todo count locator
   59 |     const todoCount = page.getByTestId('todo-count')
   60 |   
   61 |     // Check test using different methods.
   62 |     await expect(page.getByText('3 items left')).toBeVisible();
   63 |     await expect(todoCount).toHaveText('3 items left');
   64 |     await expect(todoCount).toContainText('3');
   65 |     await expect(todoCount).toHaveText(/3/);
   66 |
   67 |     // Check all items in one call.
   68 |     await expect(page.getByTestId('todo-title')).toHaveText(TODO_ITEMS);
   69 |     await checkNumberOfTodosInLocalStorage(page, 3);
   70 |   });
   71 | });
   72 |
   73 | test.describe('Mark all as completed', () => {
   74 |   test.beforeEach(async ({ page }) => {
   75 |     await createDefaultTodos(page);
   76 |     await checkNumberOfTodosInLocalStorage(page, 3);
   77 |   });
   78 |
   79 |   test.afterEach(async ({ page }) => {
   80 |     await checkNumberOfTodosInLocalStorage(page, 3);
   81 |   });
   82 |
   83 |   test('should allow me to mark all items as completed', async ({ page }) => {
   84 |     // Complete all todos.
   85 |     await page.getByLabel('Mark all as complete').check();
   86 |
   87 |     // Ensure all todos have 'completed' class.
   88 |     await expect(page.getByTestId('todo-item')).toHaveClass(['completed', 'completed', 'completed']);
   89 |     await checkNumberOfCompletedTodosInLocalStorage(page, 3);
   90 |   });
   91 |
   92 |   test('should allow me to clear the complete state of all items', async ({ page }) => {
   93 |     const toggleAll = page.getByLabel('Mark all as complete');
   94 |     // Check and then immediately uncheck.
   95 |     await toggleAll.check();
   96 |     await toggleAll.uncheck();
   97 |
   98 |     // Should be no completed classes.
   99 |     await expect(page.getByTestId('todo-item')).toHaveClass(['', '', '']);
  100 |   });
  101 |
  102 |   test('complete all checkbox should update state when items are completed / cleared', async ({ page }) => {
  103 |     const toggleAll = page.getByLabel('Mark all as complete');
  104 |     await toggleAll.check();
  105 |     await expect(toggleAll).toBeChecked();
  106 |     await checkNumberOfCompletedTodosInLocalStorage(page, 3);
  107 |
  108 |     // Uncheck first todo.
  109 |     const firstTodo = page.getByTestId('todo-item').nth(0);
  110 |     await firstTodo.getByRole('checkbox').uncheck();
  111 |
  112 |     // Reuse toggleAll locator and make sure its not checked.
  113 |     await expect(toggleAll).not.toBeChecked();
  114 |
  115 |     await firstTodo.getByRole('checkbox').check();
  116 |     await checkNumberOfCompletedTodosInLocalStorage(page, 3);
  117 |
  118 |     // Assert the toggle all is checked again.
  119 |     await expect(toggleAll).toBeChecked();
  120 |   });
  121 | });
  122 |
  123 | test.describe('Item', () => {
  124 |
```