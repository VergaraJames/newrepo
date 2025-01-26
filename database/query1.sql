-- Step 1
-- Insert the following new record to the account table Note: 
-- The account_id and account_type fields should handle their own values 
-- and do not need to be part of this query.:

INSERT INTO public.account(
	account_firstname, account_lastname, account_email, account_password, account_type)
	VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n', 'Employee');