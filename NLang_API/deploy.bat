gcloud functions deploy sentiment_analysis ^
--project my-rest-raurant-2 ^
--gen2 ^
--region=us-central1 ^
--runtime=python312 ^
--source=%~dp0 ^
--entry-point=sentiment_api ^
--trigger-http ^
--memory 1024MB ^
--no-allow-unauthenticated