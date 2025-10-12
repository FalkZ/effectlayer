import { effectlayer, html } from "../effectlayer";

class CounterApp {
    // state
    counter = 0;

    // computed value
    get doubled() {
        return this.counter * 2;
    }

    setCount(value: string) {
        const parsedValue = parseInt(value);
        if (!isNaN(parsedValue) && parsedValue >= 0) {
            this.counter = parsedValue;
        }

        return this.counter;
    }

    countUp() {
        this.counter++;
    }

    countDown() {
        this.counter--;

        if (this.counter < 0) {
            throw new Error("Counting below 0 is not allowed");
        }
    }

    $ui() {
        return html`
        <main>
           <button onclick=${() => this.countDown()}>-</button>
           <input type="number" @value=${this.counter} onchange=${({ currentTarget }) => {
               currentTarget.value = this.setCount(currentTarget.value);
           }} />
           <button onclick=${() => this.countUp()}>+</button>
           <div>doubled: ${this.doubled}</div>
        </main>`;
    }
}

const todoApp = effectlayer(CounterApp);

document.body.appendChild(todoApp.$ui());
