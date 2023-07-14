import { Model } from "mongoose"
import { PostModel, Role, RoleModel, TreeModel, User, UserModel } from "../models"
import { Router, Response, Request} from "express"
import * as express from 'express'
import { SecurityUtils } from "../utils"
import { checkBody, checkUserRole, checkUserToken } from "../middleware"
import { RolesEnums } from "../enums"
import { checkQuery } from "../middleware/query.middleware"
import { TreeService } from "../service/tree.service"


export class UserController {

    readonly path: string
    readonly model: Model<User>
    guestRole: Role | null

    constructor(){
        this.path = "/user"
        this.model = UserModel
        this.guestRole = null
    }

    private loadGuestRole = async ():Promise<void> => {
        if (this.guestRole) {
            return
        }
        this.guestRole = await RoleModel.findOne({
            name: "guest"
        }).exec()
    }

    readonly paramsLogin = {
        "login" : "string",
        "password" : "string",
        "tree_name" : "string",
        "image" : "string",
        "adress" : "string",
        "phone" : "string",
        "skills" : "object",
        "hobbies" : "object",
        "job" : "string",
        "aboutMe" : "string",
        "workHistory" : "object",
        "joinDate" : "string",
        "organization" : "string",
        "dirthday" : "string",
        "languages" : "object",
    }

    subscribe = async (req: Request, res: Response):Promise<void> => {

        const login: string = req.body.login
        const password: string  = req.body.password
        let tree

        console.log(req.body.workHistory)

        try{

            tree = await TreeModel.create({
                name: req.body.tree_name,
                size : 0
            })

            await this.loadGuestRole()
            const user = await UserModel.create({
                login,
                password: SecurityUtils.toSHA512(password),
                roles:[this.guestRole],
                tree,
                posts: [],
                todoTask: [],
                image: req.body.image,
                adress : req.body.adress,
                phone : req.body.phone,
                skills : req.body.skills,
                hobbies : req.body.hobbies,
                job : req.body.job,
                aboutMe : req.body.aboutMe,
                workHistory : req.body.workHistory,
                joinDate : req.body.joinDate,
                organization : req.body.organization,
                dirthday : req.body.dirthday,
                languages : req.body.languages,
                follow: []
            })
            res.json(user)

        }catch(err: unknown){
            const me = err as {[key: string]: unknown}
            if (me['name'] === "MongoServerError" && me['code'] === 11000){
                if(tree){
                    console.log("le tree en plus est supprimer")
                    await TreeModel.findByIdAndDelete(tree._id)
                }
                res.status(409).json({"message": "The login is already in use."})
            }else{
                console.log(me)
                res.status(500).end()
            }
        }

    }

    readonly paramsUpdateUser = {
        "password" : "string | undefined",
        "image": "string | undefined",
        "adress" : "string | undefined",
        "phone" : "string | undefined",
        "skills" : "object | undefined",
        "hobbies" : "object | undefined",
        "job" : "string | undefined",
        "aboutMe" : "string | undefined",
        "organization" : "string | undefined",
        "languages" : "object | undefined",
    }

    updateUser = async (req:Request, res:Response) => {

        let workHistory:any
        let updated_user
        let password
        if(req.body.organization !== req.user?.organization){
            workHistory = req.user?.workHistory
            workHistory?.push(req.body.organization)
        }
        if(req.body.password){
            password = SecurityUtils.toSHA512(req.body.password)
        }


        try{
            updated_user = await UserModel.findByIdAndUpdate(req.user?._id,{
                password,
                image: req.body.image,
                adress : req.body.adress,
                phone : req.body.phone,
                skills : req.body.skills,
                hobbies : req.body.hobbies,
                job : req.body.job,
                aboutMe : req.body.aboutMe,
                workHistory : workHistory,
                organization : req.body.organization,
                languages : req.body.languages,
            }, 
            { new: true})

            if(!updated_user){
                res.status(404).end()
                return 
            }

        }catch(e){
            console.log(e)
            res.status(500).json({"message" : "we were unable to update the user."})
            return
        }


        res.status(200).json(updated_user)
        return 
    }

    

