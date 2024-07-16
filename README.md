# A11y Chats

A handful of various chat implementations exploring not only accessibility but usability. You'll find many different versions represented by a letter of the alphabet.

## Versions

### Chat example: A 

Fairly standard chat implementation. The chat itself is within a labelled region. The following list will highlight some of this chats features.
   
- The ordered list is a polite live region that will only read new additions (`aria-atomic="false"`). This list holds all of the chat messages. An ordered list was chosen because the order in which the messages received is important. If the order of the messages were to be changes you've completely altered the meaning of the conversation.
- The avatar pulls double duty serving no only as an identifier of who is in the conversation but also as a heading for each message (paired along with some screen reader only text to provide additional context).
- What I am calling "the announcer." It is a polite live region that will indicate when the "AI" is typing. This is currently acting as a replacement to a more traditional loading indicator, which felt suitable as this is a chat user experience.
- The chat textbox and submit button. I've leaned into the search acceptance criteria here and am using the submit icon button as the visual label for the input. I feel this is warranted given the additional context provided by the visual appearance of the chat interface.

## Script

- Help me plan a holiday in Asia
- Can you give me a more detailed itinerary for Thailand?
- Thanks! Can you help me decide on the specific activities? 
