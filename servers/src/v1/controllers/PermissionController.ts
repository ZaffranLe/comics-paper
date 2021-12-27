import { Tables } from './../Database';
import DatabaseBuilder from "../utils/DatabaseBuilder"

async function hasPermission(id: number) {
  DatabaseBuilder(Tables.PermissionGroup).select({id})
}


export const PermissionController = {

}