import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'

import { UpdateCommentRequest } from '../../requests/UpdateCommentRequest'
// import { getAuthToken } from '../utils'
import { updateComment } from './wrappers'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const commentId = event.pathParameters.commentId
    const request: UpdateCommentRequest = JSON.parse(event.body)
    // const token = getAuthToken(event)
    const comment = await updateComment(commentId, request)

    if (comment) {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                comment: comment
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
                comment: comment
            })
        }
    }
}
