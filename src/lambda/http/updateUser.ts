import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'

import { UpdateUserRequest } from '../../requests/UpdateUserRequest'
// import { getAuthToken } from '../utils'
import { updateUser } from './wrappers'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const userId = event.pathParameters.userId
    const request: UpdateUserRequest = JSON.parse(event.body)
    // const token = getAuthToken(event)
    const user = await updateUser(userId, request)

    if (user) {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                user: user
            })
        }
    } else {
        return {
            statusCode: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                user: user
            })
        }
    }
}
