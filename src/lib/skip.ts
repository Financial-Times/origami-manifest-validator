import {TestingLevel} from "./testing-level"
import type {RuleExtras} from "./rule"

export type SkipTest = (value: any, extras: RuleExtras) => string|false

export function or (...fns: SkipTest[]): SkipTest {
	return (value, extras) => {
		for (let fn of fns) {
			let result = fn(value, extras)
			if (result) {
				return result
			}
		}
		return false
	}
}

export let unlessClippy: SkipTest = (_value: any, extras) =>
	extras.testingLevel == TestingLevel.Clippy ? false : "clippy test"

export let unlessComponent: SkipTest = (_value: any, extras: RuleExtras) =>
	extras.manifest.origamiType == "module" || extras.manifest.origamiType == "component"
		? false
		: "project is NOT a component"

export let unlessUndefined: SkipTest = value =>
	value === undefined ? "is undefined" : false

export let unlessComponentOrUndefined = or(unlessComponent, unlessUndefined)

export let ifComponent: SkipTest = (_value: any, extras: RuleExtras) => {
	return extras.manifest.origamiType == "module" || extras.manifest.origamiType == "component"
		? "project is a component"
		: false
}

export let unlessService: SkipTest = (_value: any, extras: RuleExtras) => {
	return extras.manifest.origamiType == "service"
		? false
		: "project is NOT a service"
}

export let ifService: SkipTest = (_value: any, extras: RuleExtras) => {
	return extras.manifest.origamiType == "service"
		? "project is a service"
		: false
}
