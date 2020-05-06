import type {Rule} from "../lib/rule"
import * as skips from "../lib/skips"
import {promises as fs} from "fs"
import {
	dirname,
	resolve as resolvePath} from "path"

let unlessComponentOrUndefined = (field: string) => (demosDefaults, level, extras) => {
	let isUndefined = demosDefaults === undefined ? "is undefined" : false
	let fieldIsUndefined = demosDefaults && demosDefaults[field] === undefined ? `${field} is undefined` : false
	return isUndefined || fieldIsUndefined || skips.unlessComponent(demosDefaults, level, extras)
}

let rules: Rule[] = [
	{
		rule: "only applies to components",
		skip: skips.ifComponent,
		test: value => value === undefined
	},
	{
		rule: "`template` must be a string or undefined",
		skip: unlessComponentOrUndefined("template"),
		test: demosDefaults => typeof demosDefaults.template == "string",
	},
	{
		rule: "`template` point at an existing file",
		skip: unlessComponentOrUndefined("template"),
		test: async (demosDefaults, _level, extras) => {
			if (typeof demosDefaults.template == "string") {
				return fs.stat(resolvePath(extras.root, demosDefaults.template))
					.then(() => true)
					.catch(() => false)
			} else {
				return false
			}
		},
	},
]

export default rules
