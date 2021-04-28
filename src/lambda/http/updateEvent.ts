import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'

import { UpdateEventRequest } from '../../requests/UpdateEventRequest'
// import { getAuthToken } from '../utils'
import { updateEvent } from './wrappers'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const eventId = event.pathParameters.eventId
    const request: UpdateEventRequest = JSON.parse(event.body)
    // const token = getAuthToken(event)
    const updatedEvent = await updateEvent(eventId, request)

    if (updatedEvent) {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                event: updatedEvent
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
                event: updatedEvent
            })
        }
    }
}
