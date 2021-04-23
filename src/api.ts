import * as AWS from 'aws-sdk'
const AWSXRAY = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
const XAWS = AWSXRAY.captureAWS(AWS)

import { Event } from './models/Event'
import { User } from './models/User'
import { Comment } from './models/Comment'

export class API {

    constructor(
        private readonly client: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly eventsTable = process.env.EVENTS_TABLE,
        private readonly eventLocationIdIndex = process.env.EVENT_LOCATION_ID_INDEX,
        private readonly eventUserIdIndex = process.env.EVENT_USER_ID_INDEX,
        private readonly usersTable = process.env.USERS_TABLE,
        private readonly commentsTable = process.env.COMMENTS_TABLE,
        private readonly commentEventIdIndex = process.env.COMMENT_EVENT_ID_INDEX) {}

    async createEvent(event: Event): Promise<Event> {
        await this.client.put({
            TableName: this.eventsTable,
            Item: event
        }).promise()
        return event
    }

    async deleteEvent(event: Event): Promise<Event> {
        const id = event.id;
        const createdAt = event.createdAt;
        await this.client.delete({
            TableName: this.eventsTable,
            Key: {
                id,
                createdAt,
            }
        }).promise()
        return event
    }

    async getEvent(eventId: string): Promise<Event> {
        const result = await this.client.query({
            TableName: this.eventsTable,
            KeyConditionExpression: 'id = :id',
            ExpressionAttributeValues: {
                ':id': eventId
            }
        }).promise()
        // TODO: check that a single event is returned
        return result.Items[0] as Event
    }

    async getLocationEvents(locationId: string): Promise<Event[]> {
        const result = await this.client.query({
            TableName: this.eventsTable,
            IndexName: this.eventLocationIdIndex,
            KeyConditionExpression: 'locationId = :locationId',
            ExpressionAttributeValues: {
                ':locationId': locationId
            }
        }).promise()
        return result.Items as Event[]
    }

    async getUserEvents(userId: string): Promise<Event[]> {
        const result = await this.client.query({
            TableName: this.eventsTable,
            IndexName: this.eventUserIdIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()
        return result.Items as Event[]
    }

    async createUser(user: User): Promise<User> {
        await this.client.put({
            TableName: this.usersTable,
            Item: user
        }).promise()
        return user
    }

    async getUser(userId: string): Promise<User[]> {
        const result = await this.client.query({
            TableName: this.usersTable,
            KeyConditionExpression: 'id = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()
        return result.Items as User[]
    }

    async createComment(comment: Comment): Promise<Comment> {
        await this.client.put({
            TableName: this.commentsTable,
            Item: comment
        }).promise()
        return comment
    }

    async deleteComment(comment: Comment): Promise<Comment> {
        const id = comment.id;
        const createdAt = comment.createdAt;
        await this.client.delete({
            TableName: this.commentsTable,
            Key: {
                id,
                createdAt,
            }
        }).promise()
        return comment
    }

    async updateComment(update: Comment): Promise<Comment> {
        const id = update.id
        const createdAt = update.createdAt
        await this.client.update({
            TableName: this.commentsTable,
            Key: {
                id,
                createdAt,
            },
            UpdateExpression: 'set updatedAt = :updatedAt, #text = :text',
            // ConditionExpression: 'eventId = :eventId',
            ExpressionAttributeValues: {
                ':updatedAt': update.updatedAt,
                ':text': update.text,
            },
            ExpressionAttributeNames: {
                '#text': 'text'
            }
        }).promise()
        return update
    }

    async getComment(commentId: string): Promise<Comment> {
        const result = await this.client.query({
            TableName: this.commentsTable,
            KeyConditionExpression: 'id = :id',
            ExpressionAttributeValues: {
                ':id': commentId
            }
        }).promise()
        // TODO: check that a single event is returned
        return result.Items[0] as Comment
    }

    async getComments(eventId: string): Promise<Comment[]> {
        const result = await this.client.query({
            TableName: this.commentsTable,
            IndexName: this.commentEventIdIndex,
            KeyConditionExpression: 'eventId = :eventId',
            ExpressionAttributeValues: {
                ':eventId': eventId
            }
        }).promise()
        return result.Items as Comment[]
    }

}