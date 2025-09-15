// const conf = {
//     appwriteUrl:String(import.meta.env.VITE_APPWRITE_URL),
//     appwriteProjectId:String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
//     appwriteDatabaseId:String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
//     appwriteCollectionId:String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
//     appwriteBucketId:String(import.meta.env.VITE_APPWRITE_BUCKET_ID),

// }
// console.log("Appwrite URL:", conf.appwriteUrl);



// export default conf
const conf = {
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
    appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
}

console.log("Appwrite URL:", conf.appwriteUrl);
console.log("Appwrite Project ID:", conf.appwriteProjectId);

export default conf;
