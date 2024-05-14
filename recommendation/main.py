import functions_framework
from models import Meal
from pydantic import ValidationError
from suggestion import get_predefined_recom
import json
from send_msg import publish
import base64  

return_info=None

@functions_framework.errorhandler(AssertionError) #to check Post method
def handle_assertion_error(e):
    body={
        "msg":"Method not allowed"
    }
    publish_error_response(body,405)
    return body, 405

@functions_framework.errorhandler(KeyError) #"Check json input structure. The json should have a meal object a a recommmendation_of's list of string"
def handle_key_error(e):
    body={
        "msg": "Bad request the json must hava a meal and a recommendation of keys. The meal must have the fields: main_dish,drink and dessert"
    }
    publish_error_response(body,400)
    return body, 400

@functions_framework.errorhandler(ValidationError) #"Checks the meal object type and the type of recommedation of"
def handle_validation_error(e):
    body={
        "msg":"Bad request the wrong type for either meal for recommendation_of"
    }
    publish_error_response(body,400)
    return body , 400

@functions_framework.errorhandler(ValueError) #"If the main_dish/drink/dessert or type of item does not exist in the database"
def handle_value_error(e):
    body={
        "msg":str(e)
    }
    publish_error_response(body,400)
    return body, 400

@functions_framework.errorhandler(TypeError) #"If the main_dish/drink/dessert or type of item does not exist in the database"
def handle_type_error(e):
    body= {
        "msg": "The item selected its not in the database"
    }
    publish_error_response(body,400)
    return body, 400

def publish_error_response(body,error):
  body['error']=error
  if(return_info is not None):
    body=body | return_info
    publish(body,return_info['dst'])
  


@functions_framework.http
def recommendations(request):

    assert request.method == "POST" #checking that the only method used is POST

    
    global return_info
    request_json = request.get_json(silent=True)
    message_data = base64.b64decode(request_json['message']['data']).decode('utf-8')
    message = json.loads(message_data)

    return_info={
      "src":message['dst'],
      "dst":message['src'],
      "flow_id":message['flow_id']
    }

    

    meal,recommedation_of=process_input(message)
    suggestion=get_predefined_recom(meal,recommedation_of)
    suggestion_text_json=suggestion.json()
    suggestion_json=json.loads(suggestion_text_json)
    publish_error_response(suggestion_json,200)

    
    return suggestion_text_json,200

def process_input(request_json):
    meal_json=request_json['meal']
    meal = Meal(main_dish=meal_json["main_dish"], drink=meal_json["drink"],dessert=meal_json["dessert"])
    recommedation_of=request_json['recommendation_of']
    if(type(recommedation_of) != list):
        raise ValidationError()
    return meal,recommedation_of

