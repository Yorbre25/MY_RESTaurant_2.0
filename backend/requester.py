import json
import base64
import google.auth
import google.auth.transport.requests
import urllib.request
import google.auth.transport.requests
import google.oauth2.id_token

url="https://us-central1-my-rest-raurant-2.cloudfunctions.net/recommendation-services"
def http_request(endpoint,method,payload):
    """
    make_authorized_post_request makes a POST request to the specified HTTP endpoint
    by authenticating with the ID token obtained from the google-auth client library
    using the specified audience value.
    """

    req = urllib.request.Request(endpoint, method=method)

    auth_req = google.auth.transport.requests.Request()
    id_token = google.oauth2.id_token.fetch_id_token(auth_req, endpoint)

    req.add_header("Authorization", f"Bearer {id_token}")
    req.add_header("Content-Type", "application/json")  # Assuming JSON payload

    destiny_json={
    "src": "",
    "dst": "",
    "flow_id":""
    }
    payload= payload | destiny_json
     
    # Convert payload to JSON string
    payload_json = json.dumps(payload)

    # Encode JSON string to bytes and then Base64
    encoded_payload_bytes = base64.b64encode(payload_json.encode("utf-8"))

    # Create the final message object
    message = {"data": encoded_payload_bytes.decode("utf-8")}

    # Create the outer dictionary with the message key
    final_payload = {"message": message}

    # Convert final payload to JSON string
    final_payload_json = json.dumps(final_payload)

    # Encode the payload data if provided
    if method!="GET":
        payload_bytes =final_payload_json.encode('utf-8')
        req.add_header("Content-Length", len(payload_bytes))
        req.data = payload_bytes
    try:
        response = urllib.request.urlopen(req)
    except urllib.error.HTTPError as e:
        response = e


    return response