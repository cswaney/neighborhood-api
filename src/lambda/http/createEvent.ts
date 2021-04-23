import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'

import { CreateEventRequest } from '../../requests/CreateEventRequest'
// import { getAuthToken } from '../utils'
import { createEvent } from './wrappers'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const request: CreateEventRequest = JSON.parse(event.body)
    // const token = getAuthToken(event)
    const response = await createEvent(request)
    const newEvent = response[0];
    const signedUrl = response[1];
    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            event: newEvent,
            signedUrl: signedUrl
        })
    }
}