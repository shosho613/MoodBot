import pandas as pd
import random
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk import tokenize
import nltk
from flask_cors import CORS, cross_origin
import json
nltk.download('vader_lexicon')
import os
import sqlite3
from flask import Flask, flash, request, redirect, url_for, session, jsonify, render_template
import email, smtplib, ssl
from email import encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'

cors = CORS(app)

@app.route('/uploadMoods', methods=['POST'])
@cross_origin()
def uploadMoods():
    moods = request.form
    bmis_df = update_bmis(moods, init_bmis())
    question = random.sample(init_q_dict()[get_overall_mood(bmis_df)], 1)[0]
    return jsonify(
        value = question,
        moods = moods
    )

def build_response(response_string):
    return jsonify(
        value=response_string,
        finished="false"
    )


@app.route('/sendMessage', methods=['POST'])
@cross_origin()
def sendMessage():
    is_final = request.form.get('isFinal')=='true'
    message = request.form.get('message')
    moods = json.loads(request.form.get('moods'))
    mood_tuple = get_overall_mood(update_bmis(moods, init_bmis()))
    follow_up, rant = issue_followup(mood_tuple, message)
    if is_final:
        if rant:
            follow_up = 'Thanks for opening up to me! I will keep this for you to look back on. I hope you have a better day tomorrow :) Goodnight!'
        else:
            follow_up = 'Those are great goals! I will be sure to email those to you as a reminder, so you know what you need to accomplish to have a great day tomorrow. Goodnight!'
            send_email(message, request.form.get('email'))
        return jsonify(
            value=follow_up,
            finished= "true"
        )
    return build_response(follow_up)
    
@app.route("/sendRecap", methods=["POST"])
@cross_origin()
def sendRecap():
    messages = json.loads(request.form.get("messages"))
    messages_str = '~'.join(messages)
    moods = json.loads(request.form.get("moods"))
    mood_tuple = get_overall_mood(update_bmis(moods, init_bmis()))
    mood_str = mood_tuple[0] + ' & ' + mood_tuple[1]
    email = request.form.get("email")
    date = json.loads(request.form.get("date"))

    connection = sqlite3.connect("users_history.db")
    create_command = """
                    CREATE TABLE IF NOT EXISTS user_interactions ( 
                    user_email VARCHAR(100), 
                    user_mood VARCHAR(30), 
                    date VARCHAR(100), 
                    interaction VARCHAR(1000))
                    ;
                    """
    cursor = connection.cursor()
    cursor.execute(create_command)
    insert_command = """
                    INSERT INTO user_interactions (user_email, user_mood, date, interaction)
                    VALUES ("[{email}]", "{mood_str}", "{date}", "{messages}") 
                    ;
                    """
    insert_command_formatted = insert_command.format(email=email, mood_str=mood_str, date=date, messages=messages_str)
    cursor.execute(insert_command_formatted)
    connection.commit()
    connection.close()
    return app.response_class(
            response="Received Recap.",
            status=200,
            mimetype='application/json',)


@app.route("/getHistory", methods=["POST"])
@cross_origin()
def getHistory():
    final_result_list = []
    email = request.form.get("email")
    print(email)

    connection = sqlite3.connect("users_history.db")
    cursor = connection.cursor()
    format_str = """
                    SELECT user_mood, date, interaction FROM user_interactions
                    WHERE user_interactions.user_email = "[{email}]"
                    ;
                    """
    get_command = format_str.format(email=email)
    cursor.execute(get_command) 
    result = cursor.fetchall() 
    for r in result:
        messages_arr = r[2].split('~')
        final_result_list.append((r[0], r[1], messages_arr))
    print(final_result_list)
    return jsonify(
        content=final_result_list
    )


# BMIS: https://mypages.unh.edu/sites/default/files/jdmayer/files/bmis-technical_supplement_for_scoring.pdf
def init_bmis():
    mood_set = ['Lively', 'Happy', 'Sad', 'Tired', 'Caring', 'Content', 'Gloomy', 'Jittery', 'Drowsy', 'Grouchy', 'Peppy', 'Nervous', 'Calm', 'Loving', 'Fed Up', 'Active']
    pleasant_unpleasant = [1, 1, -1, -1, 1, 1, -1, -1, -1, -1, 1, -1, 1, 1, -1, 1]
    arousal_calm = [1, 0, 1, -1, 1, 0, 1, 1, 0, 0, 1, 1, -1, 1, 1, 1]
    bmis_df = pd.DataFrame(data={'mood': mood_set, 'pleasant_unpleasant': pleasant_unpleasant, 'arousal_calm': arousal_calm})
    return bmis_df


