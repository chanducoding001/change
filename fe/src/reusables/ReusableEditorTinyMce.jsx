import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Paper, TextField, Box } from "@mui/material";

export default function ReusableEditorTinyMce({
  title = "",
  content = "",
  onTitleChange,
  onContentChange,
  height = "calc(100vh - 180px)",
}) {
  return (
    <Paper
      elevation={4}
      sx={{
        width: "100%",
        height,
        overflow: "hidden",
        borderRadius: 3,
        backgroundColor: "#fff",
        border: "1px solid #E2E8F0",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Title */}
      <Box
        sx={{
          p: 1,
          borderBottom: "1px solid #E2E8F0",
          backgroundColor: "#F8FAFC",
        }}
      >
        <TextField
          fullWidth
          size="small"
          label="Title"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => onTitleChange?.(e.target.value)}
        />
      </Box>

      {/* Editor */}
      <Box sx={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
        <Editor
          apiKey={import.meta.env.VITE_TINY_MCE_API_KEY}
          // apiKey="151i16ujymvu1myy7rij3ea7hcpd9zut92ka7h4i9t7rsin5"
          value={content}
          onEditorChange={(value) => onContentChange?.(value)}
          init={{
            width: "100%",
            height: 500,
            // height: "100%",
            menubar: true,
            branding: false,
            resize: false,

            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "media",
              "table",
              "code",
              "fullscreen",
              "preview",
              "searchreplace",
              "wordcount",
              "visualblocks",
              "help",
              "emoticons",
              "charmap",
            ],
            automatic_uploads: true,
            images_upload_handler: async (blobInfo, progress) => {
              const formData = new FormData();

              formData.append("file", blobInfo.blob(), blobInfo.filename());

              formData.append(
                "upload_preset",
                import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_NAME,
              );

              const response = await fetch(
                `https://api.cloudinary.com/v1_1/${
                  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
                }/image/upload`,
                {
                  method: "POST",
                  body: formData,
                },
              );

              const data = await response.json();

              return data.secure_url;
            },
            toolbar:
              "undo redo | blocks fontfamily fontsize | " +
              "bold italic underline strikethrough | " +
              "forecolor backcolor | " +
              "alignleft aligncenter alignright alignjustify | " +
              "bullist numlist outdent indent | " +
              "link image media table | " +
              "removeformat code fullscreen",

            toolbar_sticky: true,
            toolbar_sticky_offset: 0,

            file_picker_types: "image media file",

            file_picker_callback: (callback, value, meta) => {
              const input = document.createElement("input");

              if (meta.filetype === "image") {
                input.type = "file";
                input.accept = "image/*";
              } else if (meta.filetype === "media") {
                input.type = "file";
                input.accept = "video/*,audio/*";
              } else {
                input.type = "file";
              }

              input.onchange = function () {
                const file = input.files[0];

                if (!file) return;

                const reader = new FileReader();

                reader.onload = () => {
                  callback(reader.result, {
                    title: file.name,
                  });
                };

                reader.readAsDataURL(file);
              };

              input.click();
            },

            content_style: `
              body{
                margin:0;
                padding:20px;
                font-family:Arial, Helvetica, sans-serif;
                font-size:16px;
                line-height:1.8;
                color:#102A43;
              }

              img{
                max-width:100%;
                height:auto;
              }

              table{
                width:100%;
                border-collapse:collapse;
              }

              table, th, td{
                border:1px solid #CBD5E1;
              }

              th, td{
                padding:8px;
              }
            `,

            // setup: (editor) => {
            //   editor.on("init", () => {
            //     const container = editor.getContainer();

            //     container.style.height = "100%";
            //     container.style.display = "flex";
            //     container.style.flexDirection = "column";

            //     const header =
            //       container.querySelector(".tox-editor-header");

            //     if (header) {
            //       header.style.position = "sticky";
            //       header.style.top = "0";
            //       header.style.zIndex = "999";
            //       header.style.background = "#FFFFFF";
            //       header.style.borderBottom =
            //         "1px solid #E2E8F0";
            //     }

            //     const editArea =
            //       container.querySelector(".tox-edit-area");

            //     if (editArea) {
            //       editArea.style.flex = "1";
            //       editArea.style.overflow = "auto";
            //     }
            //   });

            //   // TAB SUPPORT
            //   editor.on("keydown", (e) => {
            //     if (e.key === "Tab") {
            //       e.preventDefault();

            //       const node = editor.selection.getNode();

            //       const isListItem =
            //         node.closest &&
            //         node.closest("li");

            //       if (isListItem) {
            //         if (e.shiftKey) {
            //           editor.execCommand("Outdent");
            //         } else {
            //           editor.execCommand("Indent");
            //         }
            //       }
            //       else {
            //         // Insert 4 spaces
            //         editor.insertContent(
            //           "&nbsp;&nbsp;&nbsp;&nbsp;"
            //         );
            //       }
            //     }
            //   });
            // },
            setup: (editor) => {
              editor.on("init", () => {
                const container = editor.getContainer();

                container.style.height = "100%";
                container.style.display = "flex";
                container.style.flexDirection = "column";

                const editArea = container.querySelector(".tox-edit-area");

                if (editArea) {
                  editArea.style.flex = "1";
                  editArea.style.overflow = "auto";
                }
              });

              editor.on("keydown", (e) => {
                if (e.key === "Tab") {
                  e.preventDefault();

                  const node = editor.selection.getNode();
                  const isListItem = node?.closest?.("li");

                  if (isListItem) {
                    editor.execCommand(e.shiftKey ? "Outdent" : "Indent");
                  } else {
                    editor.insertContent("&#8195;");
                  }
                }
              });
            },
          }}
        />
      </Box>
    </Paper>
  );
}

