import functions_framework
import logging
from menu import get_restaurant_menu
from send_msg import publish
import base64
import json

return_info=None
@functions_framework.errorhandler(AssertionError)
def handle_assertion_error(e):
    body={
        "msg":"Method not allowed"
    }
    publish_response(body,405)
    return body, 405

@functions_framework.errorhandler(KeyError)
def handle_assertion_error(e):
    body={
        "msg":"Wrong format in json input"
    }
    publish_response(body,400)
    return body, 400

def publish_response(body,error):
  body['error']=error
  if (return_info is not None):
    body=body | return_info
    publish(body,return_info['dst'])

@functions_framework.http
def get_menu(request):
    global return_info
    assert request.method == "POST" #checking that the only method used is POST
    request_json = request.get_json(silent=True)
    menu_json=get_restaurant_menu()
    message_data = base64.b64decode(request_json['message']['data']).decode('utf-8')
    message = json.loads(message_data)
    return_info={
        "src":message['dst'],
        "dst":message['src'],
        "flow_id":message['flow_id']
    }

    publish_response(menu_json,200)
    
    
    return menu_json,200


    