import {promises as fs} from "fs"
import {resolve as resolvePath} from "path"
import {TestingLevel} from "./lib/testing-level"
import type {Rule, RuleExtras} from "./lib/rule"

let environmentVariables = process.env

enum RuleState {
	ok,
	notok,
	skip
}

(async function run() {
	console.log("TAP version 13")

	let manifest: object
	let args = process.argv.slice(2)
	let opts = args.filter(arg => arg.startsWith("-"))
	let filename = args.filter(arg => !arg.startsWith("-"))[0]
	let testLevel = opts.includes("--clippy")
		? TestingLevel.Clippy
		: TestingLevel.Normal
	let rules = await fs.readdir(resolvePath(__dirname, "rules"))

	if (!filename) {
		console.log("Bail out!")
		console.error(`Usage: ${process.argv[1]} [--clippy] <origami.json>`)
		// ENOTRECOVERABLE
		process.exit(131)
	}

	let manifestFile = await fs.readFile(filename, "utf-8").catch(error => {
		console.log(`Bail out! Could not read file ${filename}`)
		console.error(error)
		process.stderr.write(`\n\n`)
		process.exit(131)
	})

	try {
		manifest = JSON.parse(manifestFile)
	} catch (error) {
		console.log(`Bail out! ${filename} is not valid json`)
		console.error(error)
		process.exit(131)
	}

	let exitCode = 0

	let results = []

	let extras: RuleExtras = {
		manifest,
		manifestFilename: filename,
		environment: environmentVariables,
	}

	for (let rule of rules) {
		let ruleName = rule.replace(".js", "")
		let checks: Rule[] = require(`./rules/${rule}`).default

		for (let check of checks) {
			if (check.skip) {
				let skippedReason = check.skip(manifest[ruleName], testLevel, extras)
				if (skippedReason) {
					results.push([RuleState.skip, ruleName, skippedReason])
					continue
				}
			}
			// Let them see their value, the testing level and some other
			// info they might want
			let result = check.test(manifest[ruleName], testLevel, extras)
			results.push([result ? RuleState.ok : RuleState.notok, ruleName, check.rule])
		}
	}

	let manifestKeys = Object.keys(manifest)
	let extraKeys = []

	for (let key of manifestKeys) {
		if (!rules.includes(`${key}.js`)) {
			extraKeys.push(key)
		}
	}

	if (testLevel == TestingLevel.Clippy) {
		console.warn(
			"# warning! testing level is `clippy`, will fail on spec-compliant but non-idiomatic code"
		)
	}

	console.log(`1..${results.length + 1}`)
	let rule = "all keys are specified"
	if (extraKeys.length) {
		results.push([
			RuleState.ok,
			rule,
			[`the manifest at ${filename} has these unspecified keys:\n\t${extraKeys.join("\n\t")}`],
		])
	} else {
		results.push([RuleState.notok, rule])
	}

	results.forEach((result, index) => {
		let [state, ruleName, message] = result
		if (state == RuleState.ok) {
			console.log(`ok ${index + 1} ${ruleName}: ${message}`)
		} else if (state == RuleState.skip) {
			console.log(`ok ${index + 1} # skip ${ruleName}: ${message}`)
		} else if (state == RuleState.notok) {
			exitCode = 1
			console.log(
				`not ok ${index + 1} ${ruleName}: ${message}\n\tCheck https://origami.ft.com/spec/v1/manifest/${ruleName} for help`
			)
		}
	})

	process.exit(exitCode)
})()
