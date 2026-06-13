import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { NavLink, Outlet } from "react-router-dom";

import { sidebarContent } from "../../utils/UtilityFile";
import AppbarHeader from "./AppbarHeader";
import { localUser } from "../../utils/utils";
import ContributionFloater from "../../features/ContributionFloater";
import { Avatar } from "@mui/material";
import C from "../../cards/C";

const drawerWidth = 240;

/* MAIN */
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme }) => ({
    flexGrow: 1,
    // padding: theme.spacing(3),
    padding: theme.spacing(3, 1),
    // paddingTop: theme.spacing(3),
    marginLeft: `-${drawerWidth}px`,
    transition: theme.transitions.create("margin"),
    variants: [{ props: ({ open }) => open, style: { marginLeft: 0 } }],
  }),
);

// const Main = styled("main", {
//   shouldForwardProp: (prop) => prop !== "open",
// })(({ theme }) => ({
//   flexGrow: 1,
//   minWidth: 0, // important
//   width: "100%",
//   padding: theme.spacing(3),
//   marginLeft: `-${drawerWidth}px`,
//   transition: theme.transitions.create("margin"),
// }));

/* APP BAR */
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  backgroundColor: "#0077B6",
  transition: theme.transitions.create(["margin", "width"]),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        // height:100
      },
    },
  ],
}));

/* DRAWER HEADER */
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  flexShrink: 0,
}));

/* 🔥 SCROLL AREA WITHOUT SCROLLBAR */
const ScrollArea = styled(Box)({
  flex: 1,
  overflowY: "auto",

  // hide scrollbar (all browsers)
  scrollbarWidth: "none", // Firefox
  msOverflowStyle: "none", // IE/Edge

  "&::-webkit-scrollbar": {
    display: "none", // Chrome/Safari
  },
});

