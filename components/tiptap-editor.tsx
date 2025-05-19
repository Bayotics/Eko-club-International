"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import {
  Bold,
  Italic,
  UnderlineIcon,
  List,
  ListOrdered,
  LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import TextAlign from "@tiptap/extension-text-align"
import Heading from "@tiptap/extension-heading"

interface TipTapEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export function TipTapEditor({ content, onChange, placeholder = "Write something..." }: TipTapEditorProps) {
  const [linkUrl, setLinkUrl] = useState("")
  const [linkOpen, setLinkOpen] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Heading.configure({
        levels: [1, 2],
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: "min-h-[150px] p-3 focus:outline-none rounded-md border border-input bg-background",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  const setLink = () => {
    if (linkUrl) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run()
      setLinkUrl("")
      setLinkOpen(false)
    }
  }

  const removeLink = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run()
    setLinkOpen(false)
  }

  return (
    <div className="border rounded-md">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/50">
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("bold")}
                onPressedChange={() => editor.chain().focus().toggleBold().run()}
              >
                <Bold className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Bold</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("italic")}
                onPressedChange={() => editor.chain().focus().toggleItalic().run()}
              >
                <Italic className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Italic</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("underline")}
                onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
              >
                <UnderlineIcon className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Underline</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("heading", { level: 1 })}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              >
                <Heading1 className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Heading 1</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("heading", { level: 2 })}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              >
                <Heading2 className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Heading 2</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("bulletList")}
                onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
              >
                <List className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Bullet List</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("orderedList")}
                onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
              >
                <ListOrdered className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Ordered List</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Popover open={linkOpen} onOpenChange={setLinkOpen}>
                <PopoverTrigger asChild>
                  <Toggle size="sm" pressed={editor.isActive("link")}>
                    <LinkIcon className="h-4 w-4" />
                  </Toggle>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-3">
                  <div className="flex flex-col gap-2">
                    <Input
                      placeholder="https://example.com"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          setLink()
                        }
                      }}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={setLink} className="flex-1">
                        Save
                      </Button>
                      {editor.isActive("link") && (
                        <Button size="sm" variant="outline" onClick={removeLink} className="flex-1">
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </TooltipTrigger>
            <TooltipContent>Link</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: "left" })}
                onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}
              >
                <AlignLeft className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Align Left</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: "center" })}
                onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}
              >
                <AlignCenter className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Align Center</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: "right" })}
                onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}
              >
                <AlignRight className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Align Right</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <EditorContent editor={editor} className="prose prose-sm max-w-none" />
    </div>
  )
}
