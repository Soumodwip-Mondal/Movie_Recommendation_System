from fastapi import FastAPI
app=FastAPI()
@app.get('/')
def main():
   return {'message':'Connection has been estabilished ! '}


if __name__ == "__main__":
    main()
