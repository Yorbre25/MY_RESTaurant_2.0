gcloud functions deploy recommendation-services \
--project my-rest-raurant-2 \
--gen2 \
--region=us-central1 \
--runtime=python312 \
--source=$(dirname "$0") \
--entry-point=recommendations \
--trigger-http \
--memory 1024MB \
--no-allow-unauthenticated