// import React from "react";
// import { Editor } from "@tinymce/tinymce-react";
// import { Paper, TextField, Box } from "@mui/material";

// export default function ReusableEditorTinyMce({
//   title = "",
//   content = "",
//   onTitleChange,
//   onContentChange,
//   height = "calc(100vh - 180px)",
// }) {
//   return (
//     <Paper
//       elevation={0}
//       sx={{
//         width: "100%",
//         height,
//         overflow: "hidden",
//         borderRadius: 4,

//         background:
//           "linear-gradient(135deg, #00c6ff 0%, #0072ff 50%, #00c6ff 100%)",

//         backgroundSize: "400% 400%",
//         animation: "waterFlow 12s ease infinite",

//         border: "1px solid rgba(255,255,255,0.2)",

//         boxShadow: `
//           inset 0 1px 1px rgba(255,255,255,0.25),
//           0 10px 30px rgba(0,114,255,0.25),
//           0 20px 60px rgba(0,198,255,0.20)
//         `,

//         display: "flex",
//         flexDirection: "column",

//         "@keyframes waterFlow": {
//           "0%": {
//             backgroundPosition: "0% 50%",
//           },
//           "50%": {
//             backgroundPosition: "100% 50%",
//           },
//           "100%": {
//             backgroundPosition: "0% 50%",
//           },
//         },
//       }}
//     >
//       {/* TITLE */}

//       <Box
//         sx={{
//           p: 2,
//           backdropFilter: "blur(10px)",
//           background: "rgba(255,255,255,0.12)",
//           borderBottom: "1px solid rgba(255,255,255,0.15)",
//         }}
//       >
//         <TextField
//           fullWidth
//           size="small"
//           label="Title"
//           placeholder="Enter Title"
//           value={title}
//           onChange={(e) => onTitleChange?.(e.target.value)}
//           InputLabelProps={{
//             sx: {
//               color: "rgba(255,255,255,0.8)",
//             },
//           }}
//           sx={{
//             "& .MuiOutlinedInput-root": {
//               color: "#fff",
//               background: "rgba(255,255,255,0.08)",
//               backdropFilter: "blur(10px)",

//               "& fieldset": {
//                 borderColor: "rgba(255,255,255,0.25)",
//               },

//               "&:hover fieldset": {
//                 borderColor: "#7dd3fc",
//               },

//               "&.Mui-focused fieldset": {
//                 borderColor: "#fff",
//                 boxShadow:
//                   "0 0 20px rgba(255,255,255,0.25)",
//               },
//             },
//           }}
//         />
//       </Box>

//       {/* EDITOR */}

