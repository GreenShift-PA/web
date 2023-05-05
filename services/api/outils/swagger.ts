import {Express, Request, Response} from 'express'
import * as swaggerJsDoc from 'swagger-jsdoc'
import * as swaggerUi from 'swagger-ui-express'
import {version} from '../package.json'


const options: swaggerJsDoc.Options = {
    definition:{
        openapi: "3.0.0",
        info: {
            title: 'GreenShift API - Web',
            version
        }, 
        components:{
            securirySchemas:{
                bearerAuth:{
                    type: "http",
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis:["./controller/*.ts", "./index.ts"] // The path where the routes will be created 
}

const swaggerSpec = swaggerJsDoc(options)

const swaggerDocs = (app: Express) =>{
    // Swagger page 
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

    // Docs in JSON format
    app.get('docs.json', (req: Request, res:Response) => {
        res.setHeader('Content-Type', 'application/json')
        res.send(swaggerSpec)
    })
    
}

export default swaggerDocs