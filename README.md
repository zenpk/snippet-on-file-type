# Snippet on File Type

A VSCode extension for inserting different code snippets based on the file type. Works well with shortcuts and Vim.

## Setup

### Define snippets in `settings.json`

```json
{
  "snippet-on-file-type.defineSnippets": [
    {
      "fileTypes": [
        "javascript",
        "javascriptreact",
        "typescript",
        "typescriptreact"
      ],
      "snippets": {
        "print": ["console.log($1);"], // $1 is where the cursor stops, you can also add $2, $3...
        "log": ["console.log(`========== $1 ==========`);"],
        "error": [
          "try {",
          "  $1",
          "} catch (e) {",
          "  console.log(e);",
          "}"
        ]
      }
    },
    {
      "fileTypes": ["go"],
      "snippets": {
        "print": ["fmt.Println($1)"],
        "log": ["log.Println(\"========== $1 ==========\")"],
        "error": [
          "if err != nil {",
          "    return $1, err",
          "}",
          ""
        ] // empty string at the end for adding a newline
      }
    }
  ]
}
```

## Usage

### 1. In `keybindings.json`

```json
{
  "key": "ctrl+alt+p",
  "command": "snippet-on-file-type.insertSnippetBasedOnFileType",
  "args": ["print", false] // insert the snippet at the cursor position instead of a newline
}
```

### 2. In `settings.json`, with Vim (recommended)

```json
{
  "vim.normalModeKeyBindingsNonRecursive": [
    {
      "before": ["<leader>", "g", "p"], // [g]enerate [p]rint
      "commands": [
        {
          "command": "snippet-on-file-type.insertSnippetBasedOnFileType",
          "args": ["print"]
        }
      ]
    },
    {
      "before": ["<leader>", "g", "l"], // [g]enerate [l]og
      "commands": [
        {
          "command": "snippet-on-file-type.insertSnippetBasedOnFileType",
          "args": ["log"]
        }
      ]
    }
  ]
}
```

## Why not built-in User Snippets?

The built-in User Snippets feature doesn't support shortcut configuration, making it hard to integrate with Vim. If the snippet's prefix is too short, it appears too often at the top of tab completion. If it's too long, it loses the benefit of a "shortcut".
