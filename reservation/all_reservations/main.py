import pymysql
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def extraer_reserva_aux():
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
            sql = "SELECT * from reservations"
            cursor.execute(sql)
            reservations = cursor.fetchall()
            for res in reservations:
                 res['Time'] = str(res['Time'])
                 res['Date'] = res['Date'].strftime('%Y-%m-%d')
            response = jsonify(reservations)
            return response, 200, {'Access-Control-Allow-Origin': '*'}
    except Exception as e:
        return jsonify("Message:", str(e)), 500
    finally:
        conn.close()

@app.route('/todas_reservas', methods=['GET'])
def todas_reservas(request):
    
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, Accept, X-Requested-With, Content-Type, Authorization',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Max-Age': '3600',
        }
        return ('', 204, headers)    
    return extraer_reserva_aux()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
