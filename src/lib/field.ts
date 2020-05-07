import type {Rule} from "./rule"

export enum FieldType {
	// For most fields
	Direct,
	// for objects where you'd like to have rules for each field
	Recurse,
	// for arrays where you'd like to process each item with rules for each field
	EachRecurse,
	// for arrays where you'd like to process each item with rules
	// Each
}

interface RuleField {
	type: FieldType,
	rules: Rule[]
}

export interface DirectField extends RuleField {
	type: FieldType.Direct
}

export interface RecurseField extends RuleField {
	type: FieldType.Recurse
}

export interface EachField extends RuleField {
	type: FieldType.EachRecurse
}

export type FieldMap = {
	[fieldName: string]: Field
}

export type Field = DirectField|RecurseField|EachField
