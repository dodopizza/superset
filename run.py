from dotenv import load_dotenv
from superset import create_app

if __name__ == "__main__":
    load_dotenv()
    app = create_app()
    app.run(host="localhost", port=8080, debug=True)
