import type {Rule} from "../lib/rule"
import clippyTest from "../lib/clippy-test"

let rules: Rule[] = [
	{
		rule: "",
		skip: clippyTest,
		test: (value) => {
			 // return true if it passes, false if it fails
			 return true || false
		},
	},
]

export default rules
