import markdownit from "markdown-it";
import React from "react";

const convertToHtml = (text: string): string => {
  const md = markdownit({
    // Enable HTML tags in source
    html: true,

    // Use '/' to close single tags (<br />).
    // This is only for full CommonMark compatibility.
    xhtmlOut: false,

    // Convert '\n' in paragraphs into <br>
    breaks: true,

    // CSS language prefix for fenced blocks. Can be
    // useful for external highlighters.
    langPrefix: "language-",

    // Autoconvert URL-like text to links
    linkify: false,

    // Enable some language-neutral replacement + quotes beautification
    // For the full list of replacements, see https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.js
    typographer: false,

    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: "“”‘’",

    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externally.
    // If result starts with <pre... internal wrapper is skipped.
    highlight: function (/* str, lang */) {
      return "";
    },
  });

  return md.renderInline(text);
};

// Example of using the converted HTML in a React component
export const RenderHtmlContent: React.FC<{ text: string }> = ({ text }) => {
  const htmlContent = convertToHtml(text);

  return <p dangerouslySetInnerHTML={{ __html: htmlContent }}></p>;
};
