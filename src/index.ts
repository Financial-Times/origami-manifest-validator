import {promises as fs} from "fs"
import {
	dirname as getDirname,
	resolve as resolvePath
} from "path"
import {TestingLevel} from "./lib/testing-level"
import type {Field} from "./lib/field"
import {FieldType} from "./lib/field"
import type {Rule, RuleExtras} from "./lib/rule"
import getFiles from "./lib/get-files"

let environmentVariables = process.env

enum RuleState {
	ok,
	notok,
	skip,
}

let usage = `Usage: ${process.argv[1]} [--clippy] [path to project or origami.json]`

async function* processRules(rules: Rule[], fieldName: string, value: any, extras: RuleExtras) {
	for (let rule of rules) {
		if (typeof rule.skip == "function") {
			let skippedReason = rule.skip(value, extras)
			if (skippedReason) {
				yield [
					RuleState.skip,
					`(${skippedReason}) ${fieldName}`,
					rule.rule,
					value
				]
				continue
			}
		}
		// Let them see their value, the testing level and some other
		// info they might want
		let result = rule.test(value, extras)
		if (typeof result == "boolean") {
			result = result
		} else if (result.then) {
			result = await result
		} else {
			throw new Error(`got unexpected result ${result}`)
		}
		yield [
			result ? RuleState.ok : RuleState.notok,
			fieldName,
			rule.rule,
			value
		]
	}
}

async function* processExtraKeys(fieldFiles: string[], context: any) {
	let contextKeys = Object.keys(context)

	let extraKeys = []

	for (let key of contextKeys) {
		if (!fieldFiles.includes(`${key}.js`)) {
			extraKeys.push(key)
		}
	}

	if (extraKeys.length) {
		// TODO improve this output for subfields
		yield [
			RuleState.notok,
			"",
			[
				`unspecified keys:\n\t`,
			],
			extraKeys
		]
	} else {
		yield [RuleState.ok, "", "all keys are specified", ""]
	}
}

async function* processFieldFiles(fieldFiles: string[], root: string, context: any, extras: RuleExtras) {
	yield* processExtraKeys(fieldFiles, context)

	for (let fieldFile of fieldFiles) {
		let field: Field = require(`${root}/${fieldFile}`).default
		let fieldName = fieldFile.replace(/.js$/, "")

		let value = context[fieldName]

		yield* processRules(field.rules, fieldName, value, extras)

		if (field.type == FieldType.Direct) {
			// we're done
			continue
		} else if (field.type == FieldType.Recurse) {
			let nextContext = context[fieldName]
			if (!nextContext) {
				// TODO don't skip required recursion (there currently are none like this)
				yield [
					RuleState.skip,
					fieldName,
					"not present",
					""
				]
				continue
			}
			// TODO throw an error if this folder doesn't exist
			let root = resolvePath(__dirname, "rules", fieldName)
			let subfields = await getFiles(root)
			yield* processFieldFiles(subfields, root, context[fieldName], extras)
		} else if (field.type == FieldType.Each) {
			let list = context[fieldName]
			if (!list) {
				// TODO don't skip required arrays (there currently are none like this)
				yield [
					RuleState.skip,
					fieldName,
					"not present",
					""
				]
				continue
			}
			for (let index in list) {
				let value = list[index]
				yield* processRules(field.rules, fieldName + `[${index}]`, value, extras)
			}
		} else {
			// @ts-ignore for your own good. (i know it's `never` to YOU, but who
			// knows about the future, "Type Script")
			throw new Error(`unknown field.type: ${field.type}`)
		}
	}
}

;(async function run() {
	console.log("TAP version 13")

	let manifest: object
	let args = process.argv.slice(2)
	let opts = args.filter(arg => arg.startsWith("-"))
	let rootOption = args.filter(arg => !arg.startsWith("-"))[0] || "."
	let testLevel = opts.includes("--clippy")
		? TestingLevel.Clippy
		: TestingLevel.Normal

	async function findManifest (file = ".") {
		let stats = await fs.stat(file).catch(error => {
			console.log(`Bail out! No such file ${file}`)
			console.error(usage)
			// ENOTRECOVERABLE
			process.exit(131)
		})

		if (stats.isFile()) {
			return file
		}

		if (stats.isDirectory()) {
			return findManifest(resolvePath(file, "origami.json"))
		}
	}

	let filename = await findManifest(rootOption)
	let root = getDirname(filename)

	let manifestFile = await fs.readFile(filename, "utf-8").catch(error => {
		console.log(`Bail out! Could not read file ${filename}`)
		console.error(error)
		console.error(usage)
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

	let extras: RuleExtras = {
		manifest,
		manifestFilename: filename,
		environment: environmentVariables,
		testingLevel: testLevel,
		root
	}

	let manifestKeys = Object.keys(manifest)

	let fieldPath = resolvePath(__dirname, "rules")
	let fieldFiles = await getFiles(fieldPath)
	let extraKeys = []
	for (let key of manifestKeys) {
		if (!fieldFiles.includes(`${key}.js`)) {
			extraKeys.push(key)
		}
	}

	if (testLevel == TestingLevel.Clippy) {
		console.warn(
			"# warning! testing level is `clippy`, will fail on spec-compliant but non-idiomatic code"
		)
	}

	// there's a better way to do this, but the music is so loud
	let results = []
	for await (let result of processFieldFiles(fieldFiles, fieldPath, extras.manifest, extras)) {
		results.push(result)
	}

	let exitCode = 0
	results.forEach((result, index) => {
		let [state, ruleName, message, value] = result
		if (state == RuleState.ok) {
			process.stdout.write(`ok ${index + 1} ${ruleName}: ${message}\n`)
		} else if (state == RuleState.skip) {
			process.stdout.write(`ok ${index + 1} # skip ${ruleName}: ${message}\n`)
		} else if (state == RuleState.notok) {
			exitCode = 1
			// TODO fix this for subfields
			let help = `\n\tCheck https://origami.ft.com/spec/v1/manifest/${ruleName} for help`
			let json = JSON.stringify(value, null, "\t")
			json = json ? json.replace(/^/gm, "\t\t") : "undefined"
			let received = ruleName.length
				? `\n\tgot '''\n${json}\n\t    '''`
				: ""
			process.stdout.write(
				`not ok ${index + 1} ${ruleName}: ${message}${received}${help}\n`
			)
		}
	})

	process.exit(exitCode)
})()
