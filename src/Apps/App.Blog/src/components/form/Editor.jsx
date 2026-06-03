import React, { useCallback, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import { uploadFile } from "../../api/file/file";

// Icons
import {
  BiBold, BiItalic, BiUnderline, BiStrikethrough,
  BiCode, BiCodeBlock, BiLink, BiImage,
  BiAlignLeft, BiAlignMiddle, BiAlignRight,
  BiListUl, BiListOl, BiMinus,
  BiUndo, BiRedo, BiHighlight,
} from "react-icons/bi";
import { LuHeading1, LuHeading2, LuHeading3 } from "react-icons/lu";
import { TbBlockquote, TbUnlink } from "react-icons/tb";

// ── Toolbar button ─────────────────────────────────────────────────────────────
const ToolBtn = ({ onClick, active, disabled, title, children, className = "" }) => (
  <button
    type="button"
    title={title}
    disabled={disabled}
    onClick={onClick}
    className={`
      flex items-center justify-center w-8 h-8 rounded-lg text-[15px] transition-all
      ${active
        ? "bg-amber-100 text-amber-700 shadow-inner"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}
      ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
      ${className}
    `}
  >
    {children}
  </button>
);

// ── Divider ────────────────────────────────────────────────────────────────────
const Divider = () => <div className="w-px h-6 bg-gray-200 mx-1 self-center" />;

// ── Main Editor ────────────────────────────────────────────────────────────────
export default function Editor({ content = "", onChange }) {
  const fileInputRef = useRef(null);
  const initialSetRef = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Color,
      Highlight.configure({ multicolor: true }),
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } }),
      Placeholder.configure({ placeholder: "Bắt đầu viết nội dung bài viết của bạn..." }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none min-h-[420px] px-10 py-8",
      },
    },
  });

  // Set initial content once
  React.useEffect(() => {
    if (!editor || !content || initialSetRef.current) return;
    editor.commands.setContent(content);
    editor.commands.focus("end");
    initialSetRef.current = true;
  }, [content, editor]);

  const uploadImage = useCallback(async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await uploadFile(formData);
    return res.url;
  }, []);

  const onPickImage = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    try {
      const url = await uploadImage(file);
      editor.chain().focus().setImage({ src: url, alt: file.name }).run();
    } catch {
      alert("Upload ảnh thất bại. Vui lòng thử lại.");
    } finally {
      e.target.value = "";
    }
  }, [editor, uploadImage]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href ?? "";
    const url = window.prompt("Nhập URL:", prev);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  const wordCount = editor.getText().trim().split(/\s+/).filter(Boolean).length;
  const charCount = editor.getText().length;

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white">

      {/* ── Toolbar ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 bg-gray-50 border-b border-gray-200 sticky top-0 z-10">

        {/* History */}
        <ToolBtn title="Hoàn tác (Ctrl+Z)" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <BiUndo />
        </ToolBtn>
        <ToolBtn title="Làm lại (Ctrl+Y)" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <BiRedo />
        </ToolBtn>

        <Divider />

        {/* Headings */}
        <ToolBtn title="Tiêu đề 1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })}>
          <LuHeading1 />
        </ToolBtn>
        <ToolBtn title="Tiêu đề 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>
          <LuHeading2 />
        </ToolBtn>
        <ToolBtn title="Tiêu đề 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}>
          <LuHeading3 />
        </ToolBtn>

        <Divider />

        {/* Inline formatting */}
        <ToolBtn title="In đậm (Ctrl+B)" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
          <BiBold />
        </ToolBtn>
        <ToolBtn title="In nghiêng (Ctrl+I)" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
          <BiItalic />
        </ToolBtn>
        <ToolBtn title="Gạch chân (Ctrl+U)" onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")}>
          <BiUnderline />
        </ToolBtn>
        <ToolBtn title="Gạch ngang" onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")}>
          <BiStrikethrough />
        </ToolBtn>
        <ToolBtn title="Code inline" onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")}>
          <BiCode />
        </ToolBtn>
        <ToolBtn title="Đánh dấu" onClick={() => editor.chain().focus().toggleHighlight({ color: "#fef08a" }).run()} active={editor.isActive("highlight")}>
          <BiHighlight />
        </ToolBtn>

        <Divider />

        {/* Alignment */}
        <ToolBtn title="Căn trái" onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })}>
          <BiAlignLeft />
        </ToolBtn>
        <ToolBtn title="Căn giữa" onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })}>
          <BiAlignMiddle />
        </ToolBtn>
        <ToolBtn title="Căn phải" onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })}>
          <BiAlignRight />
        </ToolBtn>

        <Divider />

        {/* Lists */}
        <ToolBtn title="Danh sách gạch đầu dòng" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>
          <BiListUl />
        </ToolBtn>
        <ToolBtn title="Danh sách đánh số" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>
          <BiListOl />
        </ToolBtn>

        <Divider />

        {/* Block elements */}
        <ToolBtn title="Trích dẫn" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}>
          <TbBlockquote />
        </ToolBtn>
        <ToolBtn title="Khối code" onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")}>
          <BiCodeBlock />
        </ToolBtn>
        <ToolBtn title="Đường kẻ ngang" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <BiMinus />
        </ToolBtn>

        <Divider />

        {/* Link & Image */}
        <ToolBtn title="Chèn liên kết" onClick={setLink} active={editor.isActive("link")}>
          <BiLink />
        </ToolBtn>
        {editor.isActive("link") && (
          <ToolBtn title="Xóa liên kết" onClick={() => editor.chain().focus().unsetLink().run()}>
            <TbUnlink />
          </ToolBtn>
        )}
        <ToolBtn title="Chèn ảnh" onClick={() => fileInputRef.current?.click()}>
          <BiImage />
        </ToolBtn>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onPickImage} />

        {/* Color picker */}
        <Divider />
        <label title="Màu chữ" className="flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors relative">
          <span className="text-sm font-bold" style={{ color: editor.getAttributes("textStyle").color || "#111" }}>A</span>
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full" style={{ backgroundColor: editor.getAttributes("textStyle").color || "#111" }} />
          <input
            type="color"
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            value={editor.getAttributes("textStyle").color || "#000000"}
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          />
        </label>
      </div>

      {/* ── Editor content ───────────────────────────────────────────── */}
      <div className="relative bg-white">
        <EditorContent
          editor={editor}
          className="[&_.ProseMirror]:focus:outline-none
            [&_.ProseMirror_h1]:text-3xl [&_.ProseMirror_h1]:font-extrabold [&_.ProseMirror_h1]:mb-4 [&_.ProseMirror_h1]:mt-6 [&_.ProseMirror_h1]:text-gray-900
            [&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h2]:mb-3 [&_.ProseMirror_h2]:mt-5 [&_.ProseMirror_h2]:text-gray-900
            [&_.ProseMirror_h3]:text-xl [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:mb-2 [&_.ProseMirror_h3]:mt-4 [&_.ProseMirror_h3]:text-gray-900
            [&_.ProseMirror_p]:text-gray-700 [&_.ProseMirror_p]:leading-relaxed [&_.ProseMirror_p]:mb-3
            [&_.ProseMirror_strong]:font-bold [&_.ProseMirror_strong]:text-gray-900
            [&_.ProseMirror_em]:italic
            [&_.ProseMirror_u]:underline
            [&_.ProseMirror_s]:line-through [&_.ProseMirror_s]:text-gray-500
            [&_.ProseMirror_code]:bg-gray-100 [&_.ProseMirror_code]:text-amber-700 [&_.ProseMirror_code]:px-1.5 [&_.ProseMirror_code]:py-0.5 [&_.ProseMirror_code]:rounded [&_.ProseMirror_code]:text-sm [&_.ProseMirror_code]:font-mono
            [&_.ProseMirror_pre]:bg-gray-900 [&_.ProseMirror_pre]:text-green-300 [&_.ProseMirror_pre]:rounded-xl [&_.ProseMirror_pre]:p-5 [&_.ProseMirror_pre]:my-4 [&_.ProseMirror_pre]:overflow-x-auto [&_.ProseMirror_pre]:text-sm [&_.ProseMirror_pre]:font-mono
            [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-amber-400 [&_.ProseMirror_blockquote]:bg-amber-50 [&_.ProseMirror_blockquote]:pl-5 [&_.ProseMirror_blockquote]:py-2 [&_.ProseMirror_blockquote]:my-4 [&_.ProseMirror_blockquote]:rounded-r-lg [&_.ProseMirror_blockquote]:text-gray-600 [&_.ProseMirror_blockquote]:italic
            [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ul]:my-3 [&_.ProseMirror_ul]:space-y-1
            [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_ol]:my-3 [&_.ProseMirror_ol]:space-y-1
            [&_.ProseMirror_li]:text-gray-700
            [&_.ProseMirror_a]:text-amber-600 [&_.ProseMirror_a]:underline [&_.ProseMirror_a]:font-medium [&_.ProseMirror_a:hover]:text-amber-800
            [&_.ProseMirror_img]:rounded-xl [&_.ProseMirror_img]:shadow-md [&_.ProseMirror_img]:my-4 [&_.ProseMirror_img]:max-w-full [&_.ProseMirror_img]:mx-auto [&_.ProseMirror_img]:block
            [&_.ProseMirror_hr]:border-gray-200 [&_.ProseMirror_hr]:my-6
            [&_.ProseMirror_mark]:bg-yellow-200 [&_.ProseMirror_mark]:px-0.5 [&_.ProseMirror_mark]:rounded
            [&_.ProseMirror_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_.is-editor-empty:first-child::before]:text-gray-400 [&_.ProseMirror_.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_.is-editor-empty:first-child::before]:h-0
          "
        />
      </div>

      {/* ── Footer: word count ───────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-4 px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
        <span>{wordCount} từ</span>
        <span>{charCount} ký tự</span>
      </div>
    </div>
  );
}
