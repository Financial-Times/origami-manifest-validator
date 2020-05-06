import type {Rule} from "../lib/rule"
import * as skips from "../lib/skips"
import {promises as fs} from "fs"
import {
	dirname,
	resolve as resolvePath} from "path"

let rules: Rule[] = [
	{
		rule: "only applies to components",
		skip: skips.ifComponent,
		test: value => value === undefined
	},
	{
		rule: "`template` must be a string",
		skip: skips.unlessComponent,
		test: demosDefaults => typeof demosDefaults.template == "string",
	},
	{
		rule: "`template` point at an existing file",
		skip: skips.unlessComponent,
		test: async (demosDefaults, _level, extras) => {
			if (typeof demosDefaults.template == "string") {
				let projectRoot = dirname(extras.manifestFilename)
				return fs.stat(resolvePath(projectRoot, demosDefaults.template))
					.then(() => true)
					.catch(() => false)
			} else {
				return false
			}
		},
	},
]

export default rules
