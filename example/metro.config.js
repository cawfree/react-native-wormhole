module.exports = {
  transformer: {
     babelTransformerPath: require.resolve(
       'metro-react-native-babel-transformer',
     ),
     assetRegistryPath: 'react-native/Libraries/Image/AssetRegistry',
     asyncRequireModulePath: require.resolve(
       'metro-runtime/src/modules/asyncRequire',
     ),
     inlineRequires: true,
     experimentalImportSupport: true,
     allowOptionalDependencies: true,
  },
};
