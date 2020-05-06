import type {TestingLevel} from "./testing-level"

export interface RuleExtras {
	manifest: object,
	manifestFilename: string,
	environment: object
}

export interface Rule {
	rule: string
	skip?(value: any, testingLevel: TestingLevel, extras: RuleExtras): string|false
	test(value: any, testingLevel: TestingLevel, extras: RuleExtras): boolean
}
