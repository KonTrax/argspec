// @ts-nocheck
const argp = require('arg')

//==============================================================================

const SymKey_Spec   = Symbol('SymKey_Spec')
const SymKey_Result = Symbol('SymKey_Result')

//==============================================================================

const Factory = module.exports = _Spec({})

//==============================================================================

Factory.SymKey_Spec   = SymKey_Spec
Factory.SymKey_Result = SymKey_Result

//==============================================================================

function _Spec (currentSpec)
{
	if (arguments.length !== 1 || typeof currentSpec !== 'object' || !currentSpec)
		throw new Error('[Invalid Arguments]')

	function Spec (newSpec)
	{
		if (arguments.length === 0)           return currentSpec
		if (typeof newSpec   !== 'object')    return currentSpec
		if (typeof newSpec   === 'undefined') return currentSpec

		return _Spec({...currentSpec, ...newSpec}) // Method: Inherit
		// return _Spec(Object.assign(currentSpec, newSpec)) // Method: Mixin
	}

	Spec[SymKey_Spec]        = true
	Spec.parse               = _SpecInstanceParse

	Spec.    isSpec          = _SpecIsSpec
	Spec.ensureSpec          = _SpecEnsureSpec

	Spec.    isResult        = _SpecIsResult
	Spec.ensureResult        = _SpecEnsureResult

	Spec.toString            = _SpecInstanceToString
	Spec[Symbol.toPrimitive] = _SpecInstanceToPrimitive

	return Spec
}

//==============================================================================

function _SpecInstanceToString () { return `${this()}` }

function _SpecInstanceToPrimitive (hint) {
	if (hint === 'string') return `${this()}`
	return Number.NaN
}

//==============================================================================

function _SpecInstanceParse (options) {
	if (Array.isArray(options))
		options = { argv: options }

	return _SpecResult(argp(this(), options))
}

//==============================================================================

function _SpecResult (result)
{
	if (!result) result   = { _: [] }
	result[SymKey_Result] = true

	let desc = Object.getOwnPropertyDescriptor(result, SymKey_Result)
	if (!desc) {
		Object.defineProperty(result, SymKey_Result, {
			value:      true,
			enumerable: false,
		})
	}
	else if (desc.enumerable) {
		desc.enumerable = false
		Object.defineProperty(result, SymKey_Result, desc)
	}
	else {
	}

	return result
}

//==============================================================================

function _SpecIsSpec (obj) { return (
	!!obj && typeof obj === 'function' && (
		(SymKey_Spec in obj)
	// ||
	// 	typeof obj.parse    === 'function' &&
	// 	typeof obj.isSpec   === 'function' &&
	// 	typeof obj.isResult === 'function'
	)
)}

function _SpecIsResult (obj) { return (
	!!obj && typeof obj === 'object' && (
		(SymKey_Result in obj)
	||
		typeof obj._ === 'object' &&
		Array.isArray(obj._)
	)
)}

//==============================================================================

function _SpecEnsureSpec (obj, fallback = Factory) {
	return (_SpecIsSpec(obj)) ? obj : fallback
}

function _SpecEnsureResult (obj, options) {
	return (
		_SpecIsResult(obj) ? obj :
		_SpecIsSpec  (obj) ? obj.parse(options) : _SpecResult()
	)
}

//==============================================================================
