import { Router } from 'express';

import { createUser } from '../controllers/Account/user';

const webhook = Router();

/**
 * @route POST /webhook/add_user
 * @description Create a new user in Database which is retrieved from Clerk
 * @access public
 */
webhook.post('/add_user', createUser);

export default webhook;
