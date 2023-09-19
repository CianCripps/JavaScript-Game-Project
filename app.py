from flask import Flask, render_template, request
from database import get_db, close_db

app = Flask(__name__)
app.teardown_appcontext(close_db)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/zombies")
def zombies():
    return render_template("zombies.html")

@app.route("/store_score", methods = ["POST"])
def store_score():
    score = int(request.form["score"])
    # here insert the score into the leaderboard table 
    # get db
    db = get_db() 
    # INSERT or UPDATE
    db.execute("""INSERT INTO leaderboard (score) 
                        VALUES (?); """, (score))
    results = db.execute("""Select * from leaderboard""").fetchall()
    db.commit()
    # "success"
    return render_template("index.html", results = results, score = score)

