/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
	testEnvironment: 'node',
	moduleFileExtensions: ['ts', 'js'],
	transform: {
		'^.+.tsx?$': ['ts-jest', {}],
	},
	testMatch: ['**/__tests__/**/*.test.ts'],
};
