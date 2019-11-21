module.exports = {
  extends: ['airbnb-base'],
  rules: {
    'arrow-parens': ['error', 'always'],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['test/**'],
      },
    ],
    'import/no-unresolved': 'off',
    indent: ['error', 2],
    'max-len': ['warn', 120],
    'no-param-reassign': ['error', { props: false }],
    'no-restricted-syntax': 'off',
    'no-underscore-dangle': 'off',
    'no-await-in-loop': 'off',
    'import/no-dynamic-require': 'off',
    'implicit-arrow-linebreak': 'off',
    'no-unused-expressions': [
      'off',
      {
        devDependencies: ['test/**'],
      },
    ],
    semi: 0,
  },
  env: {
    mocha: true,
  },
}
