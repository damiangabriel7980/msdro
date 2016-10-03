/**
 * @apiDefine admin Only users with admin rights can access this route
 */
/**
 * @apiDefine medic Only users with medic rights can access this route
 *
 */
/**
 * @apiDefine devModeMedic In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with medic rights)
 *
 */
/**
 * @apiDefine devModeAdmin In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with admin rights)
 *
 */
/**
 * @apiDefine streamAdmin Only users with streamAdmin rights can access this route
 */
/**
 * @apiDefine None Any user can access this route
 */
/**
 * @apiDefine HeaderAuthorization A token is necessary in order to access this route
 * @apiHeader {String} Bearer a Bearer token included in "Authorization" HTTP Header
 */
/**
 * @apiDefine ErrorOnServer
 * @apiError (Error 500) {Object} ServerError The requested operation could not be executed
 */
/**
 * @apiDefine BadRequest
 * @apiError (Error 4xx) {Object} BadRequest Error - Bad request
 */
/**
 * @apiDefine EntityNotFound
 * @apiError (Error 4xx) {Object} EntityNotFound Error - Entity not found
 */
/**
 * @apiDefine AccessForbidden
 * @apiError (Error 4xx) {Object} AccessForbidden Error - Access is forbidden
 */