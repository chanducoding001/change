import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { NavLink, useNavigate } from "react-router-dom";
import { profileContent } from "../../utils/UtilityFile";
import { useSelector } from "react-redux";
import { navigationLocations, optimizeImage } from "../../utils/utils";

export default function AppbarHeader() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { profilePhoto } = useSelector((state) => state.apiSlicer.userProfile);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <React.Fragment>
      <Box sx={{ 
        display: "flex", 
        alignItems: "center", 
        textAlign: "center",
        
        }}>
        {/* <Tooltip title="Account settings" >
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open}
          >
            <Avatar
              src={optimizeImage(profilePhoto?.secure_url, 100, 100)}
              // src={farmer_profile}
              alt="M"
              sx={{ width: 50, height: 50 }}
            />
          </IconButton>
        </Tooltip> */}
<Tooltip
  title="Account settings"
  slotProps={{
    tooltip: {
      sx: {
        background:
          "linear-gradient(135deg, #00c6ff 0%, #0072ff 50%, #00c6ff 100%)",
        color: "#fff",
        fontSize: "0.85rem",
        fontWeight: 500,
        boxShadow: `
          inset 0 1px 1px rgba(255,255,255,0.25),
          0 10px 30px rgba(0,114,255,0.25),
          0 20px 60px rgba(0,198,255,0.20)
        `,
        border: "1px solid rgba(255,255,255,0.2)",
      },
    },
    arrow: {
      sx: {
        color: "#0072ff",
      },
    },
  }}
  arrow
>
  <IconButton
    onClick={handleClick}
    size="small"
    sx={{ ml: 2 }}
    aria-controls={open ? "account-menu" : undefined}
    aria-haspopup="true"
    aria-expanded={open}
  >
    <Avatar
      src={optimizeImage(profilePhoto?.secure_url, 100, 100)}
      alt="M"
      sx={{ width: 50, height: 50 }}
    />
  </IconButton>
</Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
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
  inset 0 1px 1px rgba(255,255,255,0.25),
  0 10px 30px rgba(0,114,255,0.25),
  0 20px 60px rgba(0,198,255,0.20)
`,
              // background: "linear-gradient(135deg, #0077B6 0%, #00B4D8 50%, #90E0EF 100%)",
              // filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              overflow: "visible",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
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
  inset 0 1px 1px rgba(255,255,255,0.25),
  0 10px 30px rgba(0,114,255,0.25),
  0 20px 60px rgba(0,198,255,0.20)
`,
                // background: "linear-gradient(135deg, #0077B6 0%, #00B4D8 50%, #90E0EF 100%)",
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {profileContent.map((eachItem) => {
          const isLogout = eachItem.action === "logout";

          return (
            <MenuItem
              key={eachItem.id}
              component={!isLogout ? NavLink : "div"}
              to={!isLogout ? eachItem.to : undefined}
              onClick={() => {
                handleClose();

                if (isLogout) {
                  // localStorage.removeItem("user");
                  // navigate("/login", { replace: true });
                  localStorage.clear();
                  window.location.replace(navigationLocations.LOGIN);
                }
              }}
            >
              <ListItemIcon sx={{color:'white'}}>{eachItem.icon}</ListItemIcon>
              <span style={{color:'white'}}>{eachItem.title}</span>
            </MenuItem>
          );
        })}
      </Menu>
    </React.Fragment>
  );
}

{
  /* {
            profileContent.map((eachItem,index)=>{
                const isLogout = eachItem?.title?.toLowerCase()==="logout";

                return <MenuItem
                component={eachItem?.component}
                to={eachItem?.to}
                onClick={isLogout?eachItem?.onClick:()=>{}}
                key={eachItem?.title}
                >
                <ListItemIcon>
                    {eachItem?.icon}
                </ListItemIcon>
                {eachItem?.title}
                </MenuItem>
            })
        } */
}
{
  /* <MenuItem 
        component={NavLink}
        to='/app/profile'
        onClick={handleClose}
        >
          <ListItemIcon>
            <AccountCircleIcon fontSize="medium" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="medium" />
          </ListItemIcon>
          My Account
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem> */
}
