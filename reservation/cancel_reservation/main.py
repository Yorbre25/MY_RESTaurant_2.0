import pymysql
import os
from flask import Flask, request,jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


def cancelar_reserva_aux(id_reserva):
    # Configuración de la conexión a la base de datos
    connection_name = "my-rest-raurant-2:us-central1:myrestdb"
    db_user = "usuario"
    db_password = "contra"
    db_name = "restaurant_reservations"
    
    # Usamos pymysql para conectar a Cloud SQL
    conn = pymysql.connect(unix_socket=f'/cloudsql/{connection_name}', user=db_user, password=db_password, database=db_name)
    
    try:
        with conn.cursor() as cursor:
            # Insertamos la nueva reserva
            sql = "DELETE FROM reservations WHERE ID = %s"
            cursor.execute(sql, (id_reserva))
            conn.commit()
            return jsonify("Message:",'Reserva eliminada con éxito'), 200, {'Access-Control-Allow-Origin': '*'}
    except Exception as e:
        return jsonify("Message",str(e)), 500
    finally:
        conn.close()

@app.route('/cancelar_reserva', methods=['POST'])
def cancelar_reserva(request):
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, Accept, X-Requested-With, Content-Type, Authorization',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Max-Age': '3600',
        }
        return ('', 204, headers)
    request_json = request.get_json(silent=True)
    id_reserva = request_json['ID']

    return cancelar_reserva_aux(id_reserva)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
