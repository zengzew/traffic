module.exports = {
  extends: ['@tencent/eslint-config-tencent'],
  plugins: ['vue'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
      experimentalObjectRestSpread: true,
    },
  },
  globals: {
    TMap: true, // 声明TMap为全局变量
  },
};
