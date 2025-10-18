import "./style.css";
import { effectlayer } from "effectlayer";

class MoodSwing {
    energy = 5;
    coffee = 0;

    get mood() {
        if (this.energy > 8) return "🤪";
        if (this.energy > 5) return "😀";
        if (this.energy > 2) return "😑";
        return "😴";
    }

    drinkCoffee() {
        this.coffee++;
        this.energy = Math.min(10, this.energy + 3);
    }

    work() {
        this.energy = Math.max(0, this.energy - 2);
    }

    $monitor() {
        if (this.coffee > 10) console.warn("Oh oh, you may wanna slow down.");
    }

    $ui() {
        return (
            <main>
                <h1>{this.mood}</h1>
                <p>{this.energy} / 10</p>
                <button onClick={() => this.drinkCoffee()}>☕ Coffee</button>
                <button onClick={() => this.work()}>💻 Work</button>
            </main>
        );
    }
}

const moodSwing = effectlayer(MoodSwing);

moodSwing.$monitor();

document.body.appendChild(moodSwing.$ui());
