import { batch, Signal, signal } from "./patched/signals-core";
import equal from "fast-deep-equal/es6";
import {
    createDraft,
    current,
    finishDraft,
    type Draft,
    enableMapSet,
    isDraftable,
    isDraft,
} from "immer";

enableMapSet();

const createDraftSafe = (value: any) => (isDraftable(value) ? createDraft(value) : value);

// TODO: stuctured clone is not really needed, instead make sure only valid data is passed
const finishDraftSafe = (value: any) =>
    isDraft(value) ? finishDraft(value) : structuredClone(value);

const currentSafe = (value: any) => (isDraft(value) ? current(value) : structuredClone(value));

export class StateManagement {
    private stateMap = new Map<string, Signal<any>>();
    private draftLayers: Map<string, Draft<any>>[] = [];

    createState(key: string, value: any): Signal<any> {
        const state = signal(value, { name: key });

        this.stateMap.set(key, state);

        return state;
    }

    createDraftLayer() {
        this.draftLayers.unshift(new Map());
    }

    private createCurrentDraft(key: string, value: any): Draft<any> {
        const draft = createDraftSafe(value);
        const currentLayer = this.draftLayers[0]!;
        if (ASSERT) if (!currentLayer) console.error("No draft layer found");
        currentLayer.set(key, draft);

        return draft;
    }

    getDraft(key: string) {
        const latestDraftIndex = this.draftLayers.findIndex((layer) => layer.has(key));

        if (latestDraftIndex === -1) {
            const state = this.stateMap.get(key)!;
            if (ASSERT) if (!state) console.error("State not found");
            return this.createCurrentDraft(key, state.peek());
        } else if (latestDraftIndex === 0) {
            const draft = this.draftLayers[0].get(key)!;
            return draft;
        } else {
            const draft = this.draftLayers[latestDraftIndex].get(key)!;
            return this.createCurrentDraft(key, currentSafe(draft));
        }
    }

    replaceDraft(key: string, value: any) {
        this.createCurrentDraft(key, value);
    }

    discardDraftLayer() {
        this.draftLayers.shift();
    }

    applyDraftLayer() {
        const currentLayer = this.draftLayers.shift()!;
        const upperLayer = this.draftLayers[0];

        if (ASSERT) if (!currentLayer) console.error("No draft layer found");

        batch(() => {
            [...currentLayer.entries()].forEach(([key, draft]) => {
                const state = this.stateMap.get(key)!;
                const nextState = finishDraftSafe(draft);

                state.value = nextState;

                if (upperLayer) this.replaceDraft(key, nextState);
            });
        });
    }
}
