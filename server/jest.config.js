module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.js'],
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/__tests__/**',
        '!src/index.js'
    ],
    coverageDirectory: 'coverage',
    verbose: true,
    testTimeout: 10000,
    setupFilesAfterEnv: ['./src/__tests__/setup.js']
};
