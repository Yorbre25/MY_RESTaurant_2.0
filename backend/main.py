from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
import uuid
from receive_msg import *
from send_msg import *
from available_services import services
app = Flask(__name__)
CORS(app)

base_url = 'https://us-central1-smart-spark-418815.cloudfunctions.net'

@app.route('/get-reservations', methods=['POST'])
def get_reservations():
    try:
        # Hacer una solicitud GET al servicio de reservas
        response = requests.post(f"{base_url}/reservation-service", json=request.json)
        return jsonify(response.json()), response.status_code

    except Exception as e:
        return jsonify({"message": f"Error: {e}"}), response.status_code

@app.route('/sentiment-api', methods=['POST'])
def sentiment_api():
    try:
        # Hacer una solicitud GET al servicio de sentiment
        response = requests.post(f"{base_url}/Sentiment_Review", json=request.json)
        return jsonify(response.json()), response.status_code

    except Exception as e:
        return jsonify({"message": f"Error: {e}"}), response.status_code

@app.route('/get-recommendation', methods=['POST'])
def get_recommendation():
    try:
        
        request_id=str(uuid.uuid4())
        request_body={
            "dst":services['RECOMMENDATION'].value,
            "src":services['BACKEND'].value,
            "flow_id":request_id
        }
        request_body=request_body | request.json
        publish(request_body,request_body["dst"])
        my_pull=pull_suscriber(services['BACKEND'].value,services['RECOMMENDATION'].value,request_id)
        result_msg=my_pull.listen()

        if(result_msg==None):
            error_msg={
                "msg": "the request has timeout"
            }
            return error_msg, 408, {'Access-Control-Allow-Origin': '*'}
        elif "error" in result_msg:
            return result_msg,result_msg['error'], {'Access-Control-Allow-Origin': '*'}
        else:
            return result_msg,200, {'Access-Control-Allow-Origin': '*'}


    except Exception as e:
        return jsonify({"message": f"Error: {e}"}), 500


@app.route('/get-menu', methods=['GET'])
def get_menu():
    try:
        request_id=str(uuid.uuid4())
        request_body={
            "dst":services['MENU'].value,
            "src":services['BACKEND'].value,
            "flow_id":request_id
        }
        publish(request_body,services['MENU'].value)
        my_pull=pull_suscriber(services['BACKEND'].value,services['MENU'].value,request_id)
        my_message=my_pull.listen()

        
        return jsonify(my_message), 200, {'Access-Control-Allow-Origin': '*'}
    except requests.exceptions.RequestException as e:
        return jsonify({"message": f"Error: {e}"}), 500, {}  # Internal Server Error

@app.route('/')
def index():
    return 'Welcome to the MYRESTaurant Reservation System!'

if __name__ == '__main__':
    app.run(debug=True, port=8080)
