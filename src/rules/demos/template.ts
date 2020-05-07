import type {Rule} from "../../lib/rule"
import {FieldType} from "../../lib/field"
import * as skips from "../../lib/skip"
import {promises as fs} from "fs"
import {
	resolve as resolvePath
} from "path"

let unlessComponentOrUndefined: skips.SkipTest = (template, extras) => {
	let isUndefined = template === undefined ? "is undefined" : false
	return isUndefined || skips.unlessComponent(template, extras)
}

let rules: Rule[] = [
	{
		rule: "must be a string or undefined",
		skip: unlessComponentOrUndefined,
		test: template => typeof template == "string",
	},
	{
		rule: "must point at an existing file",
		skip: unlessComponentOrUndefined,
		test: async (template, extras) => {
			if (typeof template == "string") {
				return fs.stat(resolvePath(extras.root, template))
					// hmm, this might be unclear if it fails and there is
					// a non-file file at this point
					.then(entry => entry.isFile())
					.catch(() => false)
			} else {
				return false
			}
		},
	},
]

export default {
	type: FieldType.Direct,
	rules
}
