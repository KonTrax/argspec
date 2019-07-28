import * as TT from '@ktb/type-tools'

//==============================================================================

export = Spec

//==============================================================================

declare const SymKey_Spec   :unique symbol
declare const SymKey_Result :unique symbol

//==============================================================================

declare const Spec :Spec.Factory

//==============================================================================

declare namespace Spec
{//=============================================================================

	export type Options = import('arg').Options
	export type Item    = import('arg').Spec[string]
	export type Map     = import('arg').Spec

	export type Handler <T = any> = import('arg').Handler<T>

	// export import Result  = import('arg').Result

	export type DefaultMap = {}

	//----------------------------------------------------------------------------

	export type Assign <T extends Base, U extends Base, Base extends Map = Map> =
		[Base] extends [T] ? U :
		[Base] extends [U] ? T : TT.ObjectType<TT.AssignProps<T, U>>

	//----------------------------------------------------------------------------

	export type Result <T extends Map> =
		& ResultKind
		& { _ :string[] }
		& { [K in keyof T] ?:
			T[K] extends Handler   ? ReturnType<T[K]>           :
			T[K] extends [Handler] ? Array<ReturnType<T[K][0]>> : never
		}

	// export type ResultType <T extends Instance<any>> =
	// 		T extends Instance<infer R> ? Result<R> : never

	// export type ResultType <T extends Instance<any>> =
	// export type ResultType <T extends Instance<any> | Result<any>> =
	export type ResultType <T extends Instance | ResultLike> =
			T extends ResultLike ? T :
			// T extends Result  <infer R> ? Result<R> :
			T extends Instance<infer R> ? Result<R> : never

	export type ResultLike <T extends Map = DefaultMap> =
		& ResultKind
		& { _ :string[] }
		& { [K in keyof T] ?:any }

	//----------------------------------------------------------------------------

	export type SpecKind   = { readonly [SymKey_Spec]   :true }
	export type ResultKind = { readonly [SymKey_Result] :true }

	//----------------------------------------------------------------------------

	export interface Instance <A extends Map = DefaultMap>
	{
		/**/            ()       :A
		<B extends Map> (obj :B) :Instance<Assign<A, B>>

		parse ()                                    :Result<A>
		parse (options ?:Options)                   :Result<A>
		parse (options ?:          Options['argv']) :Result<A>
		parse (options ?:Options | Options['argv']) :Result<A>

		isSpec   (obj :unknown) :obj is Instance
		isResult (obj :unknown) :obj is ResultLike

		// ensureSpec   <T extends Instance<any>> (obj :T)       :T
		ensureSpec   <T extends Instance>      (obj :T)       :T
		ensureSpec                             (obj :unknown) :Instance
		// ensureSpec   (obj :unknown) :obj is Instance<any>
		// ensureSpec   (obj :unknown) :obj is Instance<any>

		ensureResult <T extends Instance|ResultLike> (obj ?:T,       options ?:Options) :ResultType<T>
		ensureResult <T extends Result<any>>         (obj ?:T,       options ?:Options) :ResultType<T>
		ensureResult                                 (obj ?:unknown, options ?:Options) :ResultLike

		readonly [SymKey_Spec]   :true
		// readonly [SymKey_Result] :true
	}

	//----------------------------------------------------------------------------

	export interface Factory extends Instance<DefaultMap>
	{
		readonly SymKey_Spec   :typeof SymKey_Spec
		readonly SymKey_Result :typeof SymKey_Result
	}

}//=============================================================================
