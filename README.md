# Effectlayer

> This framework is still in early beta, bugs and changes are expected.

Effectlayer is a reactive frontend framework that uses the familiar JSX Syntax from React, but takes a fundamentally different approach to state management.

# Tour

Instead of hooks, you can define all your application state in a single class. Every property you add becomes reactive state automatically.

```tsx
class MoodSwing {
    energy = 5;
    coffee = 0;
}
```

Computed values use standard JavaScript getters. They update automatically when their dependencies change:

```tsx
get mood() {
    if (this.energy > 8) return "🤪";
    if (this.energy > 4) return "😀";
    if (this.energy > 0) return "😑";
    return "😴";
}
```

Methods handle all state mutations.

```tsx
drinkCoffee() {
    this.coffee++;
    this.energy = Math.min(10, this.energy + 3);
}

work() {
    this.energy = Math.max(0, this.energy - 2);
}
```

Methods stating with `$` are treated as effects. They get called when ever their dependencies change.

```tsx
$monitor() {
    if (this.coffee > 10) console.warn("Oh oh, you may wanna slow down.");
}
```

To render html, JSX can returned in an effect.

```tsx
$ui() {
    return (
        <main>
            <h1>{this.mood}</h1>
            <button onClick={() => this.drinkCoffee()}>☕ Coffee</button>
            <button onClick={() => this.work()}>💻 Work</button>
        </main>
    );
}
```

To create a reactive instance, wrap your class with `effectlayer()`:

```tsx
const moodSwing = effectlayer(MoodSwing);
```

Effects are initialized by calling them once.

```tsx
moodSwing.$monitor();
```

Effects containing JSX will return a html element that can be attached to the DOM.

```tsx
document.body.appendChild(moodSwing.$ui());
```

# Why?!

Effectlayer gives you a clean frontend architecture with a minimal set of concepts to learn:

- properties for **state**
- getters for **computed values**
- methods for **mutations**
- methods starting with `$` for **effects** such as:
    - html / DOM changes
    - console.logs
    - route changes

React, Vue, and Svelte are excellent frameworks that power countless applications. Each has its strengths depending on the use case. However, their extensive APIs and concepts can feel overwhelming when you just want to build something simple.

Effectlayer is an experiment in simplifying web development. It explores how we might build reactive interfaces with fewer abstractions while keeping the power we need. Think of it as one possible direction for making frontend development more approachable, not a replacement for existing tools, but an idea worth exploring.
