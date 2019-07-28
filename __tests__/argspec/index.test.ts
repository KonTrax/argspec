import * as Spec from '../../'

// import { Spec } from '@src/argspec'
// import Spec from '@src/argspec'

//==============================================================================
//=== FIXTURES ===

const FIX = {
	instance: {
		default:  () => Spec,
	},
	spec: {
		default:  () => FIX.spec.minPlain(),
		minPlain: () => ({}),
		minKind:  () => ({[Spec.SymKey_Spec]: true }),
	},
	result: {
		default:  () => FIX.result.minKind(),
		minPlain: () => ({ _: [] }),
		minKind:  () => ({ _: [], [Spec.SymKey_Result]: true }),
	},
}

//==============================================================================
describe('Factory', () => {
//==============================================================================

describe('Factory', () => {

	it('has correct members', () =>
	{
		const test = () => Spec

		expect(test()).toEqual(expect.any(Function))
		expect(test()).toEqual(expect.objectContaining({
			// Instance
			[Symbol.toPrimitive]: expect.any(Function),
			[Spec.SymKey_Spec]:   expect.any(Function),
			toString:             expect.any(Function),

			parse:                expect.any(Function),

			isSpec:               expect.any(Function),
			ensureSpec:           expect.any(Function),

			isResult:             expect.any(Function),
			ensureResult:         expect.any(Function),

			length:               1,

			// Static
			SymKey_Spec:          Spec.SymKey_Spec,
			SymKey_Result:        Spec.SymKey_Result,
		}))
	})

})//============================================================================

describe('Defaults', () => {

	it('has correct defaults (spec)', () => {
		const test = () => Spec()
		expect(test()).toEqual(FIX.spec.default())
	})

	it('has correct defaults (result)', () => {
		const test = () => Spec.parse({argv: []})
		expect(test()).toEqual(FIX.result.default())
	})

})//============================================================================

})//============================================================================
describe('Instance', () => {
//==============================================================================

describe('Spec', () => {

	it.each([
		() => Spec,
		() => Spec({ '--var1': Boolean }),
		() => Spec({ '--var1': Boolean })({ '--var2': Boolean }),
		() => Spec({ '--var1': Boolean })({ '--var2': Boolean })({ '--var3': Boolean }),
	])('has correct members %#', (test) =>
	{
		expect(test()).toEqual(expect.any(Function))
		expect(test()).toEqual(expect.objectContaining({
			// Instance
			[Symbol.toPrimitive]: expect.any(Function),
			[Spec.SymKey_Spec]:   expect.any(Function),
			toString:             expect.any(Function),

			parse:                expect.any(Function),

			isSpec:               expect.any(Function),
			ensureSpec:           expect.any(Function),

			isResult:             expect.any(Function),
			ensureResult:         expect.any(Function),

			length:               1,
		}))
	})

})//============================================================================

describe('Spec()', () => {

	it('returns current SpecMap (a)', () => {
		const a    = { '--var1': Boolean }
		const test = () => Spec(a)()
		expect(test()).toEqual({
			'--var1': Boolean,
		})
	})

	it('returns current SpecMap (b & a) ', () => {
		const a    = { '--var1': Boolean }
		const b    = { '--var2': Boolean }
		const test = () => Spec(a)(b)()
		expect(test()).toEqual({
			'--var1': Boolean,
			'--var2': Boolean,
		})
	})

	it('returns current SpecMap (c & b & a) ', () => {
		const a    = { '--var1': Boolean }
		const b    = { '--var2': Boolean }
		const c    = { '--var3': Boolean }
		const test = () => Spec(a)(b)(c)()
		expect(test()).toEqual({
			'--var1': Boolean,
			'--var2': Boolean,
			'--var3': Boolean,
		})
	})

	it('correctly overwrites previous values', () => {
		const a    = { '--var1': Boolean }
		const b    = { '--var1': Number  }
		const test = () => Spec(a)(b)()
		expect(test()).toEqual({
			'--var1': Number ,
		})
	})

})//============================================================================

describe('Spec.is[*]', () => {
//==============================================================================

describe('Spec.isSpec', () => {
	const test = Spec.isSpec

	it.each([
		// [Spec],
		[Spec({ '--var1': Boolean })],
		[Spec({ '--var1': Boolean })({ '--var2': Boolean })],
		[Spec({ '--var1': Boolean })({ '--var2': Boolean })({ '--var3': Boolean })],
	])('correctly identifies spec %#', (obj) =>
	{
		expect(test(obj)).toBe(true)

		if (test(obj)) { const typeRes = obj }
		else           { const typeRes = obj }
	})

	it.each([1, '1', {}, true, [], String, Spec.parse()])
	('correctly identifies non-spec %#', (obj) =>
	{
		expect(test(obj)).toBe(false)

		if (test(obj)) { const typeRes = obj }
		else           { const typeRes = obj }
	})

})//============================================================================

describe('Spec.isResult', () => {
	const test = Spec.isResult
	// const FIX  = _FIX.result

	it.each([
		Spec,
		Spec({ '--var1': Boolean }),
		Spec({ '--var1': Boolean })({ '--var2': Boolean }),
		Spec({ '--var1': Boolean })({ '--var2': Boolean })({ '--var3': Boolean }),
	])(`returns true on valid result (%#)`, (spec) =>
	{
		const obj = spec.parse()
		expect(test(obj)).toBe(true)

		if (test(obj)) { const typeRes = obj }
		else           { const typeRes = obj }
	})

	it(`returns true on minimal valid Result<T>`, () => {
		const obj = FIX.result.minPlain()
		expect(test(obj)).toBe(true)
	})

	it.each([
		{ _: [] },
		{ _: [], '--var1': Boolean },
	])(`returns true on semi-valid Result<T> (%#)`, (obj) =>
	{
		expect(test(obj)).toBe(true)
	})

	it.each([
		Spec,
		Spec({ '--var1': Boolean }),
		undefined,
		null,
		{},
		{ '--var1': Boolean },
	])(`returns false on non-result (%#)`, (obj) =>
	{
		expect(test(obj)).toBe(false)

		if (test(obj)) { const typeRes = obj }
		else           { const typeRes = obj }
	})

})//============================================================================

})//============================================================================

describe('Spec.ensure[*]', () => {
//==============================================================================

describe('Spec.ensureSpec', () => {
	const test = Spec.ensureSpec

	it.each([
		Spec,
		Spec({ '--var1': Boolean }),
		Spec({ '--var1': Boolean })({ '--var2': Boolean }),
		Spec({ '--var1': Boolean })({ '--var2': Boolean })({ '--var3': Boolean }),
	])('just returns valid Instance<T> (%#)', (obj) =>
	{
		let result
		expect(result = test(obj)).toEqual(obj)
		expect(result = test(obj)).toBe(obj)

		expect(Spec.isSpec(result)).toBe(true)
	})

	it.each([
		undefined,
		null,
		{},
		{ '--var1': Boolean },
	])('returns default Instance<T> on invalid (%#)', (obj) =>
	{
		expect(Spec.isSpec  (obj)).toBe(false)
		expect(Spec.isResult(obj)).toBe(false)

		let result
		expect(result = test(obj)).toEqual(FIX.instance.default())
		expect(result = test(obj)).toBe(FIX.instance.default())

		expect(Spec.isSpec  (result)).toBe(true)
		expect(Spec.isResult(result)).toBe(false)
	})

})//============================================================================

describe('Spec.ensureResult', () => {
	const test = Spec.ensureResult

	it.each([
		Spec.parse(),
		Spec({ '--var1': Boolean }).parse(),
		Spec({ '--var1': Boolean })({ '--var2': Boolean }).parse(),
		Spec({ '--var1': Boolean })({ '--var2': Boolean })({ '--var3': Boolean }).parse(),
	])('just returns valid Result<T> (%#)', (obj) =>
	{
		expect(Spec.isSpec  (obj)).toBe(false)
		expect(Spec.isResult(obj)).toBe(true)

		let result
		expect(result = test(obj)).toEqual(obj)

		expect(Spec.isSpec  (result)).toBe(false)
		expect(Spec.isResult(result)).toBe(true)
	})

	it.each([
		{ _: [], '--var1': Boolean },
	])('just returns semi-valid Result<T> (%#)', (obj) =>
	{
		let result
		expect(result = test(obj)).toEqual(obj)

		expect(Spec.isSpec  (result)).toBe(false)
		expect(Spec.isResult(result)).toBe(true)
	})

	it.each([
		Spec,
		Spec({ '--var1': Boolean }),
		Spec({ '--var1': Boolean })({ '--var2': Boolean }),
		Spec({ '--var1': Boolean })({ '--var2': Boolean })({ '--var3': Boolean }),
	])('converts Instance<T> to Result<T> (%#)', (obj) =>
	{
		expect(Spec.isSpec  (obj)).toBe(true)
		expect(Spec.isResult(obj)).toBe(false)

		let result
		expect(result = test(obj)).toEqual(obj.parse())

		expect(Spec.isSpec  (result)).toBe(false)
		expect(Spec.isResult(result)).toBe(true)
	})

	it.each([
		undefined,
		null,
		{},
		{ '--var1': Boolean },
	])('returns default Result<T> on invalid (%#)', (obj) =>
	{
		expect(Spec.isSpec  (obj)).toBe(false)
		expect(Spec.isResult(obj)).toBe(false)

		let result
		expect(result = test(obj)).toEqual(FIX.result.default())

		expect(Spec.isSpec  (result)).toBe(false)
		expect(Spec.isResult(result)).toBe(true)
	})

})//============================================================================

})//============================================================================

describe('Spec.parse', () => {

	it('parses argv correctly (a)', () => {
		const a    = { '--var1': Boolean }
		const test = (argv ?:string[]) => Spec(a).parse({ argv })

		expect(test([ '--var1' ])).toEqual({
			[Spec.SymKey_Result]: expect.any(Boolean),
			_: [],
			'--var1': true,
		})
	})

	it('parses argv correctly (b & a)', () => {
		const a    = { '--var1': Boolean }
		const b    = { '--var2': Boolean }
		const test = (argv ?:string[]) => Spec(a)(b).parse({ argv })

		expect(test([ '--var1' ])).toEqual({
			[Spec.SymKey_Result]: expect.any(Boolean),
			_: [],
			'--var1': true,
		})
		expect(test([ '--var1', '--var2' ])).toEqual({
			[Spec.SymKey_Result]: expect.any(Boolean),
			_: [],
			'--var1': true,
			'--var2': true,
		})
	})

	it('parses argv correctly', () => {
		const a = {
			'--var1': Boolean,
			'--var2': Boolean,
		}
		const test = (argv ?:string[]) => Spec(a).parse({ argv })

		expect(test([ '--var1', 'value1', '--var2' ])).toEqual({
			[Spec.SymKey_Result]: expect.any(Boolean),
			_: ['value1'],
			'--var1': true,
			'--var2': true,
		})
	})

})//============================================================================

})//============================================================================
describe('Result', () => {
//==============================================================================

describe('Members', () => {
	const makeTest = <T extends Spec.Map> (spec ?:T|Spec.Instance<T>|Spec.Factory, opts ?:Spec.Options | string[]) => {
		const _spec = (typeof spec === 'function') ? spec : (!spec) ? Spec : Spec(spec)

		if (Array.isArray(opts))
			opts = { argv: opts }

		return () => _spec.parse(opts)
	}

	it('has correct members', () =>
	{
		const test = makeTest()

		expect(test()).toEqual(expect.any(Object))
		expect(test()).toEqual({
			[Spec.SymKey_Result]: expect.any(Boolean),
			_: expect.any(Array),
		})
		expect(Object.keys(test())).toEqual(['_'])
	})

	it('works correctly with loops', () =>
	{
		const test = makeTest(
			{ '--var1': Boolean },
			['--var1'],
		)
		const expectedKeys = ['_', '--var1']

		const res = test()

		expect(
			Object.keys(test())
		).toEqual(expectedKeys)

		expect((() => {
			const res  = test()
			const keys = []
			for (const key in res) keys.push(key);
			return keys
		})()).toEqual(expectedKeys)
	})

})//============================================================================

})//============================================================================
