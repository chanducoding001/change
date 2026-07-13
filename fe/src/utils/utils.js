const currentIpAddressMongodb = "103.224.154.158/32";

// cloudinary image uploads
export const uploadToCloudinary = async (file) => {
  if (!file) throw new Error("No file selected");

  const formData = new FormData();

  formData.append("file", file);
  formData.append(
    "upload_preset",
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_NAME
  );

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    }/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Image upload failed");
  }

  return {
    secure_url: data.secure_url,
    public_id: data.public_id,
  };
};

export const optimizeImage = (url, width = 100, height = 100) => {
  if (!url || typeof url !== "string") return "";

  return url.replace(
    "/upload/",
    `/upload/f_auto,q_auto,w_${width},h_${height},c_fill/`
  );
};

export const getOptimizedImage = (
  publicId,
  width = 500,
  height = 500
) => {
  return `https://res.cloudinary.com/${
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  }/image/upload/f_auto,q_auto,c_fill,w_${width},h_${height}/${publicId}`;
};


// web crypto api encryption
export const encryptData = async (data, secret) => {
  const enc = new TextEncoder();

  const key = await crypto.subtle.digest(
    "SHA-256",
    enc.encode(secret)
  );

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    cryptoKey,
    enc.encode(JSON.stringify(data))
  );

  return {
    iv: Array.from(iv),
    data: Array.from(new Uint8Array(encrypted)),
  };
};

export const decryptData = async (encryptedObj, secret) => {
  const enc = new TextEncoder();

  const key = await crypto.subtle.digest(
    "SHA-256",
    enc.encode(secret)
  );

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );

  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: new Uint8Array(encryptedObj.iv),
    },
    cryptoKey,
    new Uint8Array(encryptedObj.data)
  );

  return JSON.parse(
    new TextDecoder().decode(decrypted)
  );
};

export const ROLES = {
  USER:'user',
  ADMIN:'admin'
};
export const navigationLocations = {
  ADMINDASHBOARD:'/admin/dashboard',
  DASHBOARDLIST:'/admin/dashboard/list',
  IDLE:'/admin/idle',
  USERDASHBOARD:'/user/dashboard',
  UNAUTHORIZED:'/unauthorized',
  LOGIN:'/login',
  SIGNUP:'/signup',
  CONTRIBUTERS:'/admin/contributers',
  UPLOADCSVDATA:'/admin/uploadCSVData',
  DISPLAYCENSUS:'/admin/displayCensus',
  DISPLAYSTATELGD:'/admin/displayStateLGD',
  ADDTOUR:'/admin/addTour',
  ADDPLACEINTOUR:'/admin/addPlaceInTour/:tourId/:tourName',
  VISITTOUR:'/admin/visitTour/:tourId',
  TOURSLIST:'/admin/toursList',
  WORLDMAP:'/admin/worldMap',
  PROFILE:"/app/profile",
  EDITPROFILE:"/app/profile/edit/:id",
  ACCOUNTSETTINGS:"/app/account-settings",
  SETTINGS:"/app/settings",
  CREATEDATA:"/admin/create-data",
  ALLINFO:"/app/all-info",
  ALLWORKSLIST:"/app/all-works-list",
  ALLPERSONALWORKSLIST:"/app/all-personal-works-list",
  EACHWORKTHEORY:"/app/each-work-theory"
};
export const BASE_URL = "http://localhost:8080";

export const apiDetails = {
  sendOtp: `${BASE_URL}/api/auth/send-otp`,
  verifyOtp: `${BASE_URL}/api/auth/verify-otp`,
  signUpUrl: `${BASE_URL}/api/auth/signup`,
  loginUrl: `${BASE_URL}/api/auth/login`,
  createWork:`${BASE_URL}/api/work/create`,
  createInformation:`${BASE_URL}/api/information/create`,
};

export function localUser() {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Invalid user data in localStorage", error);
    return null;
  }
}

const convertUTCToIST = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

export const getTourTimeline = (tour) => {
  const timeline = [];

  // Start Location
  if (tour.startLocation) {
    timeline.push({
      type: "startLocation",
      name:
        tour.startLocation.displayName ||
        tour.startLocation.name ||
        tour.startLocation.searchQuery,
      visitSequence: 0,
      sequence: 0,
      startedAt: convertUTCToIST(tour.startedAt),
      visitedAt: "-",
      visited: "Yes",
    });
  }

  // Places
  timeline.push(
    ...(tour.places || []).map((item) => ({
      type: "place",
      name:
        item.place?.searchQuery ||
        item.place?.displayName ||
        item.place?.name,
      visitSequence: item.visitSequence,
      sequence: item.sequence,
      startedAt: convertUTCToIST(item.startedAt),
      visitedAt: convertUTCToIST(item.visitedAt),
      visited: item.visited ? "Yes" : "No",
    }))
  );

  return timeline;
};