def update_bmis(moods, df):
    df['answer'] = [0]*len(df)
    for mood in moods:
        if mood != 'email':
            df.loc[df['mood'] == mood, 'answer'] = int(moods[mood])
    return df


def get_overall_mood(df):
    score_dict = {'pleasant_unpleasant': (df['pleasant_unpleasant']*df['answer']).sum(), 'arousal_calm': (df['arousal_calm']*df['answer']).sum()}
    
    ret_tuple = (None, None)
    
    # pleasant_unpleasant: -10 down, between, 10 up
    # arousal_calm: 16 down, 16 up
    if score_dict['pleasant_unpleasant'] > 10:
        if score_dict['arousal_calm'] > 16:
            ret_tuple = ('positive', 'aroused')
        else:
            ret_tuple = ('positive', 'calm')
    elif score_dict['pleasant_unpleasant'] >= -10:
        if score_dict['arousal_calm'] > 16:
            ret_tuple = ('neutral', 'aroused')
        else:
            ret_tuple = ('neutral', 'calm')
    else:
        if score_dict['arousal_calm'] > 16:
            ret_tuple = ('negative', 'aroused')
        else:
            ret_tuple = ('negative', 'calm')
    
    return ret_tuple


def init_q_dict():
    type_tuples = [('positive', 'aroused'),
                    ('positive', 'calm'),
                    ('neutral', 'aroused'),
                    ('neutral', 'calm'),
                    ('negative', 'aroused'),
                    ('negative', 'calm')]

    pos_addon = "I am glad to hear your day went well! "
    neu_addon = "It seems like your mood after the day is pretty neutral. Let's try to see if we can recall specific events of the day. "
    neg_addon = "I am so sorry your day didn't go as planned. I'm here for you! Let's try to think positive. "
    questions = [{pos_addon+'What made you smile today?', pos_addon+'What made you feel proud today?', pos_addon+'What is something that happened today that you would love to remember?'},
                {pos_addon+'What kept you peaceful today?', pos_addon+'What did you do today that you found relaxing?', 'What was the most enjoyable part of your day?'},
                {neu_addon+'When did you feel appreciated today?', neu_addon+'What was the hardest part of your day?', neu_addon+'What do you wish went differently today?'},
                {neu_addon+"What did you want to accomplish today that you didn't get to?", neu_addon+'What helped you feel relaxed today?', neu_addon+'Who are you grateful for today?'},
                {neg_addon+'What did you do to take care of yourself today?', neg_addon+'How were you kind to yourself or to others today?', neg_addon+'How did you feel loved today?'},
                {neg_addon+'What made you want to get out of bed today?', neg_addon+'What are you grateful for that happened today?', neg_addon+'What did you eat today that was yummy?'}]

    question_dict = dict()
    for i in range(len(type_tuples)):
        question_dict[type_tuples[i]] = questions[i]
    return question_dict


def issue_followup(mood, text):
    scores = SentimentIntensityAnalyzer().polarity_scores(text)
    follow_up = ''
    rant = False
    print(scores)
    
    if scores['neg'] > .3:
        if mood[0] == 'positive':
            follow_up = "I sense some negativity. Let's make some plans for tomorrow, so you feel better the whole day."
        elif mood[0] == 'neutral' or mood[0] == 'negative':
            follow_up = "I'm sorry to hear that; I sense some sucky situations. Feel free to rant to me. I'm always here to listen. Also, here are some resources to be aware of: https://www.rochester.edu/care/"
            rant = True
    elif scores['pos'] > .3:
        follow_up = "Love to hear about this positivity! Let's keep this up for tomorrow by making some plans or goals you wish to accomplish."
    elif scores['neu'] > .3:
        if mood[0] == 'positive' or mood[0] == 'neutral':
            follow_up = "Hmm... I see. Thanks for sharing that with me. Yeah, I'm sensing very neutral vibes. Let's use this as inspiration to have a better day tomorrow by coming up with some goals!"
        elif mood[0] == 'negative':
            follow_up = "I'm sorry that today was pretty meh. I'm always here for you. If you need to get something off your chest, then, please, go ahead. Also, here are some resources to be aware of: https://www.rochester.edu/care/"
            rant = True
    
    return follow_up, rant

def send_email(plan_string, EMAIL):
    message = MIMEMultipart()
    message["From"] = EMAIL
    message["To"] = EMAIL
    message["Subject"] = "Mood Bot: Plan for tomorrow!"
    message.attach(MIMEText(plan_string, "plain"))

    text = message.as_string()
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login("shohami.sh@gmail.com", os.environ['EMAIL_PASSWORD'])
        server.sendmail("shohami.sh@gmail.com", EMAIL, text)

app.run(port=5000, debug=True)