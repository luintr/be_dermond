import asyncHandler from "../middleware/asyncHandler";
import User from "../model/userModel";
import {Request, Response} from "express";
import generateToken from "../utils/generateToken";

// @desc      Auth user & get Token
// @route     POST /api/users/login
// @access    Public
export const authUser = asyncHandler(async (req: Request, res: Response) => {
    const {email, password} = req.body

    const user = await User.findOne({email})

    if (user && (await user.matchPassword(password))) {

        const token = generateToken(res, user._id)

        res.status(200).send({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: token
        })
    } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
})

// @desc      Register User
// @route     POST /api/users
// @access    Public
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const {name, email, password} = req.body

    const userExists = await User.findOne({email})

    if (userExists) {
        res.status(400)
        throw new Error('User already exists');
    }

    const user = await User.create({
        name, email, password
    })

    if (user) {
        const token = generateToken(res, user._id)

        res.status(201).send({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: token
        })
    } else {
        res.status(400)
        throw new Error('Invalid user')
    }
})

// @desc      Logout User / clear cookie
// @route     POST /api/users/logout
// @access    Private
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie('jwt')
    res.status(200).send({message: 'Logout successfully'})
})

// @desc      Get User Profile
// @route     GET /api/users/profile
// @access    Public
export const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
    // @ts-ignore:next-line
    const user = await User.findById(req.user._id)
    if (user) {
        res.status(200).send({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    } else {
        res.status(400)
        throw new Error('User not found')
    }
})

// @desc      Update User Profile
// @route     PUT /api/users/profile
// @access    Private
export const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
    // @ts-ignore:next-line
    const user = await User.findById(req.user._id)
    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email

        if (req.body.password) {
            user.password = req.body.password
        }

        const updateUser = await user.save()

        if (user) {
            const token = generateToken(res, user._id)

            res.status(201).send({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: token
            })
        } else {
            res.status(400)
            throw new Error('Invalid user')
        }
    } else {
        res.status(400)
        throw new Error('User not found')
    }
})

// @desc      Get Users
// @route     GET /api/users
// @access    Private/Admin
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await User.find({})

    res.status(200).send(users)
})

// @desc      Delete Users
// @route     DELETE /api/users/:id
// @access    Private/Admin
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id)

    if (user) {
        if (user.isAdmin) {
            res.status(404);
            throw new Error('Cannot delete admin')
        }
        await User.deleteOne({_id: user._id})
        res.status(200).send({message: 'User deleted successfully'})
    } else {
        res.status(404);
        throw new Error('User not found')
    }
})

// @desc      Get Users by ID
// @route     GET /api/users/:id
// @access    Private/Admin
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id).select('-password')

    if (user) {
        res.status(200).send(user)
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc      Update User
// @route     POST /api/users/:id
// @access    Private/Admin
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
    console.log('Request Body:', req.body);
    const user = await User.findById(req.params.id)

    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.isAdmin = req.body.isAdmin || user.isAdmin

        const updatedUser = await user.save()

        console.log('Updated User:', updatedUser);

        res.status(200).send(updatedUser)
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})