//       <Box
//         sx={{
//           flex: 1,
//           p: 1,

//           "& .tox": {
//             height: "100% !important",
//             borderRadius: "16px",
//             overflow: "hidden",
//             border: "none !important",
//           },

//           "& .tox-editor-container": {
//             height: "100% !important",
//           },

//           "& .tox-statusbar": {
//             background: "#f8fafc !important",
//           },
//         }}
//       >
//         <Editor
//           apiKey={import.meta.env.VITE_TINY_MCE_API_KEY}
//           value={content}
//           onEditorChange={(value) => onContentChange?.(value)}
//           init={{
//             width: "100%",
//             height: "100%",

//             menubar: true,
//             branding: false,
//             resize: false,

//             skin: "oxide",
//             content_css: "default",

//             toolbar_sticky: true,
//             toolbar_sticky_offset: 0,

//             plugins: [
//               "advlist",
//               "autolink",
//               "lists",
//               "link",
//               "image",
//               "media",
//               "table",
//               "code",
//               "fullscreen",
//               "preview",
//               "searchreplace",
//               "wordcount",
//               "visualblocks",
//               "help",
//               "emoticons",
//               "charmap",
//             ],

//             toolbar:
//               "undo redo | blocks fontfamily fontsize | " +
//               "bold italic underline strikethrough | " +
//               "forecolor backcolor | " +
//               "alignleft aligncenter alignright alignjustify | " +
//               "bullist numlist outdent indent | " +
//               "link image media table | " +
//               "removeformat code fullscreen",

//             file_picker_types: "image media file",

//             file_picker_callback: (callback, value, meta) => {
//               const input = document.createElement("input");

//               if (meta.filetype === "image") {
//                 input.type = "file";
//                 input.accept = "image/*";
//               } else if (meta.filetype === "media") {
//                 input.type = "file";
//                 input.accept = "video/*,audio/*";
//               } else {
//                 input.type = "file";
//               }

//               input.onchange = function () {
//                 const file = input.files[0];

//                 if (!file) return;

//                 const reader = new FileReader();

//                 reader.onload = () => {
//                   callback(reader.result, {
//                     title: file.name,
//                   });
//                 };

//                 reader.readAsDataURL(file);
//               };

//               input.click();
//             },

//             content_style: `
//               body{
//                 margin:0;
//                 padding:25px;
//                 background:#ffffff;
//                 font-family:Inter, Arial, sans-serif;
//                 font-size:16px;
//                 line-height:1.8;
//                 color:#102A43;
//               }

//               h1,h2,h3,h4,h5,h6{
//                 color:#0072ff;
//                 font-weight:700;
//               }

//               p{
//                 margin-bottom:12px;
//               }

//               blockquote{
//                 border-left:4px solid #00c6ff;
//                 margin:16px 0;
//                 padding:12px 16px;
//                 background:#f0f9ff;
//                 border-radius:8px;
//               }

//               img{
//                 max-width:100%;
//                 height:auto;
//                 border-radius:12px;
//                 box-shadow:
//                   0 8px 20px rgba(0,0,0,0.15);
//               }

//               table{
//                 width:100%;
//                 border-collapse:collapse;
//               }

//               table, th, td{
//                 border:1px solid #CBD5E1;
//               }

//               th{
//                 background:#e0f2fe;
//               }

//               th, td{
//                 padding:10px;
//               }

//               a{
//                 color:#0072ff;
//               }

//               ::-webkit-scrollbar{
//                 width:8px;
//               }

//               ::-webkit-scrollbar-thumb{
//                 background:#00c6ff;
//                 border-radius:20px;
//               }
//             `,

//             setup: (editor) => {
//               editor.on("init", () => {
//                 const container = editor.getContainer();

//                 container.style.height = "100%";
//                 container.style.display = "flex";
//                 container.style.flexDirection = "column";
//                 container.style.borderRadius = "16px";
//                 container.style.overflow = "hidden";

//                 const header =
//                   container.querySelector(".tox-editor-header");

//                 if (header) {
//                   header.style.position = "sticky";
//                   header.style.top = "0";
//                   header.style.zIndex = "999";

//                   header.style.background =
//                     "linear-gradient(135deg,#00c6ff,#0072ff)";

