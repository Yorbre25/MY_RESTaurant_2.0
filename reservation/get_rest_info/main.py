import pymysql
import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import date, datetime

app = Flask(__name__)
CORS(app)

# Custom JSON encoder to handle date and datetime objects
class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, (date, datetime)):
            return obj.isoformat()
        return json.JSONEncoder.default(self, obj)

def get_infoRest_aux():
    # Configuración de la conexión a la base de datos
    connection_name = "my-rest-raurant-2:us-central1:myrestdb"
    db_user = "usuario"
    db_password = "contra"
    db_name = "restaurant_reservations"
    
    # Usamos pymysql para conectar a Cloud SQL
    conn = pymysql.connect(unix_socket=f'/cloudsql/{connection_name}', user=db_user, password=db_password, database=db_name,cursorclass=pymysql.cursors.DictCursor)
    
    try:
        with conn.cursor() as cursor:
            # Insertamos la nueva reserva
            sql = "SELECT * from restaurant_info where restID = 1"
            cursor.execute(sql)
            rest_info = cursor.fetchone()

            response = jsonify(rest_info)
            return json.dumps(response, indent=4, sort_keys=True, cls=CustomJSONEncoder), 200, {'Access-Control-Allow-Origin': '*'}
    except Exception as e:
        return jsonify("Message:", str(e)), 500
    finally:
        conn.close()

@app.route('/get_infoRest', methods=['GET'])
def get_infoRest(request):
    
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, Accept, X-Requested-With, Content-Type, Authorization',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Max-Age': '3600',
        }
        return ('', 204, headers)    
    return get_infoRest_aux()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
