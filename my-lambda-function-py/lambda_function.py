import sys
import logging
import pymysql
import json
import os
from datetime import datetime

# RDS settings
user_name = os.environ['DB_USER']
password = os.environ['DB_PASSWORD']
rds_proxy_host = os.environ['DB_RDS_PROXY_HOST']
host = os.environ['DB_HOST']
db_name = os.environ['DB_NAME']

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Create the database connection outside of the handler to allow connections to be
# reused by subsequent function invocations.
try:
    conn = pymysql.connect(
        host=host,
        user=user_name,
        passwd=password,
        db=db_name,
        connect_timeout=5,
    )
except pymysql.MySQLError as e:
    logger.error("ERROR: Unexpected error: Could not connect to MySQL instance.")
    logger.error(e)
    sys.exit(1)

logger.info("SUCCESS: Connection to RDS for MySQL instance succeeded")


def lambda_handler(event, context):
    logger.info("event: %s, context: %s", event, context)
    http_method = event.get('httpMethod')
    path = event.get('resource')
    query_params = event.get('queryStringParameters', {})
    body = event.get('body')

    if http_method == 'POST':
        if path == '/stats':
            return post_stats(body)
        if path == '/users':
            return post_user(body)
        else:
            return {
                "statusCode": 404,
                "body": json.dumps({"message": "Not Found"})
            }

    elif http_method == 'PUT':
        if path == '/users':
            return put_user(body)
        else:
            return {
                "statusCode": 404,
                "body": json.dumps({"message": "Not Found"})
            }
        
    elif http_method == 'GET':
        if path == '/users':
            return get_user()
        elif path == '/stats':
            return get_stats()
        else:
            return {
                "statusCode": 404,
                "body": json.dumps({"message": "Not Found"})
            }
    
    return {
        "statusCode": 404,
        "body": json.dumps({"message": "Not Found"})
    }

def get_user():
    logger.info("Fetching users from Users table")
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT user_id, username FROM users")
            users = cur.fetchall()

        logger.info("Fetched data from Users table:")
        logger.info(users)

        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Data fetched successfully", "data": users})
        }

    except Exception as e:
        logger.error("Error fetching data from Users table:")
        logger.error(e)

        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Error fetching data", "error": str(e)})
        }

def get_stats():
    logger.info("/stats GET method called")
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT score, username, created_at FROM stats LEFT JOIN users ON stats.user_id = users.user_id ORDER BY score DESC LIMIT 10")
            stats = cur.fetchall()

        logger.info("Fetched data from Stats table:")
        logger.info(stats)

        stats_serializable = [
            {
                "score": score,
                "username": username,
                "created_at": created_at.isoformat()
            }
            for score, username, created_at in stats
        ]

        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Data fetched successfully", "data": stats_serializable})
        }

    except Exception as e:
        logger.error("Error fetching data from Stats table:")
        logger.error(e)

        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Error fetching data", "error": str(e)})
        }

def post_stats(body):
    logger.info("/stats POST method called")
    try:
        user_id = body.get('user_id')
        score = body.get('score')

        if user_id is None or score is None:
            return {
                "statusCode": 400,
                "body": json.dumps({"message": "Invalid request body"})
            }

        created_at = datetime.now()

        with conn.cursor() as cur:
            cur.execute("INSERT INTO stats (user_id, score, created_at) VALUES (%s, %s, %s)", (user_id, score, created_at))
            conn.commit()

        logger.info("Data inserted into Stats table successfully")

        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Data inserted successfully"})
        }

    except Exception as e:
        logger.error("Error inserting data into Stats table:")
        logger.error(e)

        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Error inserting data", "error": str(e)})
        }

def post_user(body):
    logger.info("/users POST method called")

    try:
        user_id = body.get('user_id')
        email = body.get('email')
        if user_id is None or email is None:
            return {
                "statusCode": 400,
                "body": json.dumps({"message": "Invalid request body"})
            }

        with conn.cursor() as cur:
            cur.execute("SELECT * FROM users WHERE user_id = %s", (user_id))
            existing_user = cur.fetchone()
            if not existing_user:
                cur.execute("INSERT INTO users (user_id, email, username) VALUES (%s, %s, %s)", (user_id, email, None))
                conn.commit()

        logger.info("Data inserted into Users table successfully")

        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Data inserted successfully"})
        }

    except Exception as e:
        logger.error("Error inserting data into Users table:")
        logger.error(e)

        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Error inserting data", "error": str(e)})
        }

def put_user(body):
    logger.info("/users PUT method called")
    try:
        user_id = body.get('user_id')
        username = body.get('username')

        if user_id is None or username is None:
            return {
                "statusCode": 400,
                "body": json.dumps({"message": "Invalid request body"})
            }

        with conn.cursor() as cur:
            cur.execute("UPDATE users SET username = %s WHERE user_id = %s", (username, user_id))
            conn.commit()

        logger.info("Data updated in Users table successfully")

        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Data updated successfully"})
        }

    except Exception as e:
        logger.error("Error updating data in Users table:")
        logger.error(e)

        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Error updating data", "error": str(e)})
        }