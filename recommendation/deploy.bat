gcloud functions deploy recommendation-service ^
--project my-rest-raurant-2 ^
--gen2 ^
--region=us-central1 ^
--runtime=python312 ^
--source=%~dp0 ^
--entry-point=recommendations ^
--trigger-http ^
--memory 512MB ^
--no-allow-unauthenticated