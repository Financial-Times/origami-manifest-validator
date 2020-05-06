import {TestingLevel} from "./testing-level"
import type {RuleExtras} from "./rule"

export type SkipTest = (value: any, _level: TestingLevel, extras: RuleExtras) => string|false

let unlessClippy: SkipTest = (_value: any, level: TestingLevel) =>
	level == TestingLevel.Clippy ? false : "clippy test"

let unlessComponent: SkipTest = (_value: any, _level: TestingLevel, extras: RuleExtras) => {
	return extras.manifest.origamiType == "module" || extras.manifest.origamiType == "component"
		? false
		: "project is NOT a component"
}

let ifComponent: SkipTest = (_value: any, _level, extras: RuleExtras) => {
	return extras.manifest.origamiType == "module" || extras.manifest.origamiType == "component"
		? "project is a component"
		: false
}

let unlessService: SkipTest = (_value: any, _level: TestingLevel, extras: RuleExtras) => {
	return extras.manifest.origamiType == "service"
		? false
		: "project is NOT a service"
}

let ifService: SkipTest = (_value: any, _level: TestingLevel, extras: RuleExtras) => {
	return extras.manifest.origamiType == "service"
		? "project is a service"
		: false
}

export {
	unlessClippy,
	ifComponent,
	unlessComponent,
	ifService,
	unlessService,
}
