
-- Step 6
-- Update all records in the inventory table to add "/vehicles" to the middle of the file path in 
-- the inv_image and inv_thumbnail columns using a single query.

UPDATE public.inventory
SET inv_image = REPLACE (inv_image, '/images/', 'https://raw.githubusercontent.com/VergaraJames/newrepo/main/public/images/site/' ),
    inv_thumbnail = REPLACE (inv_image, '/images/', 'https://raw.githubusercontent.com/VergaraJames/newrepo/main/public/images/site/' );