//                   header.style.borderBottom =
//                     "1px solid rgba(255,255,255,0.15)";
//                 }

//                 const toolbar =
//                   container.querySelector(".tox-toolbar");

//                 if (toolbar) {
//                   toolbar.style.background = "transparent";
//                 }

//                 const editArea =
//                   container.querySelector(".tox-edit-area");

//                 if (editArea) {
//                   editArea.style.flex = "1";
//                   editArea.style.overflow = "auto";
//                 }
//               });

//               editor.on("keydown", (e) => {
//                 if (e.key === "Tab") {
//                   e.preventDefault();

//                   const node =
//                     editor.selection.getNode();

//                   const isListItem =
//                     node.closest &&
//                     node.closest("li");

//                   if (isListItem) {
//                     if (e.shiftKey) {
//                       editor.execCommand("Outdent");
//                     } else {
//                       editor.execCommand("Indent");
//                     }
//                   } else {
//                     editor.insertContent(
//                       "&nbsp;&nbsp;&nbsp;&nbsp;"
//                     );
//                   }
//                 }
//               });
//             },
//           }}
//         />
//       </Box>
//     </Paper>
//   );
// }

// import React from "react";
// import { Editor } from "@tinymce/tinymce-react";
// import { Paper, TextField, Box } from "@mui/material";

// export default function ReusableEditorTinyMce({
//   title = "",
//   content = "",
//   onTitleChange,
//   onContentChange,
//   height = "calc(100vh - 180px)",
// }) {
//   return (
//     <Paper
//       elevation={4}
//       sx={{
//         width: "100%",
//         height,
//         overflow: "hidden",
//         borderRadius: 3,
//         backgroundColor: "#fff",
//         border: "1px solid #E2E8F0",
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       {/* Title */}
//       <Box
//         sx={{
//           p: 1.5,
//           borderBottom: "1px solid #E2E8F0",
//           backgroundColor: "#F8FAFC",
//         }}
//       >
//         <TextField
//           fullWidth
//           size="small"
//           label="Title"
//           placeholder="Enter Title"
//           value={title}
//           onChange={(e) => onTitleChange?.(e.target.value)}
//         />
//       </Box>

//       {/* TinyMCE */}
//       <Box sx={{ flex: 1 }}>
//         <Editor
//           apiKey="151i16ujymvu1myy7rij3ea7hcpd9zut92ka7h4i9t7rsin5"
//           value={content}
//           onEditorChange={(value) => onContentChange?.(value)}
//           init={{
//             width: "100%",
//             height: "100%",
//             menubar: true,
//             branding: false,
//             resize: false,

//             plugins: [
//               "advlist",
//               "autolink",
//               "lists",
//               "link",
//               "image",
//               "media",
//               "table",
//               "code",
//               "fullscreen",
//               "preview",
//               "searchreplace",
//               "wordcount",
//               "visualblocks",
//               "help",
//               "emoticons",
//               "charmap",
//             ],

//             toolbar:
//               "undo redo | blocks fontfamily fontsize | " +
//               "bold italic underline strikethrough | " +
//               "forecolor backcolor | " +
//               "alignleft aligncenter alignright alignjustify | " +
//               "bullist numlist outdent indent | " +
//               "link image media table | " +
//               "removeformat code fullscreen",

//             toolbar_sticky: true,
//             toolbar_sticky_offset: 0,

//             file_picker_types: "image media file",

//             file_picker_callback: (callback, value, meta) => {
//               const input = document.createElement("input");

//               if (meta.filetype === "image") {
//                 input.setAttribute("type", "file");
//                 input.setAttribute("accept", "image/*");
//               } else if (meta.filetype === "media") {
//                 input.setAttribute("type", "file");
//                 input.setAttribute("accept", "video/*,audio/*");
//               } else {
//                 input.setAttribute("type", "file");
//               }

//               input.onchange = function () {
//                 const file = this.files[0];

//                 const reader = new FileReader();

//                 reader.onload = function () {
//                   callback(reader.result, {
//                     title: file.name,
//                   });
//                 };

//                 reader.readAsDataURL(file);
//               };

//               input.click();
//             },

