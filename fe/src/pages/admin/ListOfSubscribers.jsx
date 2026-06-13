import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReusableTable from "../../reusables/ReusableTable";
import { loadingStates } from "../../app/appUtils";
import { allUsersApi } from "../../app/thunkApiCalls";
import { optimizeImage } from "../../utils/utils";

export const tableHeadRowCells = [
  "Name",
  "Email",
  "Mobile",
  "Address",
  "Profile Photo",
];

export const columns = [
  "name",
  "email",
  "mobile",
  "address",
  "profilePhoto",
];

const createData = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  mobile: user.mobile,
  address: user.address,
  profilePhoto: optimizeImage(user.profilePhoto?.secure_url,100,100),
});

const ListOfSubscribers = () => {
  const dispatch = useDispatch();

  const allUsers = useSelector((state) => state.apiSlicer.allUsers);

  useEffect(() => {
    if (
      allUsers.loading === loadingStates.IDLE &&
      !allUsers.data?.data?.length
    ) {
      dispatch(allUsersApi({
        url:`${import.meta.env.VITE_ALL_USERS}`,
        data:[]
      }));
    }
  }, [dispatch, allUsers.loading]);

  const rows = useMemo(() => {
    return (allUsers.data?.data || []).map(createData);
  }, [allUsers.data]);

  return (
    <>
      <ReusableTable
        tableHeadRowCells={tableHeadRowCells}
        rows={rows}
        columns={columns}
      />
    </>
  );
};

export default ListOfSubscribers;







// import React, { useEffect, useState } from 'react'
// import {useDispatch, useSelector} from "react-redux";
// import ReusableTable from '../../reusables/ReusableTable';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { loadingStates } from '../../app/appUtils';
// import { allUsersApi } from '../../app/thunkApiCalls';

// export const tableHeadRowCells = [
//   "Name",
//   "Email",
//   "Mobile",
//   "Address",
//   "Profile Photo",
//   // "Contribution",
//   // "Amount To Pay",
//   // "Amount Paid",
//   // "Delete",
// ];

// export const columns = [
//   "name",
//   "email",
//   "mobile",
//   "address",
//   "Profile Photo",
//   // "contribution",
//   // "amountToPay",
//   // "amountPaid",
//   // "delete",
// ];

// export function createData(dataObj){
//   const {name:username,email,mobile:phoneNumber,address,profilePhoto,role,id:_id} = dataObj;
//   return {
//     name,email,mobile,address,profilePhoto,role,id
//   }
// };
// // const allUsersRows = [
// //   createData(),
// // ]
// const ListOfSubscribers = () => {

//   const dispatch = useDispatch();
//   const allUsers = useSelector((state)=>state.apiSlicer.allUsers);
//   const [allUsersData,setAllUsersData] = useState(allUsers?.data?.data?.data);
//   const allUsersRows = allUsersData?.map((each,index)=>{
//     const {name:username,email,mobile:phoneNumber,address,profilePhoto,role,id:_id} = each;
//     const requiredObj = {name,email,mobile,address,profilePhoto,role,id}
//     return createData(requiredObj); 
//   });
//   useEffect(() => {
//   if (
//     !allUsers.data?.length &&
//     allUsers.loading === loadingStates.IDLE
//   ) {
//     dispatch(allUsersApi());
//   }
// }, [dispatch, allUsers]);
//   console.log("data",allUsers);
//   console.log("all rows",allUsersRows);
  
//   return (
//     <>
//     ListOfSubscribers
//     <ReusableTable
//     tableHeadRowCells={tableHeadRowCells}
//     rows = {allUsersRows}
//     createData={createData}
//     columns={columns}
//     />
//     </>
//   )
// }

// export default ListOfSubscribers;








// export function createData(
//   name,
//   email,
//   mobile,
//   address,
//   profilePhoto,
//   // contribution,
//   // amountToPay,
//   // amountPaid
// ) {
//   return {
//     name,
//     email,
//     mobile,
//     address,
//     profilePhoto
//     // contribution,
//     // amountToPay,
//     // amountPaid,
//   };
// }

// export const rows = [
//   createData(
//     "Fransisco",
//     "as@gmail.com",
//     "9876543210",
//     "-"
//     // 1000,
//     // 1000,
//     // 0
//   ),
//   createData(
//     "John",
//     "john@gmail.com",
//     "9999999999",
//     "-"
//     // 2000,
//     // 1500,
//     // 500
//   ),
// ];


//     const tableHeadRowCells = [
//         "Name",
//         "Email",
//         "Mobile",
//         "Contribution",
//         "Amount to pay",
//         "Amount paid",
//         "Delete"
//     ];
//     function createData(name, email, mobile, contribution, amountToPay,amountPaid,deleteRow) {
//   return {
//     name,
//     email,
//     mobile,
//     contribution,
//     amountToPay,amountPaid,deleteRow,
//     history: [
//       { date: "2026-01-01", amount: 120 },
//       { date: "2026-01-02", amount: 200 },
//     ],
//   };
// }
// const rows = [
//     createData("Fransisco", "as@gmail.com", "9876543210", 1000, 1000,0,<DeleteIcon/>),
// ]