    me = async (req:Request, res: Response) => {
        res.json(req.user)
    }

    getAllUsersInfo = async (req:Request, res:Response): Promise<void> => {

        const users = await UserModel.find({}).populate("tree")
        if(!users){
            res.status(404).json({"message" : "No users"})
            return
        }
        users.forEach(user => {
            user.password = ""
            user.roles = []
        })

        res.status(200).json(users)
        return 
    }

    readonly paramsGiveRole = {
        "user_id" : "string",
        "role" : "string"
    }

    addRole = async (req:Request, res:Response): Promise<void> => {

        if(!req.user){res.send(401).end(); return}

        // Check that we don't assign roles to ourselves 
        if ( req.body.user_id === String(req.user._id)){
            res.status(409).json({"message" : "You can't assign roles to yourself"})
            return
        }

        try{
            const role = await RoleModel.findById(req.body.role)
            const user = await UserModel.findById(req.body.user_id)
            if(!role || !user){res.status(404).json({"message" : "Role or User not found"}); return}
            if(!user.roles.some(userRole => String(role._id) === String(userRole._id))){
                user.roles.push(role)
                user.save()
                res.status(200).json({"message" : "Role assign"})
                return 
            }
        
            res.status(409).json({"message" : "The user already has the role"})
            return

        }catch(err){
            res.status(400).json({"message" : "One of the ID is incorrect"})
            return
        }
    }

    getRoles = async (req: Request, res: Response): Promise<void> => {

        const roles = await RoleModel.find({})

        res.send(roles)
    }

    getAllUsers = async (req:Request, res: Response): Promise<void> => {
        const users = (await UserModel.find({})).length

        res.status(200).json(users)
    }

    getOneUser = async (req: Request, res: Response): Promise<void> => {
        if(!req.query.id || typeof req.query.id !== "string"){
            res.status(400).end()
            return
        }

        let user
        try{
            user = await UserModel.findById(req.query.id).populate("roles").populate("tree")
            if(user){
                user.password = ""
                user.roles = []
            }
        }catch(e){
            res.status(404).json("User not found")
        }

        res.status(200).json(user)
    }

    readonly queryUsersTree = {
        "id" : "string"
    }

    getUserTree = async (req: Request, res: Response): Promise<void> => {

        try{
            const user = await UserModel.findById(req.query.id).populate("tree")
            
            if(!user){
                res.status(404).end(); return 
            }
            
            res.status(200).json(user.tree)
        }catch(err){

            res.status(400).json({"message": "User not found"})
        }
    }

    readonly queryGetPost = {
        "user_id" : "string | undefined"
    }

    getAllPost = async (req:Request, res:Response): Promise<void> => {

        if (!req.query.user_id && req.user){
            res.status(200).json((await req.user.populate("posts")).posts)
            return
        }

        try{
            const user = await UserModel.findById(req.query.user_id).populate("posts")
            if (!user){
                res.status(404).json({'message': "User not found"})
                return 
            }
            res.status(200).json(user.posts)
            return 
        }catch(err){
            res.status(500).json({'message': "Server error"})
            return 
        }
    
    }

    readonly paramsUpdateTree = {
        "name" : "string"
    }

    updateTree = async (req:Request, res:Response):Promise<void> => {
        if(!req.user){
            res.status(500).json({"message" : "No access to your personal information"})
            return 
        }
        try{
            const tree = await TreeModel.findById(req.user.tree._id)
            if(!tree){
                res.status(400).json({"message" : "Tree not found"})
                return 
            }
            tree.name = req.body.name
            tree.save()
            res.status(200).json(tree)
            return
        }catch(err){
            res.status(500).json({"message" : "Can't access to your tree"})
            return 
        }
    }

