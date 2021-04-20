// import * as uuid from 'uuid'

import { API } from '../../api'
import { Event } from '../../models/Event'

// import { CreateTodoRequest } from '../requests/CreateTodoRequest'
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { parseUserId } from '../../auth/utils'
import { createLogger } from '../../utils/logger'

const api = new API()
const logger = createLogger('http')
// const bucketName = process.env.ATTACHMENTS_S3_BUCKET

// export async function createTodo(token: string, request: CreateTodoRequest): Promise<Event> {
//     const userId = parseUserId(token)
//     const createdAt = new Date().toISOString()
//     const todoId = uuid.v4()
//     logger.info(`Creating an item (userid=${userId})`)
//     const item = await api.createTodo({
//         userId: userId,
//         todoId: todoId,
//         createdAt: createdAt,
//         name: request.name,
//         dueDate: request.dueDate,
//         done: false,
//         attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`
//     })
//     logger.info('Created item', { 'data': item })
//     return item
// }

export async function getEvents(location: string): Promise<Event[]> {
    logger.info(`Getting events (location=${location})`)
    const events = await api.getEvents(location)
    logger.info('Found events', { 'data': events })
    return events
}

export async function getUserEvents(userId: string): Promise<Event[]> {
    logger.info(`Getting events (userId=${userId})`)
    const events = await api.getUserEvents(userId)
    logger.info('Found events', { 'data': events })
    return events
}

// export async function getTodo(todoId: string, token: string): Promise<Event> {
//     const userId = parseUserId(token)
//     return await api.getTodo(userId, todoId)
// }

// export async function updateTodo(todoId: string, request: UpdateTodoRequest, token: string): Promise<Event> {
//     logger.info(`Updating item (todoId=${todoId})`)
//     const userId = parseUserId(token)
//     const item = await api.getTodo(userId, todoId)  // required to get `createdAt` used by update
//     for (let attribute in request) {
//         item[attribute] = request[attribute]
//     }
//     if (item) {
//         logger.info('Found matching item', { 'data': item })
//         return await api.updateTodo(item)
//     } else {
//         logger.info('Unable to find matching item')
//         return item
//     }
// }

// export async function deleteTodo(todoId: string, token: string): Promise<Event> {
//     logger.info(`Deleting item (todoId=${todoId})`)
//     const userId = parseUserId(token)
//     const item = await api.getTodo(userId, todoId)  // required to get `createdAt` used by delete
//     if (item) {
//         logger.info('Found matching item', { 'data': item })
//         return await api.deleteTodo(item)
//     } else {
//         logger.info('Unable to find matching item')
//         return item
//     }
// }
