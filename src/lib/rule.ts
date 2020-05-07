import type {TestingLevel} from "./testing-level"

export interface RuleExtras {
	manifest: object
	manifestFilename: string
	environment: object
	root: string
	testingLevel: TestingLevel
}

export interface Rule {
	rule: string
	skip?(
		value: any,
		extras: RuleExtras
	): string | false
	test(value: any, extras: RuleExtras): boolean|Promise<boolean>
}
