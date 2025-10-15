import { effectlayer } from "effectlayer";

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
        return (
            <main test="hello">
                <button type="button" onClick={() => this.countDown()}>
                    -
                </button>
                <input type="checkbox"></input>
                <input
                    type="number"
                    value={this.counter}
                    onChange={({ currentTarget }) => {
                        currentTarget.value = this.setCount(
                            currentTarget.value,
                        );
                    }}
                />
                <button type="button" onClick={() => this.countUp()}>
                    +
                </button>
                <div>doubled: {this.doubled}</div>
            </main>
        );
    }
}

const todoApp = effectlayer(CounterApp);

const t = todoApp.$ui();

console.log(t);

document.body.appendChild(t);
