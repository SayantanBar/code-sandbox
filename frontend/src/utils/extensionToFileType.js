const extensionToMap = {
  js: "javascript",
  ts: "typescript",
  jsx: "javascript",
  json: "json",
  html: "html",
  css: "css",
  md: "markdown",
  gitignore: "gitignore",
};
export const extensionToFileType = (extension) => {
  if (!extension) return undefined;
  console.log(extensionToMap[extension]);

  return extensionToMap[extension];
};
