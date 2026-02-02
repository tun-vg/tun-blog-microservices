// src/components/Editor.jsx
import React, { useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

export default function Editor({ onChange }) {
  const fileInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: true }),
      Placeholder.configure({
        placeholder: "Nhập nội dung bài viết ở đây...",
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
  });

  if (!editor) return null;

  const triggerPickImage = () => fileInputRef.current?.click();

  // --- A) Upload thường ---
  const uploadFileToServer = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/files/upload", { method: "POST", body: formData });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.url; // backend trả về URL public
  };

  // --- B) Pre-signed URL (khuyên dùng) ---
  const uploadFileByPresign = async (file) => {
    const presignRes = await fetch(`/api/files/presign?filename=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}`);
    if (!presignRes.ok) throw new Error("Get presigned URL failed");
    const presign = await presignRes.json(); // { uploadUrl, publicUrl }

    const putRes = await fetch(presign.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!putRes.ok) throw new Error("PUT to storage failed");
    return presign.publicUrl;
  };

  const onPickImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      // Chọn 1 trong 2 cách:
      // const url = await uploadFileToServer(file);
      const url = await uploadFileByPresign(file);

      editor.chain().focus().setImage({ src: url, alt: file.name }).run();
    } catch (err) {
      console.error(err);
      alert("Upload ảnh thất bại");
    } finally {
      e.target.value = ""; // reset input
    }
  };

  const buttons = [
    { label: "B", action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold") },
    { label: "I", action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic") },
    { label: "H1", action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive("heading", { level: 1 }) },
    { label: "H2", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
    { label: "• List", action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList") },
    { label: "1. List", action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList") },
  ];

  return (
    <div className="border rounded-xl p-3 space-y-2 ">
      <div className="flex flex-wrap gap-2">
        {buttons.map((b) => (
          <button
            key={b.label}
            className={`px-2 py-1 border rounded ${b.active ? "bg-gray-200" : ""}`}
            onClick={b.action}
            type="button"
          >
            {b.label}
          </button>
        ))}
        <button className="px-2 py-1 border rounded" onClick={triggerPickImage} type="button">
          Ảnh
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onPickImage}
        />
      </div>
      <EditorContent editor={editor} className="ProseMirror min-h-[240px] p-3 border rounded" />
    </div>
  );
}
