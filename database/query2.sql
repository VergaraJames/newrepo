
-- Step 2
-- Modify the Tony Stark record to change the account_type to "Admin".
UPDATE public.account
	SET account_type='Admin'
	WHERE account_firstname='Tony' AND account_lastname='Stark';