//             content_style: `
//               body{
//                 margin:0;
//                 padding:20px;
//                 font-family:Arial, Helvetica, sans-serif;
//                 font-size:16px;
//                 line-height:1.8;
//                 color:#102A43;
//               }

//               img{
//                 max-width:100%;
//                 height:auto;
//               }

//               table{
//                 border-collapse:collapse;
//                 width:100%;
//               }

//               table,th,td{
//                 border:1px solid #CBD5E1;
//               }

//               th,td{
//                 padding:8px;
//               }
//             `,

//             setup: (editor) => {
//               editor.on("init", () => {
//                 const container = editor.getContainer();

//                 container.style.height = "100%";
//                 container.style.display = "flex";
//                 container.style.flexDirection = "column";

//                 const header =
//                   container.querySelector(".tox-editor-header");

//                 if (header) {
//                   header.style.position = "sticky";
//                   header.style.top = "0";
//                   header.style.zIndex = "999";
//                   header.style.background = "#FFFFFF";
//                   header.style.borderBottom =
//                     "1px solid #E2E8F0";
//                 }

//                 const editArea =
//                   container.querySelector(".tox-edit-area");

//                 if (editArea) {
//                   editArea.style.flex = "1";
//                   editArea.style.overflow = "auto";
//                 }
//               });
//             },
//           }}
//         />
//       </Box>
//     </Paper>
//   );
// }

// import React from "react";
// import { Editor } from "@tinymce/tinymce-react";
// import { Paper, TextField, Box } from "@mui/material";

// export default function ReusableEditorTinyMce({
//   title = "",
//   content = "",
//   onTitleChange,
//   onContentChange,
//   height = "calc(100vh - 180px)",
// }) {
//   return (
//     <Paper
//       elevation={4}
//       sx={{
//         width: "100%",
//         height,
//         overflow: "hidden",
//         borderRadius: 3,
//         bgcolor: "#FFFFFF",
//         border: "1px solid #E2E8F0",
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       {/* Title Section */}
//       <Box
//         sx={{
//           p: 1,
//           borderBottom: "1px solid #E2E8F0",
//           backgroundColor: "#F8FAFC",
//         }}
//       >
//         <TextField
//           fullWidth
//           label="Title"
//           placeholder="Enter title..."
//           value={title}
//           onChange={(e) => onTitleChange?.(e.target.value)}
//           variant="outlined"
//           size="small"
//         />
//       </Box>

//       {/* Editor Section */}
//       <Box sx={{ flex: 1 }}>
//         <Editor
//           apiKey="151i16ujymvu1myy7rij3ea7hcpd9zut92ka7h4i9t7rsin5"
//           value={content}
//           onEditorChange={(value) => onContentChange?.(value)}
//           init={{
//             width: "100%",
//             height: "100%",
//             menubar: true,
//             branding: false,
//             resize: false,

//             plugins: [
//               "advlist",
//               "autolink",
//               "lists",
//               "link",
//               "image",
//               "charmap",
//               "preview",
//               "anchor",
//               "searchreplace",
//               "wordcount",
//               "visualblocks",
//               "code",
//               "fullscreen",
//               "insertdatetime",
//               "media",
//               "table",
//               "help",
//               "emoticons",
//             ],

//             toolbar:
//               "undo redo | blocks fontfamily fontsize | " +
//               "bold italic underline | forecolor backcolor | " +
//               "alignleft aligncenter alignright alignjustify | " +
//               "bullist numlist | link image media table | " +
//               "removeformat code fullscreen",

//             toolbar_sticky: true,

//             content_style: `
//               body {
//                 margin: 0;
//                 padding: 20px;
//                 font-family: Arial, Helvetica, sans-serif;
//                 font-size: 16px;
//                 line-height: 1.8;
//               }
//             `,
//           }}
//         />
//       </Box>
//     </Paper>
//   );
// }

// import React from "react";
// import { Editor } from "@tinymce/tinymce-react";
// import { Paper } from "@mui/material";

