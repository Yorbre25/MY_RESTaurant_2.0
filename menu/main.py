import functions_framework
import logging
from menu import get_restaurant_menu
from send_msg import publish
import base64
import json

@functions_framework.errorhandler(AssertionError)
def handle_assertion_error(e):
    body={
        "msg":"Method not allowed"
    }
    return body, 200


@functions_framework.http
def get_menu(request):
    assert request.method == "POST" #checking that the only method used is GET
    request_json = request.get_json(silent=True)
    menu_json=get_restaurant_menu()
    logging.basicConfig(level=logging.INFO) 
    logging.info(msg="llegue al metodo")
    message_data = base64.b64decode(request_json['message']['data']).decode('utf-8')
    message = json.loads(message_data)
    logging.info(msg=str(message))
    destiny_data={
        "src":message['dst'],
        "dst":message['src'],
        "flow_id":message['flow_id']
    }
    response_data= destiny_data | menu_json
    publish(response_data,destiny_data['dst'])
    
    
    return menu_json,200


    