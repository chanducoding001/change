import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import UserDashboard from "../pages/user/UserDashboard";
import PersonIcon from '@mui/icons-material/Person';
import { navigationLocations, ROLES } from "./utils";
import { Navigate, NavLink, replace } from "react-router-dom";
import { AccountCircle } from "@mui/icons-material";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { Button } from "@mui/material";
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import CreateIcon from '@mui/icons-material/Create';
import SourceIcon from '@mui/icons-material/Source';
import ListIcon from '@mui/icons-material/List';
import PageviewIcon from '@mui/icons-material/Pageview';
import DashboardIcon from '@mui/icons-material/Dashboard';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import TvIcon from '@mui/icons-material/Tv';

export const sidebarContent = [
  {
    roles:[ROLES.ADMIN],
    title:'Admin Dashboard',
    icon:<AdminPanelSettingsIcon/>,
    locationToTravel:navigationLocations?.ADMINDASHBOARD
  },
  {
    roles:[ROLES.ADMIN,ROLES.USER],
    title:'User Dashboard',
    icon:<PersonIcon/>,
    locationToTravel:navigationLocations?.USERDASHBOARD
  },
  {
    roles:[ROLES.ADMIN],
    title:'Contributers',
    icon:<SubscriptionsIcon/>,
    locationToTravel:navigationLocations?.CONTRIBUTERS
  },
  {
    roles:[ROLES.ADMIN],
    title:'Create Data',
    icon:<CreateIcon/>,
    locationToTravel:navigationLocations?.CREATEDATA
  },
  {
    roles:[ROLES.ADMIN],
    title:'Upload Census Data',
    icon:<UploadFileIcon/>,
    locationToTravel:navigationLocations?.UPLOADCSVDATA
  },
  {
    roles:[ROLES.ADMIN],
    title:'Personal Works',
    icon:<AssuredWorkloadIcon/>,
    locationToTravel:navigationLocations?.ALLPERSONALWORKSLIST
  },
  {
    roles:[ROLES.ADMIN,ROLES.USER],
    title:'Display Census Data',
    icon:<TvIcon/>,
    locationToTravel:navigationLocations?.DISPLAYCENSUS
  },
  {
    roles:[ROLES.ADMIN],
    title:'Dashboards list',
    icon:<DashboardIcon/>,
    locationToTravel:navigationLocations?.DASHBOARDLIST
  },
  
  {
    roles:[ROLES.ADMIN,ROLES.USER],
    title:'Information',
    icon:<SourceIcon/>,
    locationToTravel:navigationLocations?.ALLINFO
  },
  {
    roles:[ROLES.ADMIN,ROLES.USER],
    title:'List Of Works',
    icon:<ListIcon/>,
    locationToTravel:navigationLocations?.ALLWORKSLIST
  },
  {
    roles:[ROLES.ADMIN],
    title:'Idle',
    icon:<PageviewIcon/>,
    locationToTravel:navigationLocations?.IDLE
  },
];

export const profileContent = [
    {
        id:1,
        component:NavLink,
        title:'Profile',
        icon:<AccountCircle/>,
        to:'/app/profile',
        action:'profile'
    },
    // {
    //     id:2,
    //     component:NavLink,
    //     title:'Account Setting',
    //     icon:<AccountCircle/>,
    //     to:'/app/account-settings',
    //     action:'account'
    // },
    {
        id:3,
        component:NavLink,
        title:'Settings',
        icon:<Settings/>,
        to:'/app/settings',
        action:'setting'
    },
    {
        id:4,
        component:Button,
        title:'LogOut',
        icon:<Logout/>,
        action:'logout'
    },
    
]
