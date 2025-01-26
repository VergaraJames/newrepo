UPDATE
   public.inventory
SET
  inv_description = REPLACE(inv_description, 'the small interiors', ' a huge interior')
WHERE
  inv_make = 'GM' AND inv_model= 'Hummer';