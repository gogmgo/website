"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import { Table, TableRow, TableHeader, TableCell } from "@tiptap/extension-table"
import { useEffect } from "react"

const BTN: React.CSSProperties = {
  padding: "3px 8px",
  borderRadius: "4px",
  border: "1px solid rgba(244,241,234,0.12)",
  backgroundColor: "rgba(244,241,234,0.04)",
  color: "rgba(184,181,173,0.70)",
  fontSize: "0.75rem",
  cursor: "pointer",
  userSelect: "none",
}

export function RichTextEditor({
  content,
  onChange,
}: {
  content: string
  onChange: (html: string) => void
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        style: [
          "min-height:320px",
          "padding:16px",
          "outline:none",
          "color:#f4f1ea",
          "font-size:0.875rem",
          "line-height:1.7",
        ].join(";"),
      },
    },
    immediatelyRender: false,
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false })
    }
  }, [editor, content])

  if (!editor) return null

  const cmd = editor.chain().focus()

  return (
    <div
      style={{
        border: "1px solid rgba(244,241,234,0.12)",
        borderRadius: "8px",
        backgroundColor: "rgba(244,241,234,0.02)",
        overflow: "hidden",
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "4px",
          padding: "10px 12px",
          borderBottom: "1px solid rgba(244,241,234,0.08)",
        }}
      >
        <button type="button" style={BTN} onClick={() => cmd.toggleBold().run()}>B</button>
        <button type="button" style={BTN} onClick={() => cmd.toggleItalic().run()}>I</button>
        <button type="button" style={BTN} onClick={() => cmd.toggleHeading({ level: 2 }).run()}>H2</button>
        <button type="button" style={BTN} onClick={() => cmd.toggleHeading({ level: 3 }).run()}>H3</button>
        <button type="button" style={BTN} onClick={() => cmd.toggleBulletList().run()}>• List</button>
        <button type="button" style={BTN} onClick={() => cmd.toggleOrderedList().run()}>1. List</button>
        <button
          type="button"
          style={BTN}
          onClick={() => {
            const url = window.prompt("URL")
            if (url) editor.chain().focus().setLink({ href: url }).run()
          }}
        >
          Link
        </button>
        <button
          type="button"
          style={BTN}
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          Unlink
        </button>
        <button
          type="button"
          style={BTN}
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
        >
          Table
        </button>
        <button type="button" style={BTN} onClick={() => cmd.undo().run()}>↩</button>
        <button type="button" style={BTN} onClick={() => cmd.redo().run()}>↪</button>
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}
