gcloud functions deploy menu_service ^
--project my-rest-raurant-2 ^
--gen2 ^
--region=us-central1 ^
--runtime=python312 ^
--source=%~dp0 ^
--entry-point=get_menu ^
--trigger-http ^
--memory 512MB