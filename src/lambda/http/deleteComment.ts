import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'

// import { getAuthToken } from '../utils'
import { deleteComment } from './wrappers'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    // const token = getAuthToken(event)
    const commentId = event.pathParameters.commentId
    const deletedComment = await deleteComment(commentId)

    if (deletedComment) {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                comment: deletedComment
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
                comment: {}
            })
        }
    }
}