// export default function ReusableEditorTinyMce({
//   value = "",
//   onChange,
//   height = "calc(100vh - 180px)",
// }) {
//   return (
//     <Paper
//       elevation={4}
//       sx={{
//         width: "100%",
//         height,
//         overflow: "hidden",
//         borderRadius: 3,
//         bgcolor: "#FFFFFF",
//         border: "1px solid #E2E8F0",
//         boxShadow: (theme) => theme.shadows[4],
//       }}
//     >
//       <Editor
//         apiKey="151i16ujymvu1myy7rij3ea7hcpd9zut92ka7h4i9t7rsin5"
//         value={value}
//         onEditorChange={(content) => onChange?.(content)}
//         init={{
//           width: "100%",
//           height: "100%",

//           menubar: true,
//           branding: false,
//           resize: false,

//           plugins: [
//             "advlist",
//             "autolink",
//             "lists",
//             "link",
//             "image",
//             "charmap",
//             "preview",
//             "anchor",
//             "searchreplace",
//             "wordcount",
//             "visualblocks",
//             "code",
//             "fullscreen",
//             "insertdatetime",
//             "media",
//             "table",
//             "help",
//             "emoticons",
//             "pagebreak",
//           ],

//           toolbar:
//             "undo redo | blocks fontfamily fontsize | " +
//             "bold italic underline strikethrough | " +
//             "forecolor backcolor | " +
//             "alignleft aligncenter alignright alignjustify | " +
//             "bullist numlist outdent indent | " +
//             "link image media table | " +
//             "removeformat | code fullscreen",

//           toolbar_sticky: true,
//           toolbar_sticky_offset: 0,

//           content_style: `
//             html {
//               background: #FFFFFF;
//             }

//             body {
//               margin: 0;
//               padding: 20px;
//               min-height: 100%;
//               background: #FFFFFF;
//               color: #102A43;
//               font-family: Arial, Helvetica, sans-serif;
//               font-size: 16px;
//               line-height: 1.8;
//             }

//             img {
//               max-width: 100%;
//               height: auto;
//             }

//             table {
//               border-collapse: collapse;
//               width: 100%;
//             }

//             table, th, td {
//               border: 1px solid #CBD5E1;
//             }

//             th, td {
//               padding: 8px;
//             }
//           `,

//           setup: (editor) => {
//             editor.on("init", () => {
//               const container = editor.getContainer();

//               container.style.height = "100%";
//               container.style.display = "flex";
//               container.style.flexDirection = "column";
//               container.style.border = "none";

//               const header = container.querySelector(
//                 ".tox-editor-header"
//               );

//               if (header) {
//                 header.style.position = "sticky";
//                 header.style.top = "0";
//                 header.style.zIndex = "999";
//                 header.style.background = "#FFFFFF";
//                 header.style.borderBottom = "1px solid #E2E8F0";
//                 header.style.boxShadow =
//                   "0px 1px 3px rgba(0,0,0,0.08)";
//               }

//               const editArea =
//                 container.querySelector(".tox-edit-area");

//               if (editArea) {
//                 editArea.style.flex = "1";
//                 editArea.style.overflow = "auto";
//               }

//               const toolbar =
//                 container.querySelector(".tox-toolbar");

//               if (toolbar) {
//                 toolbar.style.background = "#FFFFFF";
//               }
//             });
//           },
//         }}
//       />
//     </Paper>
//   );
// }

// import React from "react";
// import { Editor } from "@tinymce/tinymce-react";

// export default function ReusableEditorTinyMce({
//   value,
//   onChange,
//   height = "calc(100vh - 150px)",
// }) {
//   return (
//     <div
//       style={{
//         width: "100%",
//         height: height,
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       <Editor
//         apiKey="151i16ujymvu1myy7rij3ea7hcpd9zut92ka7h4i9t7rsin5"
//         value={value}
//         onEditorChange={(content) => onChange(content)}
//         init={{
//           width: "100%",
//           height: "100%",

//           menubar: true,

//           plugins: [
//             "advlist",
//             "autolink",
//             "link",
//             "image",
//             "lists",
//             "charmap",
//             "preview",
//             "anchor",
//             "pagebreak",
//             "searchreplace",
//             "wordcount",
//             "visualblocks",
//             "code",
//             "fullscreen",
//             "insertdatetime",
//             "media",
//             "table",
//             "emoticons",
//             "help",
//           ],

