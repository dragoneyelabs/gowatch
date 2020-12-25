module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  rules: {
    "vue/comment-directive": 0,
    "vue/max-attributes-per-line": ["error", {
      "singleline": 1,
      "multiline": {
        "max": 1,
        "allowFirstLine": false
      }
    }],
    "comma-dangle": ["error", {
      "arrays": "always-multiline",
      "objects": "always-multiline",
      "imports": "always-multiline",
      "exports": "always-multiline",
      "functions": "always-multiline"
    }],
    semi: [2, "always"],
    "vue/script-indent": ["error", 2, {
      "baseIndent": 1,
      "switchCase": 0,
      "ignores": []
    }],
    "space-before-function-paren": ["error", "never"],
  },
  overrides: [
    {
      "files": ["*.vue"],
      "rules": {
        "indent": "off"
      }
    }
  ]
}
