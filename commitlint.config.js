const Configuration = {
  /*
   * Resolve and load @commitlint/config-conventional from node_modules.
   * Referenced packages must be installed
   */
  extends: ['@commitlint/config-conventional'],
  /*
   * Any rules defined here will override rules from @commitlint/config-conventional
   */
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'revert'],
    ],
  },
  /*
   * Whether commitlint uses the default ignore rules, see the description above.
   */
  defaultIgnores: true,
  /*
   * Custom prompt configs
   */
  prompt: {
    messages: {},
    questions: {
      type: {
        description:
          'please input type (ex. feat, fix, test, refactor, style, chore):',
      },
    },
  },
};

export default Configuration;