    readonly queryValidatePost = {
        "post_id" : "string"
    }

    validatePost = async (req:Request, res:Response): Promise<void> => {
    
        try{
            const post = await PostModel.findById(req.query.post_id)
            if(!post){
                res.status(404).json({"message" : "Post not found"})
                return 
            }
            if(!req.user){
                res.status(500).end()
                return 
            }       
            // Check that the user hasn't already validated the post
            if(post.whoValidates.some(validator => String(validator) === String(req.user?._id))){
                res.status(406).json({"message" : "You have already validated this post"})
                return
            }
            
            post.whoValidates.push(req.user)
            post.save()
            const tree = await TreeModel.findById(post.treeLinked)
            
            if(!tree){
                res.status(404).json({"message" : "Tree not found"})
                return 
            }
            
            await TreeService.treeAddScore(tree, 1)

            res.status(200).json({"message" : "You validate this post"})
            return


        }catch(err){
            res.status(400).json({"message" : "This is not a Post Id"})
            return
        }
    }

    readonly queryFollow = {
        "user_id" : "string"
    }

    follow = async (req:Request, res:Response): Promise<void> => {

        if ( !req.user || req.user._id == req.query.user_id){
            res.status(400).json({"message": "You can't follow yourself"})
            return 
        }

        try{
            const follow_user = await UserModel.findById(req.query.user_id)
            if (!follow_user){
                res.status(404).json({"message" : "We can't find this user"})
                return 
            }
            req.user?.follow.push(follow_user)
            req.user?.save()

            res.status(200).send("OK")
            return 
        }catch(e){
            console.log(e);
            res.status(400).json({"message" : "This is not a user's ID"})
            return
        }


    }

    getFollower = async (req:Request, res:Response):Promise<void> => {
        const user_tree:any[] = []
        try{
            const list_followers = req.user?.follow
            if(!list_followers){
                res.status(204).json({"message" : "you are following no one"})
                return 
            }

            for (let user of list_followers){
                const user_info = await UserModel.findById(user._id).populate("tree")
                user_tree.push(user_info)
            }
            res.status(200).json(user_tree)
            
        }catch(e){
            console.log(e)
            res.status(500).end()
            return 
        }
    }

    buildRouter = (): Router => {
        
        const router = express.Router()
        router.post(`/subscribe`, express.json(), checkBody(this.paramsLogin), this.subscribe.bind(this))
        router.get('/follow', express.json(), checkUserToken(), this.getFollower.bind(this))
        router.get('/me', checkUserToken(), this.me.bind(this))
        router.get('/count', checkUserToken(), checkUserRole(RolesEnums.admin), this.getAllUsers.bind(this))
        router.get('/one', checkUserToken(), checkUserRole(RolesEnums.guest), this.getOneUser.bind(this))
        router.get('/role', checkUserToken(), checkUserRole(RolesEnums.admin), this.getRoles.bind(this)) // Return the list of all possible roles 
        router.get('/tree', checkUserToken(), checkQuery(this.queryUsersTree), this.getUserTree.bind(this))
        router.get('/post', checkUserToken(), checkQuery(this.queryGetPost), this.getAllPost.bind(this))
        router.get('/all', checkUserToken(), this.getAllUsersInfo.bind(this))
        router.patch('/', express.json(), checkUserToken(), checkBody(this.paramsUpdateUser), this.updateUser.bind(this))
        router.patch('/tree', express.json(), checkUserToken(), checkBody(this.paramsUpdateTree), this.updateTree.bind(this))
        router.patch('/validate', express.json(), checkUserToken(), checkQuery(this.queryValidatePost), this.validatePost.bind(this))
        router.patch('/role', express.json(), checkUserToken(), checkUserRole(RolesEnums.admin), checkBody(this.paramsGiveRole), this.addRole.bind(this))
        router.put('/follow', express.json(), checkUserToken(), checkQuery(this.queryFollow), this.follow.bind(this))
 
        return router
    }
}