# MoodBot
DandyHacks 2020 Project: 
**Winner of Healthcare Track!**

## Inspiration
Given the difficulty of the current times, it is now more important than ever to be able to talk about mental health. We wanted to make sure that everyone gets an opportunity to share details about their day, even if there isn't someone to listen. That's where our project comes in: Mood Bot always listens :)
## What it does
Our AI chat bot has a quick discussion every night about the user's day. It begins with a sign in to their account. Then, they select moods that apply for that day. Based on those moods, we start a discussion with the user, and ask them to tell us about their day. It could be positive, neutral, or negative. Based on the user's responses (which we analyze using VADER sentiment analysis), we reply with an appropriate response that will take into account the user's feelings. To finish off the conversation, Mood bot urges the user to look forward to the next day with a positive note and to think of goals to set. Mood bot will remind the user of the goals via email. Mood bot has account association via email, and can keep track of discussion history with each unique user as well.
## How we built it
We used the React Javascript framework to build the website frontend. Using mainly bootstrap to style the pages. We connected the site to a Flask Python server. In it, we handled HTTP requests and did sentiment analysis using the nltk library. We also used SQLite to store discussion history. We had a lot of both frontend and backend logic to try to make the user experience as convenient and comfortable as possible.
## Challenges we ran into
One challenge we ran into was deciding on how to best tackle the topic of mental health, and if having an AI chat bot discuss such personal topics with you may seem awkward. Obviously, there is much work to be done to have a more humane robot with feelings and sympathy. However, given the circumstances, we believe that just a simple prompt or nudge in the right direction to become more of a mental health journal and less of a AI-therapist is what people would need. There were also some technological challenges we ran into; a lot of this was new to us, so we had to learn about how to really combine a frontend website with a backend sever, and what goes into that. We also decided to forgo password authorization and encryption at this point--in general, security is something that we would have to keep as a high priority if we were to move forward with Mood Bot's development.
## Accomplishments that we're proud of
We are very proud of the different technologies and libraries we were able to master in such a short period of time. From having very limited front-end background and sentiment analysis background, we were able to create something that relies on these tools heavily, and did so super well.
## What we learned
We learned just how much work goes into having a welcoming UI, even if it's a seemingly easy concept. 
## What's next for Mood Bot
We hope that Mood Bot can work with professional psychologists to generate a bank of questions that are deemed more important to ask than the ones we came up with. Our mood questionnaire is based on existing psychology research, but our follow-up questions were more subjective. We hope that professionals can help us generate better questions and, in turn, we would be able to launch this to University of Rochester students (or anyone, really!).
