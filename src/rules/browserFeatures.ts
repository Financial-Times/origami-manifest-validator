import type {Rule} from "../lib/rule"
import * as skips from "../lib/skips"
import * as polyfillLibrary from "polyfill-library"

let features: string[]

async function checkArrayContainsOnlyPolyfillFeatures (array: string[]) {
	if (!Array.isArray(array)) {
		return false
	}

	if (!features) {
		let aliases = Object.keys(await polyfillLibrary.listAliases())
		let polyfills = await polyfillLibrary.listAllPolyfills()
		features = [...aliases, ...polyfills]
	}

	for (let feature of array) {
		if (!features.includes(feature)) {
			return false
		}
	}

	return true
}

let rules: Rule[] = [
	{
		rule: "must not be present unless project is component",
		skip: skips.ifComponent,
		test: value => value === undefined,
	},
	{
		rule: "must only contain keys 'required' and 'optional'",
		skip: skips.unlessComponent,
		test: browserFeatures => {
			let keys = Object.keys(browserFeatures)
			for (let key of keys) {
				if (key == "optional" || key == "required") {
					continue
				}
				return false
			}
			return true
		}
	},
	{
		rule: "required and optional contain only valid polyfill.io features",
		skip: skips.unlessComponent,
		test: async browserFeatures => {
			let requiredValid = browserFeatures.required === undefined || await checkArrayContainsOnlyPolyfillFeatures(browserFeatures.required)
			let optionalValid = browserFeatures.optional === undefined || await checkArrayContainsOnlyPolyfillFeatures(browserFeatures.optional)
			return browserFeatures && requiredValid && optionalValid
		},
	},
]

export default rules
