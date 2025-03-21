const pool = require("../database/")
const { check } = require("express-validator")

/* *****************************
*   Register new account
*   From guide https://blainerobertson.github.io/340-js/views/account-process-register.html
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = `INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) 
      VALUES 
      ($1, 
        $2, 
        $3, 
        $4, 'Client') 
        RETURNING *`
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}

/* **********************
*   Check for existing email
* ********************* */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Get account by email
* Return account data using email address
* from video https://www.youtube.com/watch?v=vqCWUqt8heQ
* Unit 5, Login Activity
* *************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

async function getAccountById(account_id) {
  try {
    const result = await pool.query('SELECT account_firstname, account_lastname, account_email, account_id, account_type FROM account WHERE account_id = $1', [account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}
module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, getAccountById}