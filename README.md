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
        "typescriptreact",
        "vue"
      ],
      "snippets": {
        "print": "console.log($1);",
        "log": "console.log(`$1`, \"background: #1e1f22; color: #bcbec4\");",
      }
    },
    {
      "fileTypes": ["go"],
      "snippets": {
        "print": "fmt.Println($1)",
        "error": "if err != nil {\n    return $1err\n}"
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
  "args": ["print", false] // false: don't add a new line
}
```

### 2. In `settings.json`, with Vim (recommended)

```json
{
  "vim.normalModeKeyBindingsNonRecursive": [
    {
      "before": ["<leader>", "g", "p"],
      "commands": [
        {
          "command": "snippet-on-file-type.insertSnippetBasedOnFileType",
          "args": ["print"]
        }
      ]
    }
  ]
}
```

## Why not built-in User Snippets?

The built-in User Snippets feature doesn't support shortcut configuration, making it hard to integrate with Vim. If the snippet's prefix is too short, it appears too often at the top of tab completion. If it's too long, it loses the benefit of a "shortcut".
