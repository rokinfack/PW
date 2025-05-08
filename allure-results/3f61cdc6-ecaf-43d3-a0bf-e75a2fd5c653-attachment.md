# Test info

- Name: Clear completed button >> should remove completed items when clicked
- Location: /Users/rostandkinfack/playwright/poc-playwright/tests/dashboard.spec.ts:296:7

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toHaveCount(expected)

Locator: getByTestId('todo-item')
Expected: 2
Received: 3
Call log:
  - expect.toHaveCount with timeout 5000ms
  - waiting for getByTestId('todo-item')
    9 × locator resolved to 3 elements
      - unexpected value "3"

    at /Users/rostandkinfack/playwright/poc-playwright/tests/dashboard.spec.ts:300:29
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
    - text: book a doctors appointment
  - listitem:
    - checkbox "Toggle Todo"
    - text: book a doctors appointmentf
- strong: "3"
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
  200 |
  201 |   test('should hide other controls when editing', async ({ page }) => {
  202 |     const todoItem = page.getByTestId('todo-item').nth(1);
  203 |     await todoItem.dblclick();
  204 |     await expect(todoItem.getByRole('checkbox')).not.toBeVisible();
  205 |     await expect(todoItem.locator('label', {
  206 |       hasText: TODO_ITEMS[1],
  207 |     })).not.toBeVisible();
  208 |     await checkNumberOfTodosInLocalStorage(page, 3);
  209 |   });
  210 |
  211 |   test('should save edits on blur', async ({ page }) => {
  212 |     const todoItems = page.getByTestId('todo-item');
  213 |     await todoItems.nth(1).dblclick();
  214 |     await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).fill('buy some sausages');
  215 |     await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).dispatchEvent('blur');
  216 |
  217 |     await expect(todoItems).toHaveText([
  218 |       TODO_ITEMS[0],
  219 |       'buy some sausages',
  220 |       TODO_ITEMS[2],
  221 |     ]);
  222 |     await checkTodosInLocalStorage(page, 'buy some sausages');
  223 |   });
  224 |
  225 |   test('should trim entered text', async ({ page }) => {
  226 |     const todoItems = page.getByTestId('todo-item');
  227 |     await todoItems.nth(1).dblclick();
  228 |     await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).fill('    buy some sausages    ');
  229 |     await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).press('Enter');
  230 |
  231 |     await expect(todoItems).toHaveText([
  232 |       TODO_ITEMS[0],
  233 |       'buy some sausages',
  234 |       TODO_ITEMS[2],
  235 |     ]);
  236 |     await checkTodosInLocalStorage(page, 'buy some sausages');
  237 |   });
  238 |
  239 |   test('should remove the item if an empty text string was entered', async ({ page }) => {
  240 |     const todoItems = page.getByTestId('todo-item');
  241 |     await todoItems.nth(1).dblclick();
  242 |     await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).fill('');
  243 |     await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).press('Enter');
  244 |
  245 |     await expect(todoItems).toHaveText([
  246 |       TODO_ITEMS[0],
  247 |       TODO_ITEMS[2],
  248 |     ]);
  249 |   });
  250 |
  251 |   test('should cancel edits on escape', async ({ page }) => {
  252 |     const todoItems = page.getByTestId('todo-item');
  253 |     await todoItems.nth(1).dblclick();
  254 |     await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).fill('buy some sausages');
  255 |     await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).press('Escape');
  256 |     await expect(todoItems).toHaveText(TODO_ITEMS);
  257 |   });
  258 | });
  259 |
  260 | test.describe('Counter', () => {
  261 |   test('should display the current number of todo items', async ({ page }) => {
  262 |     // create a new todo locator
  263 |     const newTodo = page.getByPlaceholder('What needs to be done?');
  264 |     
  265 |     // create a todo count locator
  266 |     const todoCount = page.getByTestId('todo-count')
  267 |
  268 |     await newTodo.fill(TODO_ITEMS[0]);
  269 |     await newTodo.press('Enter');
  270 |
  271 |     await expect(todoCount).toContainText('1');
  272 |
  273 |     await newTodo.fill(TODO_ITEMS[1]);
  274 |     await newTodo.press('Enter');
  275 |     await expect(todoCount).toContainText('2');
  276 |
  277 |     await checkNumberOfTodosInLocalStorage(page, 2);
  278 |   });
  279 | });
  280 |
  281 | test.describe('Clear completed button', () => {
  282 |   test.beforeEach(async ({ page }) => {
  283 |     await createDefaultTodos(page);
  284 |   });
  285 |
  286 |   test('should display the correct text', async ({ page }) => {
  287 |     await page.locator('.todo-list li .toggle').first().check();
  288 |     await expect(page.getByRole('button', { name: 'Clear completed' })).toBeVisible();
  289 |   });
  290 |
  291 |   test('should remove completed items when clicked', async ({ page }) => {
  292 |     const todoItems = page.getByTestId('todo-item');
  293 |     await todoItems.nth(1).getByRole('checkbox').check();
  294 |     await page.getByRole('button', { name: 'Clear completed' }).click();
  295 |     await expect(todoItems).toHaveCount(2);
  296 |     await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
  297 |   });
  298 |
  299 |   test('should be hidden when there are no items that are completed', async ({ page }) => {
> 300 |     await page.locator('.todo-list li .toggle').first().check();
      |                             ^ Error: Timed out 5000ms waiting for expect(locator).toHaveCount(expected)
  301 |     await page.getByRole('button', { name: 'Clear completed' }).click();
  302 |     await expect(page.getByRole('button', { name: 'Clear completed' })).toBeHidden();
  303 |   });
  304 | });
  305 |
  306 | test.describe('Persistence', () => {
  307 |   test('should persist its data', async ({ page }) => {
  308 |     // create a new todo locator
  309 |     const newTodo = page.getByPlaceholder('What needs to be done?');
  310 |
  311 |     for (const item of TODO_ITEMS.slice(0, 2)) {
  312 |       await newTodo.fill(item);
  313 |       await newTodo.press('Enter');
  314 |     }
  315 |
  316 |     const todoItems = page.getByTestId('todo-item');
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
```