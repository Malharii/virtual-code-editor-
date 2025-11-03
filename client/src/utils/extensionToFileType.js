const extensionToTypeMap = {
  js: "javascript",
  jsx: "javascript",
  css: "css",
  html: "html",
  json: "json",
  txt: "text",
  ts: "typescript",
  tsx: "typescript",
  gitignore: "gitignore",
  md: "markdown",
  yml: "yaml",
  svg: "svg",
};

export const extensionToFileType = (extension) => {
  if (!extension) return undefined;

  return extensionToTypeMap[extension];
};
