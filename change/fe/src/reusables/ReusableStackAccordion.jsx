import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  Typography,
  Button,
  Box,
  Chip,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { localUser, BASE_URL, ROLES } from "../utils/utils";
import ReusableEditorTinyMce from "./ReusableEditorTinyMce";
import { useDispatch, useSelector } from "react-redux";
import {
  modifyInformationApi,
  setMainDashboardApi,
} from "../app/thunkApiCalls";
import { callKeys } from "../pages/admin/CreateInfoWork";
import {
  deleteOneInAllDashboards,
  deleteOneInAllInfo,
  deleteOneInAllWorks,
  updateMainDashboard,
  updateOneInAllDashboards,
  updateOneInAllInfo,
  updateOneInAllWorks,
} from "../app/apiSlicer";
import useModal from "./useModal";
import UniversalModal from "../features/UniversalModal";

export default function ReusableStackAccordion(props) {
  const {
    item,
    onUpdate,
    onDelete,
    type,
    saveUrl,
    deleteUrl,
    id,
    saveApiReference,
    deleteApiReference,
    setParentModalData,
    setParentModalType,
    setParentShowModal,
    dashboardFor,
    isDefault,
  } = props;
  const {
    showModal,
    modalData,
    modalType,
    modalNavigation,
    modalAction,
    setModalAction,
    setShowModal,
    setModalData,
    setModalType,
    setModalNavigation,
  } = useModal();

  const [editMode, setEditMode] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const dispatch = useDispatch();
  const [title, setTitle] = useState(item.title);
  const [content, setContent] = useState(item.content);
  const userProfile = useSelector((state) => state.apiSlicer.userProfile);
  const { role } = userProfile;
  // ---------------- TOGGLE ----------------
  const handleToggle = () => {
    setExpanded((prev) => !prev);
    setShowFullText(false); // reset read more when collapsing
  };

  // ---------------- HELPERS ----------------
  // const stripHtml = (html = "") => {
  //   const text = html.replace(/<[^>]*>/g, "");

  //   const textarea = document.createElement("textarea");
  //   textarea.innerHTML = text;

  //   return textarea.value;
  // };
const stripHtml = (html = "") => {
  const div = document.createElement("div");
  div.innerHTML = html;

  return (div.textContent || div.innerText || "")
    .replace(/\u00A0/g, " ")
    .replace(/\u2003/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};
  const getPreviewText = (text, maxLength = 120) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const plainContent = stripHtml(content);

  // ---------------- SET MAIN -------------
  // update dashboard during edit delete set main in the store
  const handleSetMainDashboard = async () => {
    try {
      const result = await dispatch(
        setMainDashboardApi({
          url: `${import.meta.env.VITE_SET_MAIN_DASHBOARD}/${id}`,
        }),
      );
      if (setMainDashboardApi.fulfilled.match(result)) {
        console.log("main", result.payload);
        const requiredPayload = { data: result.payload?.data };
        // update store and show popup
        dispatch(updateMainDashboard(requiredPayload));
        setModalData({
          title: "Success",
          content: `${type} updated successfully!`,
        });
        setModalType("success");
      } else if (setMainDashboardApi.rejected.match(result)) {
        // show pop up
        setModalData({ title: "Failed!", content: `${type} update failed!` });
        setModalType("error");
      }
    } catch (error) {
      setModalData({ title: "Failed!", content: error.message });
      setModalType("error");
    }
    setShowModal(true);
  };
  // ---------------- SAVE ----------------
  // const handleSave = async () => {
  //   try {
  //     const { token } = localUser();

  //     const response = await fetch(
  //       `${BASE_URL}/api/information/${item._id}`,
  //       {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`
  //         },
  //         body: JSON.stringify({ title, content })
  //       }
  //     );

  //     const data = await response.json();

  //     if (!response.ok) throw new Error(data.message);

  //     onUpdate(data.data);
  //     setEditMode(false);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleSave = async () => {
    try {
      const result = await dispatch(
        saveApiReference({
          url: `${saveUrl}/${id}`,
          data: { title, content },
        }),
      );

      if (saveApiReference.fulfilled.match(result)) {
        const resultPayload = result.payload?.data;

        if (type === callKeys.INFO) {
          // dispatch update info
          dispatch(updateOneInAllInfo(resultPayload));
        } else if (type === callKeys.WORK) {
          // dispatch update work
          dispatch(updateOneInAllWorks(resultPayload));
        } else if (type === callKeys.DASHBOARD) {
          // update dashboards
          dispatch(updateOneInAllDashboards(resultPayload));
        }
        setModalData({
          title: "Success",
          content: `${type} saved successfully!`,
        });
        setModalType("success");
        setEditMode(false);
      } else if (saveApiReference.rejected.match(result)) {
        setModalData({ title: "Failed!", content: result.payload });
        setModalType("error");
      }
    } catch (error) {
      setModalData({ title: "Failed!", content: result.payload });
      setModalType("error");
    }
    setShowModal(true);
  };
  // ---------------- DELETE ----------------

  async function handleDelete() {
    setShowModal(false);
    try {
      const result = await dispatch(
        deleteApiReference({
          url: `${deleteUrl}/${id}`,
          data: {},
        }),
      );
      if (deleteApiReference.fulfilled.match(result)) {
        // update in the store with id
        if (type === callKeys.INFO) {
          dispatch(deleteOneInAllInfo(id));
        } else if (type === callKeys.WORK) {
          dispatch(deleteOneInAllWorks(id));
        } else if (type === callKeys.DASHBOARD) {
          dispatch(deleteOneInAllDashboards(id));
        }
        setParentModalData({
          title: "Success!",
          content: `${type} deleted successfully`,
        });

        setParentModalType("success");
        setParentShowModal(true);
      } else if (deleteApiReference.rejected.match(result)) {
        setParentModalData({
          title: "Deletion Failed!",
          content: result.payload,
        });

        setParentModalType("error");
        setParentShowModal(true);
      }
    } catch (error) {
      setParentModalData({
        title: "Deletion Failed!",
        content: result.payload,
      });

      setParentModalType("error");
      setParentShowModal(true);
    }
  }
  const handleInitialDeleteClick = async () => {
    setModalData({
      title: "Delete?",
      content: `Are You sure You want to delete this ${type}?`,
    });
    setModalType("error");
    setModalAction("delete");
    setShowModal(true);
  };

  const getPreviewContent = (html = "", maxLength = 180) => {
  const temp = document.createElement("div");
  temp.innerHTML = html;

  temp.querySelectorAll("img, video, iframe, table").forEach((el) => {
    el.remove();
  });

  const text = (temp.textContent || temp.innerText || "").trim();

  if (!text) {
    return "...";
  }

  return text.length > maxLength
    ? `${text.slice(0, maxLength)}...`
    : text;
};
  return (
    <>
      <Accordion
        // expanded={expanded}
        expanded={editMode || expanded}
        onChange={!editMode ? handleToggle : undefined}
        // onChange={handleToggle}
        sx={{
          transition: "all 0.3s ease",
        }}
      >
        {/* ---------------- EDIT MODE ---------------- */}
        {editMode ? (
          <ReusableEditorTinyMce
            title={title}
            content={content}
            onTitleChange={setTitle}
            onContentChange={setContent}
            height="600px"
          />
        ) : (
          <>
            {/* ---------------- TITLE ---------------- */}
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  width: "100%",
                }}
              >
                {/* your draggable icon will stay before this */}

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    display: "-webkit-box",
                    WebkitLineClamp: expanded ? "unset" : 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {title}
                </Typography>
                {type === callKeys.DASHBOARD && (
                  <>
                    {dashboardFor && (
                      <Chip
                        label={dashboardFor}
                        size="small"
                        variant="outlined"
                        sx={{
                          textTransform: "capitalize",
                          fontWeight: 600,
                        }}
                      />
                    )}

                    {item?.isDefault ? (
                      <Chip
                        label={"Main Dashboard"}
                        size="small"
                        variant="outlined"
                        color={"success"}
                        sx={{
                          fontWeight: 600,
                        }}
                      />
                    ) : null}
                  </>
                )}
              </Box>
            </AccordionSummary>

            {/* ---------------- CONTENT ---------------- */}

            {/* <AccordionDetails>
              <Box
                sx={{
                  "& *": {
                    maxWidth: "100%",
                  },
                  "& img": {
                    maxWidth: "100%",
                    height: "auto",
                  },
                  "& table": {
                    width: "100%",
                    borderCollapse: "collapse",
                  },
                  "& table, & th, & td": {
                    border: "1px solid #CBD5E1",
                  },
                  "& th, & td": {
                    padding: "8px",
                  },
                }}
                dangerouslySetInnerHTML={{
                  __html: expanded
                    ? content
                    : `${content.substring(0, 250)}...`,
                }}
              />
            </AccordionDetails> */}
            {/* <AccordionDetails>
  <Box
    sx={{
      width: "100%",
      maxWidth: "100%",

      "& img": {
        maxWidth: "100%",
        height: "auto",
        display: "block",
      },

      "& table": {
        width: "100%",
        display: "block",
        overflowX: "auto",
        borderCollapse: "collapse",
      },

      "& iframe": {
        width: "100%",
        maxWidth: "100%",
      },

      "& video": {
        width: "100%",
        maxWidth: "100%",
      },

      "& pre": {
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      },

      "& p, & span, & div, & td, & th": {
        overflowWrap: "break-word",
        wordBreak: "break-word",
      },
    }}
    dangerouslySetInnerHTML={{
      __html: content,
    }}
  />
</AccordionDetails> */}

{/* <AccordionDetails>
  {!expanded ? (
    <Typography
      variant="body2"
      sx={{
        color: "text.secondary",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis",
        wordBreak: "break-word",
      }}
    >
      {content.replace(/<[^>]+>/g, "")}
    </Typography>
  ) : (
    <Box
      sx={{
        width: "100%",

        "& table": {
          display: "block",
          overflowX: "auto",
          borderCollapse: "collapse",
        },

        "& pre": {
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        },
      }}
      dangerouslySetInnerHTML={{
        __html: content,
      }}
    />
  )}
</AccordionDetails> */}

<AccordionDetails>
  {!expanded ? (
    <Typography
      variant="body2"
      sx={{
        color: "text.secondary",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis",
        wordBreak: "break-word",
      }}
    >
      {stripHtml(content)}
    </Typography>
  ) : (
    <Box
      sx={{
        width: "100%",

        "& img": {
          maxWidth: "100%",
          height: "auto",
        },

        "& table": {
          display: "block",
          overflowX: "auto",
          borderCollapse: "collapse",
          maxWidth: "100%",
        },

        "& iframe": {
          maxWidth: "100%",
        },

        "& video": {
          maxWidth: "100%",
        },

        "& pre": {
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        },

        "& p, & span, & div": {
          wordBreak: "break-word",
        },
      }}
      dangerouslySetInnerHTML={{
        __html: content,
      }}
    />
  )}
</AccordionDetails>
          </>
        )}

        {/* ---------------- ACTIONS ---------------- */}
        {role === ROLES.ADMIN ? (
          <>
            <AccordionActions>
              {editMode ? (
                <>
                  <Button variant="contained" onClick={handleSave}>
                    Save
                  </Button>
                  <Button onClick={() => setEditMode(false)}>Cancel</Button>
                </>
              ) : (
                <>
                  {type === callKeys.DASHBOARD && (
                    <Button
                      // color="success"
                      variant="outlined"
                      onClick={() => handleSetMainDashboard()}
                      disabled={item?.isDefault}
                    >
                      {item?.isDefault ? "Main Dashboard" : "Set As Main"}
                    </Button>
                  )}

                  <Button variant="outlined" onClick={() => setEditMode(true)}>
                    Edit
                  </Button>
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={handleInitialDeleteClick}
                    // onClick={handleDelete}
                  >
                    Delete
                  </Button>
                </>
              )}
            </AccordionActions>
          </>
        ) : null}
      </Accordion>
      <UniversalModal
        showModal={showModal}
        setShowModal={setShowModal}
        modalData={modalData}
        setModalData={setModalData}
        type={modalType}
        setModalType={setModalType}
        modalAction={modalAction}
        setModalAction={setModalAction}
        deleteFunctionReference={handleDelete}
      />
    </>
  );
}




