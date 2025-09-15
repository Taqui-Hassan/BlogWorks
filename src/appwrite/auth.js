import conf from "../conf/conf.js";
import { Client, Account, ID } from 'appwrite';

export class AuthService {
    client  = new Client();
    account;

    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client)
    }
    async createAccount({email,password,name}){
        try{
            const userAccount = await this.account.create(ID.unique(),email,password,name)

            if(userAccount){
                // call another method
                return this.login(email,password);

            }
            else{
                return userAccount;
            }
            
        }
        catch(e){
            throw e;
        }
    }

    async login ({email,password}){
        try{
            return await this.account.createEmailPasswordSession(email,password); // yaha change kia h mene pehle createEmailSession tha
        }
        catch(e){
            throw e;
        }
    }
    async getCurrentUser(){
        try{
            console.log("Fetching current user...");
            return await this.account.get();


        }catch(e){
            console.log("Appwrite service::GetCurrentUser :: error ",e)
        }

        return null;
    }
    async logout(){
        try{await this.account.deleteSessions();}
        catch(e){
            throw e
        }
    }
}

const authService =  new  AuthService();
export default authService;
