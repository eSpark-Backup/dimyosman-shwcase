import { useEffect, useRef } from "react";

import Quill from "quill";
import "quill/dist/quill.snow.css";

import { attachment, bold, italic, lineThrough, link } from "../../assets";

const MessageInput = ({
  emojiPickerVisible,
  setEmojiPickerVisible,
  quillInstance,
  onChange,
  value,
}) => {
  const quillRef = useRef(null);

  useEffect(() => {
    if (!quillInstance?.current) {
      quillInstance.current = new Quill(quillRef.current, {
        theme: "snow",
        modules: {
          toolbar: [["bold", "italic", "strike", "image"], ["link"]],
        },
        placeholder: "Type your message here",
      });

      quillInstance.current.getModule("toolbar").addHandler("image", () => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.disabled = true;
        fileInput.onchange = function (event) {
          const file = event.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = function () {
              const range = quillInstance.current.getSelection();
              const link = `<a href="${reader.result}" download>${file.name}</a>`;
              quillInstance.current.insertEmbed(range.index, "link", link);
            };
            reader.readAsDataURL(file);
          }
        };
        fileInput.click();
      });

      quillInstance.current.getModule("toolbar").addHandler("emoji", () => {
        setEmojiPickerVisible(!emojiPickerVisible);
      });

      const toolbar = document.querySelector(".ql-toolbar");

      if (toolbar) {
        const boldButton = toolbar.querySelector(".ql-bold");
        const italicButton = toolbar.querySelector(".ql-italic");
        const strikeButton = toolbar.querySelector(".ql-strike");
        const linkButton = toolbar.querySelector(".ql-link");
        const imageButton = toolbar.querySelector(".ql-image");

        if (boldButton) {
          boldButton.innerHTML = `<img src="${bold}" alt="Bold"/>`;
        }

        if (italicButton) {
          italicButton.innerHTML = `<img src="${italic}" alt="italic"/>`;
        }

        if (strikeButton) {
          strikeButton.innerHTML = `<img src="${lineThrough}" alt="lineThrough"/>`;
        }

        if (linkButton) {
          linkButton.innerHTML = `<img src="${link}" alt="link"/>`;
        }

        if (imageButton) {
          imageButton.innerHTML = `<img src="${attachment}" alt="image"/>`;
        }

        // Listen for text changes and call the onChange callback
        quillInstance.current.on("text-change", () => {
          const content = quillInstance.current.root.innerHTML; // Get HTML content
          const text = quillInstance.current.getText(); // Get plain text content
          if (onChange) {
            onChange({ content, text }); // Pass the content to the parent
          }
        });
      }
    }
  }, [emojiPickerVisible]);

  useEffect(() => {
    if (quillInstance?.current) {
      const editorContent = quillInstance.current.root.innerHTML;
      if (editorContent !== value) {
        quillInstance.current.root.innerHTML = value || "";
      }
    }
  }, [value]);

  return (
    <div ref={quillRef} style={{ height: "74px" }} />
  );
};

export default MessageInput;
