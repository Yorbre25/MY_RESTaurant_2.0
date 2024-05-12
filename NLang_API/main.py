import functions_framework
from sentiments_model_retriever import predict_text_sentiment_analysis_sample
from scale_messages import get_scales_message
from send_msg import publish
import base64
import json

return_info=None
@functions_framework.errorhandler(KeyError)
def handle_key_error(e):
    response={
        'msg':str(e)
    }
    publish_response(response,400)
    return response, 400

@functions_framework.errorhandler(AssertionError)
def handle_assertion_error(e):
    response={
        'msg': "Method not allowed"
    }
    publish_response(response,405)
    return response, 405

def publish_response(body,error):
  body['error']=error
  if (return_info is not None):
    body=body | return_info
    publish(body,return_info['dst'])
  

@functions_framework.http
def sentiment_api(request):

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

    
    param='review'

    if message and param in message: # get review parameter from body
        review = message[param]
    else: 
        raise KeyError("Bad Request: the requested parameters were no send") #if the needed keys are not in the request
    
    if(type(review)!=str):
        raise KeyError("The review value must be a string") #wrong key type

    try:
        sentiment_json= predict_text_sentiment_analysis_sample(content=review) # make the request to the sentiment analysis model

        sentiment_scale=sentiment_json['sentiment']
        sentiment_msg=get_scales_message(sentiment_scale) #getting the message related to the value on the scale

        response = { #building the reponse 
            "scale": sentiment_scale,
            "msg"  : sentiment_msg
        }
    except:
        response = { #building the reponse 
            "scale": 0,
            "msg"  : "no valid review message, please review your message"
        }
    publish_response(response,200)
    return response,200
