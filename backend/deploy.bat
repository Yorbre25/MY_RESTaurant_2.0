gcloud run deploy backend ^
--source=%~dp0 ^
--region=us-central1 ^
--memory 2Gi ^
--min-instances=1 ^
--max-instances=100 ^
--cpu=4
