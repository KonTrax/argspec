// @ts-check

/** @type {import('@jest/types/build/Config').GlobalConfig & import('@jest/types/build/Config').DefaultOptions} */
module.exports =
{//=============================================================================

	verbose: true,

	testMatch: [
		// "**/__tests__/**/*.[jt]s?(x)",
		// "**/?(*.)+(spec|test).[jt]s?(x)",
		"**/__tests__/**/*.+(spec|test).[jt]s?(x)",
	],

	roots: [
		'<rootDir>/__tests__',
		'<rootDir>/src',
	],

	transform: {
		[/^.+\.tsx?$/.source]: 'ts-jest',
		// '^.+\\.tsx?$': 'ts-jest',
	},

	moduleNameMapper: {
		'^@src/(.*)$': '<rootDir>/src/$1',
	},

	globals: {
		'ts-jest': /** @type {import('ts-jest/dist/types').TsJestGlobalOptions} */ ({
			tsConfig:    'tsconfig.test.json',
			babelConfig: false,
		}),
	},

}//=============================================================================
