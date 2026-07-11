import React, { useState } from "react";
import GISMap from "../GIS/GISMap";

const WorldMap = () => {
  const [level, setLevel] = useState("country");
  const [search, setSearch] = useState("");

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div
        style={{
          padding: "10px",
          borderBottom: "1px solid #ccc",
          background: "#f5f5f5",
        }}
      >
        <h2>GIS Boundary Explorer</h2>

      </div>

      {/* Map */}
      <div style={{ flex: 1 }}>
        <GISMap />
      </div>
    </div>
  );
};

export default WorldMap;







// import React, { useState } from "react";
// import GISMap from "../GIS/GISMap";
// import CountryImporter from "./CountryImporter";

// const WorldMap = () => {
//   const [level, setLevel] = useState("country");
//   const [search, setSearch] = useState("");

//   return (
//     <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
//       {/* Header */}
//       <div
//         style={{
//           padding: "10px",
//           borderBottom: "1px solid #ccc",
//           background: "#f5f5f5",
//         }}
//       >
//         <h2>GIS Boundary Explorer</h2>

//         <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
//           <select
//             value={level}
//             onChange={(e) => setLevel(e.target.value)}
//           >
//             <option value="country">Country</option>
//             <option value="state">State</option>
//             <option value="district">District</option>
//             <option value="mandal">Mandal</option>
//             <option value="village">Village</option>
//           </select>

//           <input
//             type="text"
//             placeholder="Search..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//           <button>Load</button>
//         </div>
//       </div>

//       {/* Map */}
//       <div style={{ flex: 1 }}>
//         <GISMap />
//       </div>
//     </div>
//   );
// };

// export default WorldMap;
