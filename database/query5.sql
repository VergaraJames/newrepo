SELECT i.inv_make, i.inv_model, c.classification_name
FROM public.inventory i INNER JOIN public.classification c 
ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';