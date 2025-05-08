# Test info

- Name: New Todo >> should append new items to the bottom of the list
- Location: /Users/rostandkinfack/playwright/poc-playwright/tests/dashboard.spec.ts:55:7

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: getByText('3 items left')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for getByText('3 items left')

    at /Users/rostandkinfack/playwright/poc-playwright/tests/dashboard.spec.ts:63:50
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
    - text: buy some cheese
  - listitem:
    - checkbox "Toggle Todo"
    - text: feed the cat
  - listitem:
    - checkbox "Toggle Todo"
    - text: book a doctors appointment
  - listitem:
    - checkbox "Toggle Todo"
    - text: book a doctors appointmentf
- strong: "4"
- text: items left
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
   11 |   'book a doctors appointment',
   12 |   'book a doctors appointmentf',
   13 | ] as const;
   14 |
   15 | test.describe('New Todo', () => {
   16 |   test('should allow me to add todo items', async ({ page }) => {
   17 |     // create a new todo locator
   18 |     const newTodo = page.getByPlaceholder('What needs to be done?');
   19 |
   20 |     // Create 1st todo.
   21 |     await newTodo.fill(TODO_ITEMS[0]);
   22 |     await newTodo.press('Enter');
   23 |
   24 |     // Make sure the list only has one todo item.
   25 |     await expect(page.getByTestId('todo-title')).toHaveText([
   26 |       TODO_ITEMS[0]
   27 |     ]);
   28 |
   29 |     // Create 2nd todo.
   30 |     await newTodo.fill(TODO_ITEMS[1]);
   31 |     await newTodo.press('Enter');
   32 |
   33 |     // Make sure the list now has two todo items.
   34 |     await expect(page.getByTestId('todo-title')).toHaveText([
   35 |       TODO_ITEMS[0],
   36 |       TODO_ITEMS[1]
   37 |     ]);
   38 |
   39 |     await checkNumberOfTodosInLocalStorage(page, 2);
   40 |   });
   41 |
   42 |   test('should clear text input field when an item is added', async ({ page }) => {
   43 |     // create a new todo locator
   44 |     const newTodo = page.getByPlaceholder('What needs to be done?');
   45 |
   46 |     // Create one todo item.
   47 |     await newTodo.fill(TODO_ITEMS[0]);
   48 |     await newTodo.press('Enter');
   49 |
   50 |     // Check that input is empty.
   51 |     await expect(newTodo).toBeEmpty();
   52 |     await checkNumberOfTodosInLocalStorage(page, 1);
   53 |   });
   54 |
   55 |   test('should append new items to the bottom of the list', async ({ page }) => {
   56 |     // Create 3 items.
   57 |     await createDefaultTodos(page);
   58 |
   59 |     // create a todo count locator
   60 |     const todoCount = page.getByTestId('todo-count')
   61 |   
   62 |     // Check test using different methods.
>  63 |     await expect(page.getByText('3 items left')).toBeVisible();
      |                                                  ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
   64 |     await expect(todoCount).toHaveText('3 items left');
   65 |     await expect(todoCount).toContainText('3');
   66 |     await expect(todoCount).toHaveText(/3/);
   67 |
   68 |     // Check all items in one call.
   69 |     await expect(page.getByTestId('todo-title')).toHaveText(TODO_ITEMS);
   70 |     await checkNumberOfTodosInLocalStorage(page, 3);
   71 |   });
   72 | });
   73 |
   74 | test.describe('Mark all as completed', () => {
   75 |   test.beforeEach(async ({ page }) => {
   76 |     await createDefaultTodos(page);
   77 |     await checkNumberOfTodosInLocalStorage(page, 3);
   78 |   });
   79 |
   80 |   test.afterEach(async ({ page }) => {
   81 |     await checkNumberOfTodosInLocalStorage(page, 3);
   82 |   });
   83 |
   84 |   test('should allow me to mark all items as completed', async ({ page }) => {
   85 |     // Complete all todos.
   86 |     await page.getByLabel('Mark all as complete').check();
   87 |
   88 |     // Ensure all todos have 'completed' class.
   89 |     await expect(page.getByTestId('todo-item')).toHaveClass(['completed', 'completed', 'completed']);
   90 |     await checkNumberOfCompletedTodosInLocalStorage(page, 3);
   91 |   });
   92 |
   93 |   test('should allow me to clear the complete state of all items', async ({ page }) => {
   94 |     const toggleAll = page.getByLabel('Mark all as complete');
   95 |     // Check and then immediately uncheck.
   96 |     await toggleAll.check();
   97 |     await toggleAll.uncheck();
   98 |
   99 |     // Should be no completed classes.
  100 |     await expect(page.getByTestId('todo-item')).toHaveClass(['', '', '']);
  101 |   });
  102 |
  103 |   test('complete all checkbox should update state when items are completed / cleared', async ({ page }) => {
  104 |     const toggleAll = page.getByLabel('Mark all as complete');
  105 |     await toggleAll.check();
  106 |     await expect(toggleAll).toBeChecked();
  107 |     await checkNumberOfCompletedTodosInLocalStorage(page, 3);
  108 |
  109 |     // Uncheck first todo.
  110 |     const firstTodo = page.getByTestId('todo-item').nth(0);
  111 |     await firstTodo.getByRole('checkbox').uncheck();
  112 |
  113 |     // Reuse toggleAll locator and make sure its not checked.
  114 |     await expect(toggleAll).not.toBeChecked();
  115 |
  116 |     await firstTodo.getByRole('checkbox').check();
  117 |     await checkNumberOfCompletedTodosInLocalStorage(page, 3);
  118 |
  119 |     // Assert the toggle all is checked again.
  120 |     await expect(toggleAll).toBeChecked();
  121 |   });
  122 | });
  123 |
  124 | test.describe('Item', () => {
  125 |
  126 |   test('should allow me to mark items as complete', async ({ page }) => {
  127 |     // create a new todo locator
  128 |     const newTodo = page.getByPlaceholder('What needs to be done?');
  129 |
  130 |     // Create two items.
  131 |     for (const item of TODO_ITEMS.slice(0, 2)) {
  132 |       await newTodo.fill(item);
  133 |       await newTodo.press('Enter');
  134 |     }
  135 |
  136 |     // Check first item.
  137 |     const firstTodo = page.getByTestId('todo-item').nth(0);
  138 |     await firstTodo.getByRole('checkbox').check();
  139 |     await expect(firstTodo).toHaveClass('completed');
  140 |
  141 |     // Check second item.
  142 |     const secondTodo = page.getByTestId('todo-item').nth(1);
  143 |     await expect(secondTodo).not.toHaveClass('completed');
  144 |     await secondTodo.getByRole('checkbox').check();
  145 |
  146 |     // Assert completed class.
  147 |     await expect(firstTodo).toHaveClass('completed');
  148 |     await expect(secondTodo).toHaveClass('completed');
  149 |   });
  150 |
  151 |   test('should allow me to un-mark items as complete', async ({ page }) => {
  152 |     // create a new todo locator
  153 |     const newTodo = page.getByPlaceholder('What needs to be done?');
  154 |
  155 |     // Create two items.
  156 |     for (const item of TODO_ITEMS.slice(0, 2)) {
  157 |       await newTodo.fill(item);
  158 |       await newTodo.press('Enter');
  159 |     }
  160 |
  161 |     const firstTodo = page.getByTestId('todo-item').nth(0);
  162 |     const secondTodo = page.getByTestId('todo-item').nth(1);
  163 |     const firstTodoCheckbox = firstTodo.getByRole('checkbox');
```