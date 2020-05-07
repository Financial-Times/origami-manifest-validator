import type {Rule} from "./rule"

export enum FieldType {
	// For most fields
	Direct,
	// for objects where you'd like to have rules for each field
	Recurse,
	// for arrays where you'd like to process each item with the rules
	Each
}

interface RuleField {
	type: FieldType,
	rules: Rule[]
}

export interface DirectField extends RuleField {
	type: FieldType.Direct,
	rules: Rule[]
}

export interface RecurseField extends RuleField {
	type: FieldType.Recurse,
	fields: Promise<FieldMap>
}

export interface EachField extends RuleField {
	type: FieldType.Each,
	each: Rule[]
}

export type FieldMap = {
	[fieldName: string]: Field
}

export type Field = DirectField|RecurseField|EachField
