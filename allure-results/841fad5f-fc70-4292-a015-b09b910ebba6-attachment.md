# Test info

- Name: Item >> should allow me to edit an item
- Location: /Users/rostandkinfack/playwright/poc-playwright/tests/dashboard.spec.ts:180:7

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toHaveText(expected)

Locator: getByTestId('todo-item')
- Expected  - 0
+ Received  + 1

  Array [
    "buy some cheese",
    "buy some sausages",
    "book a doctors appointment",
+   "book a doctors appointmentf",
  ]
Call log:
  - expect.toHaveText with timeout 5000ms
  - waiting for getByTestId('todo-item')
    9 × locator resolved to 4 elements

    at /Users/rostandkinfack/playwright/poc-playwright/tests/dashboard.spec.ts:191:29
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
    - text: buy some sausages
    - button "Delete": ×
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
   91 |
   92 |     // Ensure all todos have 'completed' class.
   93 |     await expect(page.getByTestId('todo-item')).toHaveClass(['completed', 'completed', 'completed']);
   94 |     await checkNumberOfCompletedTodosInLocalStorage(page, 3);
   95 |   });
   96 |
   97 |   test('should allow me to clear the complete state of all items', async ({ page }) => {
   98 |     const toggleAll = page.getByLabel('Mark all as complete');
   99 |     // Check and then immediately uncheck.
  100 |     await toggleAll.check();
  101 |     await toggleAll.uncheck();
  102 |
  103 |     // Should be no completed classes.
  104 |     await expect(page.getByTestId('todo-item')).toHaveClass(['', '', '']);
  105 |   });
  106 |
  107 |   test('complete all checkbox should update state when items are completed / cleared', async ({ page }) => {
  108 |     const toggleAll = page.getByLabel('Mark all as complete');
  109 |     await toggleAll.check();
  110 |     await expect(toggleAll).toBeChecked();
  111 |     await checkNumberOfCompletedTodosInLocalStorage(page, 3);
  112 |
  113 |     // Uncheck first todo.
  114 |     const firstTodo = page.getByTestId('todo-item').nth(0);
  115 |     await firstTodo.getByRole('checkbox').uncheck();
  116 |
  117 |     // Reuse toggleAll locator and make sure its not checked.
  118 |     await expect(toggleAll).not.toBeChecked();
  119 |
  120 |     await firstTodo.getByRole('checkbox').check();
  121 |     await checkNumberOfCompletedTodosInLocalStorage(page, 3);
  122 |
  123 |     // Assert the toggle all is checked again.
  124 |     await expect(toggleAll).toBeChecked();
  125 |   });
  126 | });
  127 |
  128 | test.describe('Item', () => {
  129 |
  130 |   test('should allow me to mark items as complete', async ({ page }) => {
  131 |     // create a new todo locator
  132 |     const newTodo = page.getByPlaceholder('What needs to be done?');
  133 |
  134 |     // Create two items.
  135 |     for (const item of TODO_ITEMS.slice(0, 2)) {
  136 |       await newTodo.fill(item);
  137 |       await newTodo.press('Enter');
  138 |     }
  139 |
  140 |     // Check first item.
  141 |     const firstTodo = page.getByTestId('todo-item').nth(0);
  142 |     await firstTodo.getByRole('checkbox').check();
  143 |     await expect(firstTodo).toHaveClass('completed');
  144 |
  145 |     // Check second item.
  146 |     const secondTodo = page.getByTestId('todo-item').nth(1);
  147 |     await expect(secondTodo).not.toHaveClass('completed');
  148 |     await secondTodo.getByRole('checkbox').check();
  149 |
  150 |     // Assert completed class.
  151 |     await expect(firstTodo).toHaveClass('completed');
  152 |     await expect(secondTodo).toHaveClass('completed');
  153 |   });
  154 |
  155 |   test('should allow me to un-mark items as complete', async ({ page }) => {
  156 |     // create a new todo locator
  157 |     const newTodo = page.getByPlaceholder('What needs to be done?');
  158 |
  159 |     // Create two items.
  160 |     for (const item of TODO_ITEMS.slice(0, 2)) {
  161 |       await newTodo.fill(item);
  162 |       await newTodo.press('Enter');
  163 |     }
  164 |
  165 |     const firstTodo = page.getByTestId('todo-item').nth(0);
  166 |     const secondTodo = page.getByTestId('todo-item').nth(1);
  167 |     const firstTodoCheckbox = firstTodo.getByRole('checkbox');
  168 |
  169 |     await firstTodoCheckbox.check();
  170 |     await expect(firstTodo).toHaveClass('completed');
  171 |     await expect(secondTodo).not.toHaveClass('completed');
  172 |     await checkNumberOfCompletedTodosInLocalStorage(page, 1);
  173 |
  174 |     await firstTodoCheckbox.uncheck();
  175 |     await expect(firstTodo).not.toHaveClass('completed');
  176 |     await expect(secondTodo).not.toHaveClass('completed');
  177 |     await checkNumberOfCompletedTodosInLocalStorage(page, 0);
  178 |   });
  179 |
  180 |   test('should allow me to edit an item', async ({ page }) => {
  181 |     await createDefaultTodos(page);
  182 |
  183 |     const todoItems = page.getByTestId('todo-item');
  184 |     const secondTodo = todoItems.nth(1);
  185 |     await secondTodo.dblclick();
  186 |     await expect(secondTodo.getByRole('textbox', { name: 'Edit' })).toHaveValue(TODO_ITEMS[1]);
  187 |     await secondTodo.getByRole('textbox', { name: 'Edit' }).fill('buy some sausages');
  188 |     await secondTodo.getByRole('textbox', { name: 'Edit' }).press('Enter');
  189 |
  190 |     // Explicitly assert the new text value.
> 191 |     await expect(todoItems).toHaveText([
      |                             ^ Error: Timed out 5000ms waiting for expect(locator).toHaveText(expected)
  192 |       TODO_ITEMS[0],
  193 |       'buy some sausages',
  194 |       TODO_ITEMS[2]
  195 |     ]);
  196 |     await checkTodosInLocalStorage(page, 'buy some sausages');
  197 |   });
  198 | });
  199 |
  200 | test.describe('Editing', () => {
  201 |   test.beforeEach(async ({ page }) => {
  202 |     await createDefaultTodos(page);
  203 |     await checkNumberOfTodosInLocalStorage(page, 3);
  204 |   });
  205 |
  206 |   test('should hide other controls when editing', async ({ page }) => {
  207 |     const todoItem = page.getByTestId('todo-item').nth(1);
  208 |     await todoItem.dblclick();
  209 |     await expect(todoItem.getByRole('checkbox')).not.toBeVisible();
  210 |     await expect(todoItem.locator('label', {
  211 |       hasText: TODO_ITEMS[1],
  212 |     })).not.toBeVisible();
  213 |     await checkNumberOfTodosInLocalStorage(page, 3);
  214 |   });
  215 |
  216 |   test('should save edits on blur', async ({ page }) => {
  217 |     const todoItems = page.getByTestId('todo-item');
  218 |     await todoItems.nth(1).dblclick();
  219 |     await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).fill('buy some sausages');
  220 |     await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).dispatchEvent('blur');
  221 |
  222 |     await expect(todoItems).toHaveText([
  223 |       TODO_ITEMS[0],
  224 |       'buy some sausages',
  225 |       TODO_ITEMS[2],
  226 |     ]);
  227 |     await checkTodosInLocalStorage(page, 'buy some sausages');
  228 |   });
  229 |
  230 |   test('should trim entered text', async ({ page }) => {
  231 |     const todoItems = page.getByTestId('todo-item');
  232 |     await todoItems.nth(1).dblclick();
  233 |     await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).fill('    buy some sausages    ');
  234 |     await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).press('Enter');
  235 |
  236 |     await expect(todoItems).toHaveText([
  237 |       TODO_ITEMS[0],
  238 |       'buy some sausages',
  239 |       TODO_ITEMS[2],
  240 |     ]);
  241 |     await checkTodosInLocalStorage(page, 'buy some sausages');
  242 |   });
  243 |
  244 |   test('should remove the item if an empty text string was entered', async ({ page }) => {
  245 |     const todoItems = page.getByTestId('todo-item');
  246 |     await todoItems.nth(1).dblclick();
  247 |     await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).fill('');
  248 |     await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).press('Enter');
  249 |
  250 |     await expect(todoItems).toHaveText([
  251 |       TODO_ITEMS[0],
  252 |       TODO_ITEMS[2],
  253 |     ]);
  254 |   });
  255 |
  256 |   test('should cancel edits on escape', async ({ page }) => {
  257 |     const todoItems = page.getByTestId('todo-item');
  258 |     await todoItems.nth(1).dblclick();
  259 |     await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).fill('buy some sausages');
  260 |     await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).press('Escape');
  261 |     await expect(todoItems).toHaveText(TODO_ITEMS);
  262 |   });
  263 | });
  264 |
  265 | test.describe('Counter', () => {
  266 |   test('should display the current number of todo items', async ({ page }) => {
  267 |     // create a new todo locator
  268 |     const newTodo = page.getByPlaceholder('What needs to be done?');
  269 |     
  270 |     // create a todo count locator
  271 |     const todoCount = page.getByTestId('todo-count')
  272 |
  273 |     await newTodo.fill(TODO_ITEMS[0]);
  274 |     await newTodo.press('Enter');
  275 |
  276 |     await expect(todoCount).toContainText('1');
  277 |
  278 |     await newTodo.fill(TODO_ITEMS[1]);
  279 |     await newTodo.press('Enter');
  280 |     await expect(todoCount).toContainText('2');
  281 |
  282 |     await checkNumberOfTodosInLocalStorage(page, 2);
  283 |   });
  284 | });
  285 |
  286 | test.describe('Clear completed button', () => {
  287 |   test.beforeEach(async ({ page }) => {
  288 |     await createDefaultTodos(page);
  289 |   });
  290 |
  291 |   test('should display the correct text', async ({ page }) => {
```