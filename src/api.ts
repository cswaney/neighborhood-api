import * as AWS from 'aws-sdk'
const AWSXRAY = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
const XAWS = AWSXRAY.captureAWS(AWS)

import { Event } from './models/Event'

export class API {

    constructor(
        private readonly client: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly eventsTable = process.env.EVENTS_TABLE,
        private readonly eventsLocationIdIndex = process.env.EVENT_LOCATION_ID_INDEX) {}

    // async createTodo(item: Event): Promise<Event> {
    //     await this.client.put({
    //         TableName: this.table,
    //         Item: item
    //     }).promise()
    //     return item
    // }

    async getEvents(locationId: string): Promise<Event[]> {
        const result = await this.client.query({
            TableName: this.eventsTable,
            IndexName: this.eventsLocationIdIndex,
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
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()
        return result.Items as Event[]
    }

    // async getTodo(userId: string, todoId: string): Promise<Event> {
    //     const result = await this.client.query({
    //         TableName: this.table,
    //         KeyConditionExpression: 'userId = :userId',
    //         ExpressionAttributeValues: {
    //             ':userId': userId
    //         }
    //     }).promise()
    //     return result.Items.filter(todo => todo.todoId == todoId)[0] as Event
    // }

    // async updateTodo(update: Event): Promise<Event> {
    //     const userId = update.userId
    //     const createdAt = update.createdAt
    //     await this.client.update({
    //         TableName: this.table,
    //         Key: {
    //             userId,
    //             createdAt,
    //         },
    //         UpdateExpression: 'set #todo_name = :name, dueDate = :dueDate, done = :done',
    //         ConditionExpression: 'todoId = :todoId',
    //         ExpressionAttributeValues: {
    //             ':todoId': update.todoId,
    //             ':name': update.name,
    //             ':dueDate': update.dueDate,
    //             ':done': update.done
    //         },
    //         ExpressionAttributeNames: {
    //             '#todo_name': 'name'
    //         }
    //     }).promise()
    //     return update
    // }

    // async deleteTodo(item: Event): Promise<Event> {
    //     const userId = item.userId
    //     const createdAt = item.createdAt
    //     await this.client.delete({
    //         TableName: this.table,
    //         Key: {
    //             userId,
    //             createdAt,
    //         },
    //         ConditionExpression: 'todoId = :todoId',
    //         ExpressionAttributeValues: {
    //             ':todoId': item.todoId
    //         }
    //     }).promise()
    //     return item
    // }

}