export default function LayoutFile() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const { role } = localUser();

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        // Width:'100%',
        // maxWidth: "100%",
        // overflowX: "hidden",
        // minWidth:'100vh',
        background:
          "linear-gradient(135deg, #00c6ff 0%, #0072ff 50%, #00c6ff 100%)",
        backgroundSize: "400% 400%",
        animation: "waterFlow 12s ease infinite",

        "@keyframes waterFlow": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        // backgroundColor: "black"
        // backgroundColor: "#F5F9FC"
      }}
    >
      <CssBaseline />

      {/* APP BAR */}
      <AppBar
        position="fixed"
        open={open}
        sx={{
          // height:70,
          background:
            "linear-gradient(135deg, #00c6ff 0%, #0072ff 50%, #00c6ff 100%)",
          backgroundSize: "400% 400%",
          animation: "waterFlow 12s ease infinite",

          "@keyframes waterFlow": {
            "0%": { backgroundPosition: "0% 50%" },
            "50%": { backgroundPosition: "100% 50%" },
            "100%": { backgroundPosition: "0% 50%" },
          },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => setOpen(true)}
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Avatar
            //  src="/logo.svg"
            sx={{
              width: 50,
              height: 50,
              bgcolor: "#fff",
              boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
            }}
          >
            <C size={50} />
          </Avatar>
          {/* <Typography variant="h6">Persistent Drawer</Typography> */}

          <Box sx={{ flexGrow: 1 }} />

          <AppbarHeader />
        </Toolbar>
      </AppBar>

      {/* DRAWER */}
      <Drawer
        variant="persistent"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            // backgroundColor: "#0077B6",
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            overflow: "hidden",
            background:
              "linear-gradient(135deg, #00c6ff 0%, #0072ff 50%, #00c6ff 100%)",
            backgroundSize: "400% 400%",
            animation: "waterFlow 12s ease infinite",

            "@keyframes waterFlow": {
              "0%": { backgroundPosition: "0% 50%" },
              "50%": { backgroundPosition: "100% 50%" },
              "100%": { backgroundPosition: "0% 50%" },
            },
          },
        }}
      >
        {/* HEADER */}
        <DrawerHeader>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ContributionFloater />
          </Box>

          <IconButton onClick={() => setOpen(false)}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon sx={{ color: "white" }} />
            ) : (
              <ChevronRightIcon sx={{ color: "white" }} />
            )}
          </IconButton>
        </DrawerHeader>

        <Divider />

        {/* 🔥 SCROLL AREA (NO VISIBLE SCROLLBAR) */}
        <ScrollArea>
          <List>
            {sidebarContent
              .filter((r) => r.roles.includes(role))
              .map((route) => (
                <ListItem key={route.title} disablePadding>
                  <ListItemButton
                    component={NavLink}
                    to={route.locationToTravel}
                    end
                    sx={{
                      textDecoration: "none",
                      "&.active": {
                        backgroundColor: "rgba(255,255,255,0.25)",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: "#E2E8F0" }}>
                      {route.icon}
                    </ListItemIcon>

                    <ListItemText
                      primary={route.title}
                      sx={{ color: "#E2E8F0" }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </ScrollArea>
      </Drawer>

      {/* MAIN CONTENT */}
      <Main
        open={open}
        sx={{
          Width: "100%",
          maxWidth: "100%",
          // backgroundColor:'yellow'
          // minHeight: "90vh",
          // margin: "70px 2px 2px 2px",
          // background:
          //       "linear-gradient(135deg, #00c6ff 0%, #0072ff 50%, #00c6ff 100%)",
          //     backgroundSize: "400% 400%",
          //     animation: "waterFlow 12s ease infinite",

          //     "@keyframes waterFlow": {
          //       "0%": { backgroundPosition: "0% 50%" },
          //       "50%": { backgroundPosition: "100% 50%" },
          //       "100%": { backgroundPosition: "0% 50%" },
          //     },
          //     boxShadow: `
          //       0 10px 30px rgba(0,0,0,0.15),
          //       inset 0 1px 1px rgba(255,255,255,0.25)
          //     `,
          // mx:1,
          // my:6
          // py: 4,
          // px: 2,
        }}
      >
        {/* <Box sx={{ height: 100 }} /> */}
        {/* <Box sx={{ height: 64,width:'100%' }} /> */}
        <Box sx={{ height: 50, width: "100%" }} />
        <Outlet/>
        {/* <Box
          sx={
            {
              // backgroundColor:"black"
              // backgroundColor:'yellow'
              minHeight: "100vh",
              background:
                    "linear-gradient(135deg, #00c6ff 0%, #0072ff 50%, #00c6ff 100%)",
                  backgroundSize: "400% 400%",
                  animation: "waterFlow 12s ease infinite",
                  "@keyframes waterFlow": {
                    "0%": { backgroundPosition: "0% 50%" },
                    "50%": { backgroundPosition: "100% 50%" },
                    "100%": { backgroundPosition: "0% 50%" },
                  },
                  boxShadow: `
                    0 10px 30px rgba(0,0,0,0.15),
                    inset 0 1px 1px rgba(255,255,255,0.25)
                  `,
                  backdropFilter: "blur(18px)",
                  WebkitBackdropFilter: "blur(18px)",
                  p:1
            }
          }
        >
          <Outlet />
        </Box> */}
      </Main>
    </Box>
  );
}



// import * as React from "react";
// import { styled, useTheme } from "@mui/material/styles";
// import Box from "@mui/material/Box";
// import Drawer from "@mui/material/Drawer";
// import CssBaseline from "@mui/material/CssBaseline";
// import MuiAppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import Typography from "@mui/material/Typography";
// import Divider from "@mui/material/Divider";
// import IconButton from "@mui/material/IconButton";
// import MenuIcon from "@mui/icons-material/Menu";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemButton from "@mui/material/ListItemButton";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";

// import { NavLink, Outlet } from "react-router-dom";

// import { sidebarContent } from "../../utils/UtilityFile";
// import AppbarHeader from "./AppbarHeader";
// import { localUser } from "../../utils/utils";
// import ContributionFloater from "../../features/ContributionFloater";

// const drawerWidth = 240;

// /* MAIN CONTENT */
// const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
//   ({ theme }) => ({
//     flexGrow: 1,
//     padding: theme.spacing(3),
//     marginLeft: `-${drawerWidth}px`,
//     transition: theme.transitions.create("margin"),
//     variants: [
//       {
//         props: ({ open }) => open,
//         style: { marginLeft: 0 },
//       },
//     ],
//   })
// );

// /* APP BAR */
// const AppBar = styled(MuiAppBar, {
//   shouldForwardProp: (prop) => prop !== "open",
// })(({ theme }) => ({
//   backgroundColor: "#0077B6",
//   transition: theme.transitions.create(["margin", "width"]),
//   variants: [
//     {
//       props: ({ open }) => open,
//       style: {
//         width: `calc(100% - ${drawerWidth}px)`,
//         marginLeft: `${drawerWidth}px`,
//       },
//     },
//   ],
// }));

// /* DRAWER HEADER */
// const DrawerHeader = styled("div")(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "space-between",
//   padding: theme.spacing(0, 1),
//   ...theme.mixins.toolbar,
//   flexShrink: 0, // 🔥 prevents header collapse
// }));

// export default function LayoutFile() {
//   const theme = useTheme();
//   const [open, setOpen] = React.useState(false);
//   const { role } = localUser();

//   return (
//     <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#F5F9FC" }}>
//       <CssBaseline />

//       {/* APP BAR */}
//       <AppBar position="fixed" open={open}>
//         <Toolbar>
//           <IconButton
//             color="inherit"
//             onClick={() => setOpen(true)}
//             sx={{ mr: 2, ...(open && { display: "none" }) }}
//           >
//             <MenuIcon />
//           </IconButton>

//           <Typography variant="h6">Persistent Drawer</Typography>

//           <Box sx={{ flexGrow: 1 }} />

//           <AppbarHeader />
//         </Toolbar>
//       </AppBar>

//       {/* DRAWER */}
//       <Drawer
//         variant="persistent"
//         open={open}
//         sx={{
//           width: drawerWidth,
//           flexShrink: 0,
//           "& .MuiDrawer-paper": {
//             width: drawerWidth,
//             boxSizing: "border-box",
//             backgroundColor: "#0077B6",

//             display: "flex",
//             flexDirection: "column",
//             height: "100vh",
//             overflow: "hidden", // 🔥 important: only inner scrolls
//           },
//         }}
//       >
//         {/* HEADER */}
//         <DrawerHeader>
//           {/* CONTRIBUTION FLOATER (HEADER AREA) */}
//           <Box sx={{ display: "flex", alignItems: "center" }}>
//             <ContributionFloater />
//           </Box>

//           {/* CLOSE BUTTON */}
//           <IconButton onClick={() => setOpen(false)}>
//             {theme.direction === "ltr" ? (
//               <ChevronLeftIcon sx={{ color: "white" }} />
//             ) : (
//               <ChevronRightIcon sx={{ color: "white" }} />
//             )}
//           </IconButton>
//         </DrawerHeader>

//         <Divider />

//         {/* 🔥 SCROLLABLE MENU AREA */}
//         <Box
//           sx={{
//             flex: 1,
//             overflowY: "auto",
//           }}
//         >
//           <List>
//             {sidebarContent
//               .filter((r) => r.roles.includes(role))
//               .map((route) => (
//                 <ListItem key={route.title} disablePadding>
//                   <ListItemButton
//                     component={NavLink}
//                     to={route.locationToTravel}
//                     sx={{
//                       textDecoration: "none",
//                       "&.active": {
//                         backgroundColor: "rgba(255,255,255,0.25)",
//                       },
//                     }}
//                   >
//                     <ListItemIcon sx={{ color: "#E2E8F0" }}>
//                       {route.icon}
//                     </ListItemIcon>

//                     <ListItemText
//                       primary={route.title}
//                       sx={{ color: "#E2E8F0" }}
//                     />
//                   </ListItemButton>
//                 </ListItem>
//               ))}
//           </List>
//         </Box>
//       </Drawer>

//       {/* MAIN CONTENT */}
//       <Main open={open}>
//         <Box sx={{ height: 64 }} />
//         <Outlet />
//       </Main>
//     </Box>
//   );
// }

// import * as React from "react";
// import { styled, useTheme } from "@mui/material/styles";
// import Box from "@mui/material/Box";
// import Drawer from "@mui/material/Drawer";
// import CssBaseline from "@mui/material/CssBaseline";
// import MuiAppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import List from "@mui/material/List";
// import Typography from "@mui/material/Typography";
// import Divider from "@mui/material/Divider";
// import IconButton from "@mui/material/IconButton";
// import MenuIcon from "@mui/icons-material/Menu";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import ListItem from "@mui/material/ListItem";
// import ListItemButton from "@mui/material/ListItemButton";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";
// import InboxIcon from "@mui/icons-material/MoveToInbox";
// import MailIcon from "@mui/icons-material/Mail";
// import { NavLink, Outlet } from "react-router-dom";
// import { sidebarContent } from "../../utils/UtilityFile";
// import AppbarHeader from "./AppbarHeader";
// import { localUser } from "../../utils/utils";
// import ContributionFloater from "../../features/ContributionFloater";

// const drawerWidth = 240;

// const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
//   ({ theme }) => ({
//     flexGrow: 1,
//     padding: theme.spacing(3),
//     transition: theme.transitions.create("margin", {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.leavingScreen,
//     }),
//     marginLeft: `-${drawerWidth}px`,
//     variants: [
//       {
//         props: ({ open }) => open,
//         style: {
//           transition: theme.transitions.create("margin", {
//             easing: theme.transitions.easing.easeOut,
//             duration: theme.transitions.duration.enteringScreen,
//           }),
//           marginLeft: 0,
//         },
//       },
//     ],
//   }),
// );

// const AppBar = styled(MuiAppBar, {
//   shouldForwardProp: (prop) => prop !== "open",
// })(({ theme }) => ({
//   backgroundColor: "#0077B6",
//   transition: theme.transitions.create(["margin", "width"], {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   variants: [
//     {
//       props: ({ open }) => open,
//       style: {
//         width: `calc(100% - ${drawerWidth}px)`,
//         marginLeft: `${drawerWidth}px`,
//         transition: theme.transitions.create(["margin", "width"], {
//           easing: theme.transitions.easing.easeOut,
//           duration: theme.transitions.duration.enteringScreen,
//         }),
//       },
//     },
//   ],
// }));

// const DrawerHeader = styled("div")(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   padding: theme.spacing(0, 1),
//   // necessary for content to be below app bar
//   ...theme.mixins.toolbar,
//   justifyContent: "flex-end",
// }));

// export default function LayoutFile() {
//   const theme = useTheme();
//   const [open, setOpen] = React.useState(false);

//   const handleDrawerOpen = () => {
//     setOpen(true);
//   };

//   const handleDrawerClose = () => {
//     setOpen(false);
//   };
//   const {role} = localUser();
//   console.log("role",role);

//   return (
//     <Box
//       sx={{ display: "flex",
//         minHeight: "100vh",
//         backgroundColor: "#F5F9FC" ,
//         // overflowY: "auto",
//       }}
//     >
//       <CssBaseline />
//       <AppBar position="fixed" open={open}>
//         <Toolbar>
//           <IconButton
//             color="inherit"
//             aria-label="open drawer"
//             onClick={handleDrawerOpen}
//             edge="start"
//             sx={[
//               {
//                 mr: 2,
//               },
//               open && { display: "none" },
//             ]}
//           >
//             <MenuIcon />
//           </IconButton>

//           <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
//             {/* Left Title */}
//             <Typography variant="h6" noWrap>
//               Persistent drawer
//             </Typography>

//             {/* Spacer */}
//             <Box sx={{ flexGrow: 1 }} />

//             {/* Right Side (AppbarHeader) */}
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 2,
//                 marginRight: { xs: 1, sm: 2, md: 4 }, // responsive spacing
//               }}
//             >
//               <AppbarHeader />
//             </Box>
//           </Box>
//         </Toolbar>
//       </AppBar>
//       <Drawer
//         sx={{
//           width: drawerWidth,
//           flexShrink: 0,
//           "& .MuiDrawer-paper": {
//             width: drawerWidth,
//             boxSizing: "border-box",
//             backgroundColor: "#0077B6",
//             // overflowY: "auto",
//           },
//         }}
//         variant="persistent"
//         anchor="left"
//         open={open}
//       >
//         <DrawerHeader>
//           <ContributionFloater/>
//           <IconButton onClick={handleDrawerClose}>
//             {theme.direction === "ltr" ? (
//               <ChevronLeftIcon sx={{color:'white'}} />
//             ) : (
//               <ChevronRightIcon sx={{color:'white'}} />
//             )}
//           </IconButton>
//         </DrawerHeader>

//         <Divider />
//         <List>
//             {sidebarContent
//   .filter((eachRoute) => eachRoute.roles.includes(role))
//   .map((eachRoute) => (
//     <ListItem key={eachRoute.title} disablePadding>
//       <ListItemButton
//         component={NavLink}
//         to={eachRoute.locationToTravel}
//         sx={{
//           width: "100%",
//           textDecoration: "none",

//           "&.active": {
//             backgroundColor: "rgba(255,255,255,0.25)",
//             backdropFilter: "blur(8px)",
//           },

//           "&.active .MuiListItemIcon-root": {
//             color: "#E2E8F0",
//           },

//           "&:hover": {
//             backgroundColor: "rgba(255,255,255,0.25)",
//             color: "#023E8A",
//           },

//           "&:hover .MuiListItemIcon-root": {
//             // color: "#023E8A",
//           },
//         }}
//       >
//         <ListItemIcon
//           sx={{
//             color: "#E2E8F0",
//           }}
//         >
//           {eachRoute.icon}
//         </ListItemIcon>

//         <ListItemText
//           primary={eachRoute.title}
//           sx={{
//             color: "#E2E8F0",
//           }}
//         />
//       </ListItemButton>
//     </ListItem>
//   ))}
//           {/* {sidebarContent.map((eachRoute) => (
//             eachRoute.role === role ? <ListItem key={eachRoute.title} disablePadding>
//               <ListItemButton
//                 component={NavLink}
//                 to={eachRoute.locationToTravel}
//                 sx={{
//                   width: "100%",
//                   textDecoration: "none",

//                   "&.active": {
//                     backgroundColor: "rgba(255,255,255,0.25)",
//                     backdropFilter: "blur(8px)",
//                   },

//                   "&.active .MuiListItemIcon-root": {
//                     color: "#E2E8F0",
//                   },
//                   "&:hover": {
//                     backgroundColor: "rgba(255, 255, 255, 0.25)",
//                     color: "#023E8A",
//                   },
//                   "&:hover .MuiListItemIcon-root": {
//                     color: "#023E8A",
//                   },
//                 }}
//               >
//                 <ListItemIcon>{eachRoute.icon}</ListItemIcon>

//                 <ListItemText primary={eachRoute.title} />
//               </ListItemButton>
//             </ListItem>:(null)
//           ))} */}
//         </List>
//       </Drawer>
//       <Main open={open}>
//         <DrawerHeader />
//         <Outlet />
//       </Main>
//     </Box>
//   );
// }

// import * as React from "react";
// import { styled, useTheme } from "@mui/material/styles";
// import Box from "@mui/material/Box";
// import Drawer from "@mui/material/Drawer";
// import CssBaseline from "@mui/material/CssBaseline";
// import MuiAppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import List from "@mui/material/List";
// import Typography from "@mui/material/Typography";
// import Divider from "@mui/material/Divider";
// import IconButton from "@mui/material/IconButton";
// import MenuIcon from "@mui/icons-material/Menu";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import ListItem from "@mui/material/ListItem";
// import ListItemButton from "@mui/material/ListItemButton";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";
// import { NavLink, Outlet } from "react-router-dom";

// import { sidebarContent } from "../../utils/UtilityFile";
// import AppbarHeader from "./AppbarHeader";
// import { localUser } from "../../utils/utils";
// import ContributionFloater from "../../features/ContributionFloater";

// const drawerWidth = 240;

// /* MAIN CONTENT */
// const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
//   ({ theme }) => ({
//     flexGrow: 1,
//     padding: theme.spacing(3),
//     transition: theme.transitions.create("margin", {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.leavingScreen,
//     }),
//     marginLeft: `-${drawerWidth}px`,
//     variants: [
//       {
//         props: ({ open }) => open,
//         style: {
//           marginLeft: 0,
//           transition: theme.transitions.create("margin", {
//             easing: theme.transitions.easing.easeOut,
//             duration: theme.transitions.duration.enteringScreen,
//           }),
//         },
//       },
//     ],
//   })
// );

// /* APP BAR */
// const AppBar = styled(MuiAppBar, {
//   shouldForwardProp: (prop) => prop !== "open",
// })(({ theme }) => ({
//   backgroundColor: "#0077B6",
//   transition: theme.transitions.create(["margin", "width"], {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   variants: [
//     {
//       props: ({ open }) => open,
//       style: {
//         width: `calc(100% - ${drawerWidth}px)`,
//         marginLeft: `${drawerWidth}px`,
//       },
//     },
//   ],
// }));

// /* DRAWER HEADER */
// const DrawerHeader = styled("div")(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   padding: theme.spacing(0, 1),
//   ...theme.mixins.toolbar,
//   justifyContent: "flex-end",
// }));

// export default function LayoutFile() {
//   const theme = useTheme();
//   const [open, setOpen] = React.useState(false);

//   const { role } = localUser();

//   return (
//     <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#F5F9FC" }}>
//       <CssBaseline />

//       {/* APP BAR */}
//       <AppBar position="fixed" open={open}>
//         <Toolbar>
//           <IconButton
//             color="inherit"
//             onClick={() => setOpen(true)}
//             sx={{ mr: 2, ...(open && { display: "none" }) }}
//           >
//             <MenuIcon />
//           </IconButton>

//           <Typography variant="h6">Persistent Drawer</Typography>

//           <Box sx={{ flexGrow: 1 }} />

//           <AppbarHeader />
//         </Toolbar>
//       </AppBar>

//       {/* DRAWER */}
//       <Drawer
//         variant="persistent"
//         open={open}
//         sx={{
//           width: drawerWidth,
//           flexShrink: 0,
//           "& .MuiDrawer-paper": {
//             width: drawerWidth,
//             boxSizing: "border-box",
//             backgroundColor: "#0077B6",
//             overflowY: "auto", // 🔥 FIX FOR OVERFLOW
//             display: "flex",
//             flexDirection: "column",
//           },
//         }}
//       >
//         {/* HEADER (ONLY CONTROLS) */}
//         <DrawerHeader>
//           <Box sx={{ flex: 1 }} />

//           <IconButton onClick={() => setOpen(false)}>
//             {theme.direction === "ltr" ? (
//               <ChevronLeftIcon sx={{ color: "white" }} />
//             ) : (
//               <ChevronRightIcon sx={{ color: "white" }} />
//             )}
//           </IconButton>
//         </DrawerHeader>

//         <Divider />

//         {/* CONTRIBUTION WIDGET (FIXED POSITION IN LAYOUT) */}
//         <Box sx={{ p: 1, display: "flex", justifyContent: "center" }}>
//           <ContributionFloater />
//         </Box>

//         <Divider />

//         {/* SIDEBAR MENU */}
//         <List>
//           {sidebarContent
//             .filter((r) => r.roles.includes(role))
//             .map((route) => (
//               <ListItem key={route.title} disablePadding>
//                 <ListItemButton
//                   component={NavLink}
//                   to={route.locationToTravel}
//                   sx={{
//                     textDecoration: "none",
//                     width: "100%",
//                     "&.active": {
//                       backgroundColor: "rgba(255,255,255,0.25)",
//                     },
//                   }}
//                 >
//                   <ListItemIcon sx={{ color: "#E2E8F0" }}>
//                     {route.icon}
//                   </ListItemIcon>

//                   <ListItemText
//                     primary={route.title}
//                     sx={{ color: "#E2E8F0" }}
//                   />
//                 </ListItemButton>
//               </ListItem>
//             ))}
//         </List>
//       </Drawer>

//       {/* MAIN CONTENT */}
//       <Main open={open}>
//         <DrawerHeader />
//         <Outlet />
//       </Main>
//     </Box>
//   );
// }
