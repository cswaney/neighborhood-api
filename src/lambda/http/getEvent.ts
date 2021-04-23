import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import 'source-map-support/register'

// import { getAuthToken } from '../utils'
import { getEvent } from './wrappers'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    // const token = getAuthToken(event)
    const eventId = event.pathParameters.eventId
    const info = await getEvent(eventId)

    // TODO: check if there was a result...

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            event: info
        })
    }
}