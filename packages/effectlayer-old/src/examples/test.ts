import { effectlayer, html } from "../effectlayer";

class TodoApp {
    // state
    todos = [{ id: 1, title: "Todo 1", done: false }];
    counter = 0;

    // computed values
    get openTodos() {
        return this.todos.filter(({ done }) => done === false);
    }

    count() {
        this.counter++;
    }

    addTodo(title: string) {
        try {
            this.count();
        } catch (e) {
            console.log(e);
        }

        this.todos.push({ id: Date.now(), title, done: Math.random() > 0.5 });
    }

    $logTodos() {
        console.log("todos effect", this.todos);
    }

    $logOpenTodos() {
        console.log("openTodos effect", this.openTodos);
    }

    $ui() {
        return html`
            <div muted=${true}>
                <div
                    id="test"
                    draggable="false"
                    onclick=${() => this.addTodo("Test")}
                >
                    ${this.counter}
                </div>
                <div
                    draggable="true"
                    onclick=${() => console.log("clicked")}
                    @innerHTML=${`<i>Test</i>`}
                ></div>
            </div>
        `;
    }
}

const todoApp = effectlayer(TodoApp);

todoApp.addTodo("Todo 2");

document.body.appendChild(todoApp.$ui());

document.body.appendChild(todoApp.$ui());

todoApp.$logOpenTodos();
todoApp.$logTodos();
