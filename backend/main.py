from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
import uuid
from receive_msg import *
from send_msg import *
from available_services import services
import logging
from requester import http_request
app = Flask(__name__)
CORS(app)
service_key="BACKEND"

base_url = 'https://us-central1-my-rest-raurant-2.cloudfunctions.net/recommendation-services'

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
        body,error_code,CORS=send_msg(request.json,'SENTIMENT_REVIEW')
        return body,error_code,CORS
    except Exception as e:
        return jsonify({"message": f"Error: {e}"}), 500

@app.route('/get-recommendation', methods=['POST'])
def get_recommendation():
    try:
        print("la request es")
        print(request.json)
        response=http_request(base_url,"POST",request.json)
        body=json.loads(response.read())
        error_code=response.code
        #body,error_code,CORS=send_msg(request.json,'RECOMMENDATION')
        return body,error_code
    except Exception as e:
        return jsonify({"message": f"Error: {e}"}), 500


@app.route('/get-menu', methods=['GET'])
def get_menu():
    try:
        body,error_code,CORS=send_msg({},'MENU')
        return body,error_code,CORS

    except requests.exceptions.RequestException as e:
        return jsonify({"message": f"Error: {e}"}), 500, {}  # Internal Server Error

@app.route('/')
def index():
    return 'Welcome to the MYRESTaurant Reservation System!'


def send_msg(body,destiny_key):
            
    request_id=str(uuid.uuid4())
    request_body={
        "dst":services[destiny_key].value,
        "src":services[service_key].value,
        "flow_id":request_id
    }
    request_body=request_body | body
    print("full body")
    print(request_body)
    publish(request_body,request_body["dst"])
    my_pull=pull_suscriber(services[service_key].value,services[destiny_key].value,request_id)
    my_pull.listen()
    body,error_code,CORS=my_pull.get_response()
    print("my response body is")
    return body,error_code,CORS


if __name__ == '__main__':
    app.run(debug=True, port=8080)
