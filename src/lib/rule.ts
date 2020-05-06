import type {TestingLevel} from "./testing-level"
import * as skips from "./skips"

export interface RuleExtras {
	manifest: object
	manifestFilename: string
	environment: object
}

export interface Rule {
	rule: string
	skip?(
		value: any,
		testingLevel: TestingLevel,
		extras: RuleExtras
	): string | false
	test(value: any, testingLevel: TestingLevel, extras: RuleExtras): boolean|Promise<boolean>
}