// import React, { useState } from "react";
// import {
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   AccordionActions,
//   Typography,
//   Button,
//   Box
// } from "@mui/material";

// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import { localUser, BASE_URL } from "../utils/utils";
// import ReusableEditorTinyMce from "./ReusableEditorTinyMce";

// export default function ReusableStackAccordion({
//   item,
//   onUpdate,
//   onDelete
// }) {
//   const [editMode, setEditMode] = useState(false);
//   const [expanded, setExpanded] = useState(false);

//   const [title, setTitle] = useState(item.title);
//   const [content, setContent] = useState(item.content);

//   // ---------------- TOGGLE ----------------
//   const handleToggle = () => {
//     setExpanded((prev) => !prev);
//   };

//   // ---------------- STRIP HTML ----------------
//   const stripHtml = (html = "") => html.replace(/<[^>]*>/g, "");

//   const getPreviewText = (text, maxLength = 120) => {
//     if (!text) return "";
//     if (text.length <= maxLength) return text;
//     return text.slice(0, maxLength) + "...";
//   };

//   // ---------------- SAVE ----------------
//   const handleSave = async () => {
//     try {
//       const { token } = localUser();

//       const response = await fetch(
//         `${BASE_URL}/api/information/${item._id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`
//           },
//           body: JSON.stringify({
//             title,
//             content
//           })
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) throw new Error(data.message);

