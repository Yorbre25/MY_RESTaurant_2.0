import uuid
from send_msg import publish
from receive_msg import pull_suscriber
import json
import base64
import google.auth
import google.auth.transport.requests
import urllib.request
import google.auth.transport.requests
import google.oauth2.id_token

url="https://us-central1-my-rest-raurant-2.cloudfunctions.net/menu_service"
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


def request_restaurant_menu():
    request_id=str(uuid.uuid4())
    request_body={
        "dst":"menu_service",
        "src":"recommendation",
        "flow_id":request_id
    }
    '''
    publish(request_body,request_body['dst'])
    my_pull=pull_suscriber(request_body['src'],request_body['dst'],request_id)
    my_pull.listen()
    '''
    response=http_request(url,"POST",request_body)
    error_code=response.code
    body=json.loads(response.read())
    print("el body es")
    print(body)
    #body,error_code,CORS=my_pull.get_response()
    

    return body,error_code

def build_format(menu_json):
    main_dishes=menu_json["main_dishes"]
    drinks=menu_json["drinks"]
    desserts=menu_json["desserts"]
    formated_menu=[]
    for i in range(len(main_dishes)):
        meal={
            "main_dish":main_dishes[i],
            "drink":drinks[i],
            "dessert":desserts[i]
        }
        formated_menu.append(meal)
    return formated_menu

def get_menu():
    menu,status_code=request_restaurant_menu()
    if(status_code!=200):
        return []
    formatted_menu=build_format(menu)
    return formatted_menu