//           toolbar:
//             "undo redo | blocks fontfamily fontsize | " +
//             "bold italic underline strikethrough | " +
//             "forecolor backcolor | " +
//             "alignleft aligncenter alignright alignjustify | " +
//             "bullist numlist outdent indent | " +
//             "link image media table | " +
//             "removeformat code fullscreen",

//           toolbar_sticky: true,
//           toolbar_sticky_offset: 0,

//           branding: false,

//           content_style: `
//             body {
//               font-family: Arial, Helvetica, sans-serif;
//               font-size: 16px;
//               line-height: 1.8;
//               padding: 25px;
//               max-width: 900px;
//               margin: auto;
//               background: white;
//             }
//           `,

//           skin: "oxide",
//           resize: false,

//           setup: (editor) => {
//             editor.on("init", () => {
//               const container = editor.getContainer();

//               container.style.height = "100%";
//               container.style.display = "flex";
//               container.style.flexDirection = "column";

//               const editArea =
//                 container.querySelector(".tox-edit-area");

//               if (editArea) {
//                 editArea.style.flex = "1";
//                 editArea.style.overflow = "auto";
//               }
//             });
//           },
//         }}
//       />
//     </div>
//   );
// }

// import React, { useRef } from "react";
// import { Editor } from "@tinymce/tinymce-react";

// export default function ReusableEditorTinyMce(props) {
//     const {value, onChange, height = 600} = props;
//   const editorRef = useRef(null);

//   return (
//     <div>
//       <Editor
//         apiKey="151i16ujymvu1myy7rij3ea7hcpd9zut92ka7h4i9t7rsin5"
//         value={value}
//       onEditorChange={(content) => {
//         onChange(content);
//       }}
//         onInit={(evt, editor) => {
//           editorRef.current = editor;
//         }}
//         init={{
//           selector: "#basic-conf",
//           width: 600,
//           height: 600,
//           plugins: [
//             "advlist",
//             "autolink",
//             "link",
//             "image",
//             "lists",
//             "charmap",
//             "preview",
//             "anchor",
//             "pagebreak",
//             "searchreplace",
//             "wordcount",
//             "visualblocks",
//             "code",
//             "fullscreen",
//             "insertdatetime",
//             "media",
//             "table",
//             "emoticons",
//             "help",
//           ],
//           toolbar:
//             "undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | " +
//             "bullist numlist outdent indent | link image | print preview media fullscreen | " +
//             "forecolor backcolor emoticons | help",
//           menu: {
//             favs: {
//               title: "My Favorites",
//               items: "code visualaid | searchreplace | emoticons",
//             },
//           },
//           menubar: "favs file edit view insert format tools table help",
//           content_style:
//             "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
//         }}
//       />

//     </div>
//   );
// }

// import React, { useRef } from "react";
// import { Editor } from "@tinymce/tinymce-react";

// export default function CreateInformation() {
//   const editorRef = useRef(null);

//   return (
//     <div>
//       <Editor
//         apiKey="151i16ujymvu1myy7rij3ea7hcpd9zut92ka7h4i9t7rsin5"
//         onInit={(evt, editor) => {
//           editorRef.current = editor;
//         }}
//         init={{
//           selector: "#basic-conf",
//           width: 600,
//           height: 600,
//           plugins: [
//             "advlist",
//             "autolink",
//             "link",
//             "image",
//             "lists",
//             "charmap",
//             "preview",
//             "anchor",
//             "pagebreak",
//             "searchreplace",
//             "wordcount",
//             "visualblocks",
//             "code",
//             "fullscreen",
//             "insertdatetime",
//             "media",
//             "table",
//             "emoticons",
//             "help",
//           ],
//           toolbar:
//             "undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | " +
//             "bullist numlist outdent indent | link image | print preview media fullscreen | " +
//             "forecolor backcolor emoticons | help",
//           menu: {
//             favs: {
//               title: "My Favorites",
//               items: "code visualaid | searchreplace | emoticons",
//             },
//           },
//           menubar: "favs file edit view insert format tools table help",
//           content_style:
//             "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
//         }}
//       />

//       <button onClick={() => console.log(editorRef.current?.getContent())}>
//         Save
//       </button>
//     </div>
//   );
// }
