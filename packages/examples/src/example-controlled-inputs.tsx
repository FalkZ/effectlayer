import { effectlayer, type CheckedValue } from "effectlayer";

class CheckApp {
    state: CheckedValue = false;
    slug: string = "example-slug";

    updateState() {
        // on click the checkbox will first go to  "indeterminate" and then to true
        if (this.state === false) this.state = "indeterminate";
        else if (this.state === "indeterminate") this.state = true;
        else if (this.state === true) this.state = false;

        return this.state;
    }

    updateSlug(value: string) {
        this.slug = value
            .replace(/[^A-z0-9]/g, "-")
            .toLowerCase()
            .slice(0, 20);

        return this.slug;
    }

    $ui() {
        return (
            <>
                <input
                    type="checkbox"
                    value={this.state}
                    onValueChange={this.updateState}
                />
                <input
                    type="text"
                    value={this.slug}
                    onValueInput={this.updateSlug}
                />
            </>
        );
    }
}

const checkApp = effectlayer(CheckApp);

document.body.appendChild(checkApp.$ui());
