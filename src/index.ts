import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { Request, Response } from 'express'
import { db } from './database/knex'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.listen(Number(process.env.PORT) || 3003, () => {
    console.log(`Servidor rodando na porta ${Number(process.env.PORT) || 3003}`)
})


app.get("/students", async (req: Request, res: Response) => {
    try {
        const searchTerm = req.query.q as string | undefined

        if (searchTerm === undefined) {
            const result = await db("students")
            res.status(200).send(result)
        } else {
            const result = await db("students").where("name", "LIKE", `%${searchTerm}%`)
            res.status(200).send(result)
        }
		
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.post("/students", async (req: Request, res: Response) => {
    try {
        const {id, name, age, semester1, semester2, professor, room_number} = req.body

        if (typeof id !== "string"){
            res.status(400)
            throw new Error("id deve ser string")
        }

		if (typeof name !== "string"){
            res.status(400)
            throw new Error("name deve ser string")
        }

        if (typeof professor !== "string"){
            res.status(400)
            throw new Error("professor deve ser string")
        }

        if (typeof age !== "number"){
            res.status(400)
            throw new Error("age deve ser number")
        }

        if (typeof semester1 !== "number"){
            res.status(400)
            throw new Error("semester1 deve number")
        }

        if (typeof semester2 !== "number"){
            res.status(400)
            throw new Error("semester2 deve number")
        }

        if (typeof room_number !== "number"){
            res.status(400)
            throw new Error("room_number deve number")
        }

        const [ studentIdAlreadyExists ] = await db("students").where({ id })

        if(studentIdAlreadyExists) {
            res.status(400)
            throw new Error("'id' já existe" )
        }

        const [ studentNameAlreadyExists ] = await db("students").where({ name })

        if(studentNameAlreadyExists) {
            res.status(400)
            throw new Error("'name' já existe" )
        }

        const newStudent = {
            id,
            name,
            age, 
            semester1, 
            semester2, 
            professor, 
            room_number
        }

        await db("students").insert(newStudent)

        res.status(201).send({ 
            message: "Student cadastrado com sucesso",
            student: newStudent
        })

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.put("/students/:id", async (req: Request, res: Response) => {
    try {
        const idToEdit = req.params.id

        const newName = req.body.name
        const newAge = req.body.age
        const newSemester1 = req.body.semester1
        const newSemester2 = req.body.semester2
        const newProfessor = req.body.professor
        const newRoomNumber = req.body.room_number

        if(newName !== undefined) {
            if (typeof newName !== "string"){
                res.status(400)
                throw new Error("name deve ser string")
            }
        }

        if(newAge !== undefined) {
            if (typeof newAge !== "number"){
                res.status(400)
                throw new Error("age deve ser number")
            }
        }
        
        if(newProfessor !== undefined) {
            if (typeof newProfessor !== "string"){
                res.status(400)
                throw new Error("professor deve ser string")
            }  
        }

        if(newSemester1 !== undefined) {
            if (typeof newSemester1 !== "number"){
                res.status(400)
                throw new Error("semester1 deve number")
            }
        }

        if(newSemester2 !== undefined) {
            if (typeof newSemester2 !== "number"){
                res.status(400)
                throw new Error("semester2 deve number")
            }
        }
        if(newRoomNumber !== undefined) {
            if (typeof newRoomNumber !== "number"){
                res.status(400)
                throw new Error("room_number deve number")
            }
        }

        const [ student ] = await db("students").where({ id: idToEdit })

        if(!student) {
            res.status(400)
            throw new Error("'id' não encontrado")
        }

        const newStudent = {
            name: newName || student.name,
            age: newAge || student.age, 
            semester1: newSemester1 || student.semester1, 
            semester2: newSemester2 || student.semester2, 
            professor: newProfessor || student.professor, 
            room_number: newRoomNumber || student.room_number
        }

        await db("students").insert(newStudent).where({ id: idToEdit})

        res.status(200).send({
            message: "Student editado com sucesso",
            student: newStudent
        })

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.delete("/students/:id", async (req: Request, res: Response) => {
    try {
       const idToDelete = req.params.id
       
       const [ studentAlreadyExists ] = await db("students").where({ id: idToDelete })

       if (!studentAlreadyExists) {
        res.status(400)
        throw new Error("'id' não encontrado")
       }

       await db("students").del().where({ id: idToDelete })
       
       res.status(200).send({ message: "Student deletado com sucesso"})

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})