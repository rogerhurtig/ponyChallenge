/**
 * @file - Contains all image types that lack type declaration
 * Note: Add the image type to the file-loader in "webpack.config.js"
 */
declare module '*.png' {
  const value: any;
  export = value;
}

declare module '*.jpg' {
  const value: any;
  export = value;
}

declare module '*.svg' {
  const value: any;
  export = value;
}