# Pomodoro Clock

Welcome to Pomodoro Clock.  The aim of this project is to build a CodePen.io app similar to
https://codepen.io/freeCodeCamp/full/XpKrrW

## UX

### User Stories

Taken from https://www.freecodecamp.org/learn/front-end-libraries/front-end-libraries-projects/build-a-pomodoro-clock

As a user, I can see an element with id="break-label" that contains a string (e.g. "Break Length").

As a user, I can see an element with id="session-label" that contains a string (e.g. "Session Length").

As a user, I can see two clickable elements with corresponding IDs: id="break-decrement" and id="session-decrement".

As a user, I can see two clickable elements with corresponding IDs: id="break-increment" and id="session-increment".

As a user, I can see an element with a corresponding id="break-length", which by default (on load) displays a value of 5.

As a user, I can see an element with a corresponding id="session-length", which by default displays a value of 25.

As a user, I can see an element with a corresponding id="timer-label", that contains a string indicating a session is initialized (e.g. "Session").

As a user, I can see an element with corresponding id="time-left". NOTE: Paused or running, the value in this field should always be displayed in mm:ss format (i.e. 25:00).

As a user, I can see a clickable element with a corresponding id="start_stop".

As a user, I can see a clickable element with a corresponding id="reset".

As a user, When I click the element with the id of reset, any running timer should be stopped, the value within id="break-length" should return to 5, the value within id="session-length" should return to 25, and the element with id="time-left" should reset to it's default state.

As a user, When I click the element with the id of break-decrement, the value within id="break-length" decrements by a value of 1, and I can see the updated value.

As a user,  When I click the element with the id of break-increment, the value within id="break-length" increments by a value of 1, and I can see the updated value.

As a user, When I click the element with the id of session-decrement, the value within id="session-length" decrements by a value of 1, and I can see the updated value.

As a user, When I click the element with the id of session-increment, the value within id="session-length" increments by a value of 1, and I can see the updated value.

As a user, I should not be able to set a session or break length to <= 0.

As a user, I should not be able to set a session or break length to > 60.

As a user, When I first click the element with id="start_stop", the timer should begin running from the value currently displayed in id="session-length", even if the value has been incremented or decremented from the original value of 25.

As a user, If the timer is running, the element with the id of time-left should display the remaining time in mm:ss format (decrementing by a value of 1 and updating the display every 1000ms).

As a user, If the timer is running and I click the element with id="start_stop", the countdown should pause.

As a user, If the timer is paused and I click the element with id="start_stop", the countdown should resume running from the point at which it was paused.

As a user, When a session countdown reaches zero (NOTE: timer MUST reach 00:00), and a new countdown begins, the element with the id of timer-label should display a string indicating a break has begun.

As a user, When a session countdown reaches zero (NOTE: timer MUST reach 00:00), a new break countdown should begin, counting down from the value currently displayed in the id="break-length" element.

As a user, When a break countdown reaches zero (NOTE: timer MUST reach 00:00), and a new countdown begins, the element with the id of timer-label should display a string indicating a session has begun.

As a user, When a break countdown reaches zero (NOTE: timer MUST reach 00:00), a new session countdown should begin, counting down from the value currently displayed in the id="session-length" element.

As a user, When a countdown reaches zero (NOTE: timer MUST reach 00:00), a sound indicating that time is up should play. This should utilize an HTML5 audio tag and have a corresponding id="beep".

As a user, The audio element with id="beep" must be 1 second or longer.

As a user, The audio element with id of beep must stop playing and be rewound to the beginning when the element with the id of reset is clicked.

[Wireframes](wireframes/wireframe-pomodoro-clock.png) are supplied.