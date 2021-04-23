import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'

import { CreateUserRequest } from '../../requests/CreateUserRequest'
// import { getAuthToken } from '../utils'
import { createUser } from './wrappers'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const request: CreateUserRequest = JSON.parse(event.body)
    // const token = getAuthToken(event)
    const user = await createUser(request)

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            user: user,
        })
    }
}