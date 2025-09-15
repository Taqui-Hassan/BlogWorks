import { Client, ID, Databases, Query,Storage} from "appwrite";
import conf from '../conf/conf'
// slug is basically DocumentId
export class Service {
    client = new Client();
    databases;
    bucket;
    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }
    async createPost({ title, slug, Content, FeaturedImg, Status, UserId }) {
    try {
        console.log("Data being sent to Appwrite:",
        {
                title,
                Content,
                FeaturedImg,
                Status,
                UserId,
            })
        return await this.databases.createDocument(
            
            conf.appwriteDatabaseId,    // Correct: Database ID comes first
            conf.appwriteCollectionId,  // Correct: Collection ID comes second
            slug,
            {
                title,
                Content,
                FeaturedImg,
                Status,
                UserId,
            }
        );
    } catch (e) {
        console.log("CreatePost error:: ", e);
    }
}

    async updatePost(slug, { title, Content, FeaturedImg, Status }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    Content,
                    FeaturedImg,
                    Status,


                }
            );



        } catch (e) {
            console.log("updatePost error", e);
        }
    }
    // async uploadFile(file) {
    // try {
    //     return await this.bucket.createFile(
    //         conf.appwriteBucketId,
    //         ID.unique(),
    //         file, // This should be a FormData object
    //     );
    // }
    // catch (e) {
    //     console.log("uploadFile error", e);
    //     return false;
    // }
// }

    async deletePost(slug) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteCollectionId,
                conf.appwriteProjectId,
                slug,

            )
            return true;
        }
        catch (e) {
            console.log("DeletePost error", e);
            return false;
        }
    }
    async getPost(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,

            )

        }
        catch (e) {
            console.log("GetPost error", e)
            return false;
        }
    }
    async getPosts(queries = [Query.equal("Status", "active")]) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries,



            )

        } catch (e) {
            console.log("getPosts error", e)
            return false;
        }
    }
    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file,
            )

        }
        catch (e) {
            console.log("uploadFile error", e)
            return false;
        }
    }
    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,

                fileId,
            )
            return true;

        }
        catch (e) {
            console.log("deleteFile error", e)
            return false;
        }
    }
    getFilePreview(fileId) {
        console.log("Bucket ID:", conf.appwriteBucketId);
        console.log("File ID:", fileId);
        return this.bucket.getFilePreview(
            conf.appwriteBucketId,
            fileId,
        );
    }
}

const service = new Service()
export default service




// import conf from '../conf/conf.js';
// import { Client, ID, Databases, Storage, Query } from "appwrite";

// export class Service{
//     client = new Client();
//     databases;
//     bucket;
    
//     constructor(){
//         this.client
//         .setEndpoint(conf.appwriteUrl)
//         .setProject(conf.appwriteProjectId);
//         this.databases = new Databases(this.client);
//         this.bucket = new Storage(this.client);
//     }

//     async createPost({title, slug, content, featuredImage, status, userId}){
//         try {
//             return await this.databases.createDocument(
//                 conf.appwriteDatabaseId,
//                 conf.appwriteCollectionId,
//                 slug,
//                 {
//                     title,
//                     content,
//                     featuredImage,
//                     status,
//                     userId,
//                 }
//             )
//         } catch (error) {
//             console.log("Appwrite serive :: createPost :: error", error);
//         }
//     }

//     async updatePost(slug, {title, content, featuredImage, status}){
//         try {
//             return await this.databases.updateDocument(
//                 conf.appwriteDatabaseId,
//                 conf.appwriteCollectionId,
//                 slug,
//                 {
//                     title,
//                     content,
//                     featuredImage,
//                     status,

//                 }
//             )
//         } catch (error) {
//             console.log("Appwrite serive :: updatePost :: error", error);
//         }
//     }

//     async deletePost(slug){
//         try {
//             await this.databases.deleteDocument(
//                 conf.appwriteDatabaseId,
//                 conf.appwriteCollectionId,
//                 slug
            
//             )
//             return true
//         } catch (error) {
//             console.log("Appwrite serive :: deletePost :: error", error);
//             return false
//         }
//     }

//     async getPost(slug){
//         try {
//             return await this.databases.getDocument(
//                 conf.appwriteDatabaseId,
//                 conf.appwriteCollectionId,
//                 slug
            
//             )
//         } catch (error) {
//             console.log("Appwrite serive :: getPost :: error", error);
//             return false
//         }
//     }

//     async getPosts(queries = [Query.equal("status", "active")]){
//         try {
//             return await this.databases.listDocuments(
//                 conf.appwriteDatabaseId,
//                 conf.appwriteCollectionId,
//                 queries,
                

//             )
//         } catch (error) {
//             console.log("Appwrite serive :: getPosts :: error", error);
//             return false
//         }
//     }

//     // file upload service

//     async uploadFile(file){
//         try {
//             return await this.bucket.createFile(
//                 conf.appwriteBucketId,
//                 ID.unique(),
//                 file
//             )
//         } catch (error) {
//             console.log("Appwrite serive :: uploadFile :: error", error);
//             return false
//         }
//     }

//     async deleteFile(fileId){
//         try {
//             await this.bucket.deleteFile(
//                 conf.appwriteBucketId,
//                 fileId
//             )
//             return true
//         } catch (error) {
//             console.log("Appwrite serive :: deleteFile :: error", error);
//             return false
//         }
//     }

//     getFilePreview(fileId){
//         return this.bucket.getFilePreview(
//             conf.appwriteBucketId,
//             fileId
//         )
//     }
// }


// const service = new Service()
// export default service