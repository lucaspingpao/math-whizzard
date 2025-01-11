import sys
import logging
import pymysql
import json
import os

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
    """
    Fetch all data from the Stats table and return it as JSON.
    """
    try:
        with conn.cursor() as cur:
            # Fetch all rows from the Stats table
            cur.execute("SELECT * FROM Stats")
            stats_data = cur.fetchall()  # Fetch all rows as a list of dictionaries

        # Log and return the data
        logger.info("Fetched data from Stats table:")
        logger.info(stats_data)

        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Data fetched successfully", "data": stats_data})
        }

    except Exception as e:
        logger.error("Error fetching data from Stats table:")
        logger.error(e)

        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Error fetching data", "error": str(e)})
        }
