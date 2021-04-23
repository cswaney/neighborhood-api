import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'

import { CreateCommentRequest } from '../../requests/CreateCommentRequest'
// import { getAuthToken } from '../utils'
import { createComment } from './wrappers'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const request: CreateCommentRequest = JSON.parse(event.body)
    // const token = getAuthToken(event)
    const comment = await createComment(request)

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            event: comment,
        })
    }
}