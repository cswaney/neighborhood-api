import * as uuid from 'uuid'

import { API } from '../../api'
import { Event } from '../../models/Event'
import { User } from '../../models/User'
import { Comment } from '../../models/Comment'

import { CreateEventRequest } from '../../requests/CreateEventRequest'
import { CreateCommentRequest } from '../../requests/CreateCommentRequest'
import { UpdateCommentRequest } from '../../requests/UpdateCommentRequest'
// import { parseUserId } from '../../auth/utils'
import { createLogger } from '../../utils/logger'

const api = new API()
const logger = createLogger('http')
const bucketName = process.env.ATTACHMENTS_S3_BUCKET

export async function createEvent(request: CreateEventRequest): Promise<Event> {
    const id = uuid.v4()
    const createdAt = new Date().toISOString()
    logger.info(`Creating an event (userid=${request.userId})`)
    const event = await api.createEvent({
        id: id,
        createdAt: createdAt,
        name: request.name,
        description: request.description,
        locationId: request.locationId,
        locationName: request.locationName,
        address: request.address,
        date: request.date,
        userId: request.userId,
        attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${id}`
    })
    logger.info('Created event', { 'data': event })
    return event
}

export async function deleteEvent(eventId: string): Promise<Event> {
    logger.info(`Deleting item (eventId=${eventId})`);
    const event = await api.getEvent(eventId)  // required to get `createdAt` used by delete
    if (event) {
        logger.info('Found matching event', { 'data': event })
        return await api.deleteEvent(event)
    } else {
        logger.info('Unable to find matching event')
        return event
    }
}

export async function getLocationEvents(locationId: string): Promise<Event[]> {
    logger.info(`Getting events (locationId=${locationId})`)
    const events = await api.getLocationEvents(locationId)
    logger.info('Found events', { 'data': events })
    return events
}

export async function getUserEvents(userId: string): Promise<Event[]> {
    logger.info(`Getting events (userId=${userId})`)
    const events = await api.getUserEvents(userId)
    logger.info('Found events', { 'data': events })
    return events
}

export async function getUser(userId: string): Promise<User[]> {
    logger.info(`Getting user info (userId=${userId})`)
    const info = await api.getUser(userId)
    logger.info('Found info', { 'data': info })
    return info
}

export async function createComment(request: CreateCommentRequest): Promise<Comment> {
    const id = uuid.v4()
    const createdAt = new Date().toISOString()
    logger.info(`Creating a comment (userId=${request.userId}), eventId=${request.eventId}`)
    const comment = await api.createComment({
        id: id,
        createdAt: createdAt,
        updatedAt: createdAt,
        eventId: request.eventId,
        userId: request.userId,
        userName: request.userName,
        text: request.text,
        avatarUrl: request.avatarUrl
    })
    logger.info('Created comment', { 'data': comment })
    return comment
}

export async function deleteComment(commentId: string): Promise<Comment> {
    logger.info(`Deleting comment (commentId=${commentId})`);
    const comment = await api.getComment(commentId)  // required to get `createdAt` used by delete
    if (comment) {
        logger.info('Found matching comment', { 'data': comment })
        return await api.deleteComment(comment)
    } else {
        logger.info('Unable to find matching comment')
        return comment
    }
}

export async function updateComment(commentId: string, request: UpdateCommentRequest): Promise<Comment> {
    logger.info(`Updating comment (commentId=${commentId})`);
    const comment = await api.getComment(commentId)  // required to get `createdAt` used by delete
    if (comment) {
        logger.info('Found matching comment', { 'data': comment })
        comment.text = request.text
        return await api.updateComment(comment)
    } else {
        logger.info('Unable to find matching comment')
        return comment
    }
}

export async function getComments(eventId: string): Promise<Comment[]> {
    logger.info(`Getting events (eventId=${eventId})`)
    const comments = await api.getComments(eventId)
    logger.info('Found comments', { 'data': comments })
    return comments
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