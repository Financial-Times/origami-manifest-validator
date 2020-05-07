import type {Rule} from "../../lib/rule"
import {FieldType} from "../../lib/field"
import * as skips from "../../lib/skip"
import {resolve as resolvePath} from "path"
import checkPathIsFile from "../../lib/check-path-is-file"
import {promises as fs} from "fs"

let unlessString: skips.SkipTest = (data, _extras) => {
	if (typeof data != "string") {
		return "not a string"
	}
	return false
}

let ifString: skips.SkipTest = (data, _extras) => {
	if (typeof data == "string") {
		return "it's a string"
	}
	return false
}

let rules: Rule[] = [
	{
		rule: "must be a string or an object or undefined",
		skip: skips.unlessComponentOrUndefined,
		test: data => {
			return typeof data == "string" || (Boolean(data) && data.contructor == Object)
		},
	},
	{
		rule: "string value must point at an existing file",
		skip: skips.or(skips.unlessComponentOrUndefined, unlessString),
		test: async (path, extras) => {
			return checkPathIsFile(resolvePath(extras.root, path))
		},
	},
	{
		rule: "string value must point at a valid JSON file",
		skip: skips.or(skips.unlessComponentOrUndefined, unlessString),
		test: async (path, extras) => {
			try {
				let file = await fs.readFile(resolvePath(extras.root, path), "utf-8")
				JSON.parse(file)
				return true
			} catch {
				return false
			}
		},
	}
]

export default {
	type: FieldType.Direct,
	rules
}
