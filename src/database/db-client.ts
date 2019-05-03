import MongoClient from "./mongo-client"
import NedbClient from "./nedb-client"
import logger from "../utilities/logger";

let dbClient: IDbClient

export default function getDbClient(): IDbClient
{
    if (!dbClient)
        throw new Error("Database client not initialized!")
    return dbClient
}

export interface IDbClient
{
    updateOne(collectionName: string, query: any, update: any): Promise<void>
    insertOne(collectionName: string, record: any): Promise<void>
    replaceOne(collectionName: string, query: any, record: any): Promise<void>
    findOne(collectionName: string, query: any): Promise<any>
    deleteOne(collectionName: string, query: any): Promise<void>
    isMongo: boolean
}

export function initializeDb(connectionString: string)
{
    let protocol = connectionString.match(/^.+:\/\//)![0]

    if (protocol)
    {
        switch (protocol)
        {
            case "mongodb://":
                dbClient = new MongoClient(connectionString)
                break
            case "nedb://":
                dbClient = new NedbClient(connectionString)
                break
        }
        logger.consoleLog(`Using database protocol ${protocol}`)
    }
    else
        throw new Error("Invalid connection string")
}