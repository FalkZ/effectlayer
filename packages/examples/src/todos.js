import { effectlayer, html } from "../effectlayer";
import "./todos.css";

type Todo = {
    created: Date;
    done: boolean;
    title: string;
};

type TodoItemProps = {
    todo: Todo;
    toggleTodo: (created: Date) => boolean;
    updateTodo: (created: Date, title: string) => void;
};
const todoItem = ({ todo, toggleTodo, updateTodo }: TodoItemProps) =>
    html`
    <div class="todoItem" key=${todo.created.toISOString()}>
      <input type="checkbox" @checked=${todo.done} onchange=${({ currentTarget }) => {
          currentTarget.checked = toggleTodo(todo.created);
      }} />
      <input type="text" @value=${todo.title} onchange=${({ currentTarget }) => updateTodo(todo.created, currentTarget.value)} />
    </div>
  `;

class TodoApp {
    // state
    todos: Todo[] = [
        {
            created: new Date("2025-01-02"),
            done: false,
            title: "Check out the todos example",
        },
        {
            created: new Date("2025-01-03"),
            done: true,
            title: "Create a web framework",
        },
    ];

    get uncheckedTodos() {
        return this.todos.filter((todo) => !todo.done);
    }

    get checkedTodos() {
        return this.todos.filter((todo) => todo.done);
    }

    addTodo(title: string) {
        this.todos.unshift({
            created: new Date(),
            done: false,
            title,
        });
    }

    toggleTodo(created: Date): boolean {
        const todo = this.todos.find((todo) => todo.created === created)!;

        todo.done = !todo.done;

        return todo.done;
    }

    updateTodo(created: Date, title: string) {
        const todo = this.todos.find((todo) => todo.created === created);

        if (todo) todo.title = title;
    }

    $ui() {
        return html`
        <main>
           <h1>TODOs</h1>
            <input type="text" class="addTodo" placeholder="+ TODO" onchange=${({
                currentTarget,
            }) => {
                this.addTodo(currentTarget.value);
                currentTarget.value = "";
            }} />
           ${this.uncheckedTodos.map((todo) => todoItem({ todo, toggleTodo: this.toggleTodo, updateTodo: this.updateTodo }))}
           <hr>
           ${this.checkedTodos.map((todo) => todoItem({ todo, toggleTodo: this.toggleTodo, updateTodo: this.updateTodo }))}
        </main>`;
    }
}

const todoApp = effectlayer(TodoApp);

document.body.appendChild(todoApp.$ui());
