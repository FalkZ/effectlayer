import { effectlayer } from "effectlayer";

class CounterApp {
    // state
    counter = 0;

    // computed value
    get doubled() {
        return this.counter * 2;
    }

    updateCount(value: number | null) {
        console.log("updateCount", value);

        // update if value is positive number
        if (value !== null && value >= 0) {
            this.counter = value;
        }

        // the return value will set on the input after update
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
            <main>
                <button type="button" onClick={() => this.countDown()}>
                    -
                </button>
                <input
                    type="number"
                    value={this.counter}
                    onValueChange={this.updateCount}
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
