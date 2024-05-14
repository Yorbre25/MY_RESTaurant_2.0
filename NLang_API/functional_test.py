import unittest

import google.auth
import google.auth.transport.requests
import requests

import urllib.request
import google.auth.transport.requests
import google.oauth2.id_token
import json
import base64

url="https://us-central1-my-rest-raurant-2.cloudfunctions.net/sentiment_analysis"
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


class TestStringMethods(unittest.TestCase):

    def test_wrong_method(self): #checks that the GET method fails
        response=http_request(url,"GET",{})
        self.assertEqual(response.code, 405)
    
    def test_missing_key(self): #checks the output result
        request_body={
            
        }
        response=http_request(url,"POST",request_body)
        self.assertEqual(response.code,400)

    def test_wrong_key_type(self): #checks the output result
        request_body={
            "review": [], #wrong type
            }
        response=http_request(url,"POST",request_body)
        self.assertEqual(response.code,400)

    def test_empty_message(self): #checks the output result
        request_body={
            "review": "", #empty message
            }
        response=http_request(url,"POST",request_body)
        self.assertEqual(response.code,200)
        response_json=json.loads(response.read())
        self.assertEqual(response_json['scale'],0) #scale 0
        self.assertEqual(response_json['msg'],"no valid review message, please review your message") # msg no valid

    def test_very_possitive_msg(self):
        request_body={
            "review": "I loved the food. The pasta was really amazing and the wait was quite short. I will come back as soon as I can", #Very possitive message
            }
        response=http_request(url,"POST",request_body)
        self.assertEqual(response.code,200)

        response_json=json.loads(response.read())
        self.assertEqual(response_json['scale'],4)

    def test_very_negative_msg(self):
        request_body={
            "review": "The worse, the food was awful and the wait was too long", #Very negative message
            }
        response=http_request(url,"POST",request_body)

        self.assertEqual(response.code,200)

        response_json=json.loads(response.read())
        self.assertEqual(response_json['scale'],0)
    
    
if __name__ == '__main__':
    unittest.main()