import type {TestingLevel} from "./testing-level"
import * as skips from "./skip"
import {resolve as resolvePath} from "path"
import checkPathIsFile from "./check-path-is-file"

export interface RuleExtras {
	manifest: object
	manifestFilename: string
	environment: object
	root: string
	testingLevel: TestingLevel
}

export type RuleTest = (value: any, extras: RuleExtras) => boolean|Promise<boolean>

export interface Rule {
	rule: string
	skip?(
		value: any,
		extras: RuleExtras
	): string | false
	test: RuleTest
}

export let isRequired: Rule[] = [{
	rule: "is required",
	test: value => value !== undefined
}]

export let isFileOrUndefinedComponentOnly: Rule[] = [
	{
		rule: "must be a string or undefined",
		skip: skips.unlessComponentOrUndefined,
		test: template => typeof template == "string",
	},
	{
		rule: "must point at an existing file",
		skip: skips.unlessComponentOrUndefined,
		test: async (path, extras) => {
			if (typeof path == "string") {
				return checkPathIsFile(resolvePath(extras.root, path))
			} else {
				return false
			}
		},
	},
]
