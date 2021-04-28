import * as uuid from 'uuid'

import { API } from '../../api'
import { Event } from '../../models/Event'
import { User } from '../../models/User'
import { Comment } from '../../models/Comment'

import { CreateEventRequest } from '../../requests/CreateEventRequest'
import { UpdateEventRequest } from '../../requests/UpdateEventRequest'
import { CreateCommentRequest } from '../../requests/CreateCommentRequest'
import { UpdateCommentRequest } from '../../requests/UpdateCommentRequest'
import { CreateUserRequest } from '../../requests/CreateUserRequest'
import { UpdateUserRequest } from '../../requests/UpdateUserRequest'
// import { parseUserId } from '../../auth/utils'
import { createLogger } from '../../utils/logger'

const api = new API()
const logger = createLogger('http')
const bucketName = process.env.ATTACHMENTS_S3_BUCKET

export async function createEvent(request: CreateEventRequest): Promise<[Event, string]> {
    const id = uuid.v4()
    const createdAt = new Date().toISOString()
    logger.info(`Creating an event (userid=${request.userId})`)
    const response = await api.createEvent({
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
    const event = response[0];
    const signedUrl = response[1];
    logger.info('Created event', { 'data': event })
    return [event, signedUrl]
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

export async function getEvent(eventId: string): Promise<Event> {
    logger.info(`Getting event (eventId=${eventId})`)
    const event = await api.getEvent(eventId)
    logger.info('Found event', { 'data': event })
    return event
}

export async function updateEvent(eventId: string, request: UpdateEventRequest): Promise<Event> {
    logger.info(`Updating event (eventId=${eventId})`);
    const event = await api.getEvent(eventId)
    if (event) {
        logger.info('Found matching event', { 'data': event })
        event.name = request.name
        event.description = request.description
        event.address = request.address
        event.date = request.date
        return await api.updateEvent(event)
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

export async function createUser(request: CreateUserRequest): Promise<[User, string]> {
    const createdAt = new Date().toISOString()
    logger.info(`Creating a user (userid=${request.id})`)
    const response = await api.createUser({
        id: request.id,
        createdAt: createdAt,
        name: request.name,
        locationId: request.locationId,
        locationName: request.locationName,
        avatarUrl: `https://${bucketName}.s3.amazonaws.com/${request.id}`
    })
    const user = response[0];
    const signedUrl = response[1];
    logger.info('Created user', { 'data': user })
    return [user, signedUrl]
}

export async function updateUser(userId: string, request: UpdateUserRequest): Promise<User> {
    logger.info(`Updating user (userId=${userId})`);
    const user = await api.getUser(userId)
    if (user) {
        logger.info('Found matching user', { 'data': user })
        user.locationId = request.locationId
        user.locationName = request.locationName
        user.name = request.name
        user.avatarUrl = request.avatarUrl
        return await api.updateUser(user)
    } else {
        logger.info('Unable to find matching user')
        return user
    }
}

export async function getUser(userId: string): Promise<User> {
    logger.info(`Getting user (userId=${userId})`)
    const user = await api.getUser(userId)
    logger.info('Found user', { 'data': user })
    return user
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