//       onUpdate(data.data);
//       setEditMode(false);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // ---------------- DELETE ----------------
//   const handleDelete = async () => {
//     try {
//       const { token } = localUser();

//       const response = await fetch(
//         `${BASE_URL}/api/information/${item._id}`,
//         {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );

//       if (!response.ok) throw new Error("Delete Failed");

//       onDelete(item._id);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <Accordion expanded={expanded} onChange={handleToggle}>
//       {/* ---------------- EDIT MODE ---------------- */}
//       {editMode ? (
//         <ReusableEditorTinyMce
//           title={title}
//           content={content}
//           onTitleChange={setTitle}
//           onContentChange={setContent}
//         />
//       ) : (
//         <>
//           {/* ---------------- HEADER (TITLE) ---------------- */}
//           <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//             {expanded ? (
//               <Typography variant="h6">{title}</Typography>
//             ) : (
//               <Typography
//                 variant="h6"
//                 sx={{
//                   display: "-webkit-box",
//                   WebkitLineClamp: 1,
//                   WebkitBoxOrient: "vertical",
//                   overflow: "hidden",
//                   textOverflow: "ellipsis"
//                 }}
//               >
//                 {getPreviewText(title, 60)}
//               </Typography>
//             )}
//           </AccordionSummary>

//           {/* ---------------- CONTENT ---------------- */}
//           <AccordionDetails>
//             {expanded ? (
//               <Box
//                 dangerouslySetInnerHTML={{
//                   __html: content
//                 }}
//               />
//             ) : (
//               <Typography
//                 sx={{
//                   display: "-webkit-box",
//                   WebkitLineClamp: 1,
//                   WebkitBoxOrient: "vertical",
//                   overflow: "hidden",
//                   textOverflow: "ellipsis",
//                   color: "#555"
//                 }}
//               >
//                 {getPreviewText(stripHtml(content), 120)}
//               </Typography>
//             )}
//           </AccordionDetails>
//         </>
//       )}

//       {/* ---------------- ACTIONS ---------------- */}
//       <AccordionActions>
//         {editMode ? (
//           <>
//             <Button variant="contained" onClick={handleSave}>
//               Save
//             </Button>

//             <Button onClick={() => setEditMode(false)}>
//               Cancel
//             </Button>
//           </>
//         ) : (
//           <>
//             <Button variant="outlined" onClick={() => setEditMode(true)}>
//               Edit
//             </Button>

//             <Button color="error" variant="outlined" onClick={handleDelete}>
//               Delete
//             </Button>
//           </>
//         )}
//       </AccordionActions>
//     </Accordion>
//   );
// }

// import React, { useState } from "react";
// import {
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   AccordionActions,
//   Typography,
//   Button
// } from "@mui/material";

// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import { localUser, BASE_URL } from "../utils/utils";
// import ReusableEditorTinyMce from "./ReusableEditorTinyMce";

// export default function ReusableStackAccordion({
//   item,
//   onUpdate,
//   onDelete
// }) {
//   const [editMode, setEditMode] = useState(false);
//   const [expanded, setExpanded] = useState(false);

//   const [title, setTitle] = useState(item.title);
//   const [content, setContent] = useState(item.content);

//   // ---------------- TOGGLE ACCORDION ----------------
//   const handleToggle = () => {
//     setExpanded((prev) => !prev);
//   };

//   // ---------------- STRIP HTML + PREVIEW ----------------
//   const getPreviewText = (html, maxLength = 120) => {
//     if (!html) return "";

//     const text = html.replace(/<[^>]*>/g, "");

//     if (text.length <= maxLength) return text;

//     return text.slice(0, maxLength) + "...";
//   };

//   // ---------------- SAVE ----------------
//   const handleSave = async () => {
//     try {
//       const { token } = localUser();

//       const response = await fetch(
//         `${BASE_URL}/api/information/${item._id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`
//           },
//           body: JSON.stringify({
//             title,
//             content
//           })
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message);
//       }

//       onUpdate(data.data);
//       setEditMode(false);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // ---------------- DELETE ----------------
//   const handleDelete = async () => {
//     try {
//       const { token } = localUser();

//       const response = await fetch(
//         `${BASE_URL}/api/information/${item._id}`,
//         {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Delete Failed");
//       }

//       onDelete(item._id);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <Accordion expanded={expanded} onChange={handleToggle}>
//       {/* ---------------- EDIT MODE ---------------- */}
//       {editMode ? (
//         <ReusableEditorTinyMce
//           title={title}
//           content={content}
//           onTitleChange={setTitle}
//           onContentChange={setContent}
//         />
//       ) : (
//         <>
//           {/* ---------------- HEADER ---------------- */}
//           <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//             <Typography variant="h6">{title}</Typography>
//           </AccordionSummary>

//           {/* ---------------- CONTENT ---------------- */}
//           <AccordionDetails>
//             {expanded ? (
//               <div
//                 dangerouslySetInnerHTML={{
//                   __html: content
//                 }}
//               />
//             ) : (
//               <Typography
//                 sx={{
//                   display: "-webkit-box",
//                   WebkitLineClamp: 1,
//                   WebkitBoxOrient: "vertical",
//                   overflow: "hidden",
//                   textOverflow: "ellipsis",
//                   color: "#555"
//                 }}
//               >
//                 {getPreviewText(content)}
//               </Typography>
//             )}
//           </AccordionDetails>
//         </>
//       )}

//       {/* ---------------- ACTIONS ---------------- */}
//       <AccordionActions>
//         {editMode ? (
//           <>
//             <Button variant="contained" onClick={handleSave}>
//               Save
//             </Button>

//             <Button onClick={() => setEditMode(false)}>
//               Cancel
//             </Button>
//           </>
//         ) : (
//           <>
//             <Button
//               variant="outlined"
//               onClick={() => setEditMode(true)}
//             >
//               Edit
//             </Button>

//             <Button
//               color="error"
//               variant="outlined"
//               onClick={handleDelete}
//             >
//               Delete
//             </Button>
//           </>
//         )}
//       </AccordionActions>
//     </Accordion>
//   );
// }

// import React, { useState } from "react";
// import {
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   AccordionActions,
//   Typography,
//   Button,
//   TextField,
// } from "@mui/material";

// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// import { localUser,BASE_URL } from "../utils/utils";
// import ReusableEditorTinyMce from "./ReusableEditorTinyMce";

// export default function ReusableStackAccordion({
//   item,
//   onUpdate,
//   onDelete,
// }) {
//   const [editMode, setEditMode] = useState(false);

//   const [title, setTitle] = useState(item.title);

//   const [content, setContent] = useState(item.content);

//   const handleSave = async () => {
//     try {
//       const { token } = localUser();

//       const response = await fetch(
//         `${BASE_URL}/api/information/${item._id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             title,
//             content,
//           }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message);
//       }

//       onUpdate(data.data);

//       setEditMode(false);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       const { token } = localUser();

//       const response = await fetch(
//         `${BASE_URL}/api/information/${item._id}`,
//         {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Delete Failed");
//       }

//       onDelete(item._id);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <Accordion>
//       {
//         editMode ? <>
//         <ReusableEditorTinyMce
//         title={title}
//         content={content}
//         onTitleChange={setTitle}
//         onContentChange={setContent}
//         />
//         </> : (
//           <>
//           <AccordionSummary
//         expandIcon={<ExpandMoreIcon />}
//       >
//           <Typography variant="h6">
//             {title}
//           </Typography>
//       </AccordionSummary>

//       <AccordionDetails>
//           <div
//             dangerouslySetInnerHTML={{
//               __html: content,
//             }}
//           />
//       </AccordionDetails>
//           </>
//         )
//       }

//       <AccordionActions>
//         {editMode ? (
//           <>
//             <Button
//               variant="contained"
//               onClick={handleSave}
//             >
//               Save
//             </Button>

//             <Button
//               onClick={() =>
//                 setEditMode(false)
//               }
//             >
//               Cancel
//             </Button>
//           </>
//         ) : (
//           <>
//             <Button
//               variant="outlined"
//               onClick={() =>
//                 setEditMode(true)
//               }
//             >
//               Edit
//             </Button>

//             <Button
//               color="error"
//               variant="outlined"
//               onClick={handleDelete}
//             >
//               Delete
//             </Button>
//           </>
//         )}
//       </AccordionActions>
//     </Accordion>
//   );
// }

// import React, { useState } from "react";
// import {
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   AccordionActions,
//   Typography,
//   Button,
//   TextField,
// } from "@mui/material";

// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// import { localUser,BASE_URL } from "../utils/utils";

// export default function ReusableStackAccordion({
//   item,
//   onUpdate,
//   onDelete,
// }) {
//   const [editMode, setEditMode] = useState(false);

//   const [title, setTitle] = useState(item.title);

//   const [content, setContent] = useState(item.content);

//   const handleSave = async () => {
//     try {
//       const { token } = localUser();

//       const response = await fetch(
//         `${BASE_URL}/api/information/${item._id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             title,
//             content,
//           }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message);
//       }

//       onUpdate(data.data);

//       setEditMode(false);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       const { token } = localUser();

//       const response = await fetch(
//         `${BASE_URL}/api/information/${item._id}`,
//         {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Delete Failed");
//       }

//       onDelete(item._id);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <Accordion>
//       <AccordionSummary
//         expandIcon={<ExpandMoreIcon />}
//       >
//         {editMode ? (
//           <TextField
//             fullWidth
//             value={title}
//             onChange={(e) =>
//               setTitle(e.target.value)
//             }
//             onClick={(e) =>
//               e.stopPropagation()
//             }
//           />
//         ) : (
//           <Typography variant="h6">
//             {title}
//           </Typography>
//         )}
//       </AccordionSummary>

//       <AccordionDetails>
//         {editMode ? (
//           <TextField
//             multiline
//             rows={8}
//             fullWidth
//             value={content}
//             onChange={(e) =>
//               setContent(e.target.value)
//             }
//           />
//         ) : (
//           <div
//             dangerouslySetInnerHTML={{
//               __html: content,
//             }}
//           />
//         )}
//       </AccordionDetails>

//       <AccordionActions>
//         {editMode ? (
//           <>
//             <Button
//               variant="contained"
//               onClick={handleSave}
//             >
//               Save
//             </Button>

//             <Button
//               onClick={() =>
//                 setEditMode(false)
//               }
//             >
//               Cancel
//             </Button>
//           </>
//         ) : (
//           <>
//             <Button
//               variant="outlined"
//               onClick={() =>
//                 setEditMode(true)
//               }
//             >
//               Edit
//             </Button>

//             <Button
//               color="error"
//               variant="outlined"
//               onClick={handleDelete}
//             >
//               Delete
//             </Button>
//           </>
//         )}
//       </AccordionActions>
//     </Accordion>
//   